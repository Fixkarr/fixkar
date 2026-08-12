# Fixkar — Authentication & Authorization

## 1. Overview

Fixkar uses a role-based authentication and authorization architecture.

The application currently has two separate authentication systems:

1. Customer / Professional authentication
2. Admin authentication

The customer and professional accounts are stored using the `User` model, while administrator accounts use a separate `Admin` model.

---

# 2. Authentication Architecture

The high-level authentication flow is:

```text
Client
   │
   ▼
Authentication API
   │
   ├── Email/Password
   ├── Google Authentication
   └── Firebase-based Native Authentication
   │
   ▼
User / Admin Verification
   │
   ▼
JWT Generation
   │
   ▼
HTTP-only Cookie
   │
   ▼
Protected API Request
   │
   ▼
Authentication Middleware
   │
   ├── isAuth → Customer / Professional
   │
   └── isAdmin → Admin
```

---

# 3. User Authentication

Customer and Professional authentication is based on the `User` model.

File:

```text
Fixkar_Backend/models/userModel.js
```

The User model contains common authentication information.

Important fields include:

- `fullName`
- `email`
- `password`
- `mobile`
- `isMobileVerified`
- `isEmailVerified`
- `role`
- `termsAcceptance`
- `professionalAcceptance`
- `fcmTokens`

The password field is configured with `select: false`.

---

# 4. User Roles

The current `User` model supports two roles:

```text
customer
professional
```

The role is stored directly in the User document.

```text
User
 │
 ├── role: customer
 │       ↓
 │    Customer
 │
 └── role: professional
         ↓
      Professional
```

The `Customer` and `Professional` documents reference the base User through `userId`.

---

# 5. Customer Registration

Customer registration endpoint:

```text
POST /api/auth/signup-customer
```

The registration controller is:

```text
Fixkar_Backend/controllers/auth/userAuth.js
```

### Required information

The registration process currently expects:

```text
fullName
email
password
role
acceptedTerms
acceptedProfessionalPolicy
```

`acceptedProfessionalPolicy` is required only when the selected role is:

```text
professional
```

---

# 6. Email Verification Before Registration

Normal user registration requires email verification before the account is created.

The process is:

```text
User enters email
       ↓
Send Email OTP
       ↓
Verify Email OTP
       ↓
Temporary email_verified record created
       ↓
Registration request
       ↓
Backend checks email_verified
       ↓
User account created
```

The registration controller checks Redis for:

```text
email_verified:<email>
```

If the verification record does not exist, registration is rejected.

---

# 7. Email OTP

## Send Email OTP

```text
POST /api/otp/send-email-otp
```

Request:

```json
{
  "email": "user@example.com"
}
```

The OTP is:

- Generated as a 6-digit OTP.
- Hashed before being stored.
- Stored in Redis.
- Given a limited lifetime.
- Protected by a resend cooldown.

The default OTP expiry is:

```text
300 seconds
```

which is 5 minutes.

The default resend cooldown is:

```text
60 seconds
```

---

## Verify Email OTP

```text
POST /api/otp/verify-email-otp
```

Request:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

The OTP is compared against the hashed OTP stored in Redis.

After successful verification:

```text
email_verified:<email>
```

is stored temporarily in Redis for 15 minutes.

The original OTP and resend cooldown records are then removed.

---

# 8. Password Handling

Passwords are never stored in plain text.

During registration:

```text
Plain Password
      ↓
bcrypt
      ↓
Hashed Password
      ↓
MongoDB
```

The project uses `bcryptjs`.

During login:

```text
Entered Password
      ↓
bcrypt.compare()
      ↓
Stored Password Hash
      ↓
Authentication Result
```

---

# 9. Normal Login

Endpoint:

```text
POST /api/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

The backend:

1. Validates email and password.
2. Finds the User by email.
3. Loads the password field.
4. Compares the password using bcrypt.
5. Generates a JWT.
6. Stores the JWT in an HTTP-only cookie.
7. Returns role-specific user information.

---

# 10. JWT Authentication

JWT generation is handled by:

```text
Fixkar_Backend/utils/AuthToken.js
```

The JWT contains:

```json
{
  "userId": "USER_ID"
}
```

The token is signed using:

```text
JWT_SECRET
```

The current token expiration is:

```text
7 days
```

---

# 11. Authentication Cookie

After successful authentication, the backend creates a cookie named:

```text
token
```

The cookie is configured as:

```text
httpOnly: true
sameSite: "none"
secure: production dependent
```

The normal user authentication cookie has a maximum age of:

```text
7 days
```

Because the cookie is HTTP-only, client-side JavaScript cannot directly access the token.

---

# 12. `isAuth` Middleware

File:

```text
Fixkar_Backend/middlewares/isAuth.js
```

`isAuth` protects authenticated user routes.

The flow is:

```text
Request
   ↓
