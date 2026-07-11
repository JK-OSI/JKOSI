# JKOSI Registry Platform 🌐

<p align="center">
  <img src="public/jkosi_hero_mockup.png" alt="JKOSI Platform Hero Mockup" width="100%" style="border-radius: 16px; border: 1px solid #1f2937;" />
</p>

<p align="center">
  <a href="https://github.com/Suhar121/JKOSI/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Suhar121/JKOSI?color=blue&style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/next.js-v16.2-black?style=flat-square&logo=next.js" alt="Next.js Version" />
  <img src="https://img.shields.io/badge/payload-v3.0-green?style=flat-square&logo=payload" alt="Payload CMS Version" />
  <img src="https://img.shields.io/badge/database-postgresql-blue?style=flat-square&logo=postgresql" alt="PostgreSQL Database" />
  <a href="https://github.com/Suhar121/JKOSI/pulls"><img src="https://img.shields.io/badge/PRs-welcome-orange?style=flat-square" alt="PRs Welcome" /></a>
</p>

---

## 📖 Project Overview

The **Jammu & Kashmir Open Source Initiative (JKOSI)** registry is a dynamic, high-fidelity platform designed to catalog, review, and promote verified open-source software, telemetry tools, ML models, and digital utilities developed in the region. 

It connects local developers, researchers, and students with global open-source contributors, offering a curated directory audited to meet strict code quality and security standards.

---

## ⚡ Key Technical Highlights

* **🎨 Volumetric Glassmorphic Design**: An immersive, premium dark-themed interface built on the *Spruce Moss* colorway, utilizing custom WebGL canvas wave animations, bento-grid layouts, and rotating showcase carousels.
* **🛡️ Client-Side Input Guardrails**: A staged submission wizard equipped with strict regex validation to verify GitHub repository schemas, email formats, and maintainer details.
* **🐙 Live GitHub Profile Sync**: If a project owner's biography is blank in the registry database, the server automatically queries the official GitHub API to fetch and display their live biography.
* **📂 Strict Relational Schema**: A normalized 3NF PostgreSQL database architecture managing users, repositories, submissions, and technology stacks without redundant text blobs or JSON arrays.
* **⚙️ Automated Review Hook**: Staged submissions undergo a 2-step audit. On admin approval, database hooks resolve owner mappings (avoiding collisions) and transfer files to the public directory.

---

## 🏗️ Platform Architecture

The diagram below outlines the full lifecycle of a project submission, admin audit, and public rendering:

```mermaid
graph TD
    %% User Submission Flow
    U[Developer / Submitter] -->|1. Fills Wizard| SW[Submit Wizard]
    SW -->|2. POST /api/submissions| SDB[(PostgreSQL: Submissions)]
    
    %% Admin Approval Flow
    A[Admin / Auditor] -->|3. Reviews & Approves| AP[Payload Admin Panel]
    AP -->|4. Trigger hook| AH{afterChange Hook}
    AH -->|5. Look up / Create Owner| UDB[(PostgreSQL: Users)]
    AH -->|6. Transfer details| RDB[(PostgreSQL: Repositories)]
    
    %% Visitor View Flow
    V[Public Visitor] -->|7. Visits Site| HP[Next.js SSR Frontend]
    HP -->|8. Fetch approved| RDB
    HP -->|9. Render Dynamic Bio| GH[GitHub API]
```

---

## 🚀 Installation & Local Setup

Follow these steps to run a local instance of the JKOSI registry:

### 1. Prerequisites
* **Node.js** v20.x or higher
* **PostgreSQL** instance running locally or hosted (e.g. Supabase, Neon)

### 2. Configure Environment
Create a `.env` file in the root of the project:
```env
DATABASE_URL=postgres://your_user:your_password@127.0.0.1:5432/jkosi
PAYLOAD_SECRET=your_generated_payload_secret_key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
* **Frontend Site**: [http://localhost:3000](http://localhost:3000)
* **Admin Control Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Production Compilation
To build and optimize the project for production deployments:
```bash
npm run build
npm run start
```

### 🐳 6. Running with Docker & Docker Compose
For an automated, zero-config environment (launches both Next.js and a local PostgreSQL database container):
```bash
# Build and run the containers
docker compose up --build
```
Once initialized, the platform will be available at [http://localhost:3000](http://localhost:3000) and the database will be fully configured automatically.

---

## 🤝 Contribution Workflow

We welcome contributions from developers, designers, and documentation writers! To contribute:

1. **Fork the Repository**: Create a personal copy of this repository on GitHub.
2. **Clone Locally**: 
   ```bash
   git clone https://github.com/Suhar121/JKOSI.git
   cd JKOSI
   ```
3. **Create a Feature Branch**: 
   ```bash
   git checkout -b feat/your-awesome-feature
   ```
4. **Commit Your Code**: Keep commit messages clear and concise (e.g., following Conventional Commits guidelines).
5. **Open a Pull Request**: Submit your PR back to our `main` branch.

Please review our [Guidelines](/guidelines) and [Code of Conduct](/guidelines#conduct) before submitting contributions.

---

## 📄 Licensing

This project is open-source software licensed under the [MIT License](LICENSE). 
Copyright (c) 2026 Jammu & Kashmir Open Source Initiative.
