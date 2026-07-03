# Contributing to Smart PDF Generator

Thank you for your interest in contributing! This project welcomes all contributions, from bug reports to full feature implementations.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally: `git clone https://github.com/your-username/smart-pdf-generator.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Copy `.env.example` to `.env` and configure

## Development Workflow

- Run in development mode: `npm run dev`
- The server restarts automatically on file changes (nodemon)
- Frontend changes are served live at `http://localhost:3000`

## Code Standards

- **JavaScript**: Use ES6+ features, `'use strict'`, and meaningful variable names
- **Comments**: Add JSDoc comments for all public functions
- **Error handling**: Always wrap async operations in try/catch
- **Validation**: Validate all user input before processing
- **Security**: Never trust user input; sanitize strings before rendering or writing to files

## Submitting Changes

1. Write clear, focused commits: `git commit -m "feat: add watermark opacity control"`
2. Push your branch: `git push origin feature/your-feature-name`
3. Open a Pull Request against the `main` branch
4. Fill in the PR template with a clear description

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new PDF template
fix: resolve page numbering bug on multi-page documents
docs: update README installation steps
style: improve dark mode color contrast
refactor: extract table renderer into utility function
test: add validation tests for invoice data
```

## Reporting Issues

Please use the GitHub Issues tracker and include:
- A clear description of the bug or feature request
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your Node.js version and OS

## Adding New Templates

1. Create a generator function in `server/utils/pdfGenerator.js`
2. Add a route in `server/routes/pdf.js`
3. Add sample data in `server/routes/templates.js`
4. Add a tab panel in `client/index.html`
5. Add data collection and form building in `client/js/app.js`
6. Update the README with the new template

## Code of Conduct

- Be respectful and welcoming to all contributors
- Focus on the code, not the person
- Accept constructive criticism gracefully
- Help newcomers learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
