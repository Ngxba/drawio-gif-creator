# Contributing to Draw.io GIF Creator

Thank you for your interest in contributing! This document provides guidelines and setup instructions.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher (required by Sharp)
- npm
- Git

### Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/drawio-gif-creator.git
cd drawio-gif-creator
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Set up pre-commit hooks:

```bash
# Install pre-commit (requires Python)
pip install pre-commit

# Set up git hooks
pre-commit install
```

## Development Workflow

### Running the Tool

```bash
# Test with sample file
node src/index.js samples/sample.drawio output.gif

# With custom settings
node src/index.js samples/sample.drawio output.gif 5 10
```

### Code Quality

#### Linting

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

#### Pre-commit Hooks (Optional)

If you've set up pre-commit hooks, they will automatically run before each commit to:

- Check for trailing whitespace
- Fix end-of-file formatting
- Validate YAML and JSON files
- Prevent large files from being committed
- Run ESLint

To manually run all pre-commit checks:

```bash
pre-commit run --all-files
```

## Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Use clear, descriptive commit messages:

- ✅ Good: `fix: handle timeout errors in renderer`
- ✅ Good: `feat: add support for custom viewport sizes`
- ❌ Bad: `fix bug`
- ❌ Bad: `update code`

## Pull Request Process

1. Create a new branch for your changes
2. Make your changes and test thoroughly
3. Run linting: `npm run lint:fix`
4. Commit your changes
5. Push to your fork
6. Open a Pull Request with a clear description

### PR Checklist

- [ ] Code follows the project style
- [ ] Changes have been tested locally
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors
- [ ] Lint checks pass

## Testing Your Changes

Test with various scenarios:

```bash
# Different durations
node src/index.js samples/sample.drawio test1.gif 3 10
node src/index.js samples/sample.drawio test2.gif 10 15

# Different FPS rates
node src/index.js samples/sample.drawio test3.gif 5 5
node src/index.js samples/sample.drawio test4.gif 5 20

# Edge cases
node src/index.js samples/sample.drawio test5.gif 1 1
node src/index.js samples/sample.drawio test6.gif 60 30
```

## Code Style Guidelines

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Keep functions focused and modular
- Add comments for complex logic
- Use meaningful variable names

## Questions or Issues?

- Open an issue on GitHub
- Check existing issues first
- Provide detailed information about your environment and the problem

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
