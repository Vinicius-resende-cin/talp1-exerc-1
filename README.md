# Test Management System

A comprehensive monorepo workspace containing a backend service, frontend application, and an End-to-End (E2E) testing suite for managing, generating, and grading test/quiz questions.

## Table of Contents

- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Setup & Execution](#setup--execution)
- [Workspace Commands](#workspace-commands)
- [Testing](#testing)

## Architecture & Tech Stack

This project is structured as a monorepo using **npm workspaces**, divided into three distinct modules:

- **[Backend](./sistema/backend/README.md)**: A RESTful API built with **Node.js, Express, and TypeScript**. It handles question management, exam generation, and CSV-based grading via Multer and PapaParse.
- **[Frontend](./sistema/frontend/README.md)**: A Single Page Application (SPA) built with **React, Vite, and TypeScript**. Provides an intuitive UI for instructors to manage the system.
- **[E2E Testing](./sistema/e2e/README.md)**: A Behavior-Driven Development (BDD) testing suite powered by **Cucumber and TypeScript**, verifying full-stack integration through automated workflows.

## Project Structure

```text
sistema/
├── backend/   # Express API, controllers, routes, and unit tests
├── e2e/       # Cucumber feature files, step definitions, and test fixtures
└── frontend/  # React components, UI features, and API integration hooks
```

## Setup & Execution

Since the project uses an npm workspaces configuration, you must manage dependencies directly from the root of the repository.

1. **Install Dependencies** (This will install packages for all workspaces):

   ```bash
   npm install
   ```

2. **Start the Development Servers**:
   To run the full stack locally, you'll need to start both the backend and frontend servers in separate terminal instances (or concurrently).
   - **Backend**:
     ```bash
     npm run dev:backend
     ```
   - **Frontend**:
     ```bash
     npm run dev:frontend
     ```

## Workspace Commands

The root `package.json` provides centralized scripts to manage the individual workspaces without having to navigate into their directories.

### Build the Applications

- **Build Backend**:

  ```bash
  npm run build:backend
  ```

- **Build Frontend**:
  ```bash
  npm run build:frontend
  ```

## Testing

The project incorporates multiple layers of testing, ranging from backend logic tests to full-system Cucumber verifications.

- **Run Backend Tests** (Jest):

  ```bash
  npm run test:backend
  ```

- **Run Frontend Tests**:

  ```bash
  npm run test:frontend
  ```

- **Run E2E Tests** (Cucumber):
  ```bash
  npm run test:e2e
  ```

For more details on specific implementations, please refer to the dedicated `README.md` files located within the `backend/`, `frontend/`, and `e2e/` directories.
