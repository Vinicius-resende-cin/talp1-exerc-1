---
name: create-project-structure
description: This skill defines the project structure, including directories, files, and configurations, to establish a solid foundation for development. Use this skill when setting up the initial project architecture, organizing code, and configuring essential tools and dependencies.
---

This skill guides the creation of a well-organized project structure that serves as a solid foundation for development. It involves defining directories, files, and configurations that promote maintainability, scalability, and efficient collaboration.

## Best Practices

When setting up the initial project architecture, consider the following best practices:

- **Modularity**: Organize code into logical modules or components that encapsulate specific functionality. This promotes separation of concerns and makes it easier to manage and scale the codebase.
- **Consistency**: Establish consistent naming conventions and directory structures to improve readability and ease of navigation. This helps developers quickly understand where to find specific files and how to structure new ones.
- **Configuration Management**: Set up essential configuration files (e.g., package.json, .env, webpack.config.js) to manage dependencies, environment variables, and build processes. Define clear commands for setting up and running the project. This ensures that the project can be easily set up and run by other developers.
- **Documentation**: Include README.md files and other documentation to provide context and instructions for developers. This helps onboard new team members and provides a reference for existing ones.
- **Version Control**: Initialize a Git repository if not already initialized and set up .gitignore to manage version control effectively. This allows for efficient collaboration and tracking of changes over time.
- **Testing Structure**: Define a clear structure for tests, such as a separate tests directory or co-locating tests with the code they test. This encourages a test-driven development approach and ensures that tests are easily discoverable.

By following these best practices, you can create a project structure that is organized, maintainable, and conducive to efficient development and collaboration.

## Project Structure Example

Here is an example of a project structure for a typical web application, which can be adapted based on the specific needs of your project:

```
my-web-app/
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── .env
│   └── package.json
├── backend/
│   ├── src/
│   ├── tests/
│   ├── .env
│   └── package.json
├── README.md
└── .gitignore
```
