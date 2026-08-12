# Fixkar — Database Design

## 1. Database Overview

Fixkar uses MongoDB as its primary application database.

Mongoose is used as the Object Data Modeling (ODM) library for defining schemas, creating models, validating data and interacting with MongoDB.

The project currently maintains database models in two locations:

```text
Fixkar_Backend/
│
├── models/
│
└── controllers/
    └── Admin/
        └── AdminModels/
```

The `models/` directory contains the primary application models, while `controllers/Admin/AdminModels/` contains models used by the Admin-related system.

---

# 2. Primary Application Models

The primary models are maintained inside:

```text
Fixkar_Backend/models/
```

Current models include:

```text
models/
├── bookingModel.js
├── creditTransactionModel.js
├── galleryModel.js
├── messageModel.js
├── notificationModel.js
├── paymentModel.js
├── pickup.model.js
├── pickupSession.model.js
├── reachedOtpModel.js
├── reviewModel.js
├── serviceModel.js
├── skillsModel.js
├── userModel.js
└── walletModel.js
```

---

# 3. User Model

## `User`

File:

```text
Fixkar_Backend/models/userModel.js
```

The `User` model stores common authentication and identity information.

### Important fields

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

### Roles

The current User model supports:

```text
customer
professional
```

Passwords are configured with `select: false`.

The model also stores acceptance information for terms and professional-related policies.

---

# 4. Professional Model

## `Professional`

The Professional model is defined in:

```text
Fixkar_Backend/models/userModel.js
```

It is linked to the `User` model through `userId`.

### Important fields

- `userId`
- `dob`
- `profession`
- `selectedSkills`
- `description`
- `address`
- `charges`
- `isChargesDefined`
- `visitingCharge`
- `location`
- `profilePicture`
- `gallery`
- `status`
- `onBoarded`
- `busyDays`
- `reviews`
- `rejectionCount`
- `acceptedBy`
- `rejectedBy`
- `bankVerified`
- `bankDetails`
- `bankVerificationStatus`
- `slug`
- `shortCode`
- `taskPricing`

### Professional status

```text
pending
approved
rejected
```

### Location

Professional location uses GeoJSON-style coordinates:

```text
location.type
location.coordinates
```

A `2dsphere` index is created on the `location` field for geospatial queries.

### Important relationships

```text
Professional
   │
   ├── userId → User
   ├── profession → Service
   ├── selectedSkills → Skill
   ├── charges → FormResponse
   ├── gallery → Gallery
   ├── reviews → Review
   ├── acceptedBy → Admin
   └── rejectedBy → Admin
```

---

# 5. Customer Model

## `Customer`

The Customer model is also defined in:

```text
Fixkar_Backend/models/userModel.js
```

### Important fields

- `userId`
- `address`
- `totalBookings`

### Relationship

```text
Customer
   │
   └── userId → User
```

---

# 6. Service Model

## `Service`

File:

```text
Fixkar_Backend/models/serviceModel.js
```

Represents a service category offered on the Fixkar platform.

### Important fields

- `name`
- `description`
- `image`
- `professionalCount`
- `createdBy`
- `commission`
- `skills`
- `serviceType`

### Service types

```text
skill_based
specialized
```

### Relationships

```text
Service
   │
   ├── createdBy → Admin
   └── skills → Skill[]
```

---

# 7. Skill Model

## `Skill`

File:

```text
Fixkar_Backend/models/skillsModel.js
```

Represents a specific task/skill belonging to a service.

### Important fields

- `name`
- `service`
- `bookingType`
- `pricingSource`
- `fixedPrice`
- `isActive`
- `estimatedDuration`

### Booking types

```text
fixed
inspection
```

### Pricing sources

```text
admin
professional
```

### Relationship

```text
Skill
   │
   └── service → Service
```

A unique index exists for the combination of service and skill name.

---

# 8. Booking Model

## `Booking`

File:

```text
Fixkar_Backend/models/bookingModel.js
```

Represents a customer service booking.

### Important fields

- `customerId`
- `customerName`
- `professionalId`
- `workDate`
- `workTime`
- `problemDescription`
- `audioMessages`
- `visitingCharge`
- `workAddress`
- `distanceInKm`
- `mobileNumber`
- `status`
- `quoteAmount`
- `service`
- `task`
- `pricingType`
- `serviceCharge`
- `totalAmount`
- `professionalReceivable`
- `isPriceLocked`
- `assignmentStatus`
- `currentPaymentId`
- `cancellationType`
- `completedAt`
- `review`
- `walletTransaction`
- `offerId`
- `discountAmount`
- `finalCustomerPayable`
- `offerLocked`

