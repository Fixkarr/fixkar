# Fixkar User Roles and Permissions

## Overview

Fixkar has three primary types of platform users:

1. Visitor
2. Customer
3. Professional

The AI assistant must understand the difference between these roles because the features available to a user depend on whether the user is authenticated and whether the user is operating as a customer or professional.

The AI should never tell a user that they can perform an action unless that action is available to their current role and authentication state.

---

# 1. Visitor

A visitor is a person who is browsing Fixkar without being authenticated as a customer or professional.

A visitor can explore the public parts of the platform.

## What a Visitor Can Do

A visitor can:

- Explore what Fixkar offers
- Explore available service categories
- Discover publicly visible professionals
- View professional profiles and publicly available profile information
- Understand how Fixkar works
- Learn about the services provided through the platform
- Explore the platform before deciding to register or log in

## What a Visitor Cannot Do

A visitor cannot use authenticated customer functionality.

A visitor cannot:

- Chat with a professional through Fixkar
- Call a professional through authenticated platform functionality
- Hire a professional
- Create a customer booking that requires authentication
- Access the customer dashboard
- View private customer information
- Access their bookings or payment history
- Use customer-only platform actions

If a visitor wants to perform an authenticated action, they must first register or log in as a customer.

## Visitor Registration and Login

A visitor may register and then log in to Fixkar.

Registration changes the user's access level only after authentication and the appropriate account flow is completed.

The AI should distinguish between:

```text
Visitor
  ↓
Can explore public platform information

Visitor
  ↓
Register / Login
  ↓
Authenticated Customer
  ↓
Customer features become available
```

If a visitor asks how to hire, chat with, or call a professional, the AI should explain that authentication is required before those actions can be used.

---

# 2. Customer

A customer is an authenticated Fixkar user who uses the platform to find and hire service professionals.

Customers are users who need services and want to connect with suitable professionals.

## Customer Capabilities

An authenticated customer can:

- Search for professionals
- Search using service requirements
- Search using location
- Find professionals relevant to their service requirement
- View professional profiles
- View available professional information
- Chat with professionals through the platform
- Call professionals through available platform functionality
- Hire professionals
- Create service bookings
- Send pickup requests to professionals when the relevant feature is available
- Track bookings
- View booking information from the customer dashboard
- Manage their service requests
- Make applicable payments
- View relevant payment information
- Rate professionals
- Review professionals after eligible services

## Professional Discovery

Customers can discover professionals according to their requirements.

Important search factors can include:

- Service
- Location
- Professional skills
- Professional profile
- Availability
- Other relevant professional information supported by Fixkar

For example:

```text
Customer
   ↓
Select Service
   ↓
Provide / Use Location
   ↓
Search Professionals
   ↓
View Profiles
   ↓
Choose a Professional
```

If a customer asks the AI to find an actual professional, the AI must use a backend tool to retrieve live professional data rather than inventing a professional.

---

# 3. Customer Communication with Professionals

Authenticated customers can communicate with professionals through supported Fixkar communication features.

This can include:

- Chat
- Calling
- Other communication functionality implemented by the platform

A visitor does not receive these authenticated communication capabilities simply by viewing a professional profile.

The AI should therefore check the user's authentication state before describing an authenticated communication action as immediately available.

---

# 4. Customer Hiring and Booking

A customer can hire a professional for an applicable service provided by that professional.

A simplified flow is:

```text
Customer
   ↓
Find Professional
   ↓
View Profile
   ↓
Review Service / Skill Information
   ↓
Communicate if Required
   ↓
Hire / Send Request
   ↓
Booking / Service Request
   ↓
Professional Response
   ↓
Service
```

Customers can also send pickup requests where the relevant Fixkar functionality supports them.

The AI should not assume that every professional provides every service. It should rely on the professional's actual skills, services, and profile data when answering specific questions.

---

# 5. Customer Dashboard

Authenticated customers have access to their customer dashboard.

The dashboard is the customer's area for managing their Fixkar activity.

A customer can use the booking section to track their bookings and review relevant booking information.

Examples of customer questions include:

- "Show my bookings."
- "What is the status of my booking?"
- "Do I have any active bookings?"
- "What happened to my service request?"

These are user-specific questions.

The AI should not answer them from static knowledge. It must use authorized backend tools to retrieve the customer's actual data.

---

# 6. Professional

A professional is a user who provides services to customers through Fixkar.

