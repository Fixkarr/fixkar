# Fixkar Coupon-Based Offer System

## Architecture rules

Fixkar uses **coupon-code-based campaigns**. Customers and professionals are not given a public list of every active offer. An eligible user receives a coupon code and enters it.

A coupon has exactly one commercial audience:

```text
CUSTOMER_DISCOUNT  → customer
PROFESSIONAL_REWARD → professional
```

This prevents one coupon from having contradictory financial meanings.

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
Booking price is finalized
      ↓
Apply coupon to eligible booking
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

A customer coupon cannot make the existing payment flow's payable amount zero. A future 100%/zero-pay campaign requires an explicit zero-payment payment path.

## 2. Professional reward flow

Professional coupons are **not customer booking discounts**.

```text
Admin creates professional reward coupon
      ↓
Professional receives code
      ↓
Validate professional audience + assigned service + account state + validity + limits
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

- `couponCode` — unique normalized code and immutable after creation.
- `offerTitle`, `description` — campaign information.
- `audience` — exactly one audience for new campaigns.
- `benefitType` — customer discount or professional reward.
- `serviceId[]` — empty means all services; selected IDs mean service-specific campaign.
- Customer: `discountType`, `discountValue`, `minBookingAmount`, `maxDiscount`.
- Professional: `rewardType=wallet_credits`, `rewardValue`.
- `startDate`, `endDate` — date-only admin input is interpreted in India Standard Time (IST), with the end date valid through 23:59:59.999 IST.
- `usageLimit`, `usedCount`, `perUserLimit`.
- `newCustomerOnly` for customer campaigns.
- `isActive`, `archivedAt`.

## 4. Claim vs redemption

```text
Claimed ≠ Redeemed
```

For customer coupons, claiming associates the code with the user. The usage slot is consumed only after successful payment.

`OfferClaim` is the user's campaign-level claim. It deliberately does **not** store a single `bookingId` because one claim may be redeemed on multiple eligible bookings when `perUserLimit > 1`.

Individual redemptions belong to `OfferUsage`, which stores the booking and financial snapshot for that redemption.

`OfferClaim.redeemedCount` is the per-user redemption counter. Payment redemption updates it atomically against `perUserLimit`, so concurrent payments cannot bypass the per-user limit.

For professional wallet-reward coupons, claim and redemption happen together because the reward is granted immediately.

## 5. Limits and concurrency

Customer payment redemption and professional reward claiming use an atomic conditional increment for the global `usageLimit`.

Customer redemption also atomically increments `OfferClaim.redeemedCount` against `perUserLimit`.

If the global slot cannot be reserved, the claim counter is rolled back inside the same transaction.

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

## 7. Booking and pricing safety

A customer coupon is applied only after the booking price is finalized (`isPriceLocked=true`). The coupon calculation uses the locked `totalAmount`, not a later-changing quote or visiting charge.

The booking keeps:

```text
offerId
offerCode
offerSnapshot
discountAmount
finalCustomerPayable
offerLocked
```

This prevents later admin edits from changing an already-applied booking's financial terms.

## 8. Admin update rules

Coupon code is immutable.

Once a coupon has claims, its commercial meaning and targeting cannot be changed:

- audience
- benefit type
- service targeting
- discount/reward terms
- new-customer restriction

Create a new campaign when those terms need to change. Operational controls such as active/paused state and campaign dates remain manageable.

## 9. Admin UX rules

The admin form explains each financial field:

- `₹200` is a valid flat discount.
- Percentage discounts are between 0 and 100, with a value greater than 0.
- Maximum discount is only relevant to percentage coupons.
- Empty service selection means all services.
- Global usage is total successful redemption count.
- Per-user limit controls repeated customer usage.
- Professional rewards are wallet credits and are one-time.
- End date must be after start date.
- Active can be switched off to pause a campaign without deleting its history.

The form loads current services and allows selecting specific services.

## 10. Historical and lifecycle safety

Coupon claims are campaign-level. Redemption history is stored in `OfferUsage`.

Once a coupon is applied to a booking, the booking keeps a snapshot of the coupon's financial terms. Later admin changes do not alter the historical booking price.

Archiving is preferred over deleting a campaign with claim/usage history.

## 11. Payment integration

Both online and cash final-payment flows call the same centralized customer coupon redemption service.

```text
Online FINAL payment ─┐
                      ├→ redeemCustomerCoupon()
Cash FINAL payment ───┘
```

The redemption records `OfferUsage`, increments `usedCount` atomically, increments the user's `redeemedCount`, and marks the `OfferClaim` as redeemed.

## 12. Reversal policy

`OfferUsage` supports `used` and `reversed` states so refund/cancellation handling can restore coupon accounting later. Any implementation that reverses a successful payment must reverse the coupon usage, financial discount accounting, and corresponding per-user/global counters in one transaction.

Until that reversal path is wired into every payment/refund endpoint, a successful coupon redemption must not be manually edited in the database.
