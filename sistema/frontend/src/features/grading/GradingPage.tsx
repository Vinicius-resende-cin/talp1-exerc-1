import { useState } from "react";
import { gradeCsv } from "./api";

export function GradingPage() {
  const [testId, setTestId] = useState("");
  const [correctFile, setCorrectFile] = useState<File | null>(null);
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [rigor, setRigor] = useState<"high" | "low">("high");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    examId: string;
    grades: Record<string, number>;
    details: Array<{
      student: string;
      question: string;
      expected: string;
      answer: string;
      score: number;
    }>;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId || !correctFile || !studentFile) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResults(null);
      const data = await gradeCsv(testId, correctFile, studentFile, rigor);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during grading.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Grade Exam via CSV</h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label htmlFor="examId">Exam Variation ID (UUID) </label>
          <input
            id="examId"
            type="text"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label htmlFor="correctCsv">Correct Answers CSV </label>
          <input
            id="correctCsv"
            type="file"
            accept=".csv"
            onChange={(e) => setCorrectFile(e.target.files?.[0] || null)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label htmlFor="studentCsv">Student Answers CSV </label>
          <input
            id="studentCsv"
            type="file"
            accept=".csv"
            onChange={(e) => setStudentFile(e.target.files?.[0] || null)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label htmlFor="rigor">Rigor Level </label>
          <select
            id="rigor"
            value={rigor}
            onChange={(e) => setRigor(e.target.value as "high" | "low")}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          >
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "10px", marginTop: "10px" }}
        >
          {isLoading ? "Grading..." : "Grade Exam"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </form>

      {results && (
        <div style={{ marginTop: "30px" }}>
          <h3>Results for Exam Variation: {results.examId}</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                  }}
                >
                  Student Name
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    textAlign: "left",
                  }}
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results.grades).map(([studentName, grade]) => (
                <tr key={studentName}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {studentName}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {results.details && results.details.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3>Detailed Results</h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Student</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Question</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Expected Answer</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Student Answer</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.details.map((detail, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{detail.student}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{detail.question}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{detail.expected}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{detail.answer}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{detail.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
