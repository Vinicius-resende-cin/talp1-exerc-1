import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given(
  "an exam exists and {string} instance of it has been generated",
  async function (instancesCount: string) {
    // We navigate to exams to create an exam and generate it.
    await this.page.goto("http://localhost:5173");

    // Navigate to Questions to ensure at least one question exists
    await this.page
      .getByTestId("nav-questions")
      .click()
      .catch(() => {});
    await this.page
      .getByTestId("question-description-input")
      .fill("Sample Question for Grading");
    await this.page
      .getByTestId("alternative-description-input-0")
      .fill("Alternative A");
    await this.page.getByTestId("alternative-correct-checkbox-0").check();
    await this.page
      .getByTestId("submit-question-btn")
      .click()
      .catch(() => {});

    // Navigate to Exams
    await this.page
      .getByTestId("nav-exams")
      .click()
      .catch(() => {});

    // Create an exam
    await this.page
      .getByTestId("exam-title-input")
      .fill(`Grading Test Exam ${Date.now()}`);

    // Need to get the first question checkbox
    await this.page
      .locator('input[data-testid^="question-checkbox-"]')
      .first()
      .check()
      .catch(() => {});
    await this.page
      .getByTestId("create-exam-btn")
      .click()
      .catch(() => {});

    // Wait a bit
    await this.page.waitForTimeout(500);

    // Generate instances
    await this.page
      .locator('input[data-testid^="generate-count-"]')
      .last()
      .fill(instancesCount);
    await this.page
      .locator('button[data-testid^="generate-btn-"]')
      .last()
      .click()
      .catch(() => {});

    await this.page.waitForTimeout(500);
  },
);

When("I navigate to the Grading page", async function () {
  await this.page.getByTestId("nav-grading").click();
});

When(
  "I select the exam, set test number to {string}",
  async function (testNumber: string) {
    // It's possible the exam is selected by default, but let's try to set testNumber
    await this.page.getByTestId("test-number-input").fill(testNumber);
  },
);

When("I fill in answers for the questions", async function () {
  // Just filling 'A' for the first question (created above).
  // Depending on how many questions the exam has, we could loop, but we know there's at least 1.
  const inputs = await this.page
    .locator('input[data-testid^="answer-input-"]')
    .all();
  for (const input of inputs) {
    await input.fill("A");
  }
});

When("I submit the grading form", async function () {
  await this.page.getByTestId("grade-submit-btn").click();
});

Then("I should see the grade result on the screen", async function () {
  const result = this.page.getByTestId("grade-result");
  await expect(result).toBeVisible();
});
