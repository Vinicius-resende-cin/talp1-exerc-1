import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExamsPage } from "./ExamsPage";
import * as api from "./api";
import * as questionsApi from "../questions/api";

vi.mock("./api", () => ({
  fetchExams: vi.fn(),
  createExam: vi.fn(),
  updateExam: vi.fn(),
  deleteExam: vi.fn(),
  generateExamTests: vi.fn(),
}));

vi.mock("../questions/api", () => ({
  fetchQuestions: vi.fn(),
}));

describe("ExamsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders existing exams and shows generate input and button", async () => {
    const mockExams = [
      {
        id: "exam-123",
        title: "Test Exam 1",
        questions: [{ id: "q1", description: "Q1 desc" }],
        identifierType: "letters" as const,
      },
    ];

    vi.mocked(api.fetchExams).mockResolvedValue(mockExams);
    vi.mocked(questionsApi.fetchQuestions).mockResolvedValue([]);

    render(<ExamsPage />);

    // Wait for the exam to be visible
    await waitFor(() => {
      expect(screen.getByTestId("exam-item-exam-123")).toBeInTheDocument();
    });

    const generateCount = screen.getByTestId("generate-count-exam-123");
    expect(generateCount).toBeInTheDocument();

    const generateBtn = screen.getByTestId("generate-btn-exam-123");
    expect(generateBtn).toBeInTheDocument();
  });

  it("calls generateExamTests when generate button is clicked", async () => {
    const mockExams = [
      {
        id: "exam-123",
        title: "Test Exam 1",
        questions: [],
        identifierType: "letters" as const,
      },
    ];

    vi.mocked(api.fetchExams).mockResolvedValue(mockExams);
    vi.mocked(questionsApi.fetchQuestions).mockResolvedValue([]);
    vi.mocked(api.generateExamTests).mockResolvedValue();

    render(<ExamsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("generate-btn-exam-123")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const generateCount = screen.getByTestId("generate-count-exam-123");
    const generateBtn = screen.getByTestId("generate-btn-exam-123");

    // Change input
    await user.clear(generateCount);
    await user.type(generateCount, "3");

    // Click button
    await user.click(generateBtn);

    expect(api.generateExamTests).toHaveBeenCalledWith("exam-123", 3);
  });
});