Professionals use the platform to showcase their skills, receive service opportunities, manage bookings, provide services, receive payments, and build their reputation.

Professionals are different from customers because their primary purpose on the platform is to provide services rather than hire service providers.

---

# 7. How a Professional Registers on Fixkar

A working professional who wants to provide services through Fixkar can register as a professional and complete the professional onboarding process.

The registration and onboarding journey is important because a professional does not become an approved service provider immediately after creating an account. The professional must complete verification and wait for admin approval before accessing the approved professional workflow.

## Step 1 — Create a Fixkar Account

The professional first needs to register on Fixkar.

They can create an account using the normal registration process by providing:

- Name
- Email
- Password

Where supported, the professional can also register using Google authentication.

Google registration/login is recommended when available because it provides a convenient authentication experience.

The simplified flow is:

```text
Professional
    ↓
Register with Name + Email + Password
          OR
    Continue with Google
    ↓
Account Created
```

The AI should explain the registration method that is actually available in the current Fixkar application.

---

## Step 2 — Verify Mobile Number

After registration, the professional must verify their mobile phone number.

Fixkar uses an OTP-based verification process for mobile verification.

The flow is:

```text
Registration
    ↓
Enter Mobile Number
    ↓
Receive OTP
    ↓
Enter OTP
    ↓
Mobile Number Verified
```

The professional should complete mobile verification before continuing with the professional onboarding process.

If a user asks how to verify their mobile number, the AI should explain the OTP process rather than suggesting that verification can be skipped.

---

## Step 3 — Start Professional Onboarding

After successful mobile verification, the professional can start the onboarding process.

The onboarding process collects important identity and profile information required to proceed with professional verification.

The professional should provide accurate information.

The onboarding information includes:

- Name
- Professional/service category selection
- Address
- Date of birth
- Profile picture
- Identity document

---

## Step 4 — Enter Professional Information

During onboarding, the professional provides their basic information.

### Name

The professional provides their name.

### Professional

The professional selects the relevant professional/service category according to the services they want to provide through Fixkar.

### Address

The professional enters their address.

The address flow can involve typing the address and selecting an appropriate suggestion from the available address suggestions.

The professional should provide an accurate address because location information can be important for professional discovery and service availability.

### Date of Birth

The professional provides their date of birth as required by the onboarding process.

---

## Step 5 — Upload a Profile Picture

The professional must provide a clear profile picture.

The profile picture should:

- Be clear and recognizable
- Clearly show the professional's face
- Be suitable for use as a professional profile image

A recognizable profile picture helps customers identify the professional when viewing their profile.

The AI should advise the professional to upload a clear image in which their face can be recognized.

---

## Step 6 — Submit Identity Document

The professional must provide an identity document as required by the onboarding process.

Supported identity documents can include documents such as:

- Aadhaar
- PAN
- Driving Licence
- Other supported identity documents

The professional should upload a valid document and ensure that the information is clear and readable.

The purpose of this step is to support the professional verification process.

The AI should not promise approval merely because a document has been uploaded. The submitted information and documents must first be reviewed by Fixkar's admin/verification process.

---

## Step 7 — Submit Onboarding Application

After completing the required onboarding information and uploading the required documents, the professional submits the onboarding application.

The flow becomes:

```text
Account Registration
        ↓
Mobile OTP Verification
        ↓
Professional Onboarding
        ↓
Basic Information
        ↓
Professional Selection
        ↓
Address
        ↓
Date of Birth
        ↓
Clear Profile Picture
        ↓
Identity Document
        ↓
Submit Onboarding
```

---

## Step 8 — Pending Approval Screen

After the onboarding information is submitted, the professional may see a pending/approval status screen.

This means the application has been submitted and is waiting for admin review.

The professional should not assume that they are already an approved professional at this stage.

The flow is:

```text
Onboarding Submitted
        ↓
Pending Approval
        ↓
Admin Reviews Application / Documents
```

---

## Step 9 — Wait for Admin Approval

The professional must wait for the Fixkar admin team to review and approve the submitted information and documents.

Approval can take **up to 24 hours** according to the current Fixkar onboarding guidance.

The professional should wait for the approval process to complete rather than repeatedly submitting the same application.

The AI should communicate the expected waiting period carefully and should not guarantee approval within an exact time.

A useful explanation is:

> Your onboarding application is under admin review. Approval may take up to 24 hours, so please wait for the verification process to complete.

---

