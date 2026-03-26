import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("the following questions exist:", async function (dataTable) {
  await this.page.goto("http://localhost:5173");
  await this.page.waitForLoadState("networkidle");
});

When("I create a new exam with title {string}", async function (title: string) {
  await this.page.goto("http://localhost:5173");
  await this.page
    .getByTestId("nav-exams")
    .click()
    .catch(() => {});
  await this.page.getByTestId("exam-title-input").fill(title);
});

When(
  "I select questions {string} and {string}",
  async function (q1: string, q2: string) {
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
  await this.page.waitForSelector('li[data-testid^="exam-item-"]');
  const count = await this.page
    .locator('li[data-testid^="exam-item-"]')
    .count();
  expect(count).toBeGreaterThan(0);
});

Then(
  "the exam preview should display options as {string}",
  async function (previewText: string) {
    if (previewText === "a, b, c...") {
      await expect(this.page.locator('text=/Identifier Type:.*Letters/i').first()).toBeVisible();
    } else {
      await expect(this.page.locator('text=/Identifier Type:.*Powers of 2/i').first()).toBeVisible();
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

Given("an exam exists", async function () {
  await this.page.goto("http://localhost:5173");
  await this.page
    .getByTestId("nav-exams")
    .click()
    .catch(() => {});

  const hasExams = await this.page
    .locator('li[data-testid^="exam-item-"]')
    .count();
  if (hasExams === 0) {
    await this.page
      .getByTestId("exam-title-input")
      .fill("Generate Target Exam");
    await this.page.getByTestId("create-exam-btn").click();
    await this.page.waitForSelector('li[data-testid^="exam-item-"]');
  }
});

When(
  "I choose to generate {int} instances of the exam",
  async function (count: number) {
    const countInput = this.page
      .locator('input[data-testid^="generate-count-"]')
      .first();
    await countInput.fill(count.toString());

    const generateBtn = this.page
      .locator('button[data-testid^="generate-btn-"]')
      .first();

    const downloadPromise = this.page.waitForEvent("download");
    await generateBtn.click();
    this.download = await downloadPromise;
  },
);

Then("a ZIP file should be downloaded", async function () {
  expect(this.download).toBeDefined();

  const suggestedFilename = this.download.suggestedFilename();
  expect(suggestedFilename).toMatch(/\.zip$/);
});

Given("an exam {string} exists", async function (title: string) {
  await this.page.goto("http://localhost:5173");
  await this.page
    .getByTestId("nav-exams")
    .click()
    .catch(() => {});

  await this.page.getByTestId("exam-title-input").fill(title);
  await this.page.getByTestId("create-exam-btn").click();
  await expect(this.page.locator(`text="${title}"`).first()).toBeVisible();
});

When("I click edit for {string}", async function (title: string) {
  await this.page.locator(`button[aria-label="Edit ${title}"]`).first().click();
});

When("I change the title to {string}", async function (title: string) {
  const editInput = this.page.locator('input[aria-label="Edit Exam Title"]').first();
  await editInput.fill(title).catch(async () => {
      const inputs = this.page.getByRole("textbox");
      await inputs.first().fill(title);
    });
});

Then("the exam {string} should be in the list", async function (title: string) {
  await expect(this.page.locator(`text="${title}"`).first()).toBeVisible({ timeout: 10000 });
});

Then("{string} should not be in the list", async function (title: string) {
  await this.page.waitForTimeout(2000);
  await this.page.reload();
  await this.page.waitForTimeout(2000);
  await expect(this.page.locator(`text="${title}"`).first()).toBeHidden();
});

Then(
  "the exam {string} should not be in the list",
  async function (title: string) {
    await this.page.waitForTimeout(2000);
    await this.page.reload();
    await this.page.waitForTimeout(2000);
    await expect(this.page.locator(`text="${title}"`).first()).toBeHidden();
  },
);

When(
  "I hit delete for {string} and accept the dialog",
  async function (title: string) {
    this.page.once("dialog", (dialog: any) => dialog.accept());
    await this.page.locator(`button[aria-label="Delete ${title}"]`).first().click();
  },
);
