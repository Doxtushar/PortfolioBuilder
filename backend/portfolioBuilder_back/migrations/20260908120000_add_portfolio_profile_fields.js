export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE portfolios
      ADD COLUMN full_name varchar(160),
      ADD COLUMN headline varchar(160),
      ADD COLUMN location varchar(160),
      ADD COLUMN introduction text,
      ADD COLUMN profile_image_url text;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE portfolios
      DROP COLUMN IF EXISTS full_name,
      DROP COLUMN IF EXISTS headline,
      DROP COLUMN IF EXISTS location,
      DROP COLUMN IF EXISTS introduction,
      DROP COLUMN IF EXISTS profile_image_url;
  `);
};
