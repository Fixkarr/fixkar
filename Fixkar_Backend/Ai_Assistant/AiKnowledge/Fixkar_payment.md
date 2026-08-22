# Fixkar Payment Knowledge

## AI PURPOSE

This document teaches the AI Assistant how to understand customer
questions related to payments and respond using the correct payment flow.

The AI must first identify:
1. What is the customer asking?
2. Which payment scenario does the question belong to?
3. What information is actually available?
4. What can be confidently answered?
5. What must NOT be assumed?

---

# 1. PAYMENT INTENT DETECTION

When a customer asks anything related to money, payment, charges,
fees, refund, cancellation, wallet, earnings or payout, classify the
question into one of the following intents.

## Intent: FINAL_SERVICE_PAYMENT

Customer is asking about:
- final payment
- service payment
- how much they have to pay after work
- payment after professional completes work
- quote payment
- remaining payment
- online payment for completed/in-progress service

Example questions:
- "Mujhe final payment kab karna hai?"
- "Service complete hone ke baad payment kaise karu?"
- "Mera final bill kitna hai?"
- "Professional ko payment kab milegi?"

AI response direction:
Explain that final payment is available after the service starts
and the booking is in `in-progress` status.

Do not provide an exact amount unless the booking data contains the
actual payable amount.

---

## Intent: PAYMENT_METHOD

Customer is asking:
- payment kaise karna hai?
- online payment kaise hoga?
- Razorpay kya hai?
- payment fail ho gayi
- payment verify kaise hoti hai?

AI response direction:
Explain the available payment flow supported by the platform.

Do not claim a payment method is supported unless it exists in the
actual system.

---

## Intent: LATE_CANCELLATION_PAYMENT


3. FINAL PAYMENT FLOW
Final payment can be created only when:


Customer owns the booking

Booking is in-progress

Booking is not cancelled

Booking is not rejected

Booking is not already completed

Required quote/price information is available
The system determines the payable amount from booking data.
Possible calculation paths:

Fixed/Locked Price
totalAmount

Quote Based Price
quoteAmount + visitingCharge

Offer Locked
If an applicable offer is locked, the system can use:
finalCustomerPayable
and the corresponding discountAmount.
AI must never calculate an exact final payable amount from assumptions.

Use the actual booking/payment data when available.
4. FINAL PAYMENT RESULT
After successful Razorpay verification:


Payment becomes paid

Payment mode becomes ONLINE

Booking becomes completed

Professional earning is calculated

Professional wallet is credited

Wallet transaction is created

Platform transaction is created

Customer/professional booking state is updated

Professional receives notification
Therefore, if a customer asks:
"Payment karne ke baad kya hoga?"
AI should explain that successful final payment completes the booking

and the professional's eligible earnings are credited to their wallet.
5. LATE CANCELLATION FLOW
Late cancellation occurs when the customer cancels after the

professional has started the visit.
Customer liability:
₹50 + visitingCharge
Example:
If visiting charge = ₹100:
Customer pays:
₹100 + ₹50 = ₹150
The payment is recorded as:
paymentType = CANCEL
and:
reason = LATE_CANCELLATION_FEE
After successful payment verification:


Booking becomes cancelled
cancellationType = late

Professional receives the applicable settlement in wallet

Wallet transaction is created

Platform transaction is created
6. NORMAL CANCELLATION
For the customer-facing cancellation state currently implemented:


Booking is cancelled

No cancellation charge is applied
AI must NOT describe normal cancellation as a paid cancellation

unless the booking is actually identified as late cancellation.
7. PROFESSIONAL COMMISSION & EARNING
For FINAL payment:
commission = grossAmount × applicableCommissionPercentage / 100
professionalAmount = grossAmount - commission
The applicable commission comes from the professional's profession

configuration.
AI should not guess the percentage.
If customer asks:
"Fixkar kitna commission leta hai?"
AI should answer only if the applicable commission information is

available.
8. LATE CANCELLATION PROFESSIONAL SETTLEMENT
For a late cancellation:
fullAmount = visitingCharge + ₹50
Commission is calculated on the visiting charge.
The professional receives:
visitingCharge - commissionOnVisiting + ₹50
Therefore the ₹50 late cancellation fee is included in the

professional's settlement.
9. PROFESSIONAL WALLET
Professional wallet maintains:

pendingBalance
totalEarned
totalWithdrawn
cashPlatformFeeDue

withdrawal request information
Successful service/cancellation settlement increases the

professional's wallet balance.
AI should explain wallet balance separately from actual bank payout.
10. PROFESSIONAL WITHDRAWAL
Withdrawal requirements:


