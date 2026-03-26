# Backend - Test Management System

This is the backend service for the Test Management System. It provides the REST API for managing questions, generating exams, and grading student submissions.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Jest & Supertest**: Testing frameworks for unit and integration testing.
- **Multer**: Middleware for handling `multipart/form-data`, used for file uploads (like CSV files).
- **PapaParse**: Powerful CSV parser.

## Project Structure

- `src/`: Contains the main application code.
  - `app.ts`: Express application setup and middleware configuration.
  - `server.ts`: Entry point of the application. Starts the server.
  - `routes/`: Contains different API route handlers (`questions.ts`, `exams.ts`).
- `tests/`: Contains Jest test suites for backend APIs.

## Available Scripts

In the backend directory, you can run:

- `npm run dev`: Starts the development server with hot-reloading using `ts-node-dev`.
- `npm run build`: Compiles the TypeScript code to JavaScript in the `dist/` folder.
- `npm start`: Runs the compiled application (`dist/server.js`).
- `npm test`: Runs the test suite using Jest.

_(Note: These can also be run from the root workspace using the `npm run <script>:backend` pattern)._

## Main Features

- **Questions Management**: API endpoints to CRUD test questions.
- **Exam Generation**: Endpoints to generate exams/quizzes based on selected questions.
- **Grading System**: Endpoints that accept student submissions (often via CSV files handled by Multer/PapaParse) and automatically grade them against the correct answers.
