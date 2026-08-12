# Fixkar — Project Structure

## 1. Repository Overview

The Fixkar repository is organized into separate frontend, backend and documentation areas.

```text
fixkar/
│
├── Frontend/
├── Fixkar_Backend/
├── docs/
└── README.md
```

---

# 2. Frontend Structure

The `Frontend/` directory contains the React-based frontend application.

```text
Frontend/
│
├── android/
├── public/
├── src/
├── capacitor.config.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### `src/`

Contains the main frontend application source code.

The `src` directory contains the application's React components, pages, routing, state management, API communication and feature-specific logic.

### `public/`

Contains static frontend assets used by the application.

### `android/`

Contains the Android native project used with Capacitor.

This allows the web application to be packaged and developed as an Android application.

### `capacitor.config.json`

Contains Capacitor configuration for native and mobile integration.

### `eslint.config.js`

Contains ESLint configuration used for frontend code-quality checks.

### `index.html`

The main HTML entry point of the Vite application.

### `vite.config.js`

Contains Vite development and build configuration.

### `package.json`

Contains frontend dependencies, development dependencies and NPM scripts.

---

# 3. Backend Structure

The `Fixkar_Backend/` directory contains the Node.js and Express backend application.

```text
Fixkar_Backend/
│
├── config/
├── controllers/
├── cron/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
│
├── addSlug.js
├── server.js
├── test.js
├── package.json
└── package-lock.json
```

---

# 4. Configuration

## `config/`

Contains configuration modules for databases and external services.

Current files include:

```text
config/
├── cloudinary.js
├── db.js
├── firebaseAdmin.js
└── razorpay.js
```

### Responsibilities

- Database configuration
- Cloudinary configuration
- Firebase Admin configuration
- Razorpay configuration

Sensitive credentials must be stored using environment variables.

---

# 5. Controllers

## `controllers/`

Contains backend controllers responsible for handling application operations and HTTP requests.

The repository contains controllers for different application areas, including administrative functionality.

The Admin controller area contains operations related to:

- Admin authentication
- Professional application approval and rejection
- Service management
- Customer management
- Booking management
- Offers
- Forms
- Bank details
- Platform transactions
- Revenue information
- Site health
- Announcements
- Withdrawal requests

Controllers generally receive requests from routes, execute the required operations and return responses to the client.

---

# 6. Scheduled Jobs

## `cron/`

Contains scheduled and background task implementations.

These tasks can run automatically according to configured schedules.

---

# 7. Middleware

## `middlewares/`

Contains Express middleware used during the backend request lifecycle.

Middleware may handle:

- Authentication
- Authorization
- Request validation
- Security checks
- Request preprocessing

---

# 8. Database Models

## `models/`

Contains Mongoose models used to represent application data in MongoDB.

Models define database schemas and provide the database access layer used by the backend.

The complete database model documentation will be maintained in:

`docs/05-database-design.md`

---

# 9. API Routes

## `routes/`

Contains Express API route definitions.

Routes define backend endpoints and connect incoming requests with the appropriate middleware and controllers.

General request flow:

```text
Client
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service / Model
   ↓
Database / External Service
```

Complete API documentation will be maintained in:

`docs/06-api-documentation.md`

---

# 10. Services

## `services/`

Contains reusable service-level logic and integrations.

The service layer is intended to keep reusable operations and external-service interactions separate from HTTP request handling.

Individual services will be documented as part of the detailed backend documentation.

---

# 11. Utilities

## `utils/`

Contains reusable helper and utility functions used by different backend modules.

---

# 12. Backend Entry Point

## `server.js`

`server.js` is the main backend application entry point.

It initializes and starts the backend server and connects the required application components.

---

# 13. Utility Scripts

## `addSlug.js`

A backend utility/maintenance script related to slug processing.

## `test.js`

Contains backend testing or diagnostic code.

Its exact production usage should be verified before treating it as part of the normal production runtime.

---

# 14. Package Management

Frontend and backend maintain separate dependency configurations.

```text
Frontend/
├── package.json
└── package-lock.json

Fixkar_Backend/
├── package.json
└── package-lock.json
```

This allows frontend and backend dependencies to be managed independently.

---

# 15. Documentation Structure

Technical documentation is maintained inside the `docs/` directory.

```text
docs/
│
├── 01-project-overview.md
├── 02-system-architecture.md
├── 03-tech-stack.md
└── 04-project-structure.md
```

Additional documentation will be added as the project is documented further.

---

# 16. High-Level Application Flow

The major application layers can be represented as:

```text
Frontend
   │
   │ HTTP / WebSocket
   ▼
Routes
   │
   ▼
Middlewares
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

External services such as payment, media storage, authentication and communication providers are integrated through the appropriate backend configuration and service layers.

---

# 17. Separation of Responsibilities

| Directory | Primary Responsibility |
|---|---|
| `config/` | Application and external-service configuration |
| `controllers/` | Request and business operations |
| `cron/` | Scheduled/background tasks |
| `middlewares/` | Request-level processing and protection |
| `models/` | MongoDB/Mongoose data models |
| `routes/` | API endpoint definitions |
| `services/` | Reusable service logic |
| `utils/` | Reusable helper functions |

The separation of responsibilities helps keep the codebase maintainable, understandable and easier to scale.

---

**Last Reviewed:** 12 August 2026
