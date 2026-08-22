# Fixkar Platform Knowledge

This document is the general platform knowledge used by the Fixkar AI Assistant.

It explains what Fixkar is, who can use it, what each user type can do, how the platform generally works, and what the AI should know before answering general Fixkar-related questions.

> This file contains general platform knowledge. It is not a source of live user-specific data. Real-time information such as a customer's bookings, a professional's current availability, current payment status, or a specific professional's live profile must be retrieved through authorized backend tools.

---

## 1. What is Fixkar?

Fixkar is a technology-enabled service marketplace developed to connect customers with verified service professionals for home repair, maintenance, renovation, construction, and related services.

The platform is designed to make it easier for people to discover suitable professionals, understand the services they offer, communicate with professionals, create and manage bookings, make applicable payments, and complete the service journey through one platform.

Fixkar also helps professionals build an online presence, showcase their skills and work, receive service requests, manage bookings, manage earnings, and grow their customer base.

The platform is under active development, so services, features, workflows, and business rules may evolve over time.

---

## 2. The Main User Types on Fixkar

Fixkar has three important user experiences:

1. Visitor
2. Customer
3. Professional

These roles have different permissions and responsibilities.

---

## 3. Visitor

A visitor is a person who is exploring the Fixkar platform without being authenticated as a customer or professional.

A visitor can explore the public parts of the platform and understand what Fixkar offers.

### Visitor can:

- Explore Fixkar and understand the platform
- Explore available services
- Browse available professional listings where the public interface allows it
- View professional profiles and publicly available professional information
- Understand how Fixkar works
- Explore platform features
- Learn about service categories
- Explore the general service discovery experience

### Visitor cannot use authenticated actions

A visitor cannot use protected customer or professional actions that require authentication.

For example, a visitor cannot directly use protected communication or hiring actions such as:

- Chat with a professional
- Call a professional through protected platform features
- Hire a professional
- Create protected bookings
- Access a customer dashboard
- Access customer booking history
- Access customer-specific payment information
- Perform professional-only actions

If a visitor attempts an authenticated action, the platform can require the person to register or log in first.

The important concept is:

```text
Visitor
   ↓
Explore Fixkar
   ↓
Find useful information
   ↓
Login / Register
   ↓
Authenticated features become available
```

A person may already have an account but still needs to be authenticated in the current session before protected actions are available.

---

## 4. Customer

A customer is an authenticated Fixkar user who needs a service and wants to find and hire a professional.

Customers are the users who consume services through the platform.

### Customer can:

- Register on Fixkar
- Log in to Fixkar
- Explore available services
- Search for professionals
- Discover professionals based on their service requirement
- Find professionals according to location and other relevant filters supported by the platform
- View professional profiles
- View professional skills and service information
- View applicable professional pricing information
- View available public profile information
- Chat with professionals through platform communication features
- Call professionals through available platform communication features
- Hire professionals
- Create or send service requests
- Send pickup requests where supported by the platform
- Create and manage bookings
- Track bookings from the booking section of the customer dashboard
- View booking-related information
- Make applicable payments
- Track payment-related information where supported
- Rate professionals
- Review professionals
- Manage their customer account

### Customer dashboard

The customer dashboard is the authenticated area where customers can manage their activity on Fixkar.

A customer can use the dashboard to access areas such as:

- Bookings
- Profile/account information
- Service-related activity
- Payment-related information where supported
- Other customer-specific features provided by Fixkar

The booking section is especially important because customers can track their service requests and bookings there.

---

## 5. Professional

A professional is an authenticated user who provides a service to customers through Fixkar.

Examples include service professionals such as:

- Electricians
- Plumbers
- Carpenters
- Painters
- Masons
- Labour professionals
- Civil and renovation professionals
- AC professionals
- RO-related service professionals
- Other service providers supported by Fixkar

The exact service catalogue can grow as the platform evolves.

---

## 6. How a Professional Joins Fixkar

A working professional who wants to provide services through Fixkar can register as a professional and complete the professional onboarding process.

The general journey is:

```text
Working Professional
        ↓
Professional Registration
        ↓
Complete Onboarding
        ↓
Submit Required Information / Documents
        ↓
Wait for Admin Review
        ↓
Admin Verifies Application
        ↓
Approval
        ↓
Complete / Enhance Professional Profile
        ↓
Start Receiving Opportunities on Fixkar
```

Professional approval is important because Fixkar uses a verification process before a professional becomes an approved service provider on the platform.

The AI should not claim that a specific professional is verified unless the live platform data confirms the person's verification status.

---

## 7. Professional Onboarding and Profile Completion