### Booking status

```text
pending
accepted
reached
in-progress
rejected
completed
cancelled
searching
```

### Assignment status

```text
searching
assigned
expired
cancelled
```

### Relationships

```text
Booking
   │
   ├── customerId → Customer
   ├── professionalId → Professional
   ├── service → Service
   ├── task → Skill
   ├── currentPaymentId → Payment
   ├── review → Review
   ├── walletTransaction → WalletTransaction
   └── offerId → Offer
```

---

# 9. Payment Model

## `Payment`

File:

```text
Fixkar_Backend/models/paymentModel.js
```

Stores payment records related to bookings.

### Important fields

- `bookingId`
- `customerId`
- `professionalId`
- `paymentType`
- `amount`
- `reason`
- `currency`
- `razorpayOrderId`
- `razorpayPaymentId`
- `status`
- `paidAt`
- `offerId`
- `discountAmount`
- `paymentMode`

### Payment status

```text
created
paid
failed
cancelled
refunded
```

### Payment mode

```text
ONLINE
CASH
```

### Relationship

```text
Payment
   │
   ├── bookingId → Booking
   ├── customerId → Customer
   ├── professionalId → Professional
   └── offerId → Offer
```

---

# 10. Wallet Model

## `Wallet`

File:

```text
Fixkar_Backend/models/walletModel.js
```

Represents a professional's wallet and earnings information.

### Important fields

- `professionalId`
- `pendingBalance`
- `totalEarned`
- `totalWithdrawn`
- `credits`
- `withdrawnRequest`

### Credit information

The wallet also stores:

- Credit balance
- Lifetime credits earned
- Lifetime credits spent
- Lifetime credits expired
- First booking reward status

### Relationship

```text
Wallet
   │
   └── professionalId → Professional
```

---

# 11. Credit Transaction Model

## `CreditTransaction`

File:

```text
Fixkar_Backend/models/creditTransactionModel.js
```

Tracks professional credit transactions.

### Transaction types

```text
EARNED
SPENT
REVERSED
EXPIRED
ADJUSTMENT
```

### Important fields

- `walletId`
- `professionalId`
- `type`
- `source`
- `credits`
- `referenceId`
- `referenceModel`
- `description`
- `metadata`

### Relationships

```text
CreditTransaction
   │
   ├── walletId → Wallet
   └── professionalId → Professional
```

A unique index is used to prevent duplicate transactions for the same source/reference/type combination where applicable.

---

# 12. Gallery Model

## `Gallery`

File:

```text
Fixkar_Backend/models/galleryModel.js
```

Stores professional portfolio media.

### Important fields

- `professionalId`
- `mediaUrl`
- `mediaType`
- `publicId`

### Media types

```text
image
video
```

### Relationship

```text
Gallery
   │
   └── professionalId → Professional
```

---

# 13. Review Model

## `Review`

File:

```text
Fixkar_Backend/models/reviewModel.js
```

Stores customer reviews and ratings for professionals.

### Important fields

- `bookingId`
- `professionalId`
- `customerName`
- `customerId`
- `rating`
- `review`

### Rating

Rating must be between:

```text
1 - 5
```

### Relationships

```text
Review
   │
   ├── bookingId → Booking
   ├── professionalId → Professional
   └── customerId → Customer
```

---

# 14. Notification Model

## `Notification`

File:

```text
Fixkar_Backend/models/notificationModel.js
```

Stores application notifications.

### Important fields

- `userId`
- `title`
- `message`
- `type`
- `relatedId`
- `isRead`

### Notification types

```text
announcement
pickup_accepted
pickup_request
booking_rejected
booking_accepted
booking_cancelled
booking_completed
booking_reached
booking_pending
message
```

### Relationship

```text
Notification
   │
   └── userId → User
```

---

# 15. Message Model

## `Message`

File:

```text
Fixkar_Backend/models/messageModel.js
```

Stores user-to-user messages.

### Important fields

- `sender`
- `reciever`
- `message`
- `attachments`
- `status`
- `replyTo`
- `deliveredAt`
- `seenAt`
- `deleteFor`

