export const up = (pgm) => {
  pgm.createTable('experiences', {
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
    company_name: {
      type: 'VARCHAR(160)',
      notNull: true,
    },
    job_title: {
      type: 'VARCHAR(160)',
      notNull: true,
    },
    employment_type: {
      type: 'VARCHAR(80)',
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

  pgm.addConstraint('experiences', 'experiences_company_name_check', {
    check: "LENGTH(TRIM(company_name)) > 0",
  });

  pgm.addConstraint('experiences', 'experiences_job_title_check', {
    check: "LENGTH(TRIM(job_title)) > 0",
  });

  pgm.addConstraint('experiences', 'experiences_end_date_check', {
    check: "(end_date IS NULL) OR (end_date >= start_date)",
  });

  pgm.addConstraint('experiences', 'experiences_current_job_check', {
    check: "(is_current = false) OR (is_current = true AND end_date IS NULL)",
  });
};

export const down = (pgm) => {
  pgm.dropTable('experiences');
};
