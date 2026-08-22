# Fixkar Booking System

## Purpose

This document explains how bookings work on the Fixkar platform.

The AI Assistant must understand the complete booking lifecycle so that it can explain booking-related processes to users correctly.

The AI must also understand the difference between:

- General booking questions
- User-specific booking questions
- Direct professional hire
- Pickup-based professional search
- Fixed-price bookings
- Inspection-based bookings
- Booking status
- Payment and quote flow

Most importantly, the AI must never invent or assume the current state of a user's booking.

General booking knowledge can be answered from this document.

Actual booking information must come from the live Fixkar backend.

---

## 1. What Is a Booking?

A booking represents a customer's request for a service through Fixkar.

A booking connects information such as:

- Customer
- Professional
- Service
- Task/skill
- Work date
- Work time
- Problem description
- Work address
- Contact information
- Pricing
- Payment
- Booking status
- Review

The booking database model stores these details.

A simplified relationship is:

```text
Customer
   ↓
Service
   ↓
Task / Skill
   ↓
Professional
   ↓
Booking
   ↓
Service Work
   ↓
Payment
   ↓
Completion
   ↓
Review
```

---

## 2. Authentication Requirement

Booking-related operations are authenticated.
The booking routes use Fixkar's authentication middleware.
Therefore, a visitor cannot directly create or manage authenticated bookings.
The basic flow is:

```text
Visitor
   ↓
Register / Login
   ↓
Authenticated User
   ↓
Booking Features
```

The AI should not tell an unauthenticated visitor that they can directly create a booking if authentication is required.

---

## 3. Main Booking Types

Fixkar currently supports two important ways of creating a service request:

- **Direct Hire**
- **Pickup / Professional Search**

The difference is whether the customer already selected a particular professional.

---

## 4. Direct Hire

A direct hire happens when the customer already knows which professional they want to hire.
The customer selects a professional and creates a booking request for that professional.
The flow is:

```text
Customer
   ↓
Find Professional
   ↓
View Professional Profile
   ↓
Select Service / Task
   ↓
Select Date & Time
   ↓
Enter Problem Description
   ↓
Enter Work Address
   ↓
Create Booking
   ↓
Professional Receives Request
```

The backend identifies a direct hire when a `professionalId` is supplied with the booking request.

---

## 5. Direct Hire Validation

Before creating a direct-hire booking, the backend validates important information.
The service date and time must be valid.
The requested service time must also be in the future.
The backend does not simply trust the frontend's date/time information.
The professional must exist.
The professional must have an associated profession/service.
If a task is selected, the task must:

- Exist
- Be active
- Belong to the selected service
- Be offered by the selected professional for direct hire

Therefore:

```text
Customer selects Task
       ↓
Backend verifies Task
       ↓
Task belongs to Service?
       ↓
Task active?
       ↓
Professional offers Task?
       ↓
Booking allowed
```

If validation fails, the booking is rejected.

---

## 6. Booking Date and Time

A booking contains:

- `workDate`
- `workTime`

The backend expects a valid service date and time.
The requested service time must be in the future.
Therefore, the AI should not tell a customer that they can create a booking for a past time.
The general flow is:

```text
Customer
   ↓
Select Future Date
   ↓
Select Future Time
   ↓
Create Booking
```

---

## 7. Problem Description

The customer can provide a description of the problem they need help with.
For example, a customer may explain:

> "My kitchen tap is leaking."

or describe the work that needs to be performed.
This information becomes part of the booking request and helps the professional understand the customer's requirement.

---

## 8. Audio Description

The booking API also supports audio messages.
Customers can attach audio files as part of the booking problem description.
The backend uploads supported audio files to cloud storage and stores their URLs with the booking.
The AI should understand that a booking can contain both:

- Text Problem Description
- Audio Description

---

## 9. Customer Location and Work Address

A booking contains the work address.
For pickup-based bookings, the customer's latitude and longitude are also important because the platform uses location to find suitable nearby professionals.
The pickup flow uses:

- Customer Latitude
- Customer Longitude

to identify nearby professionals.
The AI must not claim that a particular professional is nearby without checking actual location/search data.

---

## 10. Service and Task in a Booking

A booking can contain:

- `service`
- `task`