Professional must have verified bank details.

Wallet must exist.

Minimum withdrawal amount is ₹100.

Requested amount must be within withdrawable balance after

applicable cashPlatformFeeDue adjustment.
Flow:
Professional requests withdrawal

↓

Request marked pending

↓

Admin sees request

↓

Admin manually transfers money

↓

Admin records UTR + payment mode

↓

Wallet debit transaction created

↓

Professional wallet balance reduced

↓

Withdrawal marked completed

↓

Professional notified
11. IMPORTANT: CUSTOMER VS PROFESSIONAL QUESTIONS
The AI must determine who the question is about.

Customer perspective
"Professional ko mere payment mein se kitna milega?"
→ Explain professional earning/commission.

Professional perspective
"Mere wallet se bank mein paise kaise aayenge?"
→ Explain withdrawal/payout.

Customer perspective
"Main booking cancel karu to paise lagenge?"
→ Determine whether cancellation is normal or late.

Customer perspective
"Professional aa gaya tha aur maine cancel kar diya."
→ Explain late cancellation.
12. AMOUNT SAFETY RULE
AI MUST NOT invent payment amounts.
If the customer asks:
"Kitna payment karna hai?"
AI should check available booking/payment information.
If actual amount is available:
→ Tell the exact amount.
If actual amount is unavailable:
→ Explain that the payable amount depends on the booking's

confirmed price/quote/visiting charge and ask the customer to

provide/open the booking details.
Never manufacture an amount.
13. PAYMENT STATUS QUESTIONS
If customer asks:
"Mera payment hua ya nahi?"
AI should distinguish:


Payment created

Payment pending

Payment paid

Payment already processed

Payment failed/verification failed
The AI should use actual payment status when available.
It must not say "payment successful" merely because the customer

says they completed the Razorpay screen.
Backend verification determines successful payment.
14. PAYMENT ANSWER STYLE
Payment answers should be:


Short

Clear

Customer-friendly

Hinglish when appropriate

Based on actual booking/payment data

Never speculative
Preferred structure:


Direct answer

Relevant rule

Amount, only if known

What happens next
Example:
Customer:

"Professional visit karne ke baad booking cancel kar di to?"
AI:
"Is situation mein cancellation late cancellation maana jayega.

Aapko ₹50 late cancellation fee + professional ki visiting charge

pay karni hogi. Payment successful hone ke baad booking cancelled

mark hogi aur professional ko applicable settlement mil jayega."
15. WHAT AI MUST NOT CLAIM
AI must NOT claim:


Refund exists unless supported by booking/payment data

Automatic professional payout

Instant bank transfer

Exact commission percentage without data

Exact final price without booking data

Cancellation fee for every cancellation

That every payment is refundable

That payment is successful without verified payment status
16. QUICK INTENT → RESPONSE MAP
Customer asksIntentAI should explain"Final payment kab karna hai?"FINAL_SERVICE_PAYMENTService starts/in-progress ke baad"Final payment kitna hai?"FINAL_SERVICE_PAYMENTActual booking payable amount"Payment kaise karu?"PAYMENT_METHODSupported payment process"Payment successful hua?"PAYMENT_STATUSActual payment status"Cancel karne par charge lagega?"CANCELLATIONNormal vs late cancellation"Professional aa gaya tha, cancel kar diya"LATE_CANCELLATION_PAYMENT₹50 + visiting charge"Professional ko mere paise kaise milenge?"PROFESSIONAL_EARNINGCommission ke baad wallet earning"Professional payout kaise leta hai?"PROFESSIONAL_PAYOUTWallet → withdrawal → admin → bank"Minimum withdrawal kitna hai?"PROFESSIONAL_PAYOUT₹100"Fixkar commission kitna leta hai?"PROFESSIONAL_EARNINGApplicable profession commission"Mera payment fail ho gaya"PAYMENT_STATUSPayment verification/status
17. CORE AI RULE
The AI should NOT answer payment questions merely by matching the

word "payment".
It must understand the user's intent.
For example:
"Payment kitna hai?"

→ FINAL_SERVICE_PAYMENT
"Payment professional ko kab milega?"

→ PROFESSIONAL_EARNING
"Professional ko bank mein paise kaise milenge?"

→ PROFESSIONAL_PAYOUT
"Cancel karne par payment dena padega?"

→ CANCELLATION
"Professional aa gaya tha phir maine cancel kiya."

→ LATE_CANCELLATION_PAYMENT
"Payment successful hua?"

→ PAYMENT_STATUS
The AI should select the most specific applicable intent before

generating the response.