-- One row per person across every tapt tool. id is the Telegram user id (the OIDC sub).
-- Tools key their own data by this id and never copy the row. Timestamps are ISO strings.
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  -- Telegram profile photo URL from the OIDC picture claim. Null when the user has none.
  picture TEXT,
  -- User-friendly TON address from the last TON Connect pairing. Null when disconnected.
  wallet_address TEXT,
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL
);
