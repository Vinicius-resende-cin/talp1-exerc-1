import { Router, Request, Response } from "express";

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
let exams: Exam[] = [];

/**
 * Handle GET /api/exams
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).json(exams);
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

export default router;