The service represents the broader service category.
The task represents the specific skill/work selected under that service.
Conceptually:

```text
Service
   ↓
Task / Skill
   ↓
Booking
```

The AI must remember that services and skills are dynamic.
It must not invent service names or tasks.
The current service and task data should come from the backend.

---

## 11. Pricing Types

Fixkar bookings can use different pricing workflows.
The booking model supports:

- `inspection`
- `fixed`

as pricing types.
The AI must understand that not every booking has a fixed upfront price.

---

## 12. Fixed Pricing

For a fixed-price task, the price can be determined before the service begins.
The backend checks the task's pricing configuration.
Pricing can come from:

- Admin
- Professional

depending on the task configuration.
For direct hire, when the required pricing information is available, the backend calculates the applicable service and visiting charges.
The resulting amount can be locked.
Conceptually:

```text
Task
   ↓
Fixed Pricing
   ↓
Service Charge
   ↓
Visiting Charge
   ↓
Total Amount
   ↓
Price Locked
```

The AI must never invent the fixed price.

---

## 13. Professional-Defined Pricing

Some tasks can use professional-defined pricing.
In this case, the professional's configured price for that specific task is used.
For direct hire:

```text
Customer
   ↓
Professional
   ↓
Selected Task
   ↓
Professional's Task Price
   ↓
Visiting Charge
   ↓
Total Amount
```

If the professional has not configured a price for the selected task, the backend can reject the booking request.
The AI should not create or estimate a price.

---

## 14. Inspection Pricing

Inspection-based bookings are different from fixed-price bookings.
The exact work price may not be known before the professional assesses the problem.
Therefore, the AI should not tell a customer that an inspection-based task always has a fixed upfront price.
The workflow can involve:

```text
Booking
   ↓
Professional Visits
   ↓
Problem Assessment
   ↓
Quote
   ↓
Customer Payment / Confirmation
```

The exact behavior must follow the current backend booking/payment implementation.

---

## 15. Visiting Charge

The booking system also supports a visiting charge.
For some services, the visiting charge can depend on the professional and service configuration.
For non-specialized service flows, the backend can calculate the visiting charge from distance.
For specialized services, the professional's configured visiting charge can be used.
Therefore:

```text
Service Type
      ↓
Specialized?
   /       \
 Yes        No
 ↓           ↓
Professional Distance-based
Visiting    Visiting
Charge      Charge
```

The AI should not calculate or invent a visiting charge for a user unless the actual backend data confirms it.

---

## 16. Creating a Direct Booking

The direct booking process can be represented as:

```text
Customer
   ↓
Select Professional
   ↓
Select Service
   ↓
Select Task
   ↓
Select Date
   ↓
Select Time
   ↓
Enter Problem Description
   ↓
Enter Work Address
   ↓
Optional Audio Description
   ↓
Backend Validation
   ↓
Price Calculation
   ↓
Create Booking
   ↓
Notify Professional
```

After the booking is created, the professional receives the booking request.

---

## 17. Professional Notification

When a direct booking is successfully created, the backend sends the professional a booking notification.
The platform can notify the professional through:

- Application notification
- Push notification
- Socket.IO real-time event
- WhatsApp notification where configured

The customer also receives real-time booking updates through the application.
The AI should understand that booking creation can trigger real-time notifications.

---

## 18. Initial Booking Status

The booking model supports several statuses.
The default booking status is:

- `pending`

A newly created direct booking request is therefore initially pending the professional's response.
Conceptually:

```text
Booking Created
      ↓
pending
```

---

## 19. Professional Accepts Booking

The professional can accept a pending booking.
The backend verifies that:

- The authenticated user is a professional
- The booking belongs to that professional
- The booking is currently pending

Only then can the booking become:

- `accepted`

Flow:

```text
pending
   ↓
Professional Accepts
   ↓
accepted
```

The customer receives a booking-accepted notification/update.
The AI must not tell a customer that their booking has been accepted unless the actual booking status confirms it.

---

## 20. Professional Rejects Booking

A professional can reject a booking request.
The booking can move into:

- `rejected`

The booking can also contain a rejection message.
The AI should use the actual booking data when explaining why a specific booking was rejected.
It should never invent a rejection reason.

