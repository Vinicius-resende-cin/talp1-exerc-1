import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser, Page, BrowserContext } from "@playwright/test";

// Set a longer timeout for E2E tests (60 seconds)
setDefaultTimeout(60 * 1000);

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });
});

AfterAll(async function () {
  await browser.close();
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});
