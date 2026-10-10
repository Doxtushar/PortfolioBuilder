export const up = (pgm) => {
  pgm.createTable('certifications', {
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
      type: 'VARCHAR(200)',
      notNull: true,
    },
    issuing_organization: {
      type: 'VARCHAR(160)',
      notNull: true,
    },
    issue_date: {
      type: 'DATE',
      null: true,
    },
    expiration_date: {
      type: 'DATE',
      null: true,
    },
    credential_id: {
      type: 'VARCHAR(160)',
      null: true,
    },
    credential_url: {
      type: 'TEXT',
      null: true,
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

  pgm.addConstraint('certifications', 'certifications_name_check', {
    check: "LENGTH(TRIM(name)) > 0",
  });

  pgm.addConstraint('certifications', 'certifications_issuing_organization_check', {
    check: "LENGTH(TRIM(issuing_organization)) > 0",
  });

  pgm.addConstraint('certifications', 'certifications_expiration_date_check', {
    check: "(expiration_date IS NULL) OR (issue_date IS NULL) OR (expiration_date >= issue_date)",
  });
};

export const down = (pgm) => {
  pgm.dropTable('certifications');
};
