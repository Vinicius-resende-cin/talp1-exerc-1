import { useEffect, useState } from "react";
import { fetchExams, gradeExam, Exam } from "../exams/api";

export function GradingPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [testNumber, setTestNumber] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [gradeResult, setGradeResult] = useState<{
    totalQuestions: number;
    correctAnswers: number;
    score: number;
  } | null>(null);

  useEffect(() => {
    fetchExams().then((data) => {
      setExams(data);
      if (data.length > 0) {
        setSelectedExamId(data[0].id);
      }
    });
  }, []);

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;
    try {
      const result = await gradeExam(selectedExamId, testNumber, answers);
      setGradeResult(result);
    } catch (err) {
      console.error(err);
      alert("Error grading exam");
    }
  };

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setAnswers({ ...answers, [String(questionNumber)]: value });
  };

  const currentQuestionsCount = selectedExam?.questions?.length || 0;

  useEffect(() => {
    setAnswers({});
    setGradeResult(null);
  }, [selectedExamId, testNumber]);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
      <h2>Exam Grading</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          Select Exam:
          <select
            data-testid="exam-select"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Test Number:
          <input
            data-testid="test-number-input"
            type="number"
            min={1}
            value={testNumber}
            onChange={(e) => setTestNumber(Number(e.target.value))}
          />
        </label>

        {currentQuestionsCount > 0 && (
          <fieldset>
            <legend>Answers</legend>
            {Array.from({ length: currentQuestionsCount }).map((_, i) => (
              <div key={i} style={{ marginBottom: "0.5rem" }}>
                <label>
                  Question {i + 1}:{" "}
                  <input
                    data-testid={`answer-input-${i + 1}`}
                    type="text"
                    value={answers[String(i + 1)] || ""}
                    onChange={(e) => handleAnswerChange(i + 1, e.target.value)}
                  />
                </label>
              </div>
            ))}
          </fieldset>
        )}

        <button type="submit" data-testid="grade-submit-btn">
          Grade Exam
        </button>
      </form>

      {gradeResult && (
        <div
          data-testid="grade-result"
          style={{ marginTop: "1rem", padding: "1rem", background: "#e8f5e9" }}
        >
          <h3>Grade Result</h3>
          <p>
            Score: {gradeResult.score}% ({gradeResult.correctAnswers}/
            {gradeResult.totalQuestions})
          </p>
        </div>
      )}
    </div>
  );
}