## Step 10 — Professional Dashboard After Approval

After the professional's application and documents are approved, the professional can proceed to the approved professional workflow and access the relevant dashboard.

The flow becomes:

```text
Pending Approval
       ↓
Admin Approval
       ↓
Professional Dashboard
```

The professional can then start completing and improving their professional profile.

---

## Step 11 — Complete the Professional Profile

After approval, the professional can continue with the profile completion process.

The professional can improve their profile by adding relevant information such as:

- Skills
- Services
- Service charges
- Work gallery
- Availability
- Other supported professional profile information

A complete profile can help customers understand the professional's capabilities and can improve the professional's chances of receiving suitable booking opportunities.

The professional journey after approval is:

```text
Admin Approval
      ↓
Professional Dashboard
      ↓
Complete Profile
      ↓
Add Skills / Services
      ↓
Define Charges
      ↓
Upload Work Gallery
      ↓
Set Availability
      ↓
Ready for Professional Activity
```

---

# 8. Professional Profile

Professionals can improve their profile to increase the chances of customers choosing them.

A professional can enhance their profile by providing useful and accurate information about their services and experience.

Professional profile information can include:

- Profile information
- Professional skills
- Specialized services
- Service charges
- Work gallery
- Availability
- Other relevant professional information supported by Fixkar

A complete and informative profile helps customers understand what the professional offers.

The AI should never invent profile information. When answering about a specific professional, it should use actual professional data.

---

# 9. Professional Skills and Services

Professionals can define the skills and services they provide.

A professional's available services should be based on their configured skills and supported service categories.

Professionals can also define charges for applicable skills or services where the platform supports service-specific pricing.

Example:

```text
Professional
   ↓
Select Skill / Service
   ↓
Define Applicable Charge
   ↓
Service Appears on Professional Profile
```

The AI should not assume that a professional can perform a service unless their profile or live Fixkar data confirms it.

---

# 10. Professional Work Gallery

Professionals can upload images of their previous work to their profile gallery where the platform supports this functionality.

The gallery helps customers understand the type and quality of work a professional has performed.

The AI can explain the purpose of the work gallery, but it should not claim that a specific image or project belongs to a professional unless that information is available from the platform data.

---

# 11. Professional Availability

Professionals can manage their availability.

A professional can mark days on which they are busy or unavailable.

When a professional marks a day as busy, the platform can use that information to prevent or restrict booking requests for that day according to the implemented booking logic.

Conceptually:

```text
Professional
   ↓
Availability Calendar
   ↓
Mark Day as Busy
   ↓
Professional unavailable for applicable booking requests
```

The AI should use live availability data when a customer asks whether a specific professional is available on a particular date.

Static knowledge cannot determine current availability.

---

# 12. Professional Booking Requests

Professionals can receive booking or service requests from customers.

Depending on the type of request, a professional may be able to:

- View the request
- Accept the request
- Decline the request
- Manage the booking
- Handle pickup-related requests where supported
- Track booking progress

The exact available action depends on the booking state and the platform's implemented workflow.

The AI should not tell a professional that an action is available if the current booking state does not allow it.

---

# 13. Professional Earnings and Wallet

Professionals can use Fixkar's payment-related features to manage their earnings.

Professional financial functionality can include:

- Receiving payments through Fixkar
- Managing their wallet
- Tracking earnings
- Viewing relevant earning information
- Managing applicable withdrawal-related activity supported by the platform

The AI can explain general wallet and earning concepts using knowledge.

However, questions such as:

- "How much money is in my wallet?"
- "What are my earnings?"
- "Did I receive payment for this booking?"
- "Can I withdraw this amount?"

require live, authenticated professional data and should be answered through authorized backend tools.

The AI must never guess financial information.

---

# 14. Professional Ratings and Reviews

Customers can rate and review professionals after eligible services.

Ratings and reviews contribute to the professional's reputation on the platform.

Professionals can receive customer ratings and reviews as part of their service history.

For a specific professional's current rating or reviews, the AI should retrieve actual Fixkar data rather than generating or estimating it.

---

# 15. Professional Journey After Approval

Once a professional completes onboarding and receives the required admin approval, they can continue setting up their professional presence on Fixkar.

A simplified journey is:

