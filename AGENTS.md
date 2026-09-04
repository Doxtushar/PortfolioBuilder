# Portfolio Builder — AI Development Instructions

## 1. Project

Build a production-quality SaaS web application that allows users to create, customize, publish, and share professional personal portfolios without coding.

The product should be:

* Modern and visually polished
* Responsive
* Accessible
* Scalable
* Secure
* Portfolio/resume worthy
* Easy to maintain

---

## 2. Technology Stack

### Frontend

* React 19+
* TypeScript
* Vite
* React Router
* TanStack Query
* Axios
* Lucide React
* ESLint

### Backend

* Node.js
* TypeScript
* Express.js
* REST API

### Database

* PostgreSQL

### Development

* Git / GitHub
* Environment variables for secrets
* API documentation
* Automated testing where appropriate

Do not introduce alternative frameworks or major dependencies without approval.

---

## 3. Project Structure

```text
PortfolioBuilder/
├── AGENTS.md
├── frontend/
│   └── portfolioBuilder_front/
├── backend/
│   └── portfolioBuilder_back/
├── database/
├── docs/
└── README.md
```

Follow the existing structure. Do not reorganize the project unnecessarily.

---

## 4. Product Scope

### MVP

Users should be able to:

1. Register
2. Login/logout
3. Create a portfolio
4. Edit portfolio information
5. Add:

   * About
   * Skills
   * Projects
   * Experience
   * Education
   * Certifications
   * Social links
6. Select a portfolio template
7. Customize basic appearance
8. Preview the portfolio
9. Publish/unpublish the portfolio
10. Get a public portfolio URL
11. View the portfolio responsively

### Future Features

Do not implement these unless specifically requested:

* AI-generated portfolio content
* AI resume-to-portfolio
* Portfolio analytics
* Custom domains
* QR codes
* Premium templates
* Payments/subscriptions
* Advanced drag-and-drop builder
* Advanced SEO controls

---

## 5. Architecture Principles

* Use modular architecture.
* Keep frontend and backend separated.
* Keep business logic out of UI components.
* Use reusable components.
* Keep API communication inside services/hooks.
* Keep types centralized where appropriate.
* Prefer simple solutions over unnecessary abstractions.
* Avoid premature optimization.
* Avoid duplicated logic.
* Maintain clear separation of concerns.

---

## 6. Frontend Rules

* Use TypeScript for all new code.
* Use functional React components.
* Use React hooks appropriately.
* Use React Router for routing.
* Use TanStack Query for server/API state.
* Use Axios for HTTP communication.
* Reuse components instead of duplicating UI.
* Keep components reasonably small.
* Avoid putting API calls directly inside presentation components.
* Use semantic HTML.
* Build responsive layouts.
* Follow accessibility best practices.
* Use Lucide React for icons where suitable.
* Do not add inline SVG icons unnecessarily.
* Do not introduce a global state library unless there is a demonstrated need.

---

## 7. Backend Rules

* Use TypeScript.
* Use Express.js.
* Follow RESTful API conventions.
* Separate routes, controllers, services, and data-access logic.
* Validate incoming requests.
* Use centralized error handling.
* Never expose sensitive information.
* Use environment variables for secrets and configuration.
* Return consistent API responses.
* Keep business logic inside services rather than route handlers.

---

## 8. Database Rules

* Use PostgreSQL.
* Design proper relationships and constraints.
* Use primary keys and foreign keys appropriately.
* Add indexes where justified.
* Avoid storing duplicated data unnecessarily.
* Use migrations for schema changes.
* Never modify production schema manually without a migration.
* Never delete or reset database data without explicit approval.

Core entities are expected to include:

* users
* portfolios
* projects
* skills
* experiences
* educations
* certifications
* social_links
* templates
* portfolio_settings

The exact schema must be designed before implementation of the corresponding feature.

---

## 9. Security

Always consider:

* Authentication
* Authorization
* Password hashing
* Input validation
* SQL injection prevention
* XSS prevention
* CSRF where applicable
* Secure cookies/tokens
* Rate limiting where appropriate
* File upload validation
* Environment secret protection
* Proper CORS configuration

