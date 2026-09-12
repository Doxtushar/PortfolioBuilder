export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      portfolio_id uuid NOT NULL,
      title varchar(160) NOT NULL,
      description text,
      technologies text,
      project_url text,
      github_url text,
      image_url text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT projects_portfolio_id_foreign
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,
      CONSTRAINT projects_title_not_blank CHECK (btrim(title) <> '')
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS projects;
  `);
};
