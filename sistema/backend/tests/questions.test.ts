import request from "supertest";
import app from "../src/app";

describe("Questions REST API", () => {
  let createdQuestionId: string;

  describe("POST /api/questions", () => {
    it("should create a new question with alternatives", async () => {
      const payload = {
        description: "What is the largest planet in our solar system?",
        alternatives: [
          { description: "Earth", isCorrect: false },
          { description: "Jupiter", isCorrect: true },
          { description: "Mars", isCorrect: false },
        ],
      };

      const res = await request(app).post("/api/questions").send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.description).toBe(payload.description);
      expect(res.body.alternatives).toHaveLength(3);

      const correctAlternative = res.body.alternatives.find(
        (a: any) => a.isCorrect,
      );
      expect(correctAlternative.description).toBe("Jupiter");

      createdQuestionId = res.body.id;
    });

    it("should fail if no alternative is marked as correct", async () => {
      const res = await request(app)
        .post("/api/questions")
        .send({
          description: "A question without correct alternatives?",
          alternatives: [
            { description: "One", isCorrect: false },
            { description: "Two", isCorrect: false },
          ],
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("At least one alternative must be correct");
    });

    it("should fail if alternatives are missing", async () => {
      const res = await request(app).post("/api/questions").send({
        description: "A question without alternatives?",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/questions", () => {
    it("should list all questions", async () => {
      const res = await request(app).get("/api/questions");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);

      const found = res.body.find((q: any) => q.id === createdQuestionId);
      expect(found).toBeDefined();
    });
  });

  describe("PUT /api/questions/:id", () => {
    it("should update an existing question and its alternatives", async () => {
      const payload = {
        description: "What is the second largest planet?",
        alternatives: [
          { description: "Saturn", isCorrect: true },
          { description: "Jupiter", isCorrect: false },
        ],
      };

      const res = await request(app)
        .put(`/api/questions/${createdQuestionId}`)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.description).toBe(payload.description);
      expect(res.body.alternatives).toHaveLength(2);
    });

    it("should return 404 for non-existent question", async () => {
      const res = await request(app)
        .put("/api/questions/999999999")
        .send({
          description: "Testing",
          alternatives: [{ description: "A", isCorrect: true }],
        });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/questions/:id", () => {
    it("should remove the question", async () => {
      const res = await request(app).delete(
        `/api/questions/${createdQuestionId}`,
      );
      expect(res.status).toBe(204);

      // Verify removal
      const checkRes = await request(app).get(
        `/api/questions/${createdQuestionId}`,
      );
      expect(checkRes.status).toBe(404);
    });
  });
});