---

## 21. Customer Cancels Booking

Customers can cancel their booking where the current booking state and platform rules allow cancellation.
The booking supports:

- `cancelled`

as a status.
The booking also stores a cancellation type:

- `free`
- `late`

The AI should not promise that every cancellation is free.
If a user asks about the cancellation of a specific booking, the AI should check the actual booking state and applicable backend/payment information.

---

## 22. Professional Reaches Customer Location

After a booking has been accepted, the professional can mark that they have reached the customer's location.
The backend only allows this action when the booking status is:

- `accepted`

When the professional marks the booking as reached:

```text
accepted
   ↓
Professional Reaches Location
   ↓
OTP Generated
   ↓
reached
```

The system generates a reached OTP.
The customer receives the relevant notification.

---

## 23. Reached OTP

The reached OTP is used to verify the professional's arrival.
The OTP is generated when the professional marks the booking as reached.
The OTP has an expiration period.
The backend also limits invalid OTP attempts.
The professional must provide the correct OTP to complete the arrival verification.
The AI should never generate or guess an OTP.
If a user asks:

> "What is my reached OTP?"

this is private live booking information and must come from an authenticated backend tool.

---

## 24. OTP Verification

The OTP can only be verified after the booking has reached the:

- `reached`

state.
The backend checks:

- Booking exists
- Authenticated user is the correct professional
- Booking status is reached
- OTP exists
- OTP has not expired
- Invalid attempt limit has not been exceeded
- Submitted OTP matches

After successful verification:

```text
reached
   ↓
OTP Verified
   ↓
in-progress
```

The booking also records the start time.

---

## 25. In-Progress Booking

Once the reached OTP is successfully verified, the booking becomes:

- `in-progress`

This means the professional has reached the customer and the service work has started according to the implemented workflow.
Conceptually:

```text
accepted
   ↓
reached
   ↓
OTP Verification
   ↓
in-progress
```

The AI should use the actual booking status when explaining the current state of a booking.

---

## 26. Quote Amount

For bookings where the price is not locked upfront, the professional can send a quote amount.
The booking stores:

- `quoteAmount`
- `quoteSentAt`

The professional cannot send a quote through this flow if the booking already has a locked upfront price.
Conceptually:

```text
Inspection / Unlocked Price
        ↓
Professional Assesses Work
        ↓
Professional Sends Quote
        ↓
Customer Receives Quote
```

The AI should never invent a quote.
If the user asks:

> "What quote did the professional send me?"

the AI needs actual booking data.

---

## 27. Pickup Booking

Fixkar also supports a pickup-style booking flow.
Pickup booking is used when the customer does not directly select one specific professional.
Instead, the platform searches for suitable nearby professionals.
The flow is:

```text
Customer
   ↓
Select Service
   ↓
Select Task
   ↓
Provide Location
   ↓
Provide Date & Time
   ↓
Create Pickup Request
   ↓
Find Eligible Professionals
```

---

## 28. Finding Eligible Professionals

The pickup system uses the customer's location and requested work information to find eligible professionals.
The matching process considers factors such as:

- Service
- Task
- Work date
- Customer location
- Professional eligibility
- Distance

The backend searches within a configured radius and then calculates actual road distance for the matched professionals.
The system sorts the results by distance and selects the nearest suitable professionals.
The current implementation selects up to five nearest professionals for the pickup request flow.
The AI must not invent which professionals will receive a pickup request.

---

## 29. Pickup Session

A pickup booking creates a pickup session.
The pickup session represents the customer's active search for a suitable professional.
Conceptually:

```text
Customer
   ↓
Pickup Request
   ↓
Pickup Session
   ↓
Searching
```

The current implementation gives the professional request a limited expiry window.
The AI should use live pickup-session data when answering questions about an active pickup search.

---

## 30. Pickup Requests to Professionals

The system creates pickup requests for eligible professionals.
Each request contains information such as:

- Customer
- Service
- Task
- Distance
- Work date
- Work time
- Work address
- Problem description
- Pricing information
- Customer location

Professionals receive pickup requests through the platform's notification/realtime system.
The pickup request is time-sensitive.

---

## 31. Pickup Pricing