### Message status

```text
pending
sent
delivered
seen
```

### Relationships

```text
Message
   │
   ├── sender → User
   ├── reciever → User
   ├── replyTo → Message
   └── deleteFor[] → User
```

---

# 16. Pickup Session Model

## `PickupSession`

File:

```text
Fixkar_Backend/models/pickupSession.model.js
```

Represents a pickup/search session used during professional discovery and selection.

### Important fields

- `customerId`
- `status`
- `professionalExpiresAt`
- `customerSelectionExpiresAt`
- `selectedProfessionalId`
- `selectedPickupRequestId`
- `bookingId`

### Session status

```text
searching
selecting
confirmed
expired
cancelled
```

### Relationships

```text
PickupSession
   │
   ├── customerId → Customer
   ├── selectedProfessionalId → Professional
   ├── selectedPickupRequestId → PickupRequest
   └── bookingId → Booking
```

---

# 17. Pickup Request Model

## `PickupRequest`

File:

```text
Fixkar_Backend/models/pickup.model.js
```

Represents an individual professional's request/response within a pickup search session.

### Important relationships

```text
PickupRequest
   │
   ├── pickupSessionId → PickupSession
   ├── serviceId → Service
   ├── taskId → Skill
   ├── bookingId → Booking
   ├── professionalId → Professional
   └── customerId → Customer
```

### Status

```text
pending
accepted
rejected
expired
cancelled
```

The model also stores customer location, work information, pricing, notification state and expiration information.

An expiration index is configured on `expiresAt`.

---

# 18. Reached OTP Model

## `ReachedOtp`

File:

```text
Fixkar_Backend/models/reachedOtpModel.js
```

Stores OTP information associated with a booking when verifying the professional's reached state.

### Fields

- `bookingId`
- `otp`

### Relationship

```text
ReachedOtp
   │
   └── bookingId → Booking
```

---

# 19. Admin Models

Admin-related models are stored separately from the primary `models/` directory.

Location:

```text
Fixkar_Backend/controllers/Admin/AdminModels/
```

Current Admin models include:

```text
AdminModels/
├── admin.model.js
├── announcementModel.js
├── bank.model.js
├── contact.model.js
├── form.model.js
├── formResponse.js
├── offer.model.js
├── offerUsage.model.js
└── platformTransaction.js
```

---

# 20. Admin Model

## `Admin`

File:

```text
controllers/Admin/AdminModels/admin.model.js
```

Stores administrator accounts.

### Important fields

- `adminName`
- `username`
- `role`
- `password`
- `permissions`

### Admin roles

```text
super_admin
support_admin
content_admin
booking_admin
professional_admin
```

Passwords are configured with `select: false`.

---

# 21. Announcement Model

## `Announcement`

Stores announcements created for platform users.

### Important fields

- `title`
- `message`
- `link`
- `audience`
- `professions`
- `imageUrl`
- `public_id`

### Audience

```text
all
customer
professional
```

---

# 22. Bank Model

## `Bank`

Stores supported bank information.

### Important fields

- `code`
- `name`
- `isActive`

Bank code and name are unique.

---

# 23. Contact Model

## `Contact`

Stores contact form submissions.

### Important fields

- `name`
- `email`
- `phone`
- `message`
- `replied`
- `senderRole`

### Sender roles

```text
customer
professional
visitor
```

---

# 24. Form Model

## `Form`

The Form model provides a dynamic form structure that can be configured by the platform.

It contains:

- Form information
- Purpose
- Target entity
- Version
- Active status
- Sections
- Fields

### Supported field types

```text
text
number
textarea
radio
checkbox
select
date
yesno
table
```

### Form structure

```text
Form
 │
 └── Sections
       │
       └── Fields
```

The target can reference different application entities using a dynamic reference.

---

# 25. Form Response Model

## `FormResponse`

Stores responses submitted against a dynamic form.

### Important fields

- `formId`
- `formKey`
- `purpose`
- `filledBy`
- `responses`
- `summary`
- `isEditable`

### Relationship

```text
FormResponse
   │
   └── formId → Form
```

Professional pricing information can reference a FormResponse through the Professional model.

---

# 26. Offer Model

## `Offer`

Stores promotional offers.

### Important fields

- `serviceId`
- `offerTitle`
- `discountType`
- `discountValue`
- `minBookingAmount`
- `maxDiscount`
- `startDate`
- `endDate`
- `usageLimit`
- `usedCount`
- `perUserLimit`
- `newCustomerOnly`
- `isActive`

