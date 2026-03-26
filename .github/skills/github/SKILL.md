---
name: github
description: GitHub patterns using gh CLI for repository management, pull requests and issues handling, branching strategies, and repository automation. Use when working with GitHub PRs, issues, and repository management tasks.
license: MIT
metadata:
  author: Callstack, Vinicius Resende Barbosa
  tags: github, gh-cli, pull-request, squash, merge, branching, repository-management
---

# GitHub Patterns

## Tools

Use `gh` CLI for all GitHub operations. Prefer CLI over GitHub MCP servers for lower context usage.

## Quick Commands

```bash
# Create a PR from the current branch
gh pr create --title "<feat|fix|docs|...>: <quick_description>" --body "<detailed_description>" --base <base_branch>
```

```bash
# List open PRs
gh pr list --state open --base <base_branch>
```

```bash
# View PR details
gh pr view <pr_number> --web
```

```bash
# Request a review from a specific user
gh pr review <pr_number> --request <username>
```

```bash
# Request a review from copilot on a existing PR
gh pr edit <pr_number> --add-reviewer @copilot
```

```bash
# Get issue details
gh issue view <issue_number> --web
```

```bash
# Create a new remote branch
gh branch create <branch_name> --base <base_branch>
```

## Branching Strategy

- Use branches named `<type>/<short-description>` (e.g., `feat/add-login`, `fix/auth-bug`).
  - For features, use `feat/<short-description>`.
  - For hotfixes, use `hotfix/<short-description>`.
  - For documentation changes, use `docs/<short-description>`.
  - For refactoring, use `refactor/<short-description>`.
  - For chore tasks, use `chore/<short-description>`.
  - For test-related changes, use `test/<short-description>`.
- Base branches should be `main` or `develop` depending on the workflow.
- Delete temporary branches after PRs are merged for keeping the repository clean.
- Never commit directly to `main` or `develop` branches. Always use feature branches and PRs for changes.
- Never use rebasing for public branches to avoid rewriting history. Use merge commits or squash merges instead.

## Pull Request Handling

- Always create a PR for any change that is not trivial (e.g., typo fixes can be direct commits).
- Use descriptive titles and detailed descriptions for PRs to provide context for reviewers.
  - Title format: `<type>: <short_description>` (e.g., `feat: add user authentication`).
  - Description should include the motivation for the change, what was changed, and any relevant links (e.g., issue numbers).
- Request reviews from relevant team members based on the area of the code being changed.
  - Always request at least one reviewer for code changes, and more for larger or more complex changes.
  - Always request a review from GitHub copilot for code suggestions and improvements.
- Address review comments promptly and communicate any changes made in response to feedback.
