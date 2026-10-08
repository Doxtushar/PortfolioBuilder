export const up = (pgm) => {
  pgm.createTable('education', {
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
    institution: {
      type: 'VARCHAR(160)',
      notNull: true,
    },
    degree: {
      type: 'VARCHAR(160)',
      notNull: true,
    },
    field_of_study: {
      type: 'VARCHAR(160)',
      null: true,
    },
    location: {
      type: 'VARCHAR(160)',
      null: true,
    },
    start_date: {
      type: 'DATE',
      notNull: true,
    },
    end_date: {
      type: 'DATE',
      null: true,
    },
    is_current: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    description: {
      type: 'TEXT',
      null: true,
    },
    display_order: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('education', 'education_institution_check', {
    check: "LENGTH(TRIM(institution)) > 0",
  });

  pgm.addConstraint('education', 'education_degree_check', {
    check: "LENGTH(TRIM(degree)) > 0",
  });

  pgm.addConstraint('education', 'education_end_date_check', {
    check: "(end_date IS NULL) OR (end_date >= start_date)",
  });

  pgm.addConstraint('education', 'education_current_check', {
    check: "(is_current = false) OR (is_current = true AND end_date IS NULL)",
  });
};

export const down = (pgm) => {
  pgm.dropTable('education');
};
