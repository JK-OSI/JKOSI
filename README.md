# JKOSI Registry Platform 🌐

The official open-source project registry and submission platform for the **Jammu & Kashmir Open Source Initiative (JKOSI)**. 

This platform catalogs verified open-source software, telemetry tools, ML models, and digital utilities developed to address regional capacity challenges and connect local developers with global contributors.

---

## 🌟 Key Features

* **Dynamic Registries**: 100% database-driven project index with dynamic tag search, categories matching, and developer detail pages.
* **Review & Submission Wizard**: Staged, client-side validated submission wizard that gathers project metadata, README content, and developer verification.
* **Auto-fetching GitHub Bios**: If a maintainer's biography is empty in the database, the server automatically queries the official GitHub API to fetch and render their live biography.
* **Admin Control Panel**: Full-featured admin panel powered by Payload CMS to review, audit, approve, or reject submissions.
* **Atmospheric Premium UI**: Immersive dark-themed interface built using the *Spruce Moss* colorway, custom canvas wave animations, responsive bento grids, and dynamic SVG logo carousels.
* **Multilingual theme Switcher**: Select between premium styling modes (Spruce Moss, Kashmir Marigold, Gulmarg Ice, Jasmine White).

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router, React 19)
* **CMS & Engine**: Payload CMS v3 (REST APIs, Admin panel, Collections lifecycle hooks)
* **Database**: PostgreSQL (via `@payloadcms/db-postgres`)
* **Styling**: Tailwind CSS v4 & Vanilla CSS
* **Animations**: Motion (Framer Motion)
* **Markdown Rendering**: ReactMarkdown (for formatting readmes)

---

## 🗄️ Database Collections

The database schema is normalized to 3NF and managed directly via Postgres:

1. **`users`**: Manages developer credentials, permissions, GitHub usernames, and maintainer biographies.
2. **`repositories`**: Holds active, audited projects displayed in the directory, linked to their owner via `owner_id`.
3. **`submissions`**: Manages candidate entries submitted by the community in a `pending` state before admin approval.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js v20.x or higher
* PostgreSQL instance running locally or hosted (e.g. Supabase, Neon)

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
Open [http://localhost:3000](http://localhost:3000) to view the platform. Access the Admin Control Panel at [http://localhost:3000/admin](http://localhost:3000/admin).

### 5. Compile for Production
To build and optimize the project:
```bash
npm run build
npm run start
```

---

## 🤝 Contributing

We welcome contributions from the community! To get started:

1. **Fork the Repository**: Create a personal copy of this repository on GitHub.
2. **Clone Locally**: `git clone https://github.com/Suhar121/JKOSI.git`
3. **Create a Feature Branch**: `git checkout -b feat/your-awesome-feature`
4. **Commit Changes**: Use clean, descriptive commit messages.
5. **Open a Pull Request**: Submit your PR back to our `main` branch for review.

Please review our [Guidelines](/guidelines) and [Code of Conduct](/guidelines#conduct) before submitting contributions.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
