# Fixkar — Technology Stack

## 1. Overview

Fixkar is a web-based service marketplace built using a JavaScript and Node.js based technology stack.

The repository contains separate frontend and backend applications:

- `Frontend/` — Frontend application
- `Fixkar_Backend/` — Backend application

---

## 2. Frontend

The Fixkar frontend is built using React and Vite.

### Core Technologies

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| React DOM | Rendering the React application |
| Vite | Development server and production build |
| JavaScript | Application programming language |
| Bootstrap | Responsive UI and styling |
| React Bootstrap | Bootstrap components for React |

### State Management

| Technology | Purpose |
|---|---|
| Redux Toolkit | Application state management |
| React Redux | Connecting React components with Redux |

### Routing & API

| Technology | Purpose |
|---|---|
| React Router DOM | Client-side routing |
| Axios | Communication with backend APIs |

### Forms & Validation

| Technology | Purpose |
|---|---|
| Formik | Form management |
| Yup | Form validation |
| React Select | Select/dropdown components |

### UI & User Experience

| Technology | Purpose |
|---|---|
| React Icons | Icons |
| React Toastify | Toast notifications |
| React Spinners | Loading indicators |
| Swiper | Sliders and carousels |
| React Day Picker | Calendar/date selection |
| React Countdown | Countdown functionality |

### Search & Internationalization

| Technology | Purpose |
|---|---|
| Fuse.js | Client-side fuzzy search |
| i18next | Internationalization |
| react-i18next | React integration for i18next |

### Maps & Location

| Technology | Purpose |
|---|---|
| Google Maps API | Maps and location-related functionality |
| Capacitor Geolocation | Device location access |

### Real-Time Communication

| Technology | Purpose |
|---|---|
| Socket.IO Client | Real-time communication with backend |

---

## 3. Mobile / Native Capabilities

The frontend contains Capacitor packages, allowing the web application to use native device capabilities and support mobile application development.

| Technology | Purpose |
|---|---|
| Capacitor Core | Native runtime |
| Capacitor Android | Android application support |
| Capacitor Camera | Camera access |
| Capacitor Geolocation | Device location |
| Capacitor Local Notifications | Local notifications |
| Capacitor Network | Network information |
| Capacitor CLI | Capacitor development tools |
| Capacitor Social Login | Social login capabilities |
| Capacitor Voice Recorder | Voice recording |

---

## 4. Backend

The Fixkar backend is built using Node.js and Express.

### Core Technologies

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express | Backend API framework |
| Mongoose | MongoDB object modeling |
| JavaScript | Backend programming language |

### Authentication & Security

| Technology | Purpose |
|---|---|
| JSON Web Token | Token-based authentication |
| bcryptjs | Password hashing |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin request configuration |
| Express Rate Limit | API rate limiting |
| Joi | Request/data validation |

### Backend Utilities

| Technology | Purpose |
|---|---|
| Axios | External HTTP/API requests |
| Multer | Multipart/file upload handling |
| Nanoid | Unique ID generation |
| Slugify | Slug generation |
| Dotenv | Environment variable configuration |
| Node Cron | Scheduled/background jobs |
| Nodemon | Development server auto-restart |

---

## 5. Database

### MongoDB

MongoDB is used as the primary application database.

### Mongoose

Mongoose is used to:

- Define database schemas
- Create models
- Validate data
- Query MongoDB
- Manage relationships between application entities

---

## 6. Redis

The backend includes Redis support through `ioredis`.

Redis can be used for temporary data, caching and other short-lived server-side operations.

The exact Redis use cases will be documented separately after reviewing the related implementation.

---

## 7. Payment System

### Razorpay

Razorpay is integrated into the backend for payment-related functionality.

Payment documentation will separately cover:

- Payment creation
- Payment verification
- Payment status
- Refunds, if implemented
- Professional earnings
- Settlement flow

---

## 8. Media Storage

### Cloudinary

Cloudinary is used for application media/file storage.

Multer is used for handling multipart file uploads before the relevant storage process.

Sensitive Cloudinary credentials must always be stored in environment variables.

---

## 9. Authentication & Firebase

### JWT

JSON Web Tokens are used for backend authentication.

### bcryptjs

bcryptjs is used for securely hashing passwords.

### Firebase

Firebase is included in the frontend.

Firebase Admin is included in the backend for server-side Firebase integration.

The complete authentication flow will be documented separately.

---

## 10. Communication Services

Fixkar contains integrations for multiple communication services.

| Service | Purpose |
|---|---|
| Twilio | SMS-related functionality |
| Nodemailer | Email sending |
| Brevo API | Email/API communication |
| Socket.IO | Real-time communication |

---

## 11. Maps & Location

The frontend uses Google Maps integration for location-related functionality.

Capacitor Geolocation provides device-level location access for supported mobile environments.

Location-based functionality may be used for finding and managing nearby services or professionals.

---

## 12. Internationalization

The frontend includes:

- `i18next`
- `react-i18next`

These libraries provide support for multilingual/internationalized user interfaces.

---

## 13. Development Tools

### Vite

Vite is used for frontend development and production builds.

### ESLint

ESLint is used for frontend code-quality checking.

### Nodemon

Nodemon is used during backend development to automatically restart the server when source files change.

---

## 14. Environment Variables

Sensitive configuration must not be stored directly in source code.

Examples include:

- MongoDB connection string
- JWT secret
- Razorpay secret
- Cloudinary credentials
- Twilio credentials
- Email credentials
- Firebase credentials
- Other third-party API keys

These values should be provided through environment variables.

The actual secret values must never be committed to GitHub.

---

## 15. Technology Selection

The current technology stack provides:

- React for component-based frontend development
- Vite for fast frontend development and builds
- Node.js and Express for backend APIs
- MongoDB for application data
- Mongoose for database interaction
- Redux Toolkit for frontend state management
- Socket.IO for real-time communication
- Razorpay for payments
- Cloudinary for media storage
- Redis for temporary/cache-oriented data
- Capacitor for mobile/native capabilities

---

## 16. Source of Truth

This document is based on the technologies and dependencies currently declared in the project.

A dependency being present in `package.json` does not automatically mean that every feature associated with that dependency is currently active in production.

Implementation-specific behaviour should be verified from the source code before being documented as a confirmed production feature.

**Last Reviewed:** 12 August 2026
