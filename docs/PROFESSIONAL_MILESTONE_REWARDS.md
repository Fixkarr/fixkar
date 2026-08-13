# Fixkar Professional Milestone Reward System

## Purpose

Professional rewards are **milestone-based**, not instant wallet giveaways.

A professional may claim a campaign coupon such as `PRO500`, but claiming only enrolls the professional in the campaign. Credits are released only after the professional completes the configured business milestones.

## Example Campaign

```text
Coupon: PRO500
Audience: Professional

1 completed booking  → 500 credits → Bronze
5 completed bookings → 1,000 extra credits → Silver
10 completed bookings → 2,000 extra credits → Diamond
```

The rewards are incremental. Reaching 10 completed bookings does not replace the earlier rewards; each configured milestone is rewarded once.

## Flow

```text
Admin creates professional campaign
        ↓
Professional enters coupon code
        ↓
OfferClaim created
        ↓
No wallet credit yet
        ↓
Professional completes eligible booking
        ↓
Backend counts completed bookings
        ↓
Milestone reached?
        ↓
Credit wallet atomically
        ↓
Create CreditTransaction
        ↓
Create OfferUsage audit record
        ↓
Update professional rank/badge
```

## Milestone Configuration

Each professional campaign can contain ordered milestone tiers:

```text
milestones: [
  {
    bookingCount: 1,
    rewardCredits: 500,
    badge: "BRONZE"
  },
  {
    bookingCount: 5,
    rewardCredits: 1000,
    badge: "SILVER"
  },
  {
    bookingCount: 10,
    rewardCredits: 2000,
    badge: "DIAMOND"
  }
]
```

A milestone can only be unlocked once for a professional/campaign.

## Claim vs Reward

```text
Claim = enrollment in the campaign
Reward = successful completion of a milestone
```

This prevents a public coupon announcement from becoming an unconditional wallet giveaway.

## Completion Trigger

The milestone engine runs from the existing successful booking completion/payment flow. It is not controlled by the frontend.

A booking must reach:

```text
status = completed
```

and the normal payment/completion transaction must succeed before milestone rewards are evaluated.

## Service-Specific Campaigns

A professional campaign can optionally target selected services. The professional's primary service must match the campaign service scope before the milestone reward can be issued.

Empty service scope means all professional services.

## Rank System

Ranks are derived from verified completed bookings:

| Completed bookings | Rank |
|---:|---|
| 0–4 | Bronze |
| 5–9 | Silver |
| 10+ | Diamond |

The rank is stored in the professional profile for fast display, while completed booking count remains the authoritative source for recalculation.

The profile also stores unlocked milestone keys so reward processing is idempotent.

## Anti-Duplicate Protection

The system protects against duplicate rewards through:

- `OfferClaim.rewardedMilestones`
- `OfferUsage` milestone records
- unique `CreditTransaction` references
- transactional wallet updates
- backend-only milestone evaluation

A retried payment/completion request must not pay the same milestone twice.

## Global Enrollment Limit

For professional milestone campaigns, `usageLimit` means the maximum number of professionals who can **enroll/claim** the campaign.

Once enrolled, a professional can receive each configured milestone reward once, subject to the campaign's validity and eligibility rules.

## Example Professional Experience

```text
PRO500

Claimed ✓

Progress
1 / 10 completed bookings

🥉 Bronze
✓ 1 booking → +500 credits

🔒 Silver
5 bookings → +1,000 credits

🔒 Diamond
10 bookings → +2,000 credits
```

After the 5th completion:

```text
🥈 Silver Professional

+1,000 credits unlocked
```

After the 10th:

```text
💎 Diamond Professional

+2,000 credits unlocked
```

## Business Value

The platform pays incentives only after measurable business outcomes occur:

```text
Professional action
      ↓
Completed customer work
      ↓
Successful payment/settlement
      ↓
Milestone reached
      ↓
Reward
```

This makes professional rewards an activation/retention mechanism rather than a free-credit distribution system.
