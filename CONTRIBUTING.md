# Contributing to JKOSI Registry 🤝

Thank you for your interest in contributing to the **Jammu & Kashmir Open Source Initiative (JKOSI)** project registry! We welcome contributions from developers, designers, writers, and bug hunters.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [security@jkosi.org](mailto:security@jkosi.org).

---

## 🛠️ How Can I Contribute?

### 1. Reporting Bugs 🐛
If you find a bug, please create a GitHub Issue. Be sure to include:
* A clear, descriptive title.
* Steps to reproduce the issue.
* Expected vs. actual behavior.
* Screenshots or logs if applicable.
* Your environment details (Node version, browser, OS).

### 2. Suggesting Features 💡
We love feature requests! To suggest a feature, open a GitHub Issue and explain:
* The goal or problem the feature solves.
* A detailed description of how it should work.
* Any mockups or design ideas.

### 3. Submitting Pull Requests 🚀
To submit code changes:

1. **Fork the repository** and clone it locally.
2. **Create a branch** using a descriptive name:
   * For features: `feat/your-feature-name`
   * For bug fixes: `fix/bug-description`
   * For documentation: `docs/doc-updates`
3. **Write clean, documented code** following our style guide.
4. **Ensure tests pass** and run the production build (`npm run build`) locally to confirm there are no TypeScript or Next.js compilation errors.
5. **Commit your changes** using clean commit messages (Conventional Commits are preferred):
   * Example: `feat: add search input autofocus on mount`
6. **Push to your fork** and submit a **Pull Request** back to the `main` branch of the original repository.
7. Link any relevant issues in your PR description (e.g. `Closes #12`).

---

## 🎨 Code Style & Quality Standards

* **TypeScript**: Use strict type definitions. Avoid using `any` unless absolutely necessary.
* **Component Design**: Place global UI components in `src/components/`, and page-specific views inside their respective App Router folders in `src/app/(frontend)/`.
* **CSS & Layout**: Use custom Tailwind CSS variables configured in `src/app/globals.css`. Ensure layouts are fully responsive down to mobile viewports.
* **Payload Hooks**: When modifying collection hooks, handle errors gracefully using Payload's standard API errors to present clean notifications to administrators.
* **Formatting**: Ensure files are formatted before committing.

Thank you for building with the JKOSI community! 🚀
