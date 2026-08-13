# Fixkar Coupon-Based Offer System

## Overview

Fixkar now uses a **coupon-code-based offer architecture** instead of exposing a list of all active offers to customers.

The core rule is simple:

> A customer must know and enter a valid coupon code before an offer can be claimed or applied to a booking.

This design separates **coupon definition**, **coupon claiming**, **booking application**, and **actual redemption** so that offer history, usage limits, payments, and analytics remain reliable.

---

## Why the architecture was changed

### Previous model

```text
Active Offers
    ↓
Fetch all offers
    ↓
Show offers to customer
    ↓
Customer selects an offer
    ↓
Apply to booking
```

This exposed the complete offer inventory to customers and mixed offer discovery with offer redemption.

### Current model

```text
Admin creates coupon
        ↓
Coupon code is distributed externally
        ↓
Customer enters coupon code
        ↓
Validate coupon
        ↓
Claim coupon
        ↓
Apply coupon to eligible booking
        ↓
Lock discount on booking
        ↓
Payment
        ↓
Record redemption / usage
```

There is no general customer-facing endpoint that fetches every active coupon for display.

---

# 1. Core Architecture

```text
                         ADMIN
                           │
                           ▼
                  ┌─────────────────┐
                  │  Create Coupon  │
                  │   FIXKAR100     │
                  └────────┬────────┘
                           │
                           ▼
                    ┌────────────┐
                    │   Offer    │
                    │  Campaign  │
                    └─────┬──────┘
                          │
             ┌────────────┼─────────────┐
             ▼            ▼             ▼
         Customer     Professional   Analytics
             │            │
             └──────┬─────┘
                    ▼
             Enter Coupon Code
                    │
                    ▼
             Validate Coupon
                    │
                    ▼
               OfferClaim
                    │
                    ▼
          Apply to eligible booking
                    │
                    ▼
             Booking Snapshot
                    │
                    ▼
                 Payment
                    │
                    ▼
               OfferUsage
                    │
                    ▼
             Admin Analytics
```

---

# 2. Offer / Coupon Model

The existing `Offer` entity is now treated as a coupon campaign.

Important fields include:

- `couponCode` — unique, normalized coupon code.
- `offerTitle` — internal/display title.
- `description` — explanation of the coupon.
- `audience` — who can use/claim it.
- `serviceId` — services for which the coupon is valid.
- `discountType` — percentage or flat.
- `discountValue` — discount value.
- `minBookingAmount` — minimum eligible booking amount.
- `maxDiscount` — maximum discount for percentage coupons.
- `startDate` / `endDate` — validity period.
- `usageLimit` — global redemption limit.
- `usedCount` — current redemption count.
- `perUserLimit` — maximum redemptions per user.
- `newCustomerOnly` — optional new-customer restriction.
- `isActive` — operational activation flag.
- `archivedAt` — soft-archive timestamp.

The coupon code is intentionally immutable after creation. Historical records must continue to refer to the same coupon code.

---

# 3. OfferClaim

`OfferClaim` represents the relationship between a user and a coupon they have successfully claimed.

```text
OfferClaim
├── offerId
├── userId
├── couponCode
├── status
├── bookingId
├── discountAmount
├── claimedAt
└── redeemedAt
```

The important distinction is:

```text
Claimed ≠ Redeemed
```

A user may claim a coupon but not use it on a booking.

A unique `(offerId, userId)` constraint prevents duplicate active claims for the same coupon/user combination.

---

# 4. OfferUsage

`OfferUsage` represents actual coupon consumption.

```text
OfferUsage
├── offerId
├── userId
├── bookingId
├── couponCode
├── offerSnapshot
├── discountAmount
├── paymentMode
├── status
└── timestamps
```

This is the redemption/audit record.

It is intentionally separate from `OfferClaim` so that the system can distinguish:

```text
User claimed coupon
        ↓
User actually redeemed coupon
```

---

# 5. Booking Coupon Snapshot

Once a coupon is applied to a booking, the booking stores the pricing information required to preserve historical correctness.

Relevant fields include:

```text
offerId
offerCode
offerSnapshot
  ├── title
  ├── discountType
  ├── discountValue
  └── maxDiscount

discountAmount
finalCustomerPayable
offerLocked
```

This prevents future coupon edits from changing historical bookings.

Example:

```text
Coupon at booking time:
FIXKAR100 → ₹100 OFF

Customer books → ₹100 discount locked

Admin later changes FIXKAR100 → ₹200 OFF

Old booking remains → ₹100 discount
```

