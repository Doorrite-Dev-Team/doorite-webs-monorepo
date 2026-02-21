# 🧑‍💻 Doorrite Frontend Dev Guide

Welcome to the frontend monorepo! This guide will get you set up and contributing to our apps.

Think of this monorepo as a big toolbox that holds all our related projects (like the `user-ui`, `vendor-ui`, and `rider-ui` apps) in one place. This setup makes it easy to share components, styling, and tools across all projects.

For example, our shared UI library in `packages/ui` has **ShadCN** and **Tailwind CSS** pre-configured, so all apps maintain a consistent look and feel without duplicating styles. We use **Turborepo** to coordinate all of this efficiently.

---

## 📦 Monorepo Overview

| Tool            | Details                   |
| --------------- | ------------------------- |
| Monorepo Tool   | Turborepo                 |
| Package Manager | pnpm                      |
| Framework       | Next.js                   |
| Styling         | Tailwind CSS              |
| UI Kit          | ShadCN (in `packages/ui`) |

---

## 📂 Folder Structure

```bash
doorrite-monorepo/
├─ apps/
│  ├─ user-ui/        # Main app for end-users (your focus)
│  ├─ vendor-ui/      # App for vendors
│  └─ rider-ui/       # App for delivery riders
│
├─ packages/
│  ├─ ui/             # Shared UI components (Buttons, Inputs, etc.)
│  ├─ typescript-config/  # Shared tsconfig
│  └─ eslint-config/      # Shared lint rules
│
├─ .vscode/           # VSCode settings (optional)
├─ package.json
├─ turbo.json
└─ pnpm-workspace.yaml
```

### Inside `packages/ui`

This is where our shared design system lives:

```bash
packages/ui/
├─ src/
│  ├─ components/     # Custom, shared components (e.g., Logo.tsx)
│  ├─ lib/            # Utilities, helpers, configs
│  └─ styles/         # Global CSS styles (globals.css)
├─ postcss.config.mjs # Tailwind CSS config
├─ components.json    # ShadCN config
└─ package.json       # Dependencies
```

---

## 🚀 Getting Started

### 1. Install Dependencies (One-Time Setup)

```bash
pnpm install
```

### 2. Run an App

```bash
pnpm run dev         # Default = user-ui app
```

Or to run a specific app:

```bash
pnpm turbo run dev --filter vendor-ui
pnpm turbo run dev --filter rider-ui
```

---

## 🧪 Shared UI Components

All reusable components live in:

```
packages/ui/
```

To use a component in an app:

```tsx
import { Button } from '@repo/ui';
```

To add a new ShadCN component:

```bash
cd packages/ui
pnpm dlx shadcn@canary add [component-name]
```

---

## 🔐 Environment Variables

Each app can have its own `.env.local` file. For example:

```env
# apps/user-ui/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> Never commit `.env*` files to Git!

---

## 📄 Available Scripts

| Script        | Description                           |
| ------------- | ------------------------------------- |
| `dev`         | Run user-ui in dev                    |
| `build`       | Build all apps/packages               |
| `format`      | Run Prettier on supported files       |
| `lint`        | Run ESLint across apps/packages       |
| `check-types` | Run TypeScript checks on all packages |

---

## 📉 Workflow & Pull Requests

### 1. Create a Feature Branch

```bash
git checkout -b feature/user-profile-page
```

### 2. Push and Create a PR to `main`

* Name branches using:

  ```
  feature/<scope>/<short-description>
  ```
* Examples:

  ```
  feature/user-ui/add-profile-section
  bugfix/ui/fix-button-hover
  ```

---

## ✍️ Git Commit Style

Use this format:

```
type(scope): short description
```

### Examples:

* `feat(user-ui): add mobile nav`
* `fix(ui): align button text`
* `docs(readme): update setup instructions`
* `chore: bump dependencies`

### Allowed Types:

| Type     | Purpose                                 |
| -------- | --------------------------------------- |
| feat     | New feature                             |
| fix      | Bug fix                                 |
| chore    | Tooling or dependencies                 |
| refactor | Code improvements (not feature or fix)  |
| docs     | Documentation                           |
| style    | Formatting-only changes (no code logic) |

---

## 🧼 Formatting & Linting

### Format with Prettier

```bash
pnpm run format
```

### Lint with ESLint

```bash
pnpm run lint
```

---

## ✅ Before You Push

Run these locally:

```bash
pnpm run format
pnpm run lint
```

---

## ❗ Good Practices

* Keep PRs small and focused
* Write meaningful commit messages
* Ensure components in `packages/ui` are reusable and documented

---

## 🙋 Need Help?

Ask **@AbuAbdirrahman** or your team lead in Slack or GitHub.

---

*This guide is maintained by Abu Abdirrahman. Last updated: August 2025.*
