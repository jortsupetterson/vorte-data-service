export default `
CREATE TABLE IF NOT EXISTS profile (
  user_id TEXT PRIMARY KEY,
  firstname TEXT,
  lastname TEXT,
  email_address TEXT UNIQUE NOT NULL,
  widgets_list TEXT CHECK(json_valid(widgets_list)),
  themes_obj TEXT CHECK(json_valid(themes_obj)),
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  created_by TEXT,
  last_edited TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  edited_by TEXT
);
`;
