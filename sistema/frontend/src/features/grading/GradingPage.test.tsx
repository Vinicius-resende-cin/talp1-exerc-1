import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GradingPage } from "./GradingPage";
import * as api from "./api";

vi.mock("./api", () => ({
  gradeCsv: vi.fn(),
}));

describe("GradingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form, submits, and displays results", async () => {
    const mockGrades = {
      examId: "exam-123",
      grades: { student1: 10, student2: 8 },
      details: [],
    };
    vi.mocked(api.gradeCsv).mockResolvedValue(mockGrades);

    render(<GradingPage />);

    const user = userEvent.setup();

    // Elements
    const examIdInput = screen.getByLabelText(/Exam ID/i);
    const correctAnswersInput = screen.getByLabelText(/Correct Answers CSV/i);
    const studentAnswersInput = screen.getByLabelText(/Student Answers CSV/i);
    const rigorSelect = screen.getByLabelText(/Rigor/i);
    const submitButton = screen.getByRole("button", { name: /Grade Exam/i });

    // Files
    const correctFile = new File(["correct"], "correct.csv", {
      type: "text/csv",
    });
    const studentFile = new File(["student"], "student.csv", {
      type: "text/csv",
    });

    // Interact
    await user.type(examIdInput, "exam-123");
    await user.upload(correctAnswersInput, correctFile);
    await user.upload(studentAnswersInput, studentFile);
    await user.selectOptions(rigorSelect, "high");

    await user.click(submitButton);

    expect(api.gradeCsv).toHaveBeenCalledWith(
      "exam-123",
      expect.any(File),
      expect.any(File),
      "high",
    );

    // Results in table
    await waitFor(() => {
      expect(screen.getByText("student1")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("student2")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });
  });
});