### Discount types

```text
percentage
flat
```

An offer can apply to one or more services.

---

# 27. Offer Usage Model

## `OfferUsage`

Tracks the usage of offers by users/bookings.

### Important fields

- `offerId`
- `userId`
- `bookingId`
- `discountAmount`
- `paymentMode`
- `status`

### Status

```text
used
reversed
```

### Relationships

```text
OfferUsage
   │
   ├── offerId → Offer
   ├── userId → User
   └── bookingId → Booking
```

A unique index prevents duplicate usage records for the same offer, user and booking combination.

---

# 28. Platform Transaction Model

## `PlatformTransaction`

Stores financial transaction information from the platform's perspective.

### Important fields

- `bookingId`
- `paymentId`
- `professionalId`
- `paymentMode`
- `grossAmount`
- `customerPaidAmount`
- `discountAmount`
- `commission`
- `professionalAmount`
- `profitOrLoss`

### Relationships

```text
PlatformTransaction
   │
   ├── bookingId → Booking
   ├── paymentId → Payment
   └── professionalId → Professional
```

### Payment modes

```text
ONLINE
CASH
PAYOUT
```

---

# 29. Main Entity Relationships

The major relationships in the current database can be represented as:

```text
                         ┌──────────┐
                         │   User   │
                         └────┬─────┘
                              │
                  ┌───────────┴───────────┐
                  │                       │
                  ▼                       ▼
             ┌──────────┐           ┌──────────────┐
             │ Customer │           │ Professional │
             └────┬─────┘           └──────┬───────┘
                  │                         │
                  │                         │
                  ▼                         ▼
             ┌──────────┐              ┌────────┐
             │ Booking  │◄─────────────┤ Wallet │
             └────┬─────┘              └────────┘
                  │
        ┌─────────┼───────────┐
        │         │           │
        ▼         ▼           ▼
    Payment     Review      Offer
        │
        ▼
PlatformTransaction

Service
   │
   └── Skill

Professional
   │
   ├── Gallery
   ├── Review
   ├── Wallet
   └── Service / Skill

PickupSession
   │
   └── PickupRequest
          │
          └── Booking
```

---

# 30. Important Database Design Notes

### User, Customer and Professional

The current implementation separates common user information from customer and professional-specific information.

```text
User
 ├── Customer
 └── Professional
```

Customer and Professional records reference the base User through `userId`.

### Admin

Admin is a separate model and is not part of the User role enum.

The Admin model has its own authentication identity, role and permissions.

### Service and Skill

Services contain references to their associated skills.

```text
Service
   │
   └── Skills
```

Skills can use either admin-defined or professional-defined pricing depending on `pricingSource`.

### Booking

Booking is a central entity connecting:

- Customer
- Professional
- Service
- Skill
- Payment
- Review
- Offer
- Wallet transaction

### Pickup System

The pickup system uses two related entities:

```text
PickupSession
       │
       └── PickupRequest(s)
```

The session represents the overall customer search/selection process, while pickup requests represent professional-specific participation in that session.

---

# 31. Indexes and Constraints

The current schemas contain several indexes and uniqueness constraints.

Examples include:

- Professional `shortCode` unique partial index
- Professional geospatial `2dsphere` index
- Skill uniqueness by `service + name`
- Pickup request expiration index
- Credit transaction uniqueness constraint
- Offer service/activity index
- Offer usage uniqueness constraint
- Unique Admin username
- Unique Bank code and name

Indexes should be reviewed when query patterns or database volume change.

---

# 32. Data Security

Sensitive information must be protected.

Examples include:

- User passwords
- Professional bank account information
- PAN information
- Payment credentials
- Authentication secrets

Several sensitive fields are configured with `select: false` in the current Mongoose schemas.

Application secrets must never be stored directly in the database documentation or committed to GitHub.

---

# 33. Source of Truth

This document is based on the current Mongoose schemas present in:

```text
Fixkar_Backend/models/
```

and:

```text
Fixkar_Backend/controllers/Admin/AdminModels/
```

The database documentation should be updated whenever:

- A model is added or removed
- A field changes
- A relationship changes
- A status/enum changes
- An index is added or removed
- A major database workflow changes

---

**Last Reviewed:** 12 August 2026
