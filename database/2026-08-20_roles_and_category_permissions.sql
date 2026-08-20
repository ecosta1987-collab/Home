-- Migrazione: ruoli utenti e permessi per categoria
-- Eseguire una sola volta sul database esistente.

ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER picture_url;

CREATE TABLE user_category_permissions (
  user_id INT UNSIGNED NOT NULL,
  category_key VARCHAR(64) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, category_key),
  CONSTRAINT fk_category_permissions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
