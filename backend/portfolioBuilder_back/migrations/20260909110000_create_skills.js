export const up = (pgm) => {
  pgm.createTable('skills', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    portfolio_id: {
      type: 'uuid',
      notNull: true,
      references: 'portfolios(id)',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'varchar(100)',
      notNull: true,
    },
    category: {
      type: 'varchar(100)',
      notNull: true,
    },
    proficiency: {
      type: 'integer',
      check: 'proficiency >= 0 AND proficiency <= 100',
    },
    display_order: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createConstraint('skills', 'skills_name_not_blank', {
    check: 'btrim(name) <> \'\'',
  });

  pgm.createConstraint('skills', 'skills_category_not_blank', {
    check: 'btrim(category) <> \'\'',
  });
};

export const down = (pgm) => {
  pgm.dropTable('skills');
};