Read token cookie
   ↓
JWT verification
   ↓
Extract userId
   ↓
req.userId
   ↓
next()
```

If the token is missing:

```text
401 Unauthorized
```

If JWT verification fails:

```text
401 Token not verified
```

The decoded User ID is attached to:

```text
req.userId
```

---

# 13. Customer Authentication Flow

```text
Customer
   │
   ▼
Email OTP Verification
   │
   ▼
Customer Registration
   │
   ▼
User document created
   │
   ▼
Customer document created
   │
   ▼
JWT generated
   │
   ▼
token cookie
   │
   ▼
Authenticated Customer
```

The Customer model references the User through:

```text
Customer.userId → User
```

---

# 14. Professional Registration Flow

Professional registration follows the same base User registration mechanism but creates a Professional profile.

```text
Professional
     │
     ▼
Email Verification
     │
     ▼
Registration
     │
     ▼
User created
     │
     ▼
Professional created
     │
     ▼
Professional profile completion
     │
     ▼
Admin verification/application process
```

The Professional model references:

```text
Professional.userId → User
```

---

# 15. Professional Acceptance Policy

When registering as a professional, the user must accept the professional policy.

The backend checks:

```text
acceptedProfessionalPolicy
```

If the role is:

```text
professional
```

and the policy has not been accepted, registration is rejected.

The acceptance information is stored in:

```text
professionalAcceptance
```

including:

- `accepted`
- `acceptedAt`
- `acceptedIP`
- `policyVersion`

---

# 16. Terms Acceptance

User registration requires acceptance of the platform terms.

The backend stores:

```text
termsAcceptance
```

with:

- `accepted`
- `acceptedAt`
- `acceptedIP`
- `policyVersion`

The acceptance metadata is intentionally protected from normal model selection.

---

# 17. Mobile OTP Verification

Mobile verification uses Firebase-based phone verification in the current implementation.

Endpoint:

```text
POST /api/otp/send
```

The route is protected by:

```text
isAuth
```

and rate limiting.

The OTP send endpoint validates the phone number and uses Redis for OTP-related temporary state.

---

## Mobile OTP Verification

Endpoint:

```text
POST /api/otp/verify
```

The current implementation receives a Firebase token and verifies it using Firebase Admin.

After successful verification:

```text
User.mobile
User.isMobileVerified
```

are updated.

The user is then returned according to their role.

---

# 18. OTP Rate Limiting

Mobile OTP requests use a rate limiter.

Current configuration:

```text
Window: 15 minutes
Maximum requests: 10
```

The rate-limit key uses the phone number when available, otherwise the request IP.

---

# 19. Google Authentication

Fixkar supports Google authentication through two different flows:

1. Web Google authentication
2. Native/Firebase Google authentication

---

# 20. Google Signup — Web

Endpoint:

```text
POST /api/auth/google-auth-signup
```

The request contains:

```text
fullName
email
role
acceptedTerms
acceptedProfessionalPolicy
```

The backend:

1. Checks terms acceptance.
2. Checks professional policy acceptance when applicable.
3. Checks whether the email already exists.
4. Creates the User.
5. Creates either Customer or Professional profile.
6. Generates a JWT.
7. Stores the JWT in the authentication cookie.

---

# 21. Google Login — Web

Endpoint:

```text
POST /api/auth/google-auth-login
```

Request:

```json
{
  "email": "user@example.com"
}
```

The backend:

1. Finds the user by email.
2. Checks the user's role.
3. Generates a JWT.
4. Stores the JWT in the authentication cookie.
5. Returns the corresponding Customer or Professional profile.

---

# 22. Native Google Authentication

Native authentication uses Firebase Authentication.

### Native Google Signup

```text
POST /api/auth/google-auth-signup-native
```

The client sends:

```text
idToken
role
acceptedTerms
acceptedProfessionalPolicy
```

The backend verifies the Firebase ID token using Firebase Admin.

---

### Native Google Login

```text
POST /api/auth/google-auth-login-native
```

The client sends:

```json
{
  "idToken": "FIREBASE_ID_TOKEN"
}
```

The backend:

```text
Firebase ID Token
       ↓
