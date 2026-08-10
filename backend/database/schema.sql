-- ============================================================
-- Auth App - Database Schema
-- Run this once to create the database and initial tables.
-- New features should add NEW tables/migrations here rather
-- than editing existing tables destructively.
-- ============================================================

CREATE DATABASE IF NOT EXISTS auth_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE auth_app;

-- Core users table. Keep this table focused on identity/auth only.
-- Add profile/feature-specific data in separate tables that
-- reference users(id), so this table stays stable as you grow.
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(50)   NOT NULL DEFAULT 'user',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- Example of how future features should attach to users:
-- a login audit trail. Safe to remove if you don't need it,
-- and a good template to copy for new feature tables.
CREATE TABLE IF NOT EXISTS login_history (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  ip_address  VARCHAR(45),
  user_agent  VARCHAR(255),
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_login_history_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  INDEX idx_login_history_user (user_id)
) ENGINE=InnoDB;
