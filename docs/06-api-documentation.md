# Fixkar — API Documentation

## 1. Overview

The Fixkar backend exposes REST APIs through an Express.js application.

Base API prefix:

```text
/api
```

The API is divided into multiple modules based on application functionality and user roles.

---

# 2. Authentication

## Base Path

```text
/api/auth
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup-customer` | Public | Register a customer |
| POST | `/api/auth/login` | Public | User login |
| POST | `/api/auth/logout` | Public | Logout |
| POST | `/api/auth/google-auth-signup` | Public | Google signup |
| POST | `/api/auth/google-auth-login` | Public | Google login |
| POST | `/api/auth/google-auth-login-native` | Public | Native Google login |
| POST | `/api/auth/google-auth-signup-native` | Public | Native Google signup |
| POST | `/api/auth/request-reset-password` | Public | Request password reset |

---

# 3. OTP APIs

## Base Path

```text
/api/otp
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/otp/send` | Required | Send mobile OTP |
| POST | `/api/otp/verify` | Required | Verify mobile OTP |
| POST | `/api/otp/firebase-phone-verify` | Required | Firebase phone verification |
| POST | `/api/otp/send-email-otp` | Public | Send email OTP |
| POST | `/api/otp/verify-email-otp` | Public | Verify email OTP |

Mobile OTP send/verify routes are protected by rate limiting.

---

# 4. User APIs

## Base Path

```text
/api/user
```

### User Information

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/current` | Required | Get current authenticated user |
| GET | `/api/user/getUserById/:userId` | Public | Get user by ID |

### Professional Discovery

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/professionals` | Admin | Get professionals |
| GET | `/api/user/verifiedProfessionals` | Required | Get verified professionals |
| GET | `/api/user/professionals/search` | Public | Search professionals |
| GET | `/api/user/get-service-skills/:serviceId` | Public | Get skills for a service |

### Professional Onboarding

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/user/onboard` | Required | Professional onboarding |
| POST | `/api/user/professional/complete-profile` | Required | Complete professional profile |
| POST | `/api/user/professional/set-busy-days` | Required | Set professional busy days |
| POST | `/api/user/professional/bank-details` | Required | Submit professional bank details |

### Professional Transactions

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/professional/get-transactions/:proId` | Required | Get professional transactions |
| POST | `/api/user/professional/send-withdrawn-request` | Required | Submit withdrawal request |

### Profile Management

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/user/update-profile-picture` | Required | Update profile picture |
| POST | `/api/user/update-profile-info` | Required | Update profile information |
| POST | `/api/user/professional/update-skills` | Required | Update professional skills |

### Media

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/user/upload-media` | Required | Upload professional media |
| GET | `/api/user/signature` | Public | Get Cloudinary signature |
| DELETE | `/api/user/delete-media/:mediaId` | Required | Delete uploaded media |

### Services & Forms

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/get-services` | Public | Get available services |
| POST | `/api/user/save-form-response` | Required | Save dynamic form response |
| GET | `/api/user/get-banks` | Required | Get available banks |

### Offers

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/get-elligible-offers/:bookingId` | Required | Get eligible offers |
| POST | `/api/user/apply-offer` | Required | Apply an offer to a booking |

### Announcements & Enquiries

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/get-my-announcements` | Required | Get user announcements |
| POST | `/api/user/send-enquiry` | Public | Submit an enquiry |

### Professional Pickup Requests

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/user/professional/pickup-requests` | Required | Get professional pickup requests |
| POST | `/api/user/professional/pickup-request-accept` | Required | Accept pickup request |
| POST | `/api/user/professional/pickup-request-reject` | Required | Reject pickup request |

---

# 5. Customer APIs

## Base Path

```text
/api/customer
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/customer/get-professional-info/:id` | Route currently does not enforce auth middleware | Get professional information |

---

# 6. Booking APIs

## Base Path

```text
/api/booking
```