After approval, a professional can complete and improve their profile so customers can better understand their capabilities.

A strong professional profile can help communicate:

- Who the professional is
- What services they provide
- Which skills they have
- Which specialised services they can perform
- What charges or pricing they define
- What type of work they have completed
- Their experience and capabilities as represented by the platform
- Their availability
- Their portfolio/work gallery
- Their ratings and reviews

The profile is important because customers use professional information to decide whom they want to contact or hire.

Professionals should keep their information accurate and up to date.

---

## 8. Professional Skills and Charges

Professionals can define the skills and services they offer.

They can also define applicable charges or pricing for the services/skills supported by the platform.

This information helps customers understand what a professional can offer before requesting or hiring the professional.

The AI should use live professional/profile data for a specific professional's current skills or charges rather than inventing those details.

---

## 9. Professional Work Gallery

Professionals can upload a work gallery to showcase their completed or relevant work.

The gallery helps customers visually understand the professional's experience and quality of work.

The AI can explain the purpose of the gallery, but it should not invent details about the contents of a professional's gallery.

---

## 10. Professional Availability

Professionals can manage their availability through the platform.

A professional can mark days on which they are busy or unavailable.

When a professional marks a day as busy, the platform can treat that day as unavailable for receiving applicable booking requests according to the current implementation.

Conceptually:

```text
Professional Calendar
        ↓
Available Day → Can receive applicable requests
Busy Day      → Should not receive applicable new requests for that day
```

The exact availability rules are controlled by the application implementation.

For a specific professional's current availability, the AI should retrieve live data through a backend tool rather than relying on this static knowledge file.

---

## 11. Professional Booking and Service Requests

Professionals can receive service requests and booking requests from customers.

Depending on the platform flow, a professional can:

- Receive a booking/request
- Review the request
- Accept a request
- Decline a request
- Pick up applicable bookings or service requests
- Manage current bookings
- Track booking activity
- Complete the requested service

A professional's real booking list or request list is live application data and must be retrieved from the backend when the AI needs to answer a specific question.

---

## 12. Professional Earnings and Wallet

Fixkar provides professionals with functionality for managing earnings through the platform.

Professionals can:

- Receive payments through Fixkar where supported by the booking/payment workflow
- Manage their wallet
- Track earnings
- Monitor their booking-related income
- Review applicable earning information

The wallet and earnings areas are sensitive and user-specific.

The AI must never invent a professional's wallet balance, earnings, transaction amount, or payment status.

For such questions, the AI must use an authenticated backend tool.

---

## 13. Professional Ratings and Reviews

Professionals can receive customer ratings and reviews after service interactions where the platform supports them.

Ratings and reviews help customers evaluate professional reputation and experience.

The AI can explain the purpose of ratings and reviews, but for a specific professional's actual rating, review count, or review content, the AI should retrieve the real information from the platform data.

---

## 14. Core Service Categories

Fixkar is designed to support multiple service categories.

The repository documentation and public project description currently identify examples such as:

- Electrician
- Plumber
- Carpenter
- Painter
- Mason
- Labour
- Civil and renovation services
- AC services
- RO services

The service catalogue can be extended in the future.

The AI should not state that a service is currently available unless the platform's current service data or trusted knowledge confirms it.

---

## 15. Finding Professionals

The customer can search for suitable professionals according to their service requirement and supported discovery options.

Relevant factors can include:

- Service/category
- Location
- Professional skills
- Professional profile
- Availability
- Pricing or charges
- Ratings and reviews
- Other supported platform filters

The general discovery flow is:

```text
Customer Need
     ↓
Select Service
     ↓
Provide / Use Location
     ↓
Search Professionals
     ↓
Review Professional Profiles
     ↓
Compare Relevant Information
     ↓
Contact / Hire
```

If a user asks the AI to find actual professionals, the AI should use a professional-search tool backed by Fixkar data.

The AI must not fabricate professional names, locations, availability, prices, ratings, or profiles.

---

## 16. Professional Communication

Authenticated customers can communicate with professionals through supported platform communication features.

This can include:

- Chat
- Call
- Other platform communication mechanisms that may be added later

Visitors who are not authenticated cannot use protected customer-to-professional communication features.

The AI can explain this rule as a general platform concept.

---

## 17. Hiring a Professional

An authenticated customer can hire a professional for a service supported by the professional and the platform.

A simplified journey is:

```text
Customer
   ↓
Search Service / Professional
   ↓
View Professional Profile
   ↓
Review Relevant Information
   ↓
Contact Professional if needed
   ↓
Hire / Send Service Request
   ↓
Booking / Request Created
   ↓
Professional Action
   ↓
Service Journey
```

