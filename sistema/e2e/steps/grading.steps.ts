import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

Given("I navigate to the Grading page", async function () {
  // Mock exams required by the backend
  try {
    const highReq = await fetch("http://localhost:3000/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "High Rigor Exam",
        questionIds: ["Q1"],
        identifierType: "letters",
      }),
    });
    const highExam = await highReq.json();
    this.highExamId = highExam.id;

    const lowReq = await fetch("http://localhost:3000/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Low Rigor Exam",
        questionIds: ["Q1"],
        identifierType: "letters",
      }),
    });
    const lowExam = await lowReq.json();
    this.lowExamId = lowExam.id;
  } catch (e) {
    console.error("Failed to seed exams", e);
  }

  await this.page.goto("http://localhost:5173/");
  await this.page.click('[data-testid="nav-grading"]');
});

When("I fill in the exam ID {string}", async function (examId: string) {
  let actualId = examId;
  if (examId === "HIGH-123" && this.highExamId) actualId = this.highExamId;
  if (examId === "LOW-123" && this.lowExamId) actualId = this.lowExamId;
  await this.page.fill("input#examId", actualId);
});

When(
  "I upload the correct answers CSV with high rigor mock data",
  async function () {
    const fixturesDir = path.join(__dirname, "..", "fixtures");
    if (!fs.existsSync(fixturesDir))
      fs.mkdirSync(fixturesDir, { recursive: true });
    const filePath = path.join(fixturesDir, "correct_high.csv");
    fs.writeFileSync(filePath, "Question,Correct\nQ1,A\n");
    await this.page.setInputFiles("input#correctCsv", filePath);
  },
);

When(
  "I upload the student answers CSV with high rigor mock data",
  async function () {
    const fixturesDir = path.join(__dirname, "..", "fixtures");
    if (!fs.existsSync(fixturesDir))
      fs.mkdirSync(fixturesDir, { recursive: true });
    const filePath = path.join(fixturesDir, "student_high.csv");
    fs.writeFileSync(
      filePath,
      'Student,Question,Answer\nAlice,Q1,A\nBob,Q1,"A,B"\nCharlie,Q1,"B,C"\n',
    );
    await this.page.setInputFiles("input#studentCsv", filePath);
  },
);

When(
  "I upload the correct answers CSV with low rigor mock data",
  async function () {
    const fixturesDir = path.join(__dirname, "..", "fixtures");
    if (!fs.existsSync(fixturesDir))
      fs.mkdirSync(fixturesDir, { recursive: true });
    const filePath = path.join(fixturesDir, "correct_low.csv");
    fs.writeFileSync(filePath, "Question,Correct\nQ1,A\n");
    await this.page.setInputFiles("input#correctCsv", filePath);
  },
);

When(
  "I upload the student answers CSV with low rigor mock data",
  async function () {
    const fixturesDir = path.join(__dirname, "..", "fixtures");
    if (!fs.existsSync(fixturesDir))
      fs.mkdirSync(fixturesDir, { recursive: true });
    const filePath = path.join(fixturesDir, "student_low.csv");
    fs.writeFileSync(
      filePath,
      'Student,Question,Answer\nAlice,Q1,A\nBob,Q1,"A,B"\nCharlie,Q1,"B,C"\n',
    );
    await this.page.setInputFiles("input#studentCsv", filePath);
  },
);

When("I select {string} rigor", async function (rigorLevel: string) {
  await this.page.selectOption("select#rigor", rigorLevel);
});

When("I click {string}", async function (buttonText: string) {
  // Use a more specific locator or robust wait
  await this.page.locator(`button`, { hasText: buttonText }).click();
});

Then(
  "I should see the grades table with {string} getting {string}",
  async function (studentName: string, grade: string) {
    // Wait for Results specifically to ensure API roundtrip
    await this.page.waitForSelector(
      `h3:has-text("Results for Exam Variation:")`,
    );

    const rowLocator = this.page
      .locator(`table`)
      .first()
      .locator(`tr`, { hasText: studentName })
      .first();
    await rowLocator.waitFor({ state: "visible" });

    const text = await rowLocator.innerText();
    expect(text).toContain(studentName);
    expect(text).toContain(grade);
  },
);
