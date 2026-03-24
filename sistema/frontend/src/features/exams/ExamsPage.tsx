import { useState, useEffect } from "react";
import { Exam, fetchExams, createExam, generateExamTests } from "./api";
import { Question, fetchQuestions } from "../questions/api";

export function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [identifierType, setIdentifierType] = useState<
    "letters" | "powers_of_2"
  >("letters");

  const loadData = async () => {
    const [examsData, questionsData] = await Promise.all([
      fetchExams(),
      fetchQuestions(),
    ]);
    setExams(examsData);
    setQuestions(questionsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckboxChange = (id: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      questionIds: Array.from(selectedQuestions),
      identifierType,
    };

    await createExam(payload);

    setTitle("");
    setSelectedQuestions(new Set());
    setIdentifierType("letters");
    await loadData();
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 data-testid="exams-page-title">Exam Management</h1>

      <div
        style={{
          background: "#f9f9f9",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h2 data-testid="exam-form-title">Create New Exam</h2>
        <form onSubmit={handleSubmit} data-testid="exam-form">
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter exam title"
              required
              data-testid="exam-title-input"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Identifier Type
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label>
                <input
                  type="radio"
                  value="letters"
                  checked={identifierType === "letters"}
                  onChange={() => setIdentifierType("letters")}
                  data-testid="identifier-type-letters"
                />
                Letters
              </label>
              <label>
                <input
                  type="radio"
                  value="powers_of_2"
                  checked={identifierType === "powers_of_2"}
                  onChange={() => setIdentifierType("powers_of_2")}
                  data-testid="identifier-type-powers-of-2"
                />
                Powers of 2
              </label>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Select Questions
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {questions.length === 0 ? (
                <p>No questions available.</p>
              ) : (
                questions.map((q) => (
                  <label
                    key={q.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(q.id)}
                      onChange={() => handleCheckboxChange(q.id)}
                      data-testid={`question-checkbox-${q.id}`}
                    />
                    {q.description}
                  </label>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            data-testid="create-exam-btn"
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Create Exam
          </button>
        </form>
      </div>

      <div>
        <h2 data-testid="exam-list-title">Existing Exams</h2>
        {exams.length === 0 ? (
          <p data-testid="no-exams-message">No exams found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {exams.map((exam) => (
              <li
                key={exam.id}
                data-testid={`exam-item-${exam.id}`}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  background: "#fff",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{exam.title}</h3>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Identifier Type:{" "}
                  {exam.identifierType === "powers_of_2"
                    ? "Powers of 2"
                    : "Letters"}
                </p>
                <div>
                  <strong>Questions:</strong>
                  {exam.questions && exam.questions.length > 0 ? (
                    <ul
                      style={{
                        margin: "0.5rem 0 0 1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {exam.questions.map((q) => (
                        <li key={q.id}>{q.description}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                      No questions assigned.
                    </p>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <label htmlFor={`generate-count-${exam.id}`}>
                    Copies to Generate:
                  </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue={1}
                    id={`generate-count-${exam.id}`}
                    data-testid={`generate-count-${exam.id}`}
                    style={{
                      width: "60px",
                      padding: "0.25rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    data-testid={`generate-btn-${exam.id}`}
                    onClick={() => {
                      const countInput = document.getElementById(
                        `generate-count-${exam.id}`,
                      ) as HTMLInputElement;
                      const count = parseInt(countInput.value, 10) || 1;
                      generateExamTests(exam.id, count).catch(console.error);
                    }}
                    style={{
                      background: "#007BFF",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Generate
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
