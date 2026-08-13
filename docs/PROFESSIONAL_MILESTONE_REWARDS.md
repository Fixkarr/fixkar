# Fixkar Professional Milestone Reward System

## Purpose

Professional milestone rewards are **not coupons and are not promotional offers**. A professional never enters a coupon code and never manually claims a milestone reward.

The platform automatically evaluates milestones after a real booking is successfully completed. Rewards are credited to the professional wallet only when the milestone is achieved.

Customer coupon architecture remains separate and unchanged.

## Fixed Milestones

The current platform rules are:

```text
1 completed booking  → +500 credits → Bronze
5 completed bookings → +1,000 extra credits → Silver
10 completed bookings → +2,000 extra credits → Diamond
```

Rewards are incremental. Reaching 10 completed bookings does not remove the earlier rewards.

The milestone definitions are controlled by the application, not by the customer-coupon admin form.

## Flow

```text
Professional completes a booking
        ↓
Backend marks booking completed
        ↓
Successful payment/settlement is confirmed
        ↓
Milestone engine counts completed bookings
        ↓
New milestone reached?
        ↓
Atomic one-time reward gate
        ↓
Wallet credit + CreditTransaction
        ↓
Professional achievements/rank updated
        ↓
Dashboard/profile shows progress and badge
```

There is no `OfferClaim`, coupon code, or customer `OfferUsage` involved in this professional milestone flow.

## Rank / Badge

Rank is an achievement indicator, not a wallet feature and not an admin-configurable reward type.

| Completed bookings | Rank |
|---:|---|
| 0 | NEWCOMER |
| 1–4 | BRONZE |
| 5–9 | SILVER |
| 10+ | DIAMOND |

The rank is stored on the professional profile for fast display. The completed booking count remains the source used to recalculate it.

Example profile:

```text
💎 Diamond Professional
10 completed bookings
```

## Reward Safety

Each milestone can reward a professional only once. The reward gate is performed on the backend and inside the same transaction as the booking completion/payment flow.

The system uses the professional achievement milestone list plus the credit transaction ledger to prevent duplicate wallet credits when completion/payment handling is retried.

## Eligibility

A professional must be an approved and onboarded professional to receive milestone rewards.

Only bookings whose backend status is `completed` are counted. Creating, accepting, starting, cancelling, or merely paying for a booking does not independently unlock a milestone.

## Service / Campaign Scope

Professional milestones are platform-wide fixed achievements. They are not created as service-specific coupons and are not configured per campaign.

## Customer Coupon Separation

Customer coupons continue to use the existing Offer/Coupon architecture:

```text
Customer enters coupon
        ↓
Validate coupon
        ↓
Claim/apply
        ↓
Booking/payment
        ↓
OfferUsage
```

Professional milestone rewards do not modify this flow.

## Business Value

```text
Professional action
      ↓
Completed customer work
      ↓
Successful settlement
      ↓
Milestone reached
      ↓
Automatic reward
      ↓
Higher rank / stronger profile trust
```

This turns professional rewards into a measurable activation and retention mechanism instead of an unconditional wallet-credit giveaway.
