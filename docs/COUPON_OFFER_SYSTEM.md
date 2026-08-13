# Fixkar Coupon-Based Offer System

## Architecture rules

Fixkar uses **coupon-code-based campaigns**. Customers and professionals are not given a public list of every active offer. An eligible user receives a coupon code and enters it.

A coupon has exactly one commercial audience:

```text
CUSTOMER_DISCOUNT  → customer
PROFESSIONAL_REWARD → professional
```

This prevents one coupon from having contradictory financial meanings.

---

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

---

## 2. Professional milestone reward flow

Professional coupons are **not customer booking discounts**. A professional campaign is an enrollment mechanism for a milestone-based incentive.

```text
Admin creates professional campaign
      ↓
Professional receives campaign code
      ↓
Professional enters code
      ↓
Eligibility checks
      ↓
OfferClaim(status=claimed)
      ↓
NO wallet credit yet
      ↓
Professional completes eligible bookings
      ↓
Milestone engine runs after successful final payment
      ↓
Milestone reward unlocked once
      ↓
Wallet credit + CreditTransaction + OfferUsage
      ↓
Professional rank/badge recalculated
```

The code itself does **not** give free money merely for being entered.

### Example campaign

```text
PRO500

1 completed booking  → +500 credits → BRONZE
5 completed bookings → +1000 credits → SILVER
10 completed bookings → +2000 credits → DIAMOND
```

These are cumulative milestone rewards. Completing the 10-booking milestone does not replace the earlier rewards; each milestone is awarded once.

The campaign can be service-specific. For example, a plumbing professional can be targeted by selecting the Plumbing service.

### Claim baseline

When a professional joins a campaign, the system stores `startingCompletedBookings`.

This prevents old bookings from being counted retroactively. If a professional already has 5 completed bookings before joining, the campaign does not automatically pay the 1- and 5-booking rewards for historical work. Only milestones reached after enrollment are eligible.

---

## 3. Professional ranks and badges

Professional reputation/rank is based on verified completed bookings across the platform, independent of any particular coupon campaign.

```text
0 completed bookings   → NEWCOMER
1–4 completed bookings → BRONZE 🥉
5–9 completed bookings → SILVER 🥈
10+ completed bookings  → DIAMOND 💎
```

The rank is calculated by the backend when a booking reaches `completed` after successful final payment. It is never accepted from the frontend.

The professional profile exposes achievement data such as:

```text
achievements.completedBookings
achievements.rank
achievements.rankUpdatedAt
achievements.unlockedMilestones
achievements.unlockedRewardKeys
```

This lets the profile/dashboard show progress and motivate professionals to reach the next level.

---

## 4. Professional milestone model

Professional campaigns use:

- `rewardType = wallet_credits`
- `rewardTrigger = FIRST_COMPLETED_BOOKING` or `BOOKING_COUNT_MILESTONE`
- `milestones[]`

Each milestone contains:

```text
bookingCount
rewardCredits
badge
 title
```

Example:

```text
[
  { bookingCount: 1,  rewardCredits: 500,  badge: BRONZE },
  { bookingCount: 5,  rewardCredits: 1000, badge: SILVER },
  { bookingCount: 10, rewardCredits: 2000, badge: DIAMOND }
]
```

Milestone booking counts must be positive, unique, and increasing.

---

## 5. Claim vs redemption

```text
Claimed ≠ Redeemed
```

For customer coupons, claiming associates the code with the user. The usage slot is consumed only after successful payment.

`OfferClaim` is the user's campaign-level claim. It does not store one `bookingId`; individual redemptions belong to `OfferUsage`.

For professional milestone campaigns, `OfferClaim` stores:

```text
startingCompletedBookings
rewardedMilestones[]
redeemedCount
status
```

`rewardedMilestones` prevents the same milestone from being granted twice.

`OfferUsage` stores the actual milestone redemption with:

```text
bookingId
milestoneTarget
milestoneRank
rewardCredits
paymentMode=REWARD
```

---

## 6. Limits and concurrency

Customer payment redemption and professional campaign enrollment use atomic conditional increments for global limits.

