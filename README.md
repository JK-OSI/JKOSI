<p align="center">
  <img src="public/jkosi_hero_mockup.png" alt="JKOSI Platform" width="100%" style="border-radius: 16px;" />
</p>

<h1 align="center">JKOSI — Jammu & Kashmir Open Source Initiative</h1>

<p align="center">
  A curated open-source registry platform connecting developers, researchers, and students across the Kashmir valley with the global open-source community.
</p>

<p align="center">
  <a href="https://github.com/JK-OSI/JKOSI/blob/main/LICENSE"><img src="https://img.shields.io/github/license/JK-OSI/JKOSI?color=2ea44f&style=flat-square" alt="MIT License" /></a>
  <a href="https://github.com/JK-OSI/JKOSI/actions"><img src="https://img.shields.io/github/actions/workflow/status/JK-OSI/JKOSI/ci.yml?branch=main&style=flat-square&label=CI" alt="CI Status" /></a>
  <img src="https://img.shields.io/badge/Next.js-v16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Payload_CMS-v3-7C3AED?style=flat-square" alt="Payload CMS v3" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <a href="https://github.com/JK-OSI/JKOSI/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
</p>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## About the Project

**JKOSI** (Jammu & Kashmir Open Source Initiative) is a regional open-source registry designed to catalog, audit, and promote software projects built by developers from Jammu & Kashmir.

The platform provides:
- A **public directory** of verified open-source projects with live GitHub stats
- An **admin-controlled review pipeline** where submissions are audited before going public
- A **submission portal** for developers to list their work for review
- A **member directory** tracking contributors across the ecosystem

The goal is to give regional developers a home — a credible, searchable index of their work that connects them to global opportunities and contributors.

---

## Features

- 🌙 **Premium Dark UI** — Glassmorphic design with animated canvas waves and rotating project carousels
- 🔍 **Real-time Search & Filter** — Search projects by name, filter by category (Web, AI/ML, Mobile, IoT, Blockchain)
- 📋 **Submission Wizard** — Multi-step form with live validation for GitHub URL, email, and tech stack
- ⚙️ **Auto-approval Pipeline** — Admin approves a submission → member profile and repository entry are created automatically via Payload hooks
- 🐙 **GitHub API Integration** — Fetches live author bios from GitHub if not provided in the database
- 🛡️ **Role-based Access Control** — Separate `admin` and `editor` roles with collection-level and field-level permissions
- 🗄️ **Relational PostgreSQL Schema** — Normalized collections: `users`, `members`, `repositories`, `submissions`
- 🐳 **Docker-first Deployment** — Full Docker + Docker Compose setup for zero-friction hosting

---

## Architecture

```mermaid
graph TD
    U[Developer] -->|Fills submission form| SW[/submit page]
    SW -->|POST /api/submissions| SDB[(Submissions Table)]

    A[Admin] -->|Reviews in /admin| AP[Payload Admin Panel]
    AP -->|Sets status = approved| AH{afterChange Hook}
    AH -->|Finds or creates| MDB[(Members Table)]
    AH -->|Creates entry| RDB[(Repositories Table)]

    V[Public Visitor] -->|Browses /projects| FE[Next.js Frontend]
    FE -->|payload.find repositories| RDB
    FE -->|Fetches live bio| GH[GitHub API]
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack) |
| **CMS / Backend** | Payload CMS v3 |
| **Database** | PostgreSQL 15 |
| **ORM / DB Adapter** | `@payloadcms/db-postgres` (Drizzle) |
| **Styling** | Tailwind CSS v4 + Custom Design Tokens |
| **Containerization** | Docker + Docker Compose |
| **CI** | GitHub Actions |

---

## Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **PostgreSQL** 15 (local, Docker, or hosted via [Neon](https://neon.tech) / [Supabase](https://supabase.com))
- **npm** v10+

---

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/JK-OSI/JKOSI.git
cd JKOSI
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` and fill in your database credentials and Payload secret. See [Environment Variables](#environment-variables) for details.

**4. Start the development server**
```bash
npm run dev
```

| URL | Purpose |
|---|---|
| `http://localhost:3000` | Public frontend |
| `http://localhost:3000/admin` | Payload CMS admin panel |

On first visit to `/admin`, you will be prompted to create your first admin account.

---

### Docker Setup

Docker Compose spins up the Next.js app and a PostgreSQL database together. No local PostgreSQL installation required.

**1. Copy and fill in the environment file**
```bash
cp .env.example .env
# Edit .env with your values
```

**2. Build and start containers**
```bash
docker compose up --build
```

**3. Stop containers**
```bash
docker compose down
```

The app will be available at `http://localhost:${APP_PORT}` (default: `http://localhost:3001`).

> The database schema is created automatically on first startup via Payload's `push: true` adapter setting — no manual migration step is needed.

---

## Environment Variables

Copy `.env.example` to `.env` and set these values:

| Variable | Description | Required |
|---|---|---|
| `APP_PORT` | Host port Docker maps to (e.g. `3001`) | Yes |
| `NEXT_PUBLIC_SERVER_URL` | Full public URL of the app (e.g. `https://yourdomain.com`) | Yes |
| `DB_HOST` | PostgreSQL hostname (`db` when using Docker Compose) | Yes |
| `DB_PORT` | PostgreSQL port (default: `5432`) | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_NAME` | PostgreSQL database name | Yes |
| `PAYLOAD_SECRET` | Random secret for signing sessions and JWT tokens. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Yes |

> **Security**: Never commit your `.env` file. The `.gitignore` is pre-configured to exclude it.

---

## Project Structure

```
JKOSI/
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Public-facing Next.js pages
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── projects/     # Project directory + detail pages
│   │   │   └── submit/       # Submission wizard
│   │   ├── (payload)/        # Payload admin routes
│   │   └── api/              # Payload REST API (auto-generated)
│   ├── collections/
│   │   ├── Users.ts          # Admin-only auth accounts
│   │   ├── Members.ts        # Public developer profiles
│   │   ├── Repositories.ts   # Approved open-source projects
│   │   └── Submissions.ts    # Incoming project submissions
│   └── components/           # Shared UI components
├── payload.config.ts          # Payload CMS configuration
├── docker-compose.yml         # Container orchestration
├── Dockerfile                 # Multi-stage production build
└── .env.example               # Environment variable template
```

---

## Contributing

We welcome contributions from everyone. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

**Quick start for contributors:**

```bash
# Fork and clone
git clone https://github.com/JK-OSI/JKOSI.git

# Create a branch
git checkout -b feat/your-feature-name

# Make changes, then commit using Conventional Commits
git commit -m "feat: add dark mode toggle"

# Open a Pull Request against main
```

Please also review our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Security

If you discover a security vulnerability, **do not open a public issue**. Please follow the responsible disclosure process outlined in [SECURITY.md](SECURITY.md).

---

## License

This project is licensed under the [MIT License](LICENSE).  
Copyright © 2026 Jammu & Kashmir Open Source Initiative.
