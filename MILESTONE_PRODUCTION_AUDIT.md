# Fixkar Professional Milestone Production Audit

## Scope

This audit covers only the professional milestone/reward flow. Payment, booking, authentication, and unrelated modules are intentionally outside the scope unless they directly trigger milestone completion.

## Major risks addressed

### 1. Historical reward over-crediting
The completion handler previously attempted to backfill every missing milestone up to the current rank. That was unsafe for stale or migrated accounts because one completion event could issue multiple historical rewards.

**Resolution:** a normal completion event can unlock only the milestone whose `requiredBookings` exactly equals the new completed-booking count. Existing reward transactions and reward keys remain idempotency guards.

### 2. Duplicate reward protection
Milestone rewards are protected by:

- `achievements.unlockedMilestones`
- `achievements.unlockedRewardKeys`
- `CreditTransaction` source lookup
- atomic `findOneAndUpdate` claim before wallet credit

This prevents a retry from crediting the same milestone twice.

### 3. Frontend/backend milestone drift
The professional achievement card previously contained a second hard-coded milestone table. That could diverge from backend rules.

**Resolution:** the card now uses persisted `professionalRank` next-milestone metadata. It does not calculate booking thresholds or reward amounts itself.

### 4. Incorrect highest-rank display
Missing/stale next-milestone metadata previously could be interpreted as reaching the highest rank.

**Resolution:** the UI only shows `Diamond 5 / Highest rank` when the canonical rank is actually `DIAMOND 5` and there is no next tier. Missing metadata is shown as a synchronization state instead.

### 5. Incorrect migration rank rules
`migrateProfessionalAchievements.js` contained obsolete thresholds (`1 = Bronze`, `5 = Silver`, `10 = Diamond`) that did not match the current milestone system.

**Resolution:** the migration now imports `getProfessionalRankProgress()` from the canonical milestone utility and synchronizes both `achievements` and `professionalRank` without issuing rewards.

## Current canonical progression

- `0` completed bookings → `NEWCOMER`
- `1` → `BRONZE 2`
- `3` → `BRONZE 3`
- `6` → `BRONZE 4`
- `10` → `BRONZE 5`
- `15` → `SILVER 1`
- `20` → `SILVER 2`
- `25` → `SILVER 3`
- `30` → `SILVER 4`
- `35` → `SILVER 5`
- `40` → `GOLD 1`
- `45` → `GOLD 2`
- `50` → `GOLD 3`
- `55` → `GOLD 4`
- `60` → `GOLD 5`
- `65` → `PLATINUM 1`
- `70` → `PLATINUM 2`
- `75` → `PLATINUM 3`
- `80` → `PLATINUM 4`
- `85` → `PLATINUM 5`
- `90` → `DIAMOND 1`
- `95` → `DIAMOND 2`
- `100` → `DIAMOND 3`
- `105` → `DIAMOND 4`
- `110` → `DIAMOND 5`

## Existing data reconciliation

The migration command is available as:

```bash
npm run migrate:professional-achievements
```

Run it once against the intended testing/staging database first. It recalculates completed bookings and rank metadata only; it does **not** issue historical milestone credits.

## Testing checklist

- First completed booking: rank becomes Bronze 2 and first milestone reward is issued once.
- Retrying the same completion: no duplicate milestone reward.
- Normal non-milestone completion: rank/progress updates, but no milestone reward is issued.
- Cash completion and online completion both use the same reward utility.
- `completedBookings` updates before milestone calculation.
- UI updates from the existing socket event after transaction commit.
- UI celebration occurs only when `rewards` contains an actual unlocked milestone.
- Diamond 5 is the only state displayed as highest rank.
- Existing professionals with stale rank metadata can be reconciled without issuing historical rewards.
