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

export const updateExam = async (
  id: string,
  exam: {
    title: string;
    questionIds: string[];
    identifierType: "letters" | "powers_of_2";
  },
): Promise<Exam> => {
  const res = await fetch(`/api/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!res.ok) throw new Error("Update exam failed");
  return res.json();
};

export const deleteExam = async (id: string): Promise<void> => {
  const res = await fetch(`/api/exams/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete exam failed");
};

export const generateExamTests = async (
  examId: string,
  count: number,
): Promise<void> => {
  const res = await fetch(`/api/exams/${examId}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });

  if (!res.ok) throw new Error("Failed to generate tests");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `exam_${examId}_tests.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
