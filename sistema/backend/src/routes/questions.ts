import { Router } from "express";

const router = Router();

/**
 * Represents a single choice alternative for a question.
 */
export interface Alternative {
  description: string;
  isCorrect: boolean;
}

/**
 * Represents a test or quiz question containing multiple alternatives.
 */
export interface Question {
  id: string;
  description: string;
  alternatives: Alternative[];
}

export let questions: Question[] = [];

/**
 * Create a new Question.
 * Expects `description` and `alternatives` in the request body.
 */
router.post("/", (req, res) => {
  const { description, alternatives } = req.body;
  if (!alternatives || !Array.isArray(alternatives)) {
    return res.status(400).json({ error: "alternatives are required" });
  }

  const hasCorrect = alternatives.some((alt: Alternative) => alt.isCorrect);
  if (!hasCorrect) {
    return res.status(400).json({ error: "At least one alternative must be correct" });
  }

  const newQuestion: Question = {
    id: Math.random().toString(36).substring(2, 15),
    description,
    alternatives,
  };

  questions.push(newQuestion);
  res.status(201).json(newQuestion);
});

/**
 * Retrieve all questions.
 */
router.get("/", (req, res) => {
  res.status(200).json(questions);
});

/**
 * Retrieve a specific question by ID.
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const question = questions.find((q) => q.id === id);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }
  res.status(200).json(question);
});

/**
 * Update an existing question by ID.
 * Expects `description` or `alternatives` in the request body.
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { description, alternatives } = req.body;

  if (alternatives && Array.isArray(alternatives)) {
    const hasCorrect = alternatives.some((alt: Alternative) => alt.isCorrect);
    if (!hasCorrect) {
      return res.status(400).json({ error: "At least one alternative must be correct" });
    }
  }

  const questionIndex = questions.findIndex((q) => q.id === id);
  if (questionIndex === -1) {
    return res.status(404).json({ error: "Question not found" });
  }

  questions[questionIndex] = {
    ...questions[questionIndex],
    description:
      description !== undefined
        ? description
        : questions[questionIndex].description,
    alternatives:
      alternatives !== undefined
        ? alternatives
        : questions[questionIndex].alternatives,
  };

  res.status(200).json(questions[questionIndex]);
});

/**
 * Delete a specific question by ID.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const questionIndex = questions.findIndex((q) => q.id === id);
  if (questionIndex === -1) {
    return res.status(404).json({ error: "Question not found" });
  }

  questions.splice(questionIndex, 1);
  res.status(204).send();
});

export default router;