Never hardcode:

* Passwords
* API keys
* JWT secrets
* Database credentials
* Private tokens

---

## 10. Git Rules

* Never force push.
* Never delete branches or commits without approval.
* Never run destructive Git commands without explicit approval.
* Never overwrite existing user work.
* Do not reset the repository to an earlier state unless explicitly requested.
* Keep commits focused.
* Use meaningful commit messages.

Preferred format:

```text
feat: add portfolio project API
fix: resolve portfolio preview issue
refactor: simplify template service
docs: update API documentation
test: add portfolio service tests
```

---

## 11. Multi-AI Collaboration

This project may be developed using multiple AI coding tools, including:

* Codex
* Cursor
* Devin
* JCode

Treat the repository and documentation as the source of truth.

Before modifying code:

1. Inspect the existing implementation.
2. Read relevant documentation.
3. Understand existing architecture.
4. Check Git status.
5. Identify files that actually need modification.

Do not assume another AI has not already implemented something.

Never rewrite working code simply to use a different implementation style.

Avoid modifying unrelated files.

---

## 12. Task Execution

For every task:

### Step 1 — Understand

Read the relevant files and existing implementation.

### Step 2 — Plan

Determine the smallest safe set of changes.

### Step 3 — Implement

Implement only the requested feature/fix.

### Step 4 — Validate

Run appropriate:

* TypeScript checks
* ESLint
* Tests
* Build

### Step 5 — Report

Report:

* What changed
* Files changed
* Validation performed
* Remaining issues

Do not claim something works unless it was actually validated.

---

## 13. Scope Control

When given a task:

* Do only what was requested.
* Do not redesign unrelated parts.
* Do not install dependencies unless necessary.
* Do not change the technology stack.
* Do not create unnecessary files.
* Do not generate large amounts of boilerplate without need.
* Ask for clarification when requirements are genuinely ambiguous.

---

## 14. Dependency Rules

Before adding a dependency:

1. Check whether the existing stack already provides the functionality.
2. Prefer established, maintained packages.
3. Avoid dependencies that solve trivial problems.
4. Explain why a new dependency is needed.

Do not replace existing libraries without approval.

---

## 15. UI/UX Guidelines

The product should feel like a modern SaaS application.

Prioritize:

* Clean visual hierarchy
* Consistent spacing
* Responsive design
* Good typography
* Clear navigation
* Useful empty states
* Loading states
* Error states
* Form validation
* Helpful feedback
* Accessible interactions

Avoid:

* Excessive animations
* Unnecessary gradients
* Overly complicated layouts
* Inconsistent component styles
* Placeholder content in production features

---

## 16. Portfolio Builder Principles

The portfolio editor should eventually support:

```text
Portfolio
├── Profile
├── About
├── Skills
├── Projects
├── Experience
├── Education
├── Certifications
├── Social Links
└── Appearance
```

Portfolio data should be independent from presentation templates.

A user's portfolio content should be reusable across multiple templates.

Do not store template-specific presentation logic directly inside user content.

---

## 17. Public Portfolio

Public portfolios should use a stable public identifier/slug.

Example:

```text
/app/dashboard
/portfolio/edit
/portfolio/preview
/u/tushar
```

The exact routing structure may change during architecture development.

Public portfolio pages must:

* Work without authentication
* Be responsive
* Load efficiently
* Have appropriate metadata
* Handle unpublished/nonexistent portfolios safely

---

## 18. Documentation

Maintain documentation for major architectural decisions.

Important documentation includes:

```text
docs/
├── PRODUCT.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
└── ROADMAP.md
```

Update documentation when an architectural decision materially changes.

---

## 19. Code Quality

Prefer:

```text
Readable > clever
Simple > over-engineered
Reusable > duplicated
Validated > assumed
Small focused changes > large rewrites
```

Code should be understandable by another developer without requiring the AI that generated it.

---

## 20. Important Rule

Before implementing a major feature, verify that the implementation fits the existing architecture.

Do not make architectural decisions that conflict with this document without explicitly explaining the reason and getting approval.

The goal is a stable, production-quality Portfolio Builder—not merely code that works temporarily.
