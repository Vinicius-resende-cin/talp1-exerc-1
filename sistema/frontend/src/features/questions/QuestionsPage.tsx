import { useState, useEffect } from "react";
import {
  Question,
  Alternative,
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "./api";

export function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [description, setDescription] = useState("");
  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { description: "", isCorrect: false },
  ]);

  const loadQuestions = async () => {
    const data = await fetchQuestions();
    setQuestions(data);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAddAlternative = () => {
    setAlternatives([...alternatives, { description: "", isCorrect: false }]);
  };

  const handleAlternativeChange = (
    index: number,
    field: keyof Alternative,
    value: any,
  ) => {
    const newAlts = [...alternatives];
    newAlts[index] = { ...newAlts[index], [field]: value };
    setAlternatives(newAlts);
  };

  const handleRemoveAlternative = (index: number) => {
    setAlternatives(alternatives.filter((_, i) => i !== index));
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setDescription(question.description);
    setAlternatives(
      question.alternatives.length > 0
        ? question.alternatives
        : [{ description: "", isCorrect: false }],
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(id);
      await loadQuestions();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { description, alternatives };

    if (editingId) {
      await updateQuestion(editingId, payload);
      setEditingId(null);
    } else {
      await createQuestion(payload);
    }

    setDescription("");
    setAlternatives([{ description: "", isCorrect: false }]);
    await loadQuestions();
  };

  const handleCancel = () => {
    setEditingId(null);
    setDescription("");
    setAlternatives([{ description: "", isCorrect: false }]);
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
      <h1 data-testid="page-title">Question Management</h1>

      <div
        style={{
          background: "#f9f9f9",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h2 data-testid="form-title">
          {editingId ? "Edit Question" : "Add New Question"}
        </h2>
        <form onSubmit={handleSubmit} data-testid="question-form">
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter question description"
              required
              data-testid="question-description-input"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
              Alternatives
            </h3>
            {alternatives.map((alt, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
                data-testid={`alternative-item-${index}`}
              >
                <input
                  type="text"
                  value={alt.description}
                  onChange={(e) =>
                    handleAlternativeChange(
                      index,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Alternative description"
                  required
                  data-testid={`alternative-description-input-${index}`}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={alt.isCorrect}
                    onChange={(e) =>
                      handleAlternativeChange(
                        index,
                        "isCorrect",
                        e.target.checked,
                      )
                    }
                    data-testid={`alternative-correct-checkbox-${index}`}
                  />
                  Correct
                </label>
                {alternatives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAlternative(index)}
                    data-testid={`remove-alternative-btn-${index}`}
                    aria-label={`Remove Alternative ${index + 1}`}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#ffebee",
                      color: "#c62828",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAlternative}
              data-testid="add-alternative-btn"
              aria-label="Add Alternative"
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#e3f2fd",
                color: "#1565c0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Add Alternative
            </button>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              data-testid="submit-question-btn"
              aria-label={editingId ? "Update Question" : "Create Question"}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {editingId ? "Update Question" : "Create Question"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                data-testid="cancel-edit-btn"
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#9e9e9e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 data-testid="list-title">Existing Questions</h2>
        {questions.length === 0 ? (
          <p data-testid="empty-message">No questions available.</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            data-testid="questions-list"
          >
            {questions.map((q) => (
              <div
                key={q.id}
                data-testid={`question-card-${q.id}`}
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{q.description}</h3>
                <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
                  {q.alternatives &&
                    q.alternatives.map((alt, i) => (
                      <li
                        key={alt.id || i}
                        style={{
                          fontWeight: alt.isCorrect ? "bold" : "normal",
                          color: alt.isCorrect ? "#2e7d32" : "inherit",
                        }}
                      >
                        {alt.description} {alt.isCorrect && "(Correct)"}
                      </li>
                    ))}
                </ul>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(q)}
                    data-testid={`edit-question-btn-${q.id}`}
                    aria-label={`Edit ${q.description}`}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    data-testid={`delete-question-btn-${q.id}`}
                    aria-label={`Delete ${q.description}`}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
