# 🧑‍💻 DoorRite Frontend Dev Guide

Welcome to the frontend dev team! This guide will walk you through getting up and running with the `doorrite-monorepo` — including how to work on and contribute to the apps like `user-ui`, `vendor-ui`, and `rider-ui`.

---

## 📦 Monorepo Overview

* **Tooling:** Turborepo + pnpm
* **Package Manager:** `pnpm`
* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **UI Kit:** ShadCN (installed in `packages/ui`)

---

## 📂 Folder Structure

```
doorrite-monorepo/
├─ apps/
│  ├─ user-ui/        # Default app most devs work on
│  ├─ vendor-ui/      # Vendor-facing app
│  └─ rider-ui/       # Rider-facing app
│
├─ packages/
│  ├─ ui/             # Shared UI components (ShadCN + Tailwind)
│  ├─ typescript-config/  # Base tsconfig
│  └─ eslint-config/      # Shared lint rules
│
├─ .vscode/           # VSCode settings (optional)
├─ package.json
├─ turbo.json
└─ pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### 1. **Install dependencies**

```bash
pnpm install
```

### 2. **Run frontend app in dev**

```bash
pnpm run dev         # Runs default user-ui app
```

> You can also run a specific app using Turborepo filters:

```bash
pnpm turbo run dev --filter vendor-ui
pnpm turbo run dev --filter rider-ui
```

---

## 🧪 Available Scripts

In root `package.json`:

| Script        | Description                           |
| ------------- | ------------------------------------- |
| `dev`         | Run user-ui in dev                    |
| `build`       | Build all apps/packages               |
| `format`      | Run Prettier on supported files       |
| `lint`        | Run ESLint across apps/packages       |
| `check-types` | Run TypeScript checks on all packages |

---

## 🧠 Shared Components (ShadCN + Tailwind)

All design system components are located in:

```
packages/ui/
```

These are imported into each app like this:

```tsx
import { Button } from '@repo/ui';
```

To add new components:

```bash
cd packages/ui
pnpm dlx shadcn@canary add [component-name]
```

> This uses the ShadCN CLI to add prebuilt, customizable components with Tailwind CSS.

---

## 🔐 Environment Variables

Each app can have its own `.env` file. Create one inside `apps/user-ui/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> Never commit `.env*` files to git!

---

## 📄 Workflow & PRs

* Work on a **feature branch**:

  ```
  git checkout -b feature/user-ui-navbar
  ```

* Push changes and create a PR to `main`.

* All devs work under `feature/<your-feature>` naming convention.

---

## ✍️ Git Commit Style

Follow this commit style for consistency:

```
type(scope): short description
```

**Examples:**

* `feat(user-ui): add mobile navbar`
* `fix(ui): correct padding on Button`
* `chore: update dependencies`

**Types to use:**

* `feat` – New feature
* `fix` – Bug fix
* `chore` – Tooling or deps
* `refactor` – Code improvement (no feature/fix)
* `docs` – Documentation changes
* `style` – Formatting, missing semicolons, etc

---

## 🧼 Formatting & Linting

### Prettier (Formatting)

```bash
pnpm run format
```

### ESLint (Code Linting)

```bash
pnpm run lint
```

---

## ✅ Good Practices

* Keep PRs small and focused.
* Use clear and meaningful commit messages.
* Follow component standards when adding to `packages/ui`.

---

## 🙋 Need Help?

Ask **@AbuAbdirrahman** or your team lead in Slack or GitHub.

---

*This guide is maintained by Abu Abdirrahman. Last updated: August 2025.*
