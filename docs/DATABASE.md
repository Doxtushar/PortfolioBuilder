# Portfolio Builder — Database Design

## 1. Database

Primary database:

**PostgreSQL**

The database stores user accounts, portfolio content, templates, and portfolio configuration.

---

# 2. Entity Relationship Overview

```text
User
 │
 └── Portfolio
      │
      ├── Projects
      ├── Skills
      ├── Experiences
      ├── Educations
      ├── Certifications
      ├── Social Links
      └── Portfolio Settings
```

Templates are independent:

```text
Template
   │
   └── Portfolio
```

A portfolio references the selected template.

---

# 3. users

Stores account information.

### Fields

```text
id
email
password_hash
first_name
last_name
avatar_url
created_at
updated_at
```

### Rules

* `id` is the primary key.
* `email` must be unique.
* Email should be normalized.
* Password must always be hashed.
* Never expose `password_hash` through APIs.

---

# 4. portfolios

Stores the main portfolio.

### Fields

```text
id
user_id
username
title
professional_title
bio
location
phone
is_published
template_id
created_at
updated_at
```

### Relationships

```text
user_id → users.id
template_id → templates.id
```

### Rules

* One user can own one primary portfolio in MVP.
* `username` must be unique.
* `username` becomes the public URL identifier.
* Only the portfolio owner can modify it.
* Unpublished portfolios must not be publicly accessible.

Example:

```text
/u/tushar
```

---

# 5. projects

Stores portfolio projects.

### Fields

```text
id
portfolio_id
title
description
image_url
github_url
live_url
start_date
end_date
display_order
created_at
updated_at
```

### Relationship

```text
portfolio_id → portfolios.id
```

### Rules

* A project belongs to exactly one portfolio.
* `display_order` controls project ordering.
* Deleting a portfolio should remove its projects.

---

# 6. skills

Stores portfolio skills.

### Fields

```text
id
portfolio_id
name
category
proficiency
display_order
created_at
updated_at
```

### Relationship

```text
portfolio_id → portfolios.id
```

Examples:

```text
JavaScript
React
Node.js
PostgreSQL
Java
Python
```

---

# 7. experiences

Stores professional experience.

### Fields

```text
id
portfolio_id
job_title
company
location
description
start_date
end_date
is_current
display_order
created_at
updated_at
```

### Relationship

```text
portfolio_id → portfolios.id
```

If `is_current = true`, `end_date` should normally be null.

---

# 8. educations

Stores education history.

### Fields

```text
id
portfolio_id
institution
degree
field_of_study
description
start_date
end_date
display_order
created_at
updated_at
```

### Relationship

```text
portfolio_id → portfolios.id
```

---

# 9. certifications

Stores certifications.

### Fields

```text
id
portfolio_id
name
issuing_organization
issue_date
expiration_date
credential_url
display_order
created_at
updated_at
```

### Relationship

```text
portfolio_id → portfolios.id
```

---

# 10. social_links

Stores social/professional links.

### Fields

```text
id
portfolio_id
platform
url
display_order
created_at
updated_at
```

Examples:

```text
GitHub
LinkedIn
X
Instagram
YouTube
Website
```

### Relationship

```text
portfolio_id → portfolios.id
```

---

# 11. templates

Stores available portfolio templates.

### Fields

```text
id
name
slug
description
preview_image_url
is_active
created_at
updated_at
```

### Rules

* `slug` must be unique.
* Inactive templates should not be selectable for new portfolios.
* Templates should not contain user-specific data.

---

# 12. portfolio_settings

Stores visual configuration.

### Fields

```text
id
portfolio_id
primary_color
secondary_color
font_family
background_color
show_about
show_skills
show_projects
show_experience
show_education
show_certifications
show_social_links
created_at
updated_at
```

### Relationship

```text
portfolio_id → portfolios.id
```

There should be one settings record per portfolio.

---

# 13. Relationships

