import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("I am on the questions management page", async function () {
  await this.page.goto("http://localhost:5173");
});

When(
  "I create a new question with description {string}",
  async function (description: string) {
    await this.page.fill(
      '[data-testid="question-description-input"]',
      description,
    );
  },
);

When(
  "I add an alternative {string} which is not correct",
  async function (alternative: string) {
    const inputs = this.page.locator(
      'input[data-testid^="alternative-description-input-"]',
    );
    const count = await inputs.count();

    const lastInput = inputs.nth(count - 1);
    const val = await lastInput.inputValue();

    let targetIndex = count - 1;
    if (val !== "") {
      await this.page.click('[data-testid="add-alternative-btn"]');
      targetIndex = count;
    }

    await this.page.fill(
      `[data-testid="alternative-description-input-${targetIndex}"]`,
      alternative,
    );
    await this.page.uncheck(
      `[data-testid="alternative-correct-checkbox-${targetIndex}"]`,
    );
  },
);

When(
  "I add an alternative {string} which is correct",
  async function (alternative: string) {
    const inputs = this.page.locator(
      'input[data-testid^="alternative-description-input-"]',
    );
    const count = await inputs.count();

    const lastInput = inputs.nth(count - 1);
    const val = await lastInput.inputValue();

    let targetIndex = count - 1;
    if (val !== "") {
      await this.page.click('[data-testid="add-alternative-btn"]');
      targetIndex = count;
    }

    await this.page.fill(
      `[data-testid="alternative-description-input-${targetIndex}"]`,
      alternative,
    );
    await this.page.check(
      `[data-testid="alternative-correct-checkbox-${targetIndex}"]`,
    );
  },
);

When("I save the question", async function () {
  await this.page.click('[data-testid="submit-question-btn"]');
});

Then(
  "the question {string} should be in the list of questions",
  async function (description: string) {
    await expect(
      this.page.locator(`text=${description}`).first(),
    ).toBeVisible();
  },
);

Given(
  "there is an existing question {string}",
  async function (description: string) {
    const responsePromise = this.page.waitForResponse(
      (response: any) =>
        response.url().includes("/api/questions") && response.status() === 200,
    );
    await this.page.goto("http://localhost:5173");
    await responsePromise;

    await this.page.waitForTimeout(200);

    const existing = this.page.locator(`text=${description}`);
    if ((await existing.count()) === 0) {
      await this.page.fill(
        '[data-testid="question-description-input"]',
        description,
      );
      await this.page.fill(
        `[data-testid="alternative-description-input-0"]`,
        "Dummy",
      );
      await this.page.click('[data-testid="submit-question-btn"]');
      await expect(
        this.page.locator(`text=${description}`).first(),
      ).toBeVisible();
    }
  },
);

When(
  "I update the question description to {string}",
  async function (newDescription: string) {
    const editButtons = this.page.locator('button:has-text("Edit")');
    await editButtons.first().click();

    await this.page.fill(
      '[data-testid="question-description-input"]',
      newDescription,
    );
  },
);

When("I delete the question {string}", async function (description: string) {
  this.page.on("dialog", async (dialog: any) => await dialog.accept());
  const deleteBtn = this.page.locator(
    `button[aria-label="Delete ${description}"]`,
  );
  await deleteBtn.first().click();
});

Then(
  "the question {string} should not be in the list of questions",
  async function (description: string) {
    await expect(this.page.locator(`text=${description}`).first()).toBeHidden();
  },
);