---

# 6. Coupon Validation Rules

Coupon validation checks:

1. Coupon code exists.
2. Coupon is not archived.
3. Coupon is active.
4. User belongs to an allowed audience.
5. Current time is inside the coupon validity period.
6. Global usage limit has not been reached.
7. User has not exceeded their per-user limit.
8. New-customer restriction is satisfied when enabled.
9. For a booking application, the booking belongs to the current customer.
10. Booking is in an eligible state.
11. Coupon is valid for the booking's service.
12. Booking amount satisfies the minimum amount.
13. Calculated discount is positive and valid.
14. Another coupon is not already locked on the booking.

---

# 7. Customer Flow

The customer does **not** receive all available coupons.

The intended UI is:

```text
Have a coupon?

[ ENTER COUPON CODE        ] [Apply]
```

Flow:

```text
Enter code
   ↓
Validate
   ↓
Claim
   ↓
Apply to booking
   ↓
Show discount
   ↓
Update final payable
   ↓
Lock coupon
   ↓
Pay
```

The frontend should never calculate the final discount as the source of truth. The backend must validate and calculate the authoritative discount.

---

# 8. Professional Coupon Flow

Professionals can also have coupon/reward codes, but their benefit is conceptually different from a customer discount.

The architecture therefore supports different benefit types, such as:

```text
CUSTOMER_DISCOUNT
PROFESSIONAL_REWARD
```

Possible future professional rewards:

- commission reduction
- wallet credit
- onboarding reward
- promotional incentive

A professional coupon should not automatically be treated as a customer booking discount.

---

# 9. Admin Coupon Management

Admin can create and manage coupons with:

- Coupon code
- Offer title
- Description
- Audience
- Applicable services
- Discount type
- Discount value
- Minimum booking amount
- Maximum discount
- Start date
- End date
- Global usage limit
- Per-user limit
- New-customer restriction
- Active/inactive state

Admin dashboard also exposes coupon-oriented information such as:

- coupon code
- discount
- audience
- applicable services
- redemption progress
- validity dates
- update action
- archive action

---

# 10. Soft Archive Instead of Hard Delete

Coupons should not normally be physically deleted because they may be referenced by:

- bookings
- claims
- usage records
- payments
- analytics

Therefore the preferred lifecycle is:

```text
Active
  ↓
Inactive / Archived
```

rather than:

```text
Active
  ↓
DELETE FROM DATABASE
```

Historical records remain intact.

---

# 11. Coupon Analytics

Admin analytics are available per coupon.

The analytics layer can report:

- total claims
- total redemptions
- total discount granted
- remaining usage
- coupon status
- validity period
- coupon configuration

This provides the foundation for future dashboards and campaign performance reporting.

---

# 12. Migration of Existing Offers

Existing offers created before the coupon architecture may not have coupon codes.

A migration script was added:

```bash
npm run migrate:offers-to-coupons
```

The migration generates unique coupon codes for existing offers and assigns appropriate default coupon settings.

This allows the existing database to move to the new architecture without manually recreating every old offer.

---

# 13. Payment Integration

Coupon discounts are integrated with final booking payments.

The intended settlement flow is:

```text
Booking Amount
      ↓
Coupon Discount
      ↓
Customer Payable
      ↓
Payment
      ↓
Coupon Redemption
      ↓
OfferUsage
```

Both online and cash payment paths record coupon usage where the coupon has been locked on the booking.

The coupon discount is also reflected in platform transaction calculations so that Fixkar's financial records distinguish:

```text
Gross Amount
Customer Paid Amount
Discount Amount
Commission
Professional Amount
Profit / Loss
```

---

# 14. Concurrency and Production Hardening

Coupon usage limits must be enforced atomically.

A simple pattern such as:

```text
read usedCount
↓
if usedCount < usageLimit
↓
increment usedCount
```

can create a race condition when multiple customers redeem the final available coupon simultaneously.

The production implementation should use an atomic conditional update, for example:

```text
Find coupon where:
  _id = couponId
  usedCount < usageLimit

Then atomically:
  usedCount += 1
```

The redemption record and payment settlement should also remain consistent with the transaction boundary used by the payment flow.

This is a critical production-hardening requirement before high-volume coupon campaigns are launched.

---

# 15. Main Backend Components

Important coupon-related components include:

