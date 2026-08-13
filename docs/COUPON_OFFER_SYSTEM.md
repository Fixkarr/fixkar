# Fixkar Coupon-Based Offer System

## Architecture rules

Fixkar uses **coupon-code-based campaigns**. Customers and professionals are not given a public list of every active offer. An eligible user must receive a coupon code and enter it.

A coupon has exactly one commercial audience:

```text
CUSTOMER_DISCOUNT  → customer
PROFESSIONAL_REWARD → professional
```

This prevents a single coupon from having contradictory financial meanings.

## 1. Customer discount flow

```text
Admin creates coupon
      ↓
Coupon code is distributed
      ↓
Customer enters code
      ↓
Validate audience / dates / service / amount / limits
      ↓
OfferClaim(status=claimed)
      ↓
Apply to eligible booking
      ↓
Booking stores locked offer snapshot + discount
      ↓
Online or cash payment succeeds
      ↓
Atomic OfferUsage redemption
      ↓
OfferClaim.redeemedCount += 1
      ↓
OfferClaim(status=redeemed)
```

Customer campaigns can target all services or selected services and support flat/percentage discounts, maximum discount, minimum booking amount, new-customer-only rules, global usage limits, per-customer usage limits, validity dates, and pause/active state.

## 2. Professional reward flow

Professional coupons are **not customer booking discounts**.

```text
Admin creates professional reward coupon
      ↓
Professional receives code
      ↓
Validate professional audience + assigned service + validity + limits
      ↓
Atomically reserve usage slot
      ↓
OfferClaim(status=redeemed, redeemedCount=1)
      ↓
Wallet credits are added
      ↓
CreditTransaction(source=coupon_reward)
      ↓
OfferUsage(paymentMode=REWARD)
```

Professional rewards currently use wallet credits and are one-time per professional. Service-specific professional rewards are matched against the professional's assigned `profession` service.

## 3. Offer model

Important fields:

- `couponCode` — unique normalized code.
- `offerTitle`, `description` — campaign information.
- `audience` — exactly one audience for new campaigns.
- `benefitType` — customer discount or professional reward.
- `serviceId[]` — empty means all services; selected IDs mean service-specific campaign.
- Customer: `discountType`, `discountValue`, `minBookingAmount`, `maxDiscount`.
- Professional: `rewardType=wallet_credits`, `rewardValue`.
- `startDate`, `endDate`.
- `usageLimit`, `usedCount`, `perUserLimit`.
- `newCustomerOnly` for customer campaigns.
- `isActive`, `archivedAt`.

Legacy records containing multiple audiences are normalized from `benefitType` during validation; new campaigns cannot create ambiguous audiences.

## 4. Claim vs redemption

```text
Claimed ≠ Redeemed
```

For customer coupons, claiming only associates the code with the user. The usage slot is consumed only after successful payment.

`OfferClaim.redeemedCount` is the per-user redemption counter. Payment redemption updates it atomically against the campaign's `perUserLimit`, so concurrent payments cannot bypass the per-user limit.

For professional wallet-reward coupons, claim and redemption happen together because the reward is granted immediately.

## 5. Limits and concurrency

Customer payment redemption and professional reward claiming use an atomic conditional increment for the global `usageLimit`.

Customer redemption also atomically increments `OfferClaim.redeemedCount` against `perUserLimit`.

This prevents concurrent requests from consuming the final global or per-user coupon slot at the same time.

## 6. Service targeting

```text
serviceId = []
    → all services

serviceId = [plumbingId]
    → plumbing only

serviceId = [plumbingId, electricalId]
    → plumbing or electrical
```

Customer booking validation uses the booking service. Professional reward validation uses the professional's assigned service.

## 7. Admin UX rules

The admin form explains each financial field:

- `₹200` is a valid flat discount.
- Percentage discounts are between 1 and 100.
- Maximum discount is only relevant to percentage coupons.
- Empty service selection means all services.
- Global usage is total successful redemption count.
- Per-user limit controls repeated customer usage.
- Professional rewards are wallet credits and are one-time.
- End date must be after start date.
- Active can be switched off to pause a campaign without deleting its history.

The form loads current services and allows selecting specific services.

## 8. Historical safety

Once a coupon is applied to a booking, the booking keeps a snapshot of the coupon's financial terms. Later admin changes do not alter the historical booking price.

Coupon code is immutable.

A redeemed campaign cannot be switched between customer discount and professional reward; create a new campaign when the commercial meaning needs to change.

## 9. Payment integration

Both online and cash final-payment flows call the same centralized customer coupon redemption service.

```text
Online FINAL payment ─┐
                      ├→ redeemCustomerCoupon()
Cash FINAL payment ───┘
```

The redemption records `OfferUsage`, increments `usedCount` atomically, increments the user's `redeemedCount`, and marks the `OfferClaim` as redeemed.
