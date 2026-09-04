# Portfolio Builder — Technical Architecture

## 1. Architecture Overview

Portfolio Builder uses a modular full-stack architecture:

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │  TypeScript + Vite   │
                    └──────────┬───────────┘
                               │
                         HTTPS / REST
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Node.js API       │
                    │ Express + TypeScript │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
             ┌─────────────┐       ┌──────────────┐
             │ PostgreSQL  │       │ File Storage │
             │   Database  │       │    / CDN     │
             └─────────────┘       └──────────────┘
```

---

# 2. Frontend Architecture

## Technology

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Axios
* ESLint
* Lucide React

## Structure

```text
frontend/portfolioBuilder_front/src/

├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
│
├── components/
│   ├── common/
│   └── portfolio/
│
├── features/
│   ├── auth/
│   ├── portfolio/
│   ├── projects/
│   ├── skills/
│   ├── experience/
│   ├── education/
│   ├── certifications/
│   └── templates/
│
├── layouts/
├── pages/
├── services/
├── hooks/
├── types/
├── utils/
└── assets/
```

## Principles

* Components handle presentation.
* Feature modules contain feature-specific logic.
* Services handle API communication.
* TanStack Query manages server state.
* Shared components remain reusable.
* Types are explicit.
* Avoid unnecessary global state.

---

# 3. Frontend Routing

Initial route structure:

```text
/
├── /
├── /templates
├── /login
├── /register
│
├── /dashboard
├── /dashboard/portfolio
├── /dashboard/projects
├── /dashboard/skills
├── /dashboard/experience
├── /dashboard/education
├── /dashboard/certifications
├── /dashboard/settings
│
├── /portfolio/preview
│
└── /u/:username
```

Protected routes:

```text
/dashboard/**
```

Public routes:

```text
/
/templates
/login
/register
/u/:username
```

The exact route structure can evolve during implementation.

---

# 4. Backend Architecture

Backend:

```text
Node.js
   ↓
Express
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories / Data Access
   ↓
PostgreSQL
```

Recommended structure:

```text
backend/portfolioBuilder_back/

├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── validators/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

# 5. Backend Responsibilities

## Routes

Define HTTP endpoints.

## Controllers

Handle HTTP request/response.

Controllers should remain thin.

## Services

Contain business logic.

Example:

```text
PortfolioService
ProjectService
AuthenticationService
TemplateService
```

## Repositories

Handle database operations.

Business logic should not be tightly coupled to database queries.

## Validators

Validate request data before business logic executes.

---

# 6. API Design

Use REST APIs.

Base path:

```text
/api/v1
```

Example:

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout

GET    /api/v1/portfolio
POST   /api/v1/portfolio
PUT    /api/v1/portfolio

GET    /api/v1/projects
POST   /api/v1/projects
PUT    /api/v1/projects/:id
DELETE /api/v1/projects/:id

GET    /api/v1/skills
POST   /api/v1/skills
PUT    /api/v1/skills/:id
DELETE /api/v1/skills/:id
```

Public portfolio:

```text
GET /api/v1/public/portfolio/:username
```

Exact endpoints will be finalized in `API.md`.

---

# 7. Authentication

Authentication will use:

```text
Email + Password
        ↓
Password Hash
        ↓
Authentication
        ↓
Secure Session / Token
```

Passwords must never be stored in plain text.

The final token/session strategy will be selected during authentication implementation.

Protected API requests must verify the authenticated user.

Authorization rule:

```text
Authenticated User
        ↓
Can access only their own portfolio data
```

---

# 8. Database

Primary database:

```text
PostgreSQL
```

Core entities:

```text
User
Portfolio
Project
Skill
Experience
Education
Certification
SocialLink
Template
PortfolioSettings
```

Relationships will be designed in `DATABASE.md`.

General relationship:

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
       └── Settings
```

---

# 9. Why PostgreSQL

PostgreSQL is the primary choice because portfolio data has clear relational relationships.

Examples:

```text
User → Portfolio
Portfolio → Projects
Portfolio → Skills
Portfolio → Experience
Portfolio → Education
```

PostgreSQL also provides strong constraints, transactions, indexing, and flexible JSON support where appropriate.

MongoDB remains a possible future alternative but should not be introduced alongside PostgreSQL.

---

# 10. Portfolio Data vs Template

Portfolio content and visual templates must remain separate.

```text
Portfolio Data
      │
      ▼
   Template
      │
      ▼
Rendered Portfolio
```

Example:

```text
Project data:

{
  title,
  description,
  technologies,
  githubUrl,
  liveUrl
}
```

The template determines how that project is displayed.

Changing the template must not destroy or alter portfolio content.

---

# 11. Template Architecture

Templates should be treated as presentation systems.

Conceptually:

```text
Template A
Template B
Template C
       │
       ▼
Same Portfolio Data
```

Each template should implement the same required portfolio sections.

The architecture should allow additional templates without rewriting portfolio data structures.

---

# 12. Portfolio Editor

The editor should eventually provide:

```text
Editor
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

The editor should support:

* Save
* Preview
* Publish
* Unpublish
* Validation
* Section visibility
* Basic customization

Autosave can be added after the basic editor is stable.

---

# 13. Public Portfolio Rendering

Public route:

```text
/u/:username
```

Flow:

```text
Browser
   ↓
React public portfolio route
   ↓
API
   ↓
Portfolio data
   ↓
Selected template
   ↓
Rendered portfolio
```

Public portfolios must not expose private account information.

Only explicitly public portfolio data should be rendered.

---

# 14. File Storage

Images should not be stored directly inside PostgreSQL as binary data for normal portfolio assets.

Use external object/file storage.

Database stores metadata/reference:

```text
imageUrl
storageKey
fileType
fileSize
```

Storage provider will be selected before implementing uploads.

---

# 15. Security

Security requirements include:

* Password hashing
* Input validation
* Authorization
* Secure authentication
* CORS configuration
* Rate limiting where appropriate
* Safe file uploads
* SQL injection protection
* XSS protection
* Environment variable secrets
* Secure HTTP configuration
* Proper error handling

Never expose:

* Password hashes
* Authentication secrets
* Database credentials
* Private environment variables

---

# 16. Error Handling

Backend should use centralized error handling.

API errors should have a predictable structure.

Example:

```text
{
  "success": false,
  "message": "Portfolio not found",
  "code": "PORTFOLIO_NOT_FOUND"
}
```

Do not expose internal stack traces to production clients.

---

# 17. Environment Configuration

Never hardcode environment-specific configuration.

Use:

```text
.env
.env.example
```

Examples:

```text
DATABASE_URL=
JWT_SECRET=
PORT=
CORS_ORIGIN=
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

`.env` must never be committed.

---

# 18. API Communication

Frontend:

```text
React
  ↓
TanStack Query
  ↓
Axios
  ↓
REST API
```

Centralize API configuration.

Do not scatter hardcoded API URLs throughout components.

---

# 19. Testing Strategy

Testing should be introduced progressively.

### Frontend

Test:

* Components
* Forms
* Important user flows
* Portfolio rendering

### Backend

Test:

* Services
* API endpoints
* Authentication
* Authorization
* Validation

### Integration

Verify:

```text
Frontend
   ↓
API
   ↓
Database
```

---

# 20. Deployment Architecture

Initial production architecture:

```text
                    Internet
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        React Frontend       Node API
        Hosting/CDN          Hosting
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                  PostgreSQL
                       │
                       ▼
                  File Storage
```

Deployment providers will be selected later based on cost, reliability, and project requirements.

---

# 21. Scalability Principles

The initial implementation should be a modular monolith.

Do NOT start with microservices.

```text
React
   ↓
Node/Express
   ↓
PostgreSQL
```

This keeps development and deployment simple while leaving room for future scaling.

Possible future improvements:

* CDN
* Redis caching
* Background jobs
* Queue system
* Search
* Separate services if genuinely required

---

# 22. Development Strategy

Implementation order:

```text
Phase 0
Foundation
   ↓
Phase 1
Authentication
   ↓
Phase 2
Portfolio Core
   ↓
Phase 3
Portfolio Sections
   ↓
Phase 4
Templates
   ↓
Phase 5
Portfolio Editor
   ↓
Phase 6
Publishing
   ↓
Phase 7
File Uploads
   ↓
Phase 8
SEO + Performance
   ↓
Phase 9
Testing + Security
   ↓
Phase 10
Deployment
   ↓
Phase 11
Advanced Features
```

Each phase should be completed and validated before moving to the next major phase.

---

# 23. Architecture Decision Rule

When a new technical decision is required:

1. Prefer the existing architecture.
2. Prefer the simplest production-appropriate solution.
3. Avoid unnecessary dependencies.
4. Avoid premature microservices.
5. Preserve backward compatibility where practical.
6. Document significant architectural changes.

Any major architecture change requires explicit approval.