For pickup bookings, the professional is not known at the beginning.
Therefore, professional-specific pricing cannot always be finalized before matching.
The backend can calculate an estimated total for each candidate professional using:

```text
Task Price
   +
Visiting Charge
   =
Total Amount
```

The calculation can also include platform commission and professional receivable information.
The AI must not present these calculations as a final customer charge unless the actual booking/payment data confirms the amount.

---

## 32. Pickup Professional Acceptance

A pickup request is sent to eligible professionals.
The system can receive responses from professionals.
Once a suitable professional is selected/assigned, the pickup flow can proceed toward an actual booking.
The AI should distinguish between:

- Searching
- Professional Assigned

A customer asking:

> "Has a professional been assigned?"

requires live pickup/booking data.

---

## 33. Booking Assignment

The booking model supports an assignment status.
The supported assignment states include:

- `searching`
- `assigned`
- `expired`
- `cancelled`

This is separate from the normal booking status.
Therefore:

- Booking Status
- Assignment Status

should not be treated as the same thing.
For example:

```text
Booking Status
      ↓
pending / accepted / reached / etc.

Assignment Status
      ↓
searching / assigned / expired / cancelled
```

The AI should use the correct field when answering status-related questions.

---

## 34. Booking Status Lifecycle

The booking model currently supports these booking statuses:

- `pending`
- `accepted`
- `reached`
- `in-progress`
- `rejected`
- `completed`
- `cancelled`
- `searching`

A typical direct-hire lifecycle is:

```text
pending
   ↓
accepted
   ↓
reached
   ↓
in-progress
   ↓
completed
```

Alternative outcomes include:

```text
pending
   ↓
rejected
```

or:

```text
pending / accepted / in-progress
   ↓
cancelled
```

The exact transition depends on the current backend action and booking state.
The AI must never assume that every booking follows exactly one path.

---

## 35. Booking Completion

A completed booking has the status:

- `completed`

The booking also stores completion information such as:

- `completedAt`

Once a booking is completed, the customer can use the applicable review flow.
The AI should not say that a booking is completed unless the actual booking data confirms:

```text
status = completed
```

---

## 36. Reviews After Booking

The booking can reference a review.
After eligible service completion, the customer can submit a review.
The general flow is:

```text
Service Completed
      ↓
Booking Completed
      ↓
Customer Can Review
      ↓
Review Associated With Booking
```

The AI should not invent a review or rating.
For a specific professional's current rating or a user's submitted review, live platform data is required.

---

## 37. Payments and Booking

Booking is connected with the payment system.
The booking can contain payment-related information such as:

- `currentPaymentId`

and financial values such as:

- `serviceCharge`
- `totalAmount`
- `professionalReceivable`
- `quoteAmount`
- `finalCustomerPayable`
- `discountAmount`

The AI should understand that booking and payment are connected but are not the same thing.
A booking existing does not automatically mean that payment has succeeded.

---

## 38. Payment Verification

The booking routes include payment operations such as:

- `create-order`
- `verify-payment`
- `confirm-cash-payment`

Therefore, when a customer asks:

> "Is my payment successful?"

the AI must check actual payment/booking data.
It must not infer payment success simply because:

```text
Booking = accepted
```

or:

```text
Booking = completed
```

Payment state must come from the payment system.

---

## 39. Coupons and Offers

The booking model also stores offer information.
A booking can contain:

- Offer ID
- Offer code
- Offer snapshot
- Discount amount
- Final customer payable amount
- Offer lock state

The purpose of the snapshot is to preserve the commercial terms associated with the booking.
Therefore, if a user asks:

> "Which coupon did I use?"

or:

> "How much discount did I get?"

the AI should retrieve the actual booking data.
It must not calculate or guess the discount.

---

## 40. Customer Booking Dashboard

Customers can retrieve their bookings through the authenticated booking system.
The platform provides a:

- `my-bookings`

endpoint for retrieving the user's bookings.
Therefore, when a customer asks:

> "Show my bookings."

the AI should eventually use a customer-booking tool.
The flow should be:

```text
Customer
   ↓
AI
   ↓
Booking Tool
   ↓
Authenticated User ID
   ↓
Backend
   ↓
Customer's Bookings
   ↓
AI
   ↓
Response
```

