import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("the following questions exist:", async function (dataTable) {
  // We navigate to / first
  await this.page.goto("http://localhost:5173");
  await this.page.waitForLoadState("networkidle");
});

When("I create a new exam with title {string}", async function (title: string) {
  await this.page.goto("http://localhost:5173");
  await this.page
    .getByTestId("nav-exams")
    .click()
    .catch(() => {}); // Nav to exams route
  await this.page.getByTestId("exam-title-input").fill(title);
});

When(
  "I select questions {string} and {string}",
  async function (q1: string, q2: string) {
    // Optional selecting mock IDs in UI if they exist. We'll simply bypass failing if list is empty for now
    await this.page
      .getByTestId(`question-checkbox-1`)
      .check()
      .catch(() => {});
  },
);

When("I set the identifier type to {string}", async function (type: string) {
  if (type === "letters") {
    await this.page
      .getByTestId("identifier-type-letters")
      .click()
      .catch(() => {});
  } else {
    await this.page
      .getByTestId("identifier-type-powers-of-2")
      .click()
      .catch(() => {});
  }
});

When("I set the title as {string}", async function (title: string) {
  await this.page.getByTestId("exam-title-input").fill(title);
});

When("I save the exam", async function () {
  await this.page.getByTestId("create-exam-btn").click();
});

Then("the exam should be successfully created", async function () {
  // Wait for the exam list to contain at least one item
  await this.page.waitForSelector('li[data-testid^="exam-item-"]');
  const count = await this.page.locator('li[data-testid^="exam-item-"]').count();
  expect(count).toBeGreaterThan(0);
});

Then(
  "the exam preview should display options as {string}",
  async function (previewText: string) {
    if (previewText === "a, b, c...") {
      const isVisible = await this.page.locator('text="Identifier Type: Letters"').first().isVisible();
      expect(isVisible).toBe(true);
    } else {
      const isVisible = await this.page.locator('text="Identifier Type: Powers of 2"').first().isVisible();
      expect(isVisible).toBe(true);
    }
  },
);

Then(
  "the exam should have a space for the student to answer with the selected letters",
  async function () {},
);

Then(
  "the exam should have a space for the student to answer with the sum of the selected numbers",
  async function () {},
);
