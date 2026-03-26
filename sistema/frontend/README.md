# Frontend - Test Management System

The frontend application provides the user interface for the Test Management System. It allows instructors or admins to manage questions, generate exams, and grade student submissions interactively.

## Tech Stack

- **React**: Frontend library for building the UI component tree.
- **Vite**: Next-Generation Frontend Tooling offering ultra-fast cold server start and HMR.
- **TypeScript**: Used for robust type safety across all components and API calls.
- **React Testing Library**: For testing React components without relying on implementation details.

## Project Structure

- `src/`: The main source directory for frontend code.
  - `components/` or `features/`: The modular feature-based folder containing `exams`, `grading`, `questions`.
    - Each feature encapsulates its own API, tests `*.test.tsx`, and component logic `*.tsx`.
  - `App.tsx`: The root application component holding top-level routing or state.
  - `main.tsx`: Entry point rendering the root component into the DOM.
  - `api.ts`: API integration layer talking to the `backend` service.
- `index.html`: Entry point for the Vite build system.
- `vite.config.ts`: Configuration file for Vite plugins and options.

## Available Scripts

Within the frontend directory (or using workspace flags from the root directory):

- `npm run dev` (or `npm run dev:frontend` at root): Starts Vite in development mode with Hot Module Replacement.
- `npm run build`: Compiles TypeScript and creates an optimized production build via Vite.
- `npm run test`: Runs unit and integration tests using Jest/React Testing Library setup.

## Functionality Overview

The UI encompasses three major workflows:

1. **Questions Page (`features/questions`)**: Creating, editing, and mapping new test questions.
2. **Exams Page (`features/exams`)**: Compiling existing questions into fully formed exam sets.
3. **Grading Page (`features/grading`)**: Providing an interface for uploading student submissions or selecting an exam to trigger the automated backend grading system.