### Booking Management

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/booking/create-booking` | Required | Create a booking |
| GET | `/api/booking/my-bookings` | Required | Get current user's bookings |
| GET | `/api/booking/get-booking` | Route currently does not enforce auth middleware | Get booking |
| POST | `/api/booking/reject-booking` | Route currently does not enforce auth middleware | Reject booking |
| POST | `/api/booking/cancel-booking` | Required | Cancel customer booking |
| POST | `/api/booking/accept-booking` | Route currently does not enforce auth middleware | Accept booking |
| POST | `/api/booking/confirm-pickup-hire` | Required | Confirm pickup hire |
| POST | `/api/booking/mark-reached` | Required | Mark professional as reached |
| POST | `/api/booking/verify-reached-otp` | Required | Verify reached OTP |
| POST | `/api/booking/send-quote-amount` | Required | Send booking quote |
| GET | `/api/booking/get-reached-otp/:bookingId` | Required | Get reached OTP |

### Payments

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/booking/create-order` | Required | Create payment order |
| POST | `/api/booking/verify-payment` | Required | Verify payment |
| POST | `/api/booking/confirm-cash-payment` | Required | Confirm cash payment |

### Professional Wallet

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/booking/get-professional-wallet` | Required | Get professional wallet |
| GET | `/api/booking/get-wallet-transaction/:bookingId` | Required | Get wallet transaction |

### Reviews

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/booking/post-review` | Route currently does not enforce auth middleware | Submit booking review |

The booking routes also support multipart audio uploads for booking creation.

---

# 7. Messaging APIs

## Base Path

```text
/api/messages
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/messages/get-messages/:recieverId` | Required | Get messages with another user |
| POST | `/api/messages/send/:recieverId` | Required | Send a message |
| GET | `/api/messages/get-my-conversations` | Required | Get user's conversations |
| PUT | `/api/messages/mark-seen` | Required | Mark messages as seen |
| POST | `/api/messages/delete-messages` | Required | Delete messages for current user |

Message sending supports multiple attachments.

---

# 8. Notification APIs

## Base Path

```text
/api/notification
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/notification/get-my-notifications` | Required | Get current user's notifications |
| GET | `/api/notification/mark-all-as-read` | Required | Mark all notifications as read |
| POST | `/api/notification/save-fcm-token` | Required | Save FCM token |

---

# 9. Admin APIs

## Base Path

```text
/api/admin
```

Admin APIs use role-based authentication and permissions where configured.

### Admin Authentication

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/signup` | Public | Register admin |
| POST | `/api/admin/login` | Public | Admin login |
| GET | `/api/admin/get-current-admin` | Admin | Get current admin |

### Service Management

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/create-service` | `super_admin`, `content_admin` | Create service |
| POST | `/api/admin/update-service/:serviceId` | `super_admin`, `content_admin` | Update service |
| DELETE | `/api/admin/delete-service/:serviceId` | `super_admin` | Delete service |

### Customer & Professional Management

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| GET | `/api/admin/get-all-customers` | `super_admin`, `professional_admin` | Get all customers |
| GET | `/api/admin/get-all-professionals` | `super_admin`, `professional_admin` | Get all professionals |

### Booking Management

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| GET | `/api/admin/get-all-bookings` | `super_admin`, `booking_admin` | Get all bookings |
| GET | `/api/admin/get-admin-booking/:bookingId` | `super_admin`, `booking_admin` | Get booking details |

### Professional Applications

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/accept-professional-application` | `super_admin`, `professional_admin` | Approve professional application |
| POST | `/api/admin/reject-professional-application` | `super_admin`, `professional_admin` | Reject professional application |

### Bank Verification

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/approve-bank/:proId` | `super_admin`, `professional_admin` | Approve professional bank details |
| POST | `/api/admin/reject-bank/:proId` | `super_admin`, `professional_admin` | Reject professional bank details |

### Withdrawals & Payments

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| GET | `/api/admin/get-withdrawn-requests` | `super_admin`, `professional_admin` | Get withdrawal requests |
| POST | `/api/admin/manual-pay` | `super_admin` | Process manual payment |