```text
Registration
    ↓
Mobile OTP Verification
    ↓
Professional Onboarding
    ↓
Identity / Document Submission
    ↓
Admin Approval
    ↓
Professional Dashboard
    ↓
Complete Profile
    ↓
Add Skills and Services
    ↓
Define Charges
    ↓
Upload Work Gallery
    ↓
Set Availability
    ↓
Receive Booking Opportunities
    ↓
Accept / Manage Bookings
    ↓
Provide Services
    ↓
Receive Earnings
    ↓
Build Ratings and Reputation
```

The exact steps can evolve as Fixkar's implementation changes.

---

# 16. Role Comparison

| Capability | Visitor | Customer | Professional |
|---|---|---|---|
| Explore Fixkar | Yes | Yes | Yes |
| Explore services | Yes | Yes | Yes |
| View public professional profiles | Yes | Yes | Yes |
| Register / Login | Yes | Yes | Yes |
| Search professionals | Public exploration only | Yes | According to supported platform functionality |
| Chat with professionals | No | Yes | Yes, where supported |
| Call professionals | No | Yes | Yes, where supported |
| Hire professionals | No | Yes | No, professional provides services |
| Create customer bookings | No | Yes | No |
| Track customer bookings | No | Yes | No |
| Receive booking requests | No | No | Yes |
| Accept / decline professional requests | No | No | Yes |
| Manage professional skills | No | No | Yes |
| Define professional charges | No | No | Yes |
| Upload work gallery | No | No | Yes |
| Manage professional availability | No | No | Yes |
| Manage professional wallet | No | No | Yes |
| Track professional earnings | No | No | Yes |
| Receive customer ratings | No | No | Yes |

The table describes the intended role-level capabilities. Individual actions must still be validated by the backend and the current state of the user's account.

---

# 17. Authentication and Authorization Rules for AI

The AI assistant must distinguish between a public visitor and an authenticated user.

For customer-specific or professional-specific information, authentication is required.

The AI should follow this principle:

```text
Public Question
      ↓
Knowledge

Authenticated User Question
      ↓
Identify User Role
      ↓
Check Authorization
      ↓
Use Appropriate Tool
      ↓
Return Allowed Data
```

For example:

```text
Visitor:
"Can I chat with this professional?"

Answer:
Authentication is required before using the platform's customer communication feature.
```

```text
Authenticated Customer:
"Show me my bookings."

AI
 ↓
Customer booking tool
 ↓
Authenticated user's data
 ↓
Answer
```

```text
Authenticated Professional:
"Show me my earnings."

AI
 ↓
Professional earnings tool
 ↓
Authenticated professional's data
 ↓
Answer
```

The AI must never use a tool to expose another user's private information.

---

# 18. Role-Aware AI Responses

The AI should consider the user's role when deciding how to answer.

For example, if a customer asks:

> "How can I receive booking requests?"

The AI should explain the professional journey rather than pretending that a customer can receive professional requests.

If a professional asks:

> "How do I find an electrician for my home?"

The AI should treat the user as a customer for that service need only if the platform supports switching or the relevant customer functionality is available. It should not automatically assume that every professional account has customer capabilities without checking the actual account model and authorization rules.

---

# 19. What the AI Must Not Assume

The AI must not assume:

- Every visitor is a customer
- Every registered user is an approved professional
- Every professional is available on every date
- Every professional provides every service
- Every service is available in every location
- Every professional can accept a booking at any time
- A booking is successful just because a user requested it
- A payment is successful without payment data confirming it
- A professional is verified without verification data
- A user can access another user's account information

When real data is required, the AI should use authorized backend tools.

---

# 20. Knowledge vs Live Data

This document explains the role system and general permissions.

It does not contain live user data.

For example, this knowledge can answer:

```text
"What can a professional do on Fixkar?"
```

But it cannot answer:

```text
"How many bookings do I have today?"
```

The second question requires a backend tool and live database information.

The architecture is:

```text
General Role / Platform Question
          ↓
     Fixkar Knowledge
          ↓
       Gemini
          ↓
       Response
```

```text
User-specific / Live Question
          ↓
      Gemini Intent
          ↓
       AI Tool
          ↓
   Backend Authorization
          ↓
        MongoDB
          ↓
      Actual Data
          ↓
        Gemini
          ↓
       Response
```

---

# 21. Source of Truth

This file describes Fixkar's intended user roles and role-based platform capabilities based on the current project knowledge and implementation.

The backend remains the final authority for authentication, authorization, account status, booking state, availability, financial data, and other live application state.

The AI must follow backend authorization and must not override application rules.