Hiring is an authenticated action and should not be represented as available to anonymous visitors.

If a user asks the AI to actually hire someone or create a booking, the AI must use an approved backend tool and enforce authentication and authorization before any protected action is performed.

---

## 18. Pickup Requests

Customers can send pickup requests to professionals where the relevant feature is enabled by Fixkar.

A pickup request is a service/request interaction that can be accepted and handled by professionals according to the application's workflow.

Because the actual availability and status of pickup requests are dynamic, the AI should use the appropriate backend tool when a user asks about a current pickup request.

---

## 19. Booking Management for Customers

Customers can track their bookings from the booking section of the customer dashboard.

Booking information can include details such as:

- Service
- Professional
- Booking/request status
- Schedule
- Service information
- Payment-related information
- Other booking-specific information stored by the platform

The AI should use a booking-related backend tool for current or user-specific booking questions.

Example:

```text
User:
"What is the status of my booking?"

AI
 ↓
Recognize booking-status intent
 ↓
Call authorized booking-status tool
 ↓
Get live Fixkar data
 ↓
Explain result to user
```

The AI must never guess a booking status.

---

## 20. Payments and Service Payments

Fixkar includes payment-related functionality as part of the service journey.

The platform supports payment handling connected to service bookings and professional earnings.

Payment workflows may include applicable charges, security/payment mechanisms, professional payments, and wallet/earnings management.

The AI should explain only payment rules that are confirmed by trusted Fixkar knowledge.

For live questions such as:

- "Did my payment succeed?"
- "What is my transaction status?"
- "How much is in my wallet?"
- "Where is my refund?"

use an authorized backend tool to retrieve the actual data.

---

## 21. Ratings, Reviews, and Trust

Customer ratings and reviews help build trust between customers and professionals.

A customer's decision to hire a professional can be influenced by:

- Skills
- Services
- Charges
- Availability
- Work gallery
- Ratings
- Reviews
- Other profile information

The AI should provide only trustworthy information available from the platform.

---

## 22. Admin and Platform Management

Fixkar also has an administrative side that manages the platform.

Admin capabilities documented in the project include areas such as:

- Customer management
- Professional management
- Professional verification
- Service management
- Booking management
- Payment/platform transaction management
- Revenue information
- Offers
- Forms
- Bank details
- Announcements
- Withdrawal requests
- Complaints and dispute handling
- Platform monitoring and health

The AI assistant is not an unrestricted replacement for the admin panel.

Admin-only operations must remain protected and should only be exposed through explicitly approved backend tools with proper authorization.

---

## 23. Authentication and Access Control

Fixkar distinguishes between public exploration and authenticated platform actions.

The important access model is:

```text
Visitor
   ↓
Public / exploratory features

Authenticated Customer
   ↓
Customer features

Authenticated Professional
   ↓
Professional features
```

The AI must respect the same access boundaries.

If the user is not authenticated, the AI should not expose private customer or professional information.

If a requested action requires authentication, the AI should guide the user to log in or register before continuing.

---

## 24. What a Visitor Can and Cannot Do

### Visitor can:

- Explore Fixkar
- Explore available services
- View professional profiles where publicly exposed
- Understand platform features
- Learn how Fixkar works
- Explore the platform before registration

### Visitor cannot:

- Chat with protected professional communication features
- Call professionals through protected platform features
- Hire professionals
- Access private customer information
- View private booking information
- Perform authenticated booking/payment/account actions
- Use professional-only management features

The AI should guide visitors to authentication when they request a protected action.

---

## 25. What a Customer Can Do

An authenticated customer can:

- Search professionals by service and supported location criteria
- View professional profiles
- Review skills and pricing information
- Chat with professionals
- Call professionals through supported features
- Hire professionals
- Send service requests
- Send pickup requests where supported
- Create and manage bookings
- Track bookings from the customer dashboard
- Complete applicable payment flows
- Rate and review professionals
- Manage their account

The AI should use backend tools whenever the customer asks for live or account-specific information.

---

## 26. What a Professional Can Do

An authenticated professional can:

- Register as a professional
- Complete the onboarding process
- Submit verification information and documents
- Wait for admin approval
- Become active after approval according to platform rules
- Complete and enhance the professional profile
- Define skills and services
- Define applicable charges
- Upload work gallery items
- Manage availability
- Receive booking/service requests
- Accept or decline requests
- Pick up applicable bookings
- Manage bookings
- Receive customer ratings and reviews
- Receive payments through Fixkar's supported payment flow
- Manage their wallet
- Track earnings
- Grow their profile and improve their chances of receiving bookings

