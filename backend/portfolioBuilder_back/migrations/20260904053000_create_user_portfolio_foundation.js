export const up = (pgm) => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email varchar(255) NOT NULL,
      password_hash text NOT NULL,
      name varchar(160) NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT users_email_unique UNIQUE (email),
      CONSTRAINT users_email_not_blank CHECK (btrim(email) <> ''),
      CONSTRAINT users_name_not_blank CHECK (btrim(name) <> '')
    );

    CREATE TABLE portfolios (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      username varchar(50) NOT NULL,
      title varchar(160) NOT NULL,
      bio text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT portfolios_user_id_foreign
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
      CONSTRAINT portfolios_user_id_unique UNIQUE (user_id),
      CONSTRAINT portfolios_username_unique UNIQUE (username),
      CONSTRAINT portfolios_username_not_blank CHECK (btrim(username) <> ''),
      CONSTRAINT portfolios_title_not_blank CHECK (btrim(title) <> '')
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS portfolios;
    DROP TABLE IF EXISTS users;
    DROP EXTENSION IF EXISTS pgcrypto;
  `);
};
