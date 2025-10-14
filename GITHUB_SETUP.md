# GitHub Setup Summary

This document explains the GitHub workflows, pre-commit hooks, and contribution setup for this project.

## 📁 Files Created

### GitHub Actions (`.github/workflows/`)

1. **`ci.yml`** - Continuous Integration
   - Runs on push/PR to main branch
   - Tests on Node.js 16.x, 18.x, and 20.x
   - Checks syntax and runs test conversion

2. **`codeql.yml`** - Security Scanning
   - Runs on push/PR to main branch
   - Weekly scheduled scan (Mondays)
   - Analyzes code for security vulnerabilities

### Pull Request Template

**`.github/pull_request_template.md`**

- Auto-fills when creating PRs
- Includes description, type of change, testing checklist
- Ensures consistent PR format

### Pre-commit Configuration

**`.pre-commit-config.yaml`**

- Checks for trailing whitespace
- Fixes end-of-file formatting
- Validates YAML/JSON syntax
- Prevents large files (>5MB)
- Runs ESLint with auto-fix

### Linting Setup

**`.eslintrc.json`**

- ESLint configuration for JavaScript
- 2-space indentation
- Single quotes for strings
- Semicolons required

## 🚀 Quick Start for Contributors

### Basic Setup

```bash
# Clone and install
git clone https://github.com/Ngxba/drawio-gif-creator.git
cd drawio-gif-creator
npm install
```

### Run Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Pre-commit Hooks (Optional)

Pre-commit hooks run automatically before each commit to catch issues early.

**Setup:**

```bash
# Install pre-commit (requires Python)
pip install pre-commit

# Install git hooks
pre-commit install
```

**Manual run:**

```bash
# Run on all files
pre-commit run --all-files

# Run on staged files only
pre-commit run
```

### Skip Pre-commit (if needed)

```bash
# Only use when absolutely necessary
git commit --no-verify
```

## 📋 GitHub Actions Status

Once you push, you can view workflow runs at:
`https://github.com/Ngxba/drawio-gif-creator/actions`

### CI Workflow

- ✅ Runs automatically on every push/PR
- Tests code on multiple Node.js versions
- Ensures compatibility

### CodeQL Workflow

- ✅ Scans for security issues
- Runs weekly and on changes
- GitHub Security tab will show results

## 🔧 Maintaining the Setup

### Updating Dependencies

```bash
# Update all dependencies
npm update

# Update ESLint
npm install --save-dev eslint@latest --legacy-peer-deps
```

### Updating Pre-commit Hooks

```bash
# Auto-update to latest versions
pre-commit autoupdate

# Test the updates
pre-commit run --all-files
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Pre-commit Framework](https://pre-commit.com/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [CodeQL Security Scanning](https://codeql.github.com/)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## ❓ Common Issues

### ESLint conflicts with Puppeteer dependencies

If you see peer dependency warnings:

```bash
npm install --legacy-peer-deps
```

### Pre-commit hooks failing

1. Check Python installation: `python --version` or `python3 --version`
2. Reinstall: `pip install --upgrade pre-commit`
3. Reinstall hooks: `pre-commit install`

### GitHub Actions not running

- Check `.github/workflows/` files are in the repository
- Ensure workflows have correct YAML syntax
- Check Actions tab for error messages
