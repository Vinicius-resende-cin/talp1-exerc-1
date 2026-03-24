import request from "supertest";
import app from "../src/app";

describe("Exams API", () => {
  // Optional: Add before/after hooks if mocked DB initialization is needed.

  it("should create an exam with letter identifiers", async () => {
    const payload = {
      title: "First Trimester Math Exam",
      questionIds: ["q1", "q2"],
      identifierType: "letters",
    };

    const response = await request(app)
      .post("/api/exams")
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(payload.title);
    expect(response.body.identifierType).toBe("letters");
    expect(response.body.questionIds).toEqual(payload.questionIds);
  });

  it("should create an exam with powers_of_2 identifiers", async () => {
    const payload = {
      title: "Science and Literature Mix",
      questionIds: ["q3", "q4", "q5"],
      identifierType: "powers_of_2",
    };

    const response = await request(app)
      .post("/api/exams")
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(payload.title);
    expect(response.body.identifierType).toBe("powers_of_2");
    expect(response.body.questionIds).toEqual(payload.questionIds);
  });

  it("should reject creation of an exam with an invalid identifierType", async () => {
    const payload = {
      title: "Invalid format",
      questionIds: ["q1"],
      identifierType: "roman_numerals",
    };

    await request(app).post("/api/exams").send(payload).expect(400);
  });

  it("should get a list of exams", async () => {
    const response = await request(app).get("/api/exams").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    // Assuming previous tests populated at least one exam
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body[0]).toHaveProperty("identifierType");
  });

  it("should get a single exam by id", async () => {
    // Create an exam first to ensure we have an ID
    const createPayload = {
      title: "Single Exam Test",
      questionIds: ["q1"],
      identifierType: "letters",
    };

    const createResponse = await request(app)
      .post("/api/exams")
      .send(createPayload)
      .expect(201);

    const examId = createResponse.body.id;

    const getResponse = await request(app)
      .get(`/api/exams/${examId}`)
      .expect(200);

    expect(getResponse.body.id).toBe(examId);
    expect(getResponse.body.title).toBe(createPayload.title);
    expect(getResponse.body.identifierType).toBe(createPayload.identifierType);
  });
});