Professional milestone unlocking uses an atomic claim update as the idempotency gate. MongoDB single-document writes are atomic when the expected current state is included in the update filter. Multi-document wallet/claim/usage changes are performed inside the existing payment transaction. citeturn1search1turn1search3

This prevents payment retries or duplicate completion callbacks from granting the same milestone twice.

---

## 7. Service targeting

```text
serviceId = []
    → all services

serviceId = [plumbingId]
    → plumbing only

serviceId = [plumbingId, electricalId]
    → plumbing or electrical
```

Customer booking validation uses the booking service. Professional reward validation uses the professional's assigned service.

---

## 8. Booking and pricing safety

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

---

## 9. Admin campaign creation

### Customer campaign

```text
Audience: Customer
Benefit: Customer Discount
Service: All or selected
Discount: Flat or Percentage
Minimum booking: optional
Maximum discount: percentage only
New customer only: optional
Global limit: optional
Per customer limit: configurable
```

### Professional campaign

```text
Audience: Professional
Benefit: Professional Reward
Reward: Wallet Credits
Trigger: Milestone
Service: All or selected
Milestones:
  1 booking  → ₹500 → Bronze
  5 bookings → ₹1000 → Silver
  10 bookings → ₹2000 → Diamond
Global enrollment limit: optional
Per professional: 1 campaign enrollment
```

The admin form explains that professional rewards are paid only after the corresponding completed-booking milestones. Entering a code alone never grants the milestone reward.

---

## 10. Admin update rules

Coupon code is immutable.

Once a coupon has claims, its commercial meaning and targeting should not be changed:

- audience
- benefit type
- service targeting
- discount/reward terms
- milestone structure
- new-customer restriction

Create a new campaign when those terms need to change. Operational controls such as active/paused state and campaign dates remain manageable.

---

## 11. Historical and lifecycle safety

Coupon claims are campaign-level. Redemption history is stored in `OfferUsage`.

Once a coupon is applied to a booking, the booking keeps a snapshot of the coupon's financial terms. Later admin changes do not alter the historical booking price.

Archiving is preferred over deleting a campaign with claim/usage history.

---

## 12. Payment integration

Both online and cash final-payment flows call the same centralized customer coupon redemption service and the same professional completion-reward service.

```text
Online FINAL payment ─┐
                      ├→ booking completion
Cash FINAL payment ───┘
                         ↓
                 professional credits
                         ↓
                  milestone engine
                         ↓
                    rank update
```

Professional milestone unlocks are emitted through Socket.IO after the transaction commits so the dashboard can refresh immediately.

---

## 13. Financial audit

Professional rewards create:

```text
Wallet credit
CreditTransaction
OfferUsage
```

Each milestone has a distinct reward source and target, making it auditable and idempotent.

Normal booking-completion credits remain separate from campaign milestone credits.

---

## 14. Existing-data migration

Existing professional achievement fields can be synchronized with actual completed bookings using:

```bash
npm run migrate:professional-achievements
```

The migration recalculates `completedBookings` and the Bronze/Silver/Diamond/Newcomer rank without changing booking history.

---

## 15. Current professional example

Admin creates:

```text
Coupon: PRO500
Title: Professional Growth Rewards
Audience: Professional
Reward: Wallet Credits
Trigger: Booking Count Milestone

1 booking  → 500 credits → Bronze
5 bookings → 1000 credits → Silver
10 bookings → 2000 credits → Diamond
```

Professional joins:

```text
PRO500
↓
Claimed
↓
0 credits from campaign yet
```

After first successful completed booking:

```text
+500 credits
Bronze badge
1/5 toward Silver
```

After fifth completed booking:

```text
+1000 credits
Silver badge
5/10 toward Diamond
```

After tenth completed booking:

```text
+2000 credits
Diamond badge
```

The rank is global to the professional's completed Fixkar bookings, while campaign milestone rewards are tied to the professional's specific campaign claim.

---

## 16. Reversal policy

`OfferUsage` supports `used` and `reversed` states. If a completed booking is later refunded/cancelled under a policy that reverses the professional milestone, the corresponding wallet credit, `CreditTransaction`, `OfferUsage`, and milestone state must be reversed together in one transaction.

Until that reversal path is wired into every applicable refund/cancellation endpoint, successful milestone rewards should not be manually edited in the database.