```text
users
  │
  │ 1:1
  ▼
portfolios
  │
  ├── 1:N ── projects
  ├── 1:N ── skills
  ├── 1:N ── experiences
  ├── 1:N ── educations
  ├── 1:N ── certifications
  ├── 1:N ── social_links
  │
  ├── 1:1 ── portfolio_settings
  │
  └── N:1 ── templates
```

---

# 14. Foreign Key Rules

Child records should use foreign keys.

Example:

```text
projects.portfolio_id
        ↓
portfolios.id
```

Use appropriate cascading behavior for portfolio-owned data.

Deleting a portfolio should normally remove:

```text
projects
skills
experiences
educations
certifications
social_links
portfolio_settings
```

User deletion behavior should be explicitly handled by the application and database design.

---

# 15. Indexes

Important indexes should include:

```text
users.email
portfolios.username
portfolios.user_id
projects.portfolio_id
skills.portfolio_id
experiences.portfolio_id
educations.portfolio_id
certifications.portfolio_id
social_links.portfolio_id
portfolio_settings.portfolio_id
templates.slug
```

Indexes should be added based on actual query patterns and constraints.

Unique fields should use unique constraints/indexes.

---

# 16. IDs

Use generated IDs rather than exposing sequential business identifiers where appropriate.

The exact PostgreSQL ID strategy will be finalized during implementation.

Possible approach:

```text
UUID
```

UUIDs are preferred for public-facing resources where predictable sequential IDs are undesirable.

---

# 17. Timestamps

Major tables should contain:

```text
created_at
updated_at
```

The application/database should maintain these consistently.

---

# 18. Dates

Use appropriate PostgreSQL date/time types.

Portfolio dates such as:

```text
start_date
end_date
issue_date
expiration_date
```

can use date-only values when time-of-day is not meaningful.

---

# 19. URLs

URLs should be validated by the backend.

Examples:

```text
github_url
live_url
credential_url
social_links.url
```

Do not blindly trust client-side URL validation.

---

# 20. Username / Public Slug

The portfolio username is part of the public URL:

```text
/u/:username
```

Requirements:

* Unique
* Case-normalized
* URL-safe
* Reasonable length limit
* Reserved usernames blocked

Examples of reserved usernames:

```text
admin
api
login
register
dashboard
settings
templates
help
support
```

The exact reserved list will be finalized later.

---

# 21. Privacy

Not all user account data should be public.

### Private

```text
password_hash
authentication data
internal account information
```

### Public when portfolio is published

```text
name
professional title
bio
location
portfolio projects
skills
experience
education
certifications
social links
selected contact information
```

The backend must explicitly determine which fields are publicly exposed.

---

# 22. Template Separation

Portfolio data must remain independent from template presentation.

Example:

```text
Portfolio
    │
    ├── Content
    │
    └── template_id
             │
             ▼
         Template
```

Changing a template must not modify portfolio content.

---

# 23. File Storage

Images should normally be stored in external object storage.

PostgreSQL should store references such as:

```text
avatar_url
image_url
storage_key
```

The exact storage provider will be selected before implementing uploads.

---

# 24. Future Database Extensions

These should NOT be implemented in MVP unless requested:

```text
portfolio_views
analytics_events
subscriptions
payments
custom_domains
ai_generations
notifications
audit_logs
teams
portfolio_likes
portfolio_comments
```

The current schema should leave room for these future features.

---

# 25. Migration Strategy

Database changes must be managed through migrations.

Rules:

* Never manually modify the production schema.
* Every schema change should have a migration.
* Migrations should be version controlled.
* Never silently delete production data.
* Test migrations before deployment.

---

# 26. Data Integrity

Use database constraints where appropriate:

* NOT NULL
* UNIQUE
* FOREIGN KEY
* CHECK constraints where useful
* Appropriate defaults

Do not rely entirely on frontend validation.

Validation should exist at the API boundary and database level where appropriate.

---

# 27. Database Design Principle

The database should optimize for:

```text
Data integrity
     >
Maintainability
     >
Correct relationships
     >
Query performance
     >
Premature optimization
```

Keep the MVP schema simple and normalized.

Only denormalize when there is a demonstrated performance requirement.