Firebase Admin verifyIdToken()
       ↓
Verified Firebase identity
       ↓
Extract email
       ↓
Find User
       ↓
Generate Fixkar JWT
       ↓
HTTP-only token cookie
```

The backend also checks that the Firebase email is verified.

---

# 23. Google Authentication Role Handling

Google authentication follows the same application roles:

```text
customer
professional
```

After authentication:

```text
User.role
    │
    ├── customer
    │      ↓
    │   Customer profile
    │
    └── professional
           ↓
       Professional profile
```

---

# 24. Logout

Endpoint:

```text
POST /api/auth/logout
```

The backend clears the authentication cookie:

```text
token
```

After successful logout, the response is:

```json
{
  "message": "Signout successful"
}
```

---

# 25. Password Reset

Endpoint:

```text
POST /api/auth/request-reset-password
```

Current implementation accepts:

```json
{
  "email": "user@example.com",
  "newPassword": "new-password"
}
```

The backend:

1. Finds the User by email.
2. Hashes the new password using bcrypt.
3. Saves the new password.

---

# 26. Password Reset Security Note

The current password-reset implementation directly changes the password after receiving the email and new password.

Although email OTP verification exists separately, the current `request-reset-password` controller does not itself verify that the user has completed the email OTP flow before changing the password.

Therefore, this area should be treated as a **security improvement item**.

### Recommended future architecture

```text
Forgot Password
      ↓
Enter Email
      ↓
Send Email OTP
      ↓
Verify OTP
      ↓
Issue Temporary Reset Authorization
      ↓
Set New Password
      ↓
Invalidate Reset Authorization
```

The password should only be changed after successful reset authorization.

---

# 27. Admin Authentication

Administrators use a separate authentication system.

Admin model:

```text
Fixkar_Backend/controllers/Admin/AdminModels/admin.model.js
```

Admin authentication does not use the normal User role enum.

---

# 28. Admin Registration

Endpoint:

```text
POST /api/admin/signup
```

Required fields:

```text
adminName
username
password
role
secret
```

The backend verifies:

```text
secret === ADMIN_SIGNUP_SECRET
```

The secret is stored as an environment variable and must never be committed to source control.

---

# 29. Admin Username Rules

The Admin signup process validates the username.

Allowed characters:

```text
letters
numbers
_
.
@
```

Spaces are not allowed.

Username length:

```text
Minimum: 4 characters
Maximum: 20 characters
```

Username must also be unique.

---

# 30. Admin Roles

The current Admin system supports:

```text
super_admin
support_admin
content_admin
booking_admin
professional_admin
```

---

# 31. Admin Permissions

Permissions are assigned according to the admin role.

| Role | Permissions |
|---|---|
| `super_admin` | Users, Content, Bookings, Professionals, Support |
| `support_admin` | Support |
| `content_admin` | Content |
| `booking_admin` | Bookings, Users |
| `professional_admin` | Professionals, Users |

---

# 32. Admin Login

Endpoint:

```text
POST /api/admin/login
```

Request:

```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```

The backend:

1. Finds the Admin by username.
2. Loads the password.
3. Compares the password using bcrypt.
4. Generates a JWT.
5. Stores the JWT in the `token` HTTP-only cookie.
6. Returns the Admin information without the password.

Admin authentication cookie lifetime:

```text
24 hours
```

---

# 33. `isAdmin` Middleware

File:

```text
Fixkar_Backend/middlewares/isAdmin.js
```

The middleware:

```text
Request
   ↓
Read token cookie
   ↓
Verify JWT
   ↓
Find Admin by decoded userId
   ↓
req.admin
   ↓
next()
```

If no token exists:

```text
401 Admin not authorized
```

If the Admin does not exist:

```text
401 Admin not found
```

If the token is invalid or expired:

```text
401 Invalid or expired admin token
```

---

# 34. Admin Permission Middleware

File:

```text
Fixkar_Backend/middlewares/adminPermission.js
```

The middleware receives allowed roles.

Example:

```text
adminPermission(
    "super_admin",
    "content_admin"
)
```

The middleware checks:

```text
req.admin
    ↓
