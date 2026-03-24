import { Router, Request, Response } from "express";
import PDFDocument from "pdfkit";
import archiver from "archiver";
import { questions } from "./questions";

const router = Router();

export interface Exam {
  id: string;
  title: string;
  questionIds: string[];
  identifierType: "letters" | "powers_of_2";
}

/**
 * In-memory storage for exams
 */
export let exams: Exam[] = [];

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

  let csvRows = ["Test Number,Question,Correct Answer"];

  for (let testNum = 1; testNum <= count; testNum++) {
    const doc = new PDFDocument();
    archive.append(doc as any, { name: `Test_${testNum}.pdf` });

    // Shuffle questions
    const shuffledQuestionIds = [...exam.questionIds].sort(
      () => Math.random() - 0.5,
    );

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

      let correctAnswerKey = "";

      shuffledAlts.forEach((alt, aIndex) => {
        let identifier = "";
        if (exam.identifierType === "letters") {
          identifier = String.fromCharCode(65 + aIndex); // A, B, C...
        } else {
          identifier = String(Math.pow(2, aIndex)); // 1, 2, 4...
        }

        if (alt.isCorrect) {
          correctAnswerKey = identifier;
        }

        doc.fontSize(12).text(`  ${identifier}) ${alt.description}`);
      });

      doc.moveDown();
      csvRows.push(`${testNum},${qIndex + 1},${correctAnswerKey}`);
    });

    doc.end();
  }

  archive.append(csvRows.join("\n"), { name: "answers.csv" });
  archive.finalize();
});

export default router;