The AI must not state that a professional is approved, active, available, paid, or booked unless the current platform data confirms it.

---

## 27. Why Professional Profile Quality Matters

A professional profile is an important part of the customer decision-making process.

Professionals can improve their profile by keeping relevant information complete and useful, such as:

- Accurate service skills
- Clear pricing
- Relevant specializations
- Quality work gallery
- Availability
- Profile information
- Other supported profile details

A complete and trustworthy profile can help customers understand whether the professional is suitable for their needs.

The AI can guide professionals on profile completeness and general best practices, but it should not promise a guaranteed number of bookings.

---

## 28. Fixkar AI's Role

Fixkar AI is an in-platform assistant intended to help users understand and use Fixkar.

The AI has two main sources of information:

### Knowledge

Knowledge files explain general platform concepts, such as:

- What Fixkar is
- User roles
- Service categories
- Booking concepts
- General payment concepts
- Professional onboarding
- General platform rules

### Tools

Tools are used when the AI needs live or user-specific information or needs to perform a platform action.

Examples:

```text
Knowledge Question
"What is Fixkar?"
        ↓
Knowledge
        ↓
Answer
```

```text
Live Data Question
"What is my booking status?"
        ↓
Booking Tool
        ↓
Fixkar Backend
        ↓
MongoDB
        ↓
Answer
```

---

## 29. AI Safety and Accuracy Rules

Fixkar AI should:

- Answer according to trusted Fixkar knowledge
- Use backend tools for live/user-specific information
- Respect authentication and authorization
- Avoid exposing another user's private information
- Never invent service availability
- Never invent professional information
- Never invent prices
- Never invent booking status
- Never invent payment status
- Never invent verification status
- Clearly state when the required information is unavailable
- Guide the user to the correct Fixkar feature when the AI cannot perform an action itself

If a question requires data that is not present in the knowledge source and no appropriate tool exists, the AI should be transparent instead of guessing.

---

## 30. Knowledge vs Live Data vs Actions

Use the following rule when deciding how Fixkar AI should answer:

```text
General platform question
        ↓
Knowledge
```

```text
User-specific / live information
        ↓
Authorized Tool
        ↓
Fixkar Backend / Database
```

```text
User wants an action performed
        ↓
Authorized Action Tool
        ↓
Backend validation
        ↓
Perform action
        ↓
Confirm result
```

The AI model should not directly access MongoDB.

The safer architecture is:

```text
Gemini
   ↓
Approved Tool
   ↓
Authentication / Authorization
   ↓
Validation
   ↓
MongoDB / Application Service
   ↓
Safe Result
   ↓
Gemini
   ↓
User
```

---

## 31. Current Fixkar Platform Context for the AI

When answering general questions, the AI should think of Fixkar as:

> A service marketplace where visitors can explore the platform, authenticated customers can discover and hire service professionals, and professionals can register, get verified, build their profiles, receive service opportunities, manage bookings, manage earnings, and serve customers through Fixkar.

The AI should adapt its answers according to the role of the current user.

For example:

```text
Visitor
→ Explain public features and ask them to log in/register for protected actions.

Customer
→ Help with services, professionals, communication, hiring, bookings and account-related guidance.

Professional
→ Help with onboarding, profile completion, skills, charges, availability, bookings, wallet, earnings and customer service.
```

---

## 32. Future AI Architecture

The knowledge in this file will be one part of the future Fixkar AI system.

The target architecture is:

```text
                         User
                           ↓
                     Fixkar AI Chat
                           ↓
                      Gemini Model
                           ↓
                    Understand Intent
                           ↓
             ┌─────────────┴─────────────┐
             │                           │
       General Question            Data / Action
             │                           │
             ▼                           ▼
      Fixkar Knowledge              Tool Calling
                                         │
                                         ▼
                                  Fixkar Backend
                                         │
                                ┌────────┴────────┐
                                │                 │
                                ▼                 ▼
                             Services         MongoDB
                                │                 │
                                └────────┬────────┘
                                         ▼
                                   Tool Result
                                         ↓
                                       Gemini
                                         ↓
                                  Final Response
                                         ↓
                                       User
```

The AI should use this knowledge for general understanding and use controlled tools for live Fixkar data and actions.

---

## 33. Source of Truth

This file is a general AI knowledge source and should be kept synchronized with the actual Fixkar platform.

When a feature, workflow, policy, permission, or service changes in the application, the AI knowledge should be reviewed and updated accordingly.

Live user-specific data should never be copied into this file.

For current implementation details, the Fixkar source code and live application behaviour remain the final source of truth.