The AI must never return another customer's bookings.

---

## 41. Specific Booking Details

The platform also supports retrieving an individual booking.
Therefore, questions such as:

- "What is the status of booking ABC?"
- "What date is my booking?"
- "What professional accepted my booking?"
- "What amount is associated with my booking?"

are live-data questions.
The AI should retrieve the specific booking after authentication and authorization.

---

## 42. Booking Cancellation

Cancellation is a state-changing action.
If the AI eventually gets a booking-cancellation tool, it must not immediately cancel a booking merely because the user mentions cancellation.
The AI should first understand the user's intent.

For example:

**User:**
> "Can I cancel my booking?"
*(This is an informational question.)*

**User:**
> "Cancel my booking."
*(This is an action request.)*

The second request requires:

```text
AI
 ↓
Identify Booking
 ↓
Verify User Authorization
 ↓
Check Booking State
 ↓
Check Cancellation Rules
 ↓
Execute Cancellation Tool
```

The AI should never simulate a cancellation without actually calling the backend.

---

## 43. Booking Acceptance Is an Action

Similarly:

> "Professional ko booking accept karne bolo."

and:

> "Has the professional accepted my booking?"

are completely different requests.
The first may require an action or communication tool.
The second requires live booking status.
The AI must understand the difference between:

- Information Request
- Action Request

---

## 44. Booking-Related Notifications

Booking updates can be communicated through real-time application events and notifications.
Examples include:

- Booking Created
- Booking Accepted
- Professional Reached
- Booking Updated
- Booking Status Updated

The AI can explain that Fixkar uses notifications for booking updates.
However, if the user asks:

> "Did my professional accept the booking?"

the AI should check the actual booking state instead of assuming that the notification was delivered.

---

## 45. Important Booking Rules for AI

The AI must follow these rules:

- **Rule 1 — Never invent booking status:** Always use actual booking data for user-specific status.
- **Rule 2 — Never invent professional assignment:** Check live assignment/booking data.
- **Rule 3 — Never invent prices:** Use actual pricing information.
- **Rule 4 — Never invent quote amounts:** Retrieve the actual quote.
- **Rule 5 — Never invent payment status:** Use payment/booking data.
- **Rule 6 — Never invent OTP:** OTP is private and temporary information.
- **Rule 7 — Never expose another user's booking:** Booking information must be protected by authentication and authorization.
- **Rule 8 — Do not confuse booking status with assignment status:** They are separate fields.
- **Rule 9 — Do not assume every booking is fixed-price:** Some bookings use inspection-based pricing.
- **Rule 10 — Do not assume every booking is direct hire:** Fixkar also supports pickup-based professional search.
- **Rule 11 — Do not claim a professional is available without live data:** Availability depends on actual professional data and booking conditions.
- **Rule 12 — Do not execute state-changing actions without authorization:** Actions such as cancellation, acceptance, or other booking changes must use authorized backend tools.

---

## 46. Knowledge Questions vs Live Booking Questions

The AI should separate general knowledge from user-specific information.

### General Knowledge
Example:
> "What is a Fixkar booking?"

The AI can answer using this documentation.

### Live Booking Information
Example:
> "What is the status of my booking?"

The AI needs:

```text
Booking Tool
   ↓
Backend
   ↓
Database
```

### Action Request
Example:
> "Cancel my booking."

The AI needs:

```text
Understand Intent
      ↓
Identify Booking
      ↓
Authorization
      ↓
Check Booking State
      ↓
Cancellation Tool
      ↓
Backend
      ↓
Updated Booking
      ↓
AI Response
```

---

## 47. Future Booking Tools for AI

To make the AI genuinely useful, the assistant should eventually have dedicated booking tools.
Possible tools include:

- `getMyBookings()`
- `getBookingById(bookingId)`
- `getBookingStatus(bookingId)`
- `createBooking(...)`
- `cancelBooking(bookingId)`
- `getBookingQuote(bookingId)`
- `getBookingPaymentStatus(bookingId)`
- `getPickupStatus(pickupSessionId)`

These are examples of tool responsibilities.
The actual implementation must follow the existing backend APIs and authorization rules.

---

## 48. AI Booking Architecture

The final AI architecture should work approximately like this:

