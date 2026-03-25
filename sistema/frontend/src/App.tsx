import { useState } from "react";
import { QuestionsPage } from "./features/questions/QuestionsPage";
import { ExamsPage } from "./features/exams/ExamsPage";
import { GradingPage } from "./features/grading/GradingPage";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "questions" | "exams" | "grading"
  >("questions");

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
            marginRight: "1rem",
            fontWeight: currentView === "exams" ? "bold" : "normal",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          data-testid="nav-exams"
        >
          Exams
        </button>
        <button
          onClick={() => setCurrentView("grading")}
          style={{
            fontWeight: currentView === "grading" ? "bold" : "normal",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          data-testid="nav-grading"
        >
          Grading
        </button>
      </nav>
      {currentView === "questions" && <QuestionsPage />}
      {currentView === "exams" && <ExamsPage />}
      {currentView === "grading" && <GradingPage />}
    </main>
  );
}