```text
Fixkar_Backend/
├── controllers/
│   ├── Admin/
│   │   └── AdminModels/
│   │       ├── offer.model.js
│   │       └── offerUsage.model.js
│   └── CouponController/
│       └── coupon.controller.js
│
├── services/
│   └── coupon.service.js
│
└── scripts/
    └── migrateOffersToCoupons.js
```

The service layer contains the central validation and claim logic so that coupon rules are not duplicated across controllers.

---

# 16. Main Frontend Components

Coupon-related frontend work includes:

```text
Frontend/src/
├── Admin/AdminComponents/
│   ├── AllOffers.jsx
│   ├── ManageOffers.jsx
│   └── Utils/OfferForm.jsx
│
├── Customer/
│   └── PayButton.jsx
│
└── Professional/
    └── ProfessionalCoupons.jsx
```

The customer payment flow uses coupon validation/application instead of displaying an offer catalogue.

---

# 17. API Responsibilities

The coupon controller provides responsibilities for:

### Claim coupon

```text
POST /api/coupon/claim
```

### Validate coupon

```text
POST /api/coupon/validate
```

### Apply coupon to booking

```text
POST /api/coupon/apply
```

### Get user's claimed coupons

```text
GET /api/coupon/my-claims
```

### Admin coupon analytics

```text
GET /api/admin/get-offer-analytics/:offerId
```

Actual route prefixes may depend on the application's route registration.

---

# 18. Example

Suppose Admin creates:

```text
Coupon Code: FIXKAR500
Title: ₹500 Off Home Services
Audience: Customer
Services: Plumbing, Electrical
Discount: ₹500
Minimum Booking: ₹2,000
Per User Limit: 1
Global Limit: 100
Validity: 15 Aug – 31 Aug
```

Customer has a ₹2,500 eligible booking.

```text
Booking Amount       ₹2,500
Coupon Discount       -₹500
----------------------------
Customer Payable      ₹2,000
```

The booking stores the coupon snapshot and discount amount.

After successful payment:

```text
OfferClaim → redeemed
OfferUsage → created
Offer.usedCount → +1
Booking.offerLocked → true
```

---

# 19. Design Principles

The coupon system follows these principles:

### Coupon-first

The customer must possess/know a coupon code to use an offer.

### Backend authority

Discount eligibility and amount are calculated on the server.

### Historical immutability

Past bookings must not change when coupon configuration changes later.

### Separation of concerns

```text
Offer      = campaign definition
Claim      = user's claim
Booking    = coupon locked to a transaction
Usage      = actual redemption
Payment    = financial settlement
```

### Auditability

Coupon actions should remain traceable for support, finance, and analytics.

### Safe lifecycle

Archive instead of deleting coupon records that may be referenced by historical data.

### Concurrency safety

Global and per-user limits must be enforced in a race-safe manner.

---

# 20. Current Implementation Status

| Feature | Status |
|---|---|
| Coupon code based architecture | ✅ Implemented |
| Unique coupon codes | ✅ Implemented |
| Audience targeting | ✅ Implemented |
| Service targeting | ✅ Implemented |
| Validity rules | ✅ Implemented |
| Global usage limit | ✅ Implemented |
| Per-user limit | ✅ Implemented |
| New customer rule | ✅ Implemented |
| Coupon claim model | ✅ Implemented |
| Coupon usage model | ✅ Implemented |
| Booking coupon snapshot | ✅ Implemented |
| Customer coupon input flow | ✅ Implemented |
| Professional coupon flow foundation | ✅ Implemented |
| Admin coupon management | ✅ Implemented |
| Coupon analytics | ✅ Implemented |
| Soft archive | ✅ Implemented |
| Existing offer migration | ✅ Implemented |
| Cash payment integration | ✅ Implemented |
| Online payment integration | ⚠️ Requires final atomic-redemption hardening |
| Atomic high-concurrency redemption | ⚠️ Final production hardening |
| Professional reward settlement rules | 🔶 To be finalized per business rules |

---

## Final Description

Fixkar's coupon system is designed as a **controlled, auditable, coupon-code-based promotion engine** rather than a generic offer listing system. Admin creates targeted coupon campaigns, customers or professionals claim coupons using explicit codes, eligibility is validated centrally on the backend, and eligible coupons are locked to bookings with a historical pricing snapshot. Actual redemption is recorded separately from claiming, allowing accurate usage limits, financial reconciliation, analytics, and support auditing. The architecture also preserves historical data through soft archiving and prepares the system for atomic redemption under concurrent traffic.
