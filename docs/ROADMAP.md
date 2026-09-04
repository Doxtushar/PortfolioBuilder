# Portfolio Builder — Development Roadmap

## 1. Development Strategy

Build the application incrementally.

Rules:

* One feature at a time.
* One AI agent should modify a working tree at a time.
* Every major feature must be tested.
* Keep Git commits focused.
* Update documentation when architecture changes.
* Do not implement future features early.

---

# Phase 0 — Foundation

## 0.1 Project Setup

Status: In Progress

* [x] Create React frontend
* [x] Configure Vite
* [x] Configure ESLint
* [x] Install TypeScript
* [x] Install React Router
* [x] Install Axios
* [x] Install TanStack Query
* [x] Install Lucide React
* [x] Create AGENTS.md
* [x] Create PRODUCT.md
* [x] Create ARCHITECTURE.md
* [x] Create DATABASE.md
* [x] Create API.md
* [ ] Create ROADMAP.md
* [ ] Configure frontend architecture
* [ ] Initialize backend
* [ ] Configure PostgreSQL
* [ ] Configure Git workflow

---

# Phase 1 — Backend Foundation

Goal:

Create a clean Node.js + Express + TypeScript backend.

Tasks:

* [ ] Initialize backend project
* [ ] Configure TypeScript
* [ ] Configure ESLint
* [ ] Configure Express
* [ ] Create environment configuration
* [ ] Create application entry point
* [ ] Create server entry point
* [ ] Add centralized error handling
* [ ] Add request validation
* [ ] Add logging
* [ ] Add health endpoint
* [ ] Configure CORS
* [ ] Connect PostgreSQL
* [ ] Configure database migrations
* [ ] Add basic tests

Success criteria:

```text
Backend starts
      ↓
PostgreSQL connects
      ↓
GET /api/v1/health
      ↓
Returns healthy response
```

---

# Phase 2 — Authentication

Goal:

Secure user accounts.

Tasks:

* [ ] User database table
* [ ] User model
* [ ] Registration
* [ ] Password hashing
* [ ] Login
* [ ] Authentication/session mechanism
* [ ] Logout
* [ ] Current-user endpoint
* [ ] Authentication middleware
* [ ] Authorization middleware
* [ ] Input validation
* [ ] Auth tests

Success criteria:

```text
Register
   ↓
Login
   ↓
Authenticated session
   ↓
Access dashboard
```

---

# Phase 3 — Portfolio Core

Goal:

Allow users to create and manage their portfolio.

Tasks:

* [ ] Portfolio database table
* [ ] Portfolio model
* [ ] Create portfolio
* [ ] Get own portfolio
* [ ] Update portfolio
* [ ] Username validation
* [ ] Username uniqueness
* [ ] Reserved username protection
* [ ] Ownership checks
* [ ] Portfolio API tests
* [ ] Dashboard portfolio page

---

# Phase 4 — Portfolio Sections

Implement sections independently.

## Projects

* [ ] Database
* [ ] CRUD API
* [ ] Ownership validation
* [ ] Reordering
* [ ] Frontend UI

## Skills

* [ ] Database
* [ ] CRUD API
* [ ] Ownership validation
* [ ] Reordering
* [ ] Frontend UI

## Experience

* [ ] Database
* [ ] CRUD API
* [ ] Ownership validation
* [ ] Reordering
* [ ] Frontend UI

## Education

* [ ] Database
* [ ] CRUD API
* [ ] Ownership validation
* [ ] Reordering
* [ ] Frontend UI

## Certifications

* [ ] Database
* [ ] CRUD API
* [ ] Ownership validation
* [ ] Reordering
* [ ] Frontend UI

## Social Links

* [ ] Database
* [ ] CRUD API
* [ ] Ownership validation
* [ ] Reordering
* [ ] Frontend UI

---

# Phase 5 — Portfolio Templates

Goal:

Allow users to select different portfolio designs.

Tasks:

* [ ] Template database
* [ ] Seed initial templates
* [ ] Template API
* [ ] Template listing page
* [ ] Template preview
* [ ] Template selection
* [ ] Template rendering architecture
* [ ] First production template
* [ ] Second production template
* [ ] Third production template

Important:

Portfolio content must remain independent from templates.

---

# Phase 6 — Portfolio Editor

Goal:

Create the primary portfolio-building experience.

Editor structure:

```text
Portfolio Editor
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

Tasks:

* [ ] Editor layout
* [ ] Section navigation
* [ ] Profile editor
* [ ] About editor
* [ ] Skills editor
* [ ] Projects editor
* [ ] Experience editor
* [ ] Education editor
* [ ] Certification editor
* [ ] Social links editor
* [ ] Appearance editor
* [ ] Save states
* [ ] Loading states
* [ ] Validation
* [ ] Error states

---

# Phase 7 — Preview

Goal:

Allow users to see the portfolio before publishing.

Tasks:

* [ ] Preview route
* [ ] Render selected template
* [ ] Preview all sections
* [ ] Responsive preview
* [ ] Desktop/mobile preview
* [ ] Unsaved-change handling

---

# Phase 8 — Publishing

Goal:

Make portfolios publicly accessible.

Tasks:

* [ ] Publish API
* [ ] Unpublish API
* [ ] Published state
* [ ] Public portfolio API
* [ ] Public portfolio route
* [ ] Username-based URL
* [ ] Public template rendering
* [ ] 404 handling
* [ ] Unpublished portfolio protection

Success:

```text
User
 ↓
Publish
 ↓
/u/username
 ↓
