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

### Pre-commit Hooks (Git Hooks)

**`.husky/pre-commit`**

- Runs `lint-staged` automatically before each commit
- Auto-formats code with Prettier
- Auto-fixes linting errors with oxlint
- Aborts commit if unfixable lint errors remain

### Code Quality Tools

**`package.json` - lint-staged configuration**

- Prettier: Formats `.{js,jsx,ts,tsx,json,css,md,yml,yaml}` files
- oxlint: Lints and fixes `.{js,jsx,ts,tsx}` files, then validates for remaining errors
- Configuration prevents commits with unfixable linting issues

## 🚀 Quick Start for Contributors

### Basic Setup

```bash
# Clone and install
git clone https://github.com/Ngxba/drawio-gif-creator.git
cd drawio-gif-creator
npm install
```

### Run Code Quality Checks

```bash
# Check code formatting
npm run format:check

# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Auto-format code with Prettier
npm run format

# Run all checks (format + lint)
npm run check
```

### Git Hooks (Automatic)

Git hooks are **automatically set up** when you install dependencies:

```bash
npm install
```

The `.husky/pre-commit` hook runs automatically before each commit:

- Auto-formats staged files with Prettier
- Auto-fixes staged files with oxlint
- **Aborts commit if unfixable linting errors remain**

### Skip Git Hooks (if needed)

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

# Update specific tools
npm install --save-dev oxlint@latest prettier@latest
```

### Reinstalling Git Hooks

```bash
# Reinstall Husky hooks
npx husky install

# Verify hooks are set up
ls -la .husky/
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Oxlint Documentation](https://oxc-project.github.io/docs/guide/usage.html)
- [CodeQL Security Scanning](https://codeql.github.com/)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## ❓ Common Issues

### Git hooks not running on commit

If pre-commit hooks don't run automatically:

```bash
# Reinstall Husky hooks
npx husky install

# Verify hooks are set up
cat .husky/pre-commit
```

### Commit blocked due to linting errors

The commit will abort if unfixable linting errors exist after auto-fix. To resolve:

1. Review the error message from oxlint
2. Fix the issues manually (they cannot be auto-fixed)
3. Stage the files again: `git add .`
4. Retry the commit

### Husky not initialized

If `.husky/` directory doesn't exist:

```bash
# Reinstall dependencies (triggers Husky setup)
npm install

# Or manually initialize Husky
npx husky install
```

### GitHub Actions not running

- Check `.github/workflows/` files are in the repository
- Ensure workflows have correct YAML syntax
- Check Actions tab for error messages
- Verify branch protection rules aren't blocking runs
