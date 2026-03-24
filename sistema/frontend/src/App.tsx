import { useState } from "react";
import { QuestionsPage } from "./features/questions/QuestionsPage";
import { ExamsPage } from "./features/exams/ExamsPage";

export default function App() {
  const [currentView, setCurrentView] = useState<"questions" | "exams">(
    "questions",
  );

  return (
    <main>
      <nav
        style={{
          padding: "1rem",
          background: "#eee",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => setCurrentView("questions")}
          style={{
            marginRight: "1rem",
            fontWeight: currentView === "questions" ? "bold" : "normal",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          data-testid="nav-questions"
        >
          Questions
        </button>
        <button
          onClick={() => setCurrentView("exams")}
          style={{
            fontWeight: currentView === "exams" ? "bold" : "normal",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          data-testid="nav-exams"
        >
          Exams
        </button>
      </nav>
      {currentView === "questions" && <QuestionsPage />}
      {currentView === "exams" && <ExamsPage />}
    </main>
  );
}
