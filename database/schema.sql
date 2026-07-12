-- JKOSI D1 Database Schema

-- Admin users (can log into the admin panel)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin', 'editor')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Public developer profiles
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  github_username TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  location TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Repository index
CREATE TABLE IF NOT EXISTS repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  stars INTEGER DEFAULT 0,
  commits INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Web' CHECK(category IN ('Web', 'Mobile', 'AI/ML', 'IoT', 'Blockchain')),
  owner_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Repository technology tags
CREATE TABLE IF NOT EXISTS repository_tags (
  id TEXT PRIMARY KEY,
  repository_id TEXT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_repository_tags_repo_id ON repository_tags(repository_id);

-- Project submissions (public submit form -> admin review)
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  project_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  full_name TEXT,
  email TEXT,
  github_username TEXT,
  bio TEXT,
  admin_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Submission technology stack
CREATE TABLE IF NOT EXISTS submission_tech_stack (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  tech TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_submission_tech_stack_sub_id ON submission_tech_stack(submission_id);

-- Email newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed the default admin user
-- Run `ADMIN_PASSWORD=<password> npm run db:seed-admin` to seed or update the admin password.
-- This script is NOT a migration — it builds and applies the hash from an env var.
-- The old approach of hardcoding a hash in this file was removed for security reasons.
