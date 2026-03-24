import request from "supertest";
import app from "../src/app";
import { exams } from "../src/routes/exams";
import { questions } from "../src/routes/questions";

describe("Exam Grading via /api/exams/:id/grade", () => {
  let examId: string;
  let q1Id: string;
  let q2Id: string;

  beforeAll(async () => {
    // 1. Create Question 1
    const resQ1 = await request(app)
      .post("/api/questions")
      .send({
        description: "What is 2+2?",
        alternatives: [
          { description: "3", isCorrect: false },
          { description: "4", isCorrect: true },
        ],
      });
    q1Id = resQ1.body.id;

    // 2. Create Question 2
    const resQ2 = await request(app)
      .post("/api/questions")
      .send({
        description: "What is the capital of France?",
        alternatives: [
          { description: "Berlin", isCorrect: false },
          { description: "Paris", isCorrect: true },
          { description: "Madrid", isCorrect: false },
        ],
      });
    q2Id = resQ2.body.id;

    // 3. Create an Exam
    const resExam = await request(app)
      .post("/api/exams")
      .send({
        title: "Test Exam",
        questionIds: [q1Id, q2Id],
        identifierType: "letters",
      });
    examId = resExam.body.id;
  });

  afterAll(() => {
    exams.length = 0;
    questions.length = 0;
  });

  it("should fail to grade if exam instance does not exist", async () => {
    const res = await request(app)
      .post(`/api/exams/${examId}/grade`)
      .send({
        testNumber: 1,
        answers: { 1: "A", 2: "B" },
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe(
      "Exam instance not found for the given test number",
    );
  });

  it("should generate exam instances", async () => {
    const res = await request(app)
      .post(`/api/exams/${examId}/generate`)
      .send({ count: 1 })
      .responseType("blob"); // For dealing with binary response

    expect(res.status).toBe(200);

    const exam = exams.find((e) => e.id === examId);
    expect(exam).toBeDefined();
    expect(exam?.instances).toBeDefined();
    expect(Object.keys(exam?.instances![1] || {}).length).toBe(2);
  });

  it("should correctly grade answers", async () => {
    const exam = exams.find((e) => e.id === examId);
    const correctAnswers = exam!.instances![1];

    // Perfect score
    const res1 = await request(app).post(`/api/exams/${examId}/grade`).send({
      testNumber: 1,
      answers: correctAnswers, // Provide correct answers
    });

    expect(res1.status).toBe(200);
    expect(res1.body).toMatchObject({
      totalQuestions: 2,
      correctAnswers: 2,
      score: 100,
    });

    // Partial correct score
    const mixedAnswers = { ...correctAnswers };
    mixedAnswers[1] = correctAnswers[1];
    mixedAnswers[2] = "Z"; // incorrect

    const res2 = await request(app).post(`/api/exams/${examId}/grade`).send({
      testNumber: 1,
      answers: mixedAnswers,
    });

    expect(res2.status).toBe(200);
    expect(res2.body).toMatchObject({
      totalQuestions: 2,
      correctAnswers: 1,
      score: 50,
    });

    // Zero score
    const wrongAnswers = {
      1: "Y",
      2: "Z",
    };

    const res3 = await request(app).post(`/api/exams/${examId}/grade`).send({
      testNumber: 1,
      answers: wrongAnswers,
    });

    expect(res3.status).toBe(200);
    expect(res3.body).toMatchObject({
      totalQuestions: 2,
      correctAnswers: 0,
      score: 0,
    });
  });

  it("should return 400 for invalid body", async () => {
    const res1 = await request(app).post(`/api/exams/${examId}/grade`).send({});
    expect(res1.status).toBe(400);

    const res2 = await request(app).post(`/api/exams/invalid-id/grade`).send({
      testNumber: 1,
      answers: {},
    });
    expect(res2.status).toBe(404);
  });
});