### Forms

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/forms` | `super_admin`, `content_admin` | Create dynamic form |
| GET | `/api/admin/get-all-forms` | `super_admin`, `content_admin` | Get all forms |
| GET | `/api/admin/get-form-by-service/:serviceId` | Authenticated user | Get form for a service |

### Offers

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/create-offer` | `super_admin` | Create offer |
| GET | `/api/admin/get-all-offers` | `super_admin`, `content_admin` | Get all offers |
| POST | `/api/admin/update-offer/:offerId` | `super_admin` | Update offer |
| GET | `/api/admin/get-offer/:offerId` | `super_admin` | Get offer |
| DELETE | `/api/admin/delete-offer/:offerId` | `super_admin` | Delete offer |

### Announcements

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/api/admin/announcement` | `super_admin`, `content_admin` | Create announcement |
| GET | `/api/admin/get-announcements` | `super_admin`, `content_admin` | Get announcements |
| DELETE | `/api/admin/delete-announcement/:id` | `super_admin`, `content_admin` | Delete announcement |

### Enquiries

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| GET | `/api/admin/get-enquiries` | `super_admin`, `support_admin` | Get enquiries |
| POST | `/api/admin/reply-enquiry/:enquiryId` | `super_admin`, `support_admin` | Reply to enquiry |
| DELETE | `/api/admin/delete-enquiry/:enquiryId` | `super_admin`, `support_admin` | Delete enquiry |

### Platform Monitoring

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| GET | `/api/admin/get-platform-transactions` | `super_admin` | Get platform transactions |
| GET | `/api/admin/get-site-health` | `super_admin` | Get site health information |
| GET | `/api/admin/get-revenue-health` | `super_admin` | Get revenue health information |

---

# 10. SEO APIs

## Base Path

```text
/api/seo
```

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/seo/sitemap.xml` | Public | Generate/serve sitemap |

---

# 11. Health & Wakeup APIs

## Health Check

```text
GET /api/health
```

### Purpose

Checks whether the backend server is running.

### Current response structure

```json
{
  "status": "ok",
  "message": "Fixkar backend is running"
}
```

---

## Wakeup

```text
GET /api/wakeup/ping
```

Used to trigger the backend wakeup utility.

---

# 12. Professional Short URL API

```text
GET /api/s/:shortCode
```

### Purpose

Resolves a professional short code and returns the corresponding professional profile path.

### Success response

```json
{
  "success": true,
  "slug": "/professional/profile/visit/:userId/:slug"
}
```

If the professional cannot be found, the API returns:

```text
404 Not Found
```

---

# 13. Authentication & Authorization

Fixkar currently uses different middleware levels.

### `isAuth`

Used to protect authenticated user routes.

### `isAdmin`

Used to verify administrator access.

### `adminPermission(...)`

Used to restrict administrative operations according to admin roles.

Current admin roles include:

```text
super_admin
support_admin
content_admin
booking_admin
professional_admin
```

---

# 14. File Upload APIs

Some APIs use multipart/form-data instead of JSON.

Examples include:

```text
POST /api/user/onboard
POST /api/user/update-profile-picture
POST /api/user/professional/bank-details
POST /api/user/upload-media
POST /api/booking/create-booking
POST /api/messages/send/:recieverId
POST /api/admin/create-service
POST /api/admin/announcement
```

These endpoints use Multer middleware for handling uploaded files.

---

# 15. Real-Time Communication

In addition to REST APIs, the backend uses Socket.IO for real-time communication.

Socket.IO is initialized from the backend server and supports online-user tracking and real-time application events.

The REST API documentation therefore does not represent the complete communication layer of the application.

---

# 16. API Documentation Maintenance

This document should be updated whenever the public API contract changes.

Update this document when:

- A new API endpoint is added.
- An existing endpoint is removed.
- An endpoint path changes.
- HTTP method changes.
- Authentication requirements change.
- Admin permissions change.
- Request parameters change.
- Request body changes.
- Response structure changes.
- Important API behaviour changes.

A normal internal code refactor does not require an API documentation update if the public API contract remains unchanged.

---

# 17. Source of Truth

The current endpoint list is based on the Express route registrations in:

```text
Fixkar_Backend/routes/
```

and:

```text
Fixkar_Backend/controllers/Admin/AdminRoutes/admin.routes.js
```

The API prefixes are registered in:

```text
Fixkar_Backend/server.js
```

When new routes are added, this document should be updated accordingly.

---

**Last Reviewed:** 12 August 2026