admin.role
    ↓
Allowed roles?
    │
    ├── Yes → next()
    │
    └── No → 403 Forbidden
```

---

# 35. Authorization Architecture

The complete authorization flow is:

```text
                    Request
                       │
                       ▼
                 Authentication
                       │
             ┌─────────┴─────────┐
             │                   │
          User                  Admin
             │                   │
          isAuth              isAdmin
             │                   │
             ▼                   ▼
       User identity        Admin identity
                                 │
                                 ▼
                         adminPermission
                                 │
                                 ▼
                           Allowed Role
```

---

# 36. Authentication vs Authorization

### Authentication

Answers:

> "Who are you?"

Examples:

```text
JWT
Firebase verification
Password verification
OTP verification
```

### Authorization

Answers:

> "What are you allowed to do?"

Examples:

```text
customer
professional
super_admin
content_admin
booking_admin
support_admin
professional_admin
```

---

# 37. Credential Types

The current authentication architecture uses several credential types.

| Credential | Purpose |
|---|---|
| Email + Password | Normal User authentication |
| Email OTP | Email verification |
| Firebase ID Token | Native Google/phone authentication |
| JWT | Application session authentication |
| HTTP-only Cookie | Stores application JWT |
| Admin Signup Secret | Protects Admin registration |
| Admin Username + Password | Admin authentication |

---

# 38. Important Environment Variables

Authentication depends on environment configuration.

Important authentication-related variables include:

```text
JWT_SECRET
ADMIN_SIGNUP_SECRET
OTP_EXPIRY_SECONDS
OTP_MAX_ATTEMPTS
OTP_RESEND_COOLDOWN
```

External authentication integrations may also require Firebase configuration.

Actual secret values must never be documented or committed to GitHub.

---

# 39. Authentication Security Principles

The following rules should be maintained:

- Never store plain-text passwords.
- Never commit JWT secrets.
- Never commit Admin signup secrets.
- Never expose Firebase service-account credentials.
- Keep authentication cookies HTTP-only.
- Validate authentication on the backend.
- Do not rely only on frontend role checks.
- Apply authorization middleware to sensitive Admin operations.
- Use OTP expiration and resend cooldowns.
- Keep sensitive database fields protected from normal queries.

---

# 40. Current Authentication Architecture Summary

```text
                         Fixkar Authentication
                                  │
             ┌────────────────────┴────────────────────┐
             │                                         │
       User Authentication                       Admin Authentication
             │                                         │
      ┌──────┼────────┐                           Username + Password
      │      │        │                                  │
 Password  Google    OTP                            Admin Signup Secret
      │      │        │                                  │
      │      │   Firebase/Email                       Admin Model
      │      │        │                                  │
      └──────┴────────┘                                  ▼
             │                                         JWT
             ▼                                          │
            JWT                                         ▼
             │                                       Cookie
             ▼                                          │
          Cookie                                  isAdmin
             │                                          │
           isAuth                                adminPermission
             │                                          │
      ┌──────┴──────┐                          ┌────────┴────────┐
      │             │                          │                 │
   Customer    Professional                Allowed          Forbidden
```

---

# 41. Source Files

The primary authentication implementation is located in:

```text
Fixkar_Backend/
│
├── controllers/
│   ├── auth/
│   │   ├── userAuth.js
│   │   └── otpController.js
│   │
│   └── Admin/
│       └── AdminController/
│           ├── adminSignup.js
│           └── adminLogin.js
│
├── middlewares/
│   ├── isAuth.js
│   ├── isAdmin.js
│   └── adminPermission.js
│
├── models/
│   └── userModel.js
│
├── utils/
│   └── AuthToken.js
│
└── routes/
    ├── authRoutes.js
    └── otpRoutes.js
```

---

# 42. Documentation Maintenance

This document must be updated when the authentication architecture changes.

Update this document when:

- A new authentication method is introduced.
- A role is added or removed.
- Admin permissions change.
- JWT behaviour changes.
- Cookie configuration changes.
- OTP behaviour changes.
- Password reset flow changes.
- Google/Firebase authentication changes.
- Registration requirements change.
- Authentication middleware changes.

Internal code refactoring does not require documentation changes if the external authentication behaviour remains unchanged.

---

**Last Reviewed:** 12 August 2026