Public Portfolio
```

---

# Phase 9 — File Uploads

Goal:

Support profile and project images.

Tasks:

* [ ] Select storage provider
* [ ] Upload API
* [ ] File validation
* [ ] File size limits
* [ ] Secure filenames/keys
* [ ] Profile image upload
* [ ] Project image upload
* [ ] Delete uploaded files
* [ ] Storage cleanup

Do not store normal image binaries directly in PostgreSQL.

---

# Phase 10 — UX / UI Polish

Goal:

Make the application feel like a professional SaaS product.

Tasks:

* [ ] Landing page
* [ ] Navigation
* [ ] Authentication UI
* [ ] Dashboard UI
* [ ] Editor UI
* [ ] Template gallery
* [ ] Empty states
* [ ] Loading states
* [ ] Error states
* [ ] Toast/feedback system
* [ ] Responsive design
* [ ] Accessibility review
* [ ] Mobile optimization
* [ ] Visual consistency

---

# Phase 11 — SEO / Performance

Goal:

Optimize published portfolios and the application.

Tasks:

* [ ] Page titles
* [ ] Meta descriptions
* [ ] Open Graph metadata
* [ ] Clean public URLs
* [ ] Image optimization
* [ ] Lazy loading
* [ ] API performance review
* [ ] Database indexes
* [ ] Frontend bundle review
* [ ] Lighthouse/performance review

---

# Phase 12 — Testing

Goal:

Make the application reliable.

## Backend

* [ ] Unit tests
* [ ] Service tests
* [ ] API tests
* [ ] Authentication tests
* [ ] Authorization tests
* [ ] Validation tests

## Frontend

* [ ] Component tests
* [ ] Form tests
* [ ] Routing tests
* [ ] Portfolio rendering tests

## Integration

* [ ] Authentication flow
* [ ] Portfolio creation flow
* [ ] Portfolio editing flow
* [ ] Publishing flow
* [ ] Public portfolio flow

---

# Phase 13 — Security Review

Tasks:

* [ ] Authentication review
* [ ] Authorization review
* [ ] Input validation review
* [ ] CORS review
* [ ] Rate limiting
* [ ] File upload security
* [ ] XSS review
* [ ] SQL injection review
* [ ] Secret management
* [ ] Error information exposure
* [ ] Dependency audit

---

# Phase 14 — Deployment

Goal:

Deploy the complete application.

Architecture:

```text
React
  ↓
Frontend Hosting/CDN
  ↓
Node.js API
  ↓
PostgreSQL

File Storage
  ↓
CDN / Object Storage
```

Tasks:

* [ ] Production environment configuration
* [ ] Frontend deployment
* [ ] Backend deployment
* [ ] PostgreSQL deployment
* [ ] File storage configuration
* [ ] HTTPS
* [ ] CORS production configuration
* [ ] Database migrations
* [ ] Production smoke tests
* [ ] Monitoring/logging

---

# Phase 15 — Documentation

Tasks:

* [ ] README
* [ ] Setup instructions
* [ ] Environment documentation
* [ ] API documentation
* [ ] Database documentation
* [ ] Architecture documentation
* [ ] Deployment documentation
* [ ] Screenshots
* [ ] Demo instructions

---

# Phase 16 — Advanced Features

Only begin after MVP is stable.

## AI

* [ ] AI About Me generation
* [ ] AI project description generation
* [ ] Resume-to-portfolio
* [ ] AI content improvement

## Analytics

* [ ] Portfolio views
* [ ] Visitor statistics
* [ ] Traffic sources

## Sharing

* [ ] QR code
* [ ] Social sharing
* [ ] Open Graph previews

## Premium

* [ ] Premium templates
* [ ] Subscriptions
* [ ] Payments
* [ ] Custom domains

## Advanced Builder

* [ ] Drag-and-drop sections
* [ ] Advanced customization
* [ ] Custom CSS

---

# AI Agent Workflow

## ChatGPT

Use for:

* Product decisions
* Architecture
* Database design
* API design
* Task decomposition
* Code review
* Debugging strategy
* Research

ChatGPT should not blindly generate the entire application at once.

---

## Codex

Primary implementation agent.

Use for:

* Backend implementation
* Frontend implementation
* Tests
* Debugging
* Refactoring
* Repository-wide but well-scoped tasks

---

## Cursor

Use for:

* Interactive development
* UI implementation
* Component refinement
* CSS
* Small/medium refactoring
* Local debugging

---

## Devin

Use for:

* Larger isolated features
* Multi-step backend work
* Test implementation
* Documentation
* PR-sized tasks

Prefer isolated branches/worktrees when possible.

---

## JCode

Use for:

* Quick terminal tasks
* Small fixes
* Experiments
* Simple scripts
* Learning/debugging

---

# Multi-Agent Safety Rules

Never allow multiple AI agents to modify the same working tree simultaneously.

Before starting work:

```bash
git status
```

Check current branch:

```bash
git branch --show-current
```

Review changes:

```bash
git diff
```

After completing a task:

```bash
npm run lint
npm run build
```

Run relevant tests where available.

Then commit the completed work.

---

# Feature Workflow

Every feature should follow:

```text
Requirement
    ↓
Architecture check
    ↓
Task definition
    ↓
Git branch
    ↓
Implementation
    ↓
Lint
    ↓
Tests
    ↓
Build
    ↓
Code review
    ↓
Commit
    ↓
Merge
```

---

# Definition of Done

A feature is not considered complete until:

* Code is implemented.
* Existing functionality still works.
* Validation is implemented where required.
* Relevant tests pass.
* ESLint passes.
* Build passes.
* Security implications are considered.
* Documentation is updated if necessary.
* Git changes are reviewed.
* No unrelated files were unnecessarily modified.

---

# Current Priority

The immediate development priority is:

```text
Phase 0
   ↓
Backend Foundation
   ↓
Authentication
   ↓
Portfolio Core
```

Do not begin advanced features until the MVP foundation is stable.
