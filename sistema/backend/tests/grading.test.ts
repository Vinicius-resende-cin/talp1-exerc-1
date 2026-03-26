import request from "supertest";
import app from "../src/app";
import { exams, Exam } from "../src/routes/exams";

describe("POST /api/exams/:id/grade-csv", () => {
  beforeEach(() => {
    // Clear exams
    exams.length = 0;
  });

  it("should return 400 if rigor is missing or invalid", async () => {
    const exam: Exam = {
      id: "exam1",
      title: "Exam 1",
      questionIds: ["q1"],
      identifierType: "letters",
    };
    exams.push(exam);

    const res = await request(app)
      .post(`/api/exams/${exam.id}/grade-csv`)
      .field("rigor", "invalid");

    expect(res.status).toBe(400);
  });

  it("should process high rigor correctly", async () => {
    const exam: Exam = {
      id: "exam1",
      title: "Exam 1",
      questionIds: ["q1", "q2"],
      identifierType: "letters",
    };
    exams.push(exam);

    const correctCsv = 'Question,Correct\n1,"A, C"\n2,B';
    const studentCsv =
      'Student,Question,Answer\nAlice,1,"A,C"\nAlice,2,A\nBob,1,"A"\nBob,2,B';

    const res = await request(app)
      .post(`/api/exams/${exam.id}/grade-csv`)
      .field("rigor", "high")
      .attach("correctAnswers", Buffer.from(correctCsv), "correct.csv")
      .attach("studentAnswers", Buffer.from(studentCsv), "student.csv");

    expect(res.status).toBe(200);
    expect(res.body.examId).toBe("exam1");
    // Alice: Q1 correct (1), Q2 wrong (0) = 1
    // Bob: Q1 wrong (0), Q2 correct (1) = 1
    expect(res.body.grades).toEqual({
      Alice: 1,
      Bob: 1,
    });
  });

  it("should process low rigor correctly", async () => {
    const exam: Exam = {
      id: "exam1",
      title: "Exam 1",
      questionIds: ["q1"],
      identifierType: "letters",
    };
    exams.push(exam);

    // Correct is A, C. That means out of A, B, C, D, E true correct is A, C
    // Alice guessed A, D.
    // A: selected, is correct -> ok
    // B: not selected, is not correct -> ok
    // C: not selected, is correct -> missed
    // D: selected, is not correct -> wrong
    // E: not selected, is not correct -> ok
    // Correct + Correct Not Selected = 3/5 = 0.6
    const correctCsv = 'Question,Correct\n1,"A, C"\n2,B';
    const studentCsv = 'Student,Question,Answer\nAlice,1,"A, D"\nAlice,2,B';

    const res = await request(app)
      .post(`/api/exams/${exam.id}/grade-csv`)
      .field("rigor", "low")
      .attach("correctAnswers", Buffer.from(correctCsv), "correct.csv")
      .attach("studentAnswers", Buffer.from(studentCsv), "student.csv");

    expect(res.status).toBe(200);
    expect(res.body.grades).toEqual({
      Alice: 0.6 + 1.0, // Q1 = 0.6, Q2 = 1.0
    });
  });

  it("should process low rigor powers_of_2 correctly with partial pontuation", async () => {
    const exam: Exam = {
      id: "exam-pow2",
      title: "Power 2 Exam",
      questionIds: ["1", "2"],
      identifierType: "powers_of_2",
    };
    exams.push(exam);

    // Q1: Correct = 5 (1 + 4). i.e. options 1 and 4 are correct. Total correct options = 2.
    // Q2: Correct = 3 (1 + 2). Total correct options = 2.
    const correctCsv = "Question,Correct\n1,5\n2,3";

    // Alice Q1: Answer = 1 (1). She marked 1 (correct), missed 4. Incorrect marked = 0.
    // Partial score = (1 correct - 0 incorrect) / 2 = 0.5
    // Alice Q2: Answer = 7 (1 + 2 + 4). She marked 1 and 2 (both correct), but marked 4 (incorrect). Total correct options = 2.
    // Partial score = (2 correct - 1 incorrect) / 2 = 0.5
    const studentCsv = "Student,Question,Answer\nAlice,1,1\nAlice,2,7";

    const res = await request(app)
      .post(`/api/exams/${exam.id}/grade-csv`)
      .field("rigor", "low")
      .attach("correctAnswers", Buffer.from(correctCsv), "correct.csv")
      .attach("studentAnswers", Buffer.from(studentCsv), "student.csv");

    expect(res.status).toBe(200);
    expect(res.body.grades).toEqual({
      Alice: 0.5 + 0.5,
    });
  });
});
