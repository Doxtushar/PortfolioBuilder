# Portfolio Builder — API Contract

## 1. API Overview

Base URL:

```text
/api/v1
```

API style:

```text
REST
JSON
```

All API responses should use a consistent structure.

---

# 2. Standard Response Format

### Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "message": "Something went wrong",
  "code": "ERROR_CODE"
}
```

The exact response structure may be refined during backend implementation, but consistency must be maintained.

---

# 3. Authentication

## Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "firstName": "Tushar",
  "lastName": "Kumar"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Tushar",
      "lastName": "Kumar"
    }
  },
  "message": "Registration successful"
}
```

---

## Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

Authentication/session implementation will be finalized during backend implementation.

---

## Logout

```http
POST /api/v1/auth/logout
```

Requires authentication.

---

## Current User

```http
GET /api/v1/auth/me
```

Requires authentication.

Returns the authenticated user's safe profile information.

---

# 4. Portfolio

## Get My Portfolio

```http
GET /api/v1/portfolio
```

Requires authentication.

---

## Create Portfolio

```http
POST /api/v1/portfolio
```

Request:

```json
{
  "username": "tushar",
  "title": "My Portfolio",
  "professionalTitle": "Full Stack Developer",
  "bio": "I build modern web applications.",
  "location": "India"
}
```

---

## Update Portfolio

```http
PUT /api/v1/portfolio
```

Requires authentication.

---

## Publish Portfolio

```http
POST /api/v1/portfolio/publish
```

Requires authentication.

---

## Unpublish Portfolio

```http
POST /api/v1/portfolio/unpublish
```

Requires authentication.

---

## Preview Portfolio

```http
GET /api/v1/portfolio/preview
```

Requires authentication.

---

# 5. Public Portfolio

Public portfolio:

```http
GET /api/v1/public/portfolio/:username
```

Authentication is not required.

Only published portfolio information should be returned.

Example:

```json
{
  "success": true,
  "data": {
    "username": "tushar",
    "name": "Tushar Kumar",
    "professionalTitle": "Full Stack Developer",
    "bio": "I build modern web applications.",
    "template": {
      "slug": "minimal"
    },
    "projects": [],
    "skills": [],
    "experience": [],
    "education": [],
    "certifications": [],
    "socialLinks": []
  }
}
```

---

# 6. Projects

## List Projects

```http
GET /api/v1/projects
```

Requires authentication.

Returns projects belonging to the authenticated user's portfolio.

---

## Create Project

```http
POST /api/v1/projects
```

Request:

```json
{
  "title": "Portfolio Builder",
  "description": "A professional portfolio builder.",
  "technologies": [
    "React",
    "Node.js",
    "PostgreSQL"
  ],
  "githubUrl": "https://github.com/example/project",
  "liveUrl": "https://example.com"
}
```

---

## Get Project

```http
GET /api/v1/projects/:id
```

---

## Update Project

```http
PUT /api/v1/projects/:id
```

---

## Delete Project

```http
DELETE /api/v1/projects/:id
```

---

## Reorder Projects

```http
PATCH /api/v1/projects/reorder
```

Request:

```json
{
  "items": [
    {
      "id": "uuid",
      "displayOrder": 1
    },
    {
      "id": "uuid",
      "displayOrder": 2
    }
  ]
}
```

---

# 7. Skills

## List Skills

```http
GET /api/v1/skills
```

## Create Skill

```http
POST /api/v1/skills
```

Request:

```json
{
  "name": "React",
  "category": "Frontend",
  "proficiency": 90
}
```

## Update Skill

```http
PUT /api/v1/skills/:id
```

## Delete Skill

```http
DELETE /api/v1/skills/:id
```

## Reorder Skills

```http
PATCH /api/v1/skills/reorder
```

---

# 8. Experience

## List Experience

```http
GET /api/v1/experience
```

## Create Experience

```http
POST /api/v1/experience
```

Request:

```json
{
  "jobTitle": "Software Developer",
  "company": "Example Company",
  "location": "India",
  "description": "Developed web applications.",
  "startDate": "2026-01-01",
  "endDate": null,
  "isCurrent": true
}
```

## Update Experience

```http
PUT /api/v1/experience/:id
```

## Delete Experience

```http
DELETE /api/v1/experience/:id
```

## Reorder Experience

```http
PATCH /api/v1/experience/reorder
```

---

# 9. Education

## List Education

```http
GET /api/v1/education
```

## Create Education

```http
POST /api/v1/education
```

Request:

```json
{
  "institution": "Example University",
  "degree": "B.Tech",
  "fieldOfStudy": "Computer Science",
  "description": "Computer Science degree.",
  "startDate": "2022-01-01",
  "endDate": "2026-05-01"
}
```

