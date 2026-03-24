import { render, screen } from "@testing-library/react";
import { GradingPage } from "./GradingPage";

vi.mock("../exams/api", () => ({
  fetchExams: vi.fn(() => Promise.resolve([])),
  gradeExam: vi.fn(),
  createExam: vi.fn(),
  updateExam: vi.fn(),
}));

describe("GradingPage", () => {
  it("renders correctly", async () => {
    render(<GradingPage />);
    expect(await screen.findByText("Exam Grading")).toBeInTheDocument();
    expect(screen.getByTestId("exam-select")).toBeInTheDocument();
    expect(screen.getByTestId("test-number-input")).toBeInTheDocument();
    expect(screen.getByTestId("grade-submit-btn")).toBeInTheDocument();
  });
});
