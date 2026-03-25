export const gradeCsv = async (
  examId: string,
  correctCsv: File,
  studentCsv: File,
  rigor: "high" | "low",
) => {
  const formData = new FormData();
  formData.append("correctAnswers", correctCsv);
  formData.append("studentAnswers", studentCsv);
  formData.append("rigor", rigor);

  const res = await fetch(`/api/exams/${examId}/grade-csv`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error grading exam");
  }

  return res.json() as Promise<{
    examId: string;
    grades: Record<string, number>;
  }>;
};