## Update Education

```http
PUT /api/v1/education/:id
```

## Delete Education

```http
DELETE /api/v1/education/:id
```

## Reorder Education

```http
PATCH /api/v1/education/reorder
```

---

# 10. Certifications

## List Certifications

```http
GET /api/v1/certifications
```

## Create Certification

```http
POST /api/v1/certifications
```

Request:

```json
{
  "name": "AWS Certified Developer",
  "issuingOrganization": "Amazon Web Services",
  "issueDate": "2026-01-01",
  "expirationDate": null,
  "credentialUrl": "https://example.com/certificate"
}
```

## Update Certification

```http
PUT /api/v1/certifications/:id
```

## Delete Certification

```http
DELETE /api/v1/certifications/:id
```

## Reorder Certifications

```http
PATCH /api/v1/certifications/reorder
```

---

# 11. Social Links

## List Social Links

```http
GET /api/v1/social-links
```

## Create Social Link

```http
POST /api/v1/social-links
```

Request:

```json
{
  "platform": "github",
  "url": "https://github.com/example"
}
```

## Update Social Link

```http
PUT /api/v1/social-links/:id
```

## Delete Social Link

```http
DELETE /api/v1/social-links/:id
```

## Reorder Social Links

```http
PATCH /api/v1/social-links/reorder
```

---

# 12. Templates

Templates are publicly readable.

## List Templates

```http
GET /api/v1/templates
```

## Get Template

```http
GET /api/v1/templates/:slug
```

No authentication required for reading available templates.

---

# 13. Portfolio Appearance

## Get Settings

```http
GET /api/v1/portfolio/settings
```

Requires authentication.

## Update Settings

```http
PUT /api/v1/portfolio/settings
```

Request:

```json
{
  "primaryColor": "#2563EB",
  "secondaryColor": "#64748B",
  "fontFamily": "Inter",
  "backgroundColor": "#FFFFFF",
  "showAbout": true,
  "showSkills": true,
  "showProjects": true,
  "showExperience": true,
  "showEducation": true,
  "showCertifications": true,
  "showSocialLinks": true
}
```

---

# 14. User Profile

## Get Profile

```http
GET /api/v1/profile
```

Requires authentication.

## Update Profile

```http
PUT /api/v1/profile
```

Request:

```json
{
  "firstName": "Tushar",
  "lastName": "Kumar",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

---

# 15. Authorization

Every protected endpoint must identify the authenticated user.

Example:

```text
Request
   ↓
Authentication
   ↓
User ID
   ↓
Portfolio ownership check
   ↓
Service
```

A user must never be able to access or modify another user's portfolio resources by changing an ID.

---

# 16. Validation

Backend validation is mandatory.

Validate:

* Required fields
* String lengths
* Email format
* URLs
* Dates
* Enum values
* Numeric ranges
* IDs
* Username format

Frontend validation improves UX but must never replace backend validation.

---

# 17. HTTP Status Codes

Use standard HTTP status codes.

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Use status codes consistently.

---

# 18. Error Codes

Use machine-readable error codes.

Examples:

```text
VALIDATION_ERROR
INVALID_CREDENTIALS
UNAUTHORIZED
FORBIDDEN
USER_NOT_FOUND
PORTFOLIO_NOT_FOUND
USERNAME_ALREADY_EXISTS
PROJECT_NOT_FOUND
RESOURCE_NOT_FOUND
TEMPLATE_NOT_FOUND
INTERNAL_SERVER_ERROR
```

---

# 19. Pagination

Pagination should be introduced for collections that may grow significantly.

Possible format:

```text
GET /api/v1/projects?page=1&limit=20
```

The initial MVP may return small collections without pagination if justified.

---

# 20. API Versioning

All APIs should use:

```text
/api/v1
```

Future breaking changes should use a new version rather than silently breaking existing clients.

---

# 21. Security Requirements

Protected APIs must enforce:

* Authentication
* Authorization
* Input validation
* Rate limiting where appropriate
* Safe error responses
* CORS policy
* Secure authentication/session handling

Never trust user-provided ownership IDs.

The server determines resource ownership from the authenticated user.

---

# 22. API Design Principle

Prefer:

```text
Predictable
Consistent
Validated
Secure
RESTful
```

Avoid:

```text
Duplicated endpoints
Inconsistent response formats
Business logic in routes
Client-controlled ownership
Unnecessary endpoints
```

---

# 23. Future APIs

Do not implement unless explicitly requested:

```text
/api/v1/analytics
/api/v1/ai
/api/v1/subscriptions
/api/v1/payments
/api/v1/domains
/api/v1/notifications
```

These are future product capabilities.
