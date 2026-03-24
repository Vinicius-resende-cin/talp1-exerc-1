import { Question } from "../questions/api";

export interface Exam {
  id: string;
  title: string;
  questions: Question[];
  identifierType: "letters" | "powers_of_2";
}

export const fetchExams = async (): Promise<Exam[]> => {
  try {
    const res = await fetch("/api/exams");
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Failed to fetch exams", err);
    return [];
  }
};

export const createExam = async (exam: {
  title: string;
  questionIds: string[];
  identifierType: "letters" | "powers_of_2";
}): Promise<Exam> => {
  const res = await fetch("/api/exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!res.ok) throw new Error("Create exam failed");
  return res.json();
};
