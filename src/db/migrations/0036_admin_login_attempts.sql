CREATE TABLE IF NOT EXISTS admin_login_attempts (
  scope TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  expires_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_expires_at
  ON admin_login_attempts(expires_at);
