# Fixkar — System Architecture

## 1. Overview

Fixkar is a web-based service marketplace with separate frontend and backend applications.

The repository currently contains:

- `Frontend/` — client-side application
- `Fixkar_Backend/` — server-side application

The backend provides APIs and integrates with external services for authentication, payments, media storage, communication, caching and real-time features.

---

## 2. High-Level Architecture

```text
Customer / Professional / Admin
              |
              v
       React Frontend
              |
          HTTP / API
              |
              v
      Node.js + Express
              |
      +-------+--------+----------------+
      |       |        |                |
      v       v        v                v
   MongoDB  Redis  Cloudinary       External APIs
                              |
             +----------------+----------------+
             |        |       |       |        |
             v        v       v       v        v
         Razorpay  Twilio  Firebase  Email  Socket.IO
