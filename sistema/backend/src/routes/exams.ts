import { Router, Request, Response } from "express";
import PDFDocument from "pdfkit";
import archiver from "archiver";
import multer from "multer";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { questions } from "./questions";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

export interface Exam {
  id: string;
  title: string;
  questionIds: string[];
  identifierType: "letters" | "powers_of_2";
  variations?: string[];
}

/**
 * In-memory storage for exams
 */
export let exams: Exam[] = [];

/**
 * Handle POST /api/exams/:id/grade-csv
 */
router.post(
  "/:id/grade-csv",
  upload.fields([
    { name: "correctAnswers", maxCount: 1 },
    { name: "studentAnswers", maxCount: 1 },
  ]),
  (req: Request, res: Response): any => {
    try {
      const testId = req.params.id;
      const exam = exams.find(
        (e) => e.variations?.includes(testId) || e.id === testId,
      );
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      const rigor = req.body.rigor;

      if (rigor !== "high" && rigor !== "low") {
        return res.status(400).json({ error: "Invalid rigor" });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (!files || !files.correctAnswers || !files.studentAnswers) {
        return res.status(400).json({ error: "Missing required files" });
      }

      const correctAnswersStr = files.correctAnswers[0].buffer.toString();
      const studentAnswersStr = files.studentAnswers[0].buffer.toString();

      const correctParsed = Papa.parse(correctAnswersStr, {
        header: true,
        skipEmptyLines: true,
      });
      const correctMap = new Map<string, string[]>();
      (correctParsed.data as any[]).forEach((row) => {
        const hasTestIdColumn = "Test ID" in row || "TestID" in row;
        const rowTestId = row["Test ID"] || row.TestID;
        if (hasTestIdColumn && rowTestId !== testId) {
          return;
        }

        const correct =
          row.Correct != null ? row.Correct : row["Correct Answer"];
        if (row.Question && correct != null) {
          const arr = correct
            .toString()
            .split(",")
            .map((x: string) => x.trim())
            .filter(Boolean);
          correctMap.set(row.Question.trim().toString(), arr);
        }
      });

      const studentParsed = Papa.parse(studentAnswersStr, {
        header: true,
        skipEmptyLines: true,
      });
      const studentData = studentParsed.data as any[];

      const studentGrades: { [studentName: string]: number } = {};
      const studentDetails: Array<{
        student: string;
        question: string;
        expected: string;
        answer: string;
        score: number;
      }> = [];

      studentData.forEach((row) => {
        const student = row.Student?.trim();
        const question = row.Question?.trim().toString();
        const answerRaw = row.Answer != null ? row.Answer.toString() : "";
        const answerArr = answerRaw
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean);

        if (!student || !question) return;

        if (studentGrades[student] === undefined) {
          studentGrades[student] = 0;
        }

        const correctArr = correctMap.get(question);
        if (!correctArr) return;

        let score = 0;

        if (exam.identifierType === "powers_of_2") {
          const expectedSum = parseInt(correctArr[0], 10) || 0;
          const studentAnsSum = parseInt(answerRaw, 10) || 0;

          if (rigor === "high") {
            if (expectedSum === studentAnsSum) {
              score = 1;
            }
          } else {
            let correctSelections = 0;
            let incorrectSelections = 0;
            let totalCorrectOptions = 0;
            const allOptionsPow = [1, 2, 4, 8, 16];

            allOptionsPow.forEach((pow) => {
              const expectedHasOpt = (expectedSum & pow) === pow;
              const studentHasOpt = (studentAnsSum & pow) === pow;

              if (expectedHasOpt) {
                totalCorrectOptions++;
                if (studentHasOpt) correctSelections++;
              } else {
                if (studentHasOpt) incorrectSelections++;
              }
            });

            if (totalCorrectOptions > 0) {
              const partial =
                (correctSelections - incorrectSelections) / totalCorrectOptions;
              score = partial > 0 ? partial : 0;
            }
          }
        } else {
          if (rigor === "high") {
            const sortCorrect = [...correctArr].sort().join(",");
            const sortStudent = [...answerArr].sort().join(",");
            if (sortCorrect === sortStudent) {
              score = 1;
            }
          } else {
            let correctSelections = 0;
            let correctNonSelections = 0;
            const allOptions = ["A", "B", "C", "D", "E"];

            allOptions.forEach((opt) => {
              const isCorrect = correctArr.includes(opt);
              const isSelected = answerArr.includes(opt);

              if (isCorrect && isSelected) correctSelections++;
              else if (!isCorrect && !isSelected) correctNonSelections++;
            });

            score = (correctSelections + correctNonSelections) / 5;
          }
        }

        studentGrades[student] += score;
        studentDetails.push({
          student,
          question,
          expected: correctArr.join(","),
          answer: answerRaw,
          score,
        });
      });

      res.status(200).json({
        examId: exam.id,
        grades: studentGrades,
        details: studentDetails,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

/**
 * Handle GET /api/exams
 */
router.get("/", (req: Request, res: Response) => {
  const populatedExams = exams.map((exam) => ({
    ...exam,
    questions: exam.questionIds
      .map((qId) => questions.find((q) => q.id === qId))
      .filter(Boolean),
  }));
  res.status(200).json(populatedExams);
});

/**
 * Handle POST /api/exams
 */
router.post("/", (req: Request, res: Response) => {
  const { title, questionIds, identifierType } = req.body;

  if (
    !title ||
    !questionIds ||
    !Array.isArray(questionIds) ||
    !identifierType
  ) {
    return res.status(400).json({
      error: "Missing required fields: title, questionIds, and identifierType.",
    });
  }

  if (identifierType !== "letters" && identifierType !== "powers_of_2") {
    return res.status(400).json({
      error: "Invalid identifierType. Must be 'letters' or 'powers_of_2'.",
    });
  }

  const newExam: Exam = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    questionIds,
    identifierType,
  };

  exams.push(newExam);
  res.status(201).json(newExam);
});

/**
 * Handle GET /api/exams/:id
 */
router.get("/:id", (req: Request, res: Response) => {
  const exam = exams.find((e) => e.id === req.params.id);
  if (!exam) {
    return res.status(404).json({ error: "Exam not found" });
  }
  res.status(200).json(exam);
});

/**
 * Handle PUT /api/exams/:id
 */
router.put("/:id", (req: Request, res: Response) => {
  const examIndex = exams.findIndex((e) => e.id === req.params.id);
  if (examIndex === -1) {
    return res.status(404).json({ error: "Exam not found" });
  }

  const { title, questionIds, identifierType } = req.body;

  if (
    !title ||
    !questionIds ||
    !Array.isArray(questionIds) ||
    !identifierType
  ) {
    return res.status(400).json({
      error: "Missing required fields: title, questionIds, and identifierType.",
    });
  }

  if (identifierType !== "letters" && identifierType !== "powers_of_2") {
    return res.status(400).json({
      error: "Invalid identifierType. Must be 'letters' or 'powers_of_2'.",
    });
  }

  exams[examIndex] = {
    ...exams[examIndex],
    title,
    questionIds,
    identifierType,
  };

  res.status(200).json(exams[examIndex]);
});

/**
 * Handle DELETE /api/exams/:id
 */
router.delete("/:id", (req: Request, res: Response) => {
  const examIndex = exams.findIndex((e) => e.id === req.params.id);
  if (examIndex === -1) {
    return res.status(404).json({ error: "Exam not found" });
  }

  exams.splice(examIndex, 1);
  res.status(204).send();
});

/**
 * Handle POST /api/exams/:id/generate
 */
router.post("/:id/generate", (req: Request, res: Response) => {
  const exam = exams.find((e) => e.id === req.params.id);
  if (!exam) {
    return res.status(404).json({ error: "Exam not found" });
  }

  const count = req.body.count;
  if (!count || typeof count !== "number" || count <= 0) {
    return res.status(400).json({ error: "Invalid count" });
  }

  // Set up ZIP archive
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="exam_${exam.id}_tests.zip"`,
  );

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  let csvRows = ["Test Number,Test ID,Question,Correct Answer"];

  for (let testNum = 1; testNum <= count; testNum++) {
    const doc = new PDFDocument({ bufferPages: true });

    const testId = uuidv4();
    exam.variations = exam.variations || [];
    exam.variations.push(testId);

    archive.append(doc as any, { name: `Test_${testNum}.pdf` });

    // Shuffle questions
    const shuffledQuestionIds = [...exam.questionIds].sort(
      () => Math.random() - 0.5,
    );

    // Footer with Test ID
    const addFooter = () => {
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        const oldBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.fontSize(10).text(`Test ID: ${testId}`, 0, doc.page.height - 40, {
          align: "center",
          width: doc.page.width,
          lineBreak: false,
        });
        doc.page.margins.bottom = oldBottomMargin;
      }
    };

    // Header on the first page
    doc.fontSize(12);
    doc.text("Class Name: ________________________");
    doc.text("Professor Name: ________________________");
    doc.text("Date: ________________________");
    doc.moveDown(2);

    doc
      .fontSize(16)
      .text(`${exam.title} - Test ${testNum}`, { align: "center" });
    doc.moveDown();

    shuffledQuestionIds.forEach((qId, qIndex) => {
      const question = questions.find((q) => q.id === qId);
      if (!question) return;

      doc.fontSize(14).text(`Q${qIndex + 1}: ${question.description}`);
      doc.moveDown(0.5);

      // Shuffle alternatives
      const shuffledAlts = [...question.alternatives].sort(
        () => Math.random() - 0.5,
      );

      const correctAnswerKeys: string[] = [];

      shuffledAlts.forEach((alt, aIndex) => {
        let identifier = "";
        if (exam.identifierType === "letters") {
          identifier = String.fromCharCode(65 + aIndex); // A, B, C...
        } else {
          identifier = String(Math.pow(2, aIndex)); // 1, 2, 4...
        }

        if (alt.isCorrect) {
          correctAnswerKeys.push(identifier);
        }

        doc.fontSize(12).text(`  ${identifier}) ${alt.description}`);
      });

      doc.moveDown();
      if (exam.identifierType === "powers_of_2") {
        const sum = correctAnswerKeys.reduce(
          (acc, val) => acc + parseInt(val, 10),
          0,
        );
        csvRows.push(`${testNum},${testId},${qIndex + 1},${sum}`);
      } else {
        csvRows.push(
          `${testNum},${testId},${qIndex + 1},"${correctAnswerKeys.join(",")}"`,
        );
      }
    });

    addFooter();
    doc.end();
  }

  archive.append(csvRows.join("\n"), { name: "answers.csv" });
  archive.finalize();
});

export default router;