```text
                     User
                       ↓
                    Gemini
                       ↓
                 Understand Intent
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
        General Question    Live / Action
              ↓                 ↓
        Knowledge Files       AI Tool
                                  ↓
                            Backend API
                                  ↓
                              MongoDB
                                  ↓
                            Actual Data
                                  ↓
                                Gemini
                                  ↓
                               User
```

For example:

**User:**
> "What is a booking?"
```text
        ↓
booking.md
        ↓
Gemini
        ↓
Answer
```

But:

**User:**
> "Show my pending bookings."
```text
        ↓
Gemini
        ↓
Booking Tool
        ↓
Authenticated Backend
        ↓
MongoDB
        ↓
Actual Customer Bookings
        ↓
Gemini
        ↓
Answer
```

---

## 49. Complete Direct-Hire Flow

The complete direct-hire flow can be summarized as:

```text
Customer
    ↓
Authenticated
    ↓
Find Professional
    ↓
Select Professional
    ↓
Select Service
    ↓
Select Task
    ↓
Select Future Date & Time
    ↓
Enter Problem Description
    ↓
Enter Work Address
    ↓
Optional Audio Description
    ↓
Backend Validation
    ↓
Validate Professional
    ↓
Validate Service
    ↓
Validate Task
    ↓
Validate Professional's Task
    ↓
Calculate Pricing
    ↓
Create Booking
    ↓
status = pending
    ↓
Professional Notified
    ↓
Professional Accepts
    ↓
status = accepted
    ↓
Professional Reaches
    ↓
OTP Generated
    ↓
status = reached
    ↓
OTP Verified
    ↓
status = in-progress
    ↓
Service Work
    ↓
Quote / Payment where applicable
    ↓
Service Completed
    ↓
status = completed
    ↓
Customer Review
```

---

## 50. Complete Pickup Flow

The pickup flow can be summarized as:

```text
Customer
    ↓
Authenticated
    ↓
Select Service
    ↓
Select Task
    ↓
Select Date & Time
    ↓
Provide Location
    ↓
Create Pickup Request
    ↓
Find Eligible Professionals
    ↓
Calculate Distance
    ↓
Sort by Distance
    ↓
Select Nearest Suitable Professionals
    ↓
Create Pickup Session
    ↓
Send Pickup Requests
    ↓
Professional Responses
    ↓
Professional Assignment
    ↓
Booking Flow
```

The current pickup implementation searches eligible professionals within its configured matching radius, calculates road distance, sorts them by distance, and sends requests to the nearest selected professionals.

---

## 51. Booking Status Summary

The current booking model supports:

- `pending`
- `accepted`
- `reached`
- `in-progress`
- `rejected`
- `completed`
- `cancelled`
- `searching`

A common lifecycle is:

```text
pending
   ↓
accepted
   ↓
reached
   ↓
in-progress
   ↓
completed
```

Possible alternative outcomes include:

```text
pending
   ↓
rejected
```

or:

```text
pending
   ↓
cancelled
```

or:

```text
accepted
   ↓
cancelled
```

The actual allowed transition depends on the backend action and current booking state.

---

## 52. Assignment Status Summary

Assignment status is separate from booking status.
Current assignment states include:

- `searching`
- `assigned`
- `expired`
- `cancelled`

This is particularly important for pickup-based professional matching.
The AI should never use assignment status as if it were the normal booking status.

---

## 53. Final Rule for the AI

The most important principle is:

> **Core Principle:** Static knowledge explains how Fixkar bookings work. Live backend data tells the AI what is happening with a user's actual booking.

Therefore:

```text
General Booking Question
        ↓
booking.md
        ↓
Gemini
        ↓
Answer
```

while:

```text
User-Specific Booking Question
        ↓
Gemini
        ↓
Booking Tool
        ↓
Authenticated Backend
        ↓
MongoDB
        ↓
Actual Booking Data
        ↓
Gemini
        ↓
Answer
```

And for actions:

```text
User Intent
    ↓
Authorization
    ↓
Validate Booking
    ↓
Execute Backend Tool
    ↓
Confirm Result
    ↓
Respond to User
```

The AI must never pretend that an action succeeded when the backend has not confirmed it.
