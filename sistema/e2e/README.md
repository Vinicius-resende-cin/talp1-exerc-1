# E2E Testing - Test Management System

This directory encompasses the End-to-End (E2E) test suite for the Test Management System using Cucumber and TypeScript. It ensures the whole application (frontend UI, backend API, database) properly integrations from a user's perspective.

## Tech Stack

- **Cucumber JS**: A popular BDD (Behavior-Driven Development) framework for JavaScript.
- **TypeScript**: Ensuring statically typed step definitions.

## Project Structure

- `features/`: The natural language `.feature` files describing system behaviors (Gherkin syntax).
  - `exams.feature`
  - `grading.feature`
  - `questions.feature`
- `fixtures/`: The mock data required for tests (`correct_high.csv`, `student_low.csv`, etc.).
- `steps/`: The step definitions mapping the Gherkin syntax steps to actual automation code interacting with the UI/API using TypeScript (`*.steps.ts`).
- `support/`: Contains setup operations, cleanup configurations, global hooks (`hooks.ts`).
- `cucumber.js`: The central configuration file for running Cucumber tests in the CLI.

## Available Scripts

In the `e2e` directory, you can run:

- `npm test`: Will trigger the Cucumber testing CLI to execute `.feature` files against step definitions.
- `npm run report`: Will attempt to process the `cucumber-report.html` for human-readable output of testing metrics.

_These tests can generally be run from the root workspace using `npm run test:e2e`._

## Scope

The scenarios cover:

- Admin/Instructor uploading test questions.
- Generating a comprehensive exam set.
- Successfully parsing student `CSV` files filled with answers to test the backend logic of grading.
