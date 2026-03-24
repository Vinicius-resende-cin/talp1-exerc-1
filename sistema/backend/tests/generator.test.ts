import request from "supertest";
import app from "../src/app";
import { questions } from "../src/routes/questions";
import { exams } from "../src/routes/exams";

describe("POST /api/exams/:id/generate", () => {
  beforeEach(() => {
    // Reset data
    questions.length = 0;
    exams.length = 0;
  });

  it("should generate multiple tests and return a ZIP file containing PDFs and a CSV", async () => {
    // Arrange: Create a question and an exam
    const q1 = {
      id: "q1",
      description: "Q1 desc",
      alternatives: [
        { description: "A1", isCorrect: true },
        { description: "A2", isCorrect: false },
      ],
    };
    questions.push(q1);

    exams.push({
      id: "exam1",
      title: "Title 1",
      questionIds: ["q1"],
      identifierType: "letters",
    });

    // Act
    const res = await request(app)
      .post("/api/exams/exam1/generate")
      .send({ count: 2 });

    // Assert
    expect(res.status).toBe(200);
    expect(res.header["content-type"]).toBe("application/zip");
  });
});
