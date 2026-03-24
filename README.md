# Test Management System

A simple workspace containing a backend, frontend, and an End-to-End (E2E) testing suite for managing test/quiz questions.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TypeScript
- **Testing (E2E)**: Cucumber, TypeScript (as inferred by workspace setup)
- **Monorepo Management**: npm workspaces

## Setup & Execution

Since the project uses an npm workspaces configuration, you can execute scripts directly from the root of the repository. First, install the dependencies for all workspaces:

```bash
npm install
```

### Starting the Applications

- **Backend Development Server**:
  ```bash
  npm run dev:backend
  ```

- **Frontend Development Server**:
  ```bash
  npm run dev:frontend
  ```

### Running Tests

- **Run Backend Tests**:
  ```bash
  npm run test:backend
  ```

- **Run Frontend Tests**:
  ```bash
  npm run test:frontend
  ```

- **Run E2E Tests**:
  ```bash
  npm run test:e2e
  ```

### Build the Applications

- **Build Backend**:
  ```bash
  npm run build:backend
  ```

- **Build Frontend**:
  ```bash
  npm run build:frontend
  ```
