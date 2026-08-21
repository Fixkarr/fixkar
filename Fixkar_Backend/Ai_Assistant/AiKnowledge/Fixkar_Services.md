# Fixkar Services

## Purpose

This document explains how the Fixkar AI Assistant should understand the service system of the Fixkar platform.

The most important thing to understand is that **Fixkar services are dynamic**.

The AI must not maintain or assume a permanent list of services.

Services are managed by the Fixkar platform and their current information comes from the backend database.

Therefore, whenever a user asks about currently available services, the AI should use the latest service data from the platform instead of answering from static knowledge.

---

## 1. Services Are Dynamic

Fixkar does not depend on a permanently hardcoded service list for the AI Assistant.

The platform can add, update, or remove services.

Therefore:

```text
Fixkar Database
      ↓
Current Services
      ↓
AI Service Tool
      ↓
Gemini
      ↓
User Response
```

The AI's knowledge explains how Fixkar's service system works.
It does not define which services are currently available.

---

## 2. Never Hardcode Fixkar Services

The AI must never create its own permanent list of Fixkar services.

For example, if the AI knows that plumbing, electrical work, painting, carpentry, or other home services exist in the real world, that does not mean those services are currently available on Fixkar.

The AI must verify the current platform data.

For example:

**User:**
> "Fixkar par kaunsi services available hain?"

**Wrong:**
> "Fixkar par Plumbing, Electrical, Painting aur Carpentry services available hain."

*Reason:* The AI assumed the service list from its own knowledge.

**Correct approach:**

```text
User
 ↓
AI understands the question
 ↓
Fetch current Fixkar services
 ↓
Check database response
 ↓
Return currently available services
```

---

## 3. Current Service Catalogue

There should be no manually maintained service catalogue inside this knowledge file.

The current service catalogue must always come from the Fixkar backend.

This is important because an administrator may:

* Add a new service
* Update an existing service
* Remove a service
* Change service information
* Add or modify skills under a service

The AI should automatically follow the latest backend data when the service tool is implemented.

---

## 4. When the AI Must Use Service Data

The AI should use the service-data tool whenever the user asks for information that depends on the current Fixkar service catalogue.

Examples include:

* "What services are available on Fixkar?"
* "Does Fixkar provide this service?"
* "Can I book this type of service?"
* "What services are available near me?"
* "What work can I book through Fixkar?"
* "Show me the available services."
* "What skills are available under this service?"

These questions require current platform information.
The AI should not answer these questions using only its static knowledge.

---

## 5. General Knowledge vs Fixkar Knowledge

The AI can use general knowledge to understand what a user means.

For example:

**User:**
> "Mujhe ghar ka water pipe repair karwana hai."

The AI can understand that the user is looking for a plumbing-related type of service.

However, the AI cannot immediately say:
> "Fixkar par plumbing service available hai."

Instead:

```text
User Request
      ↓
Understand User Intent
      ↓
Search Current Fixkar Services / Skills
      ↓
Find Matching Service
      ↓
Verify Availability
      ↓
Respond
```

This distinction is very important.
The AI can use general knowledge to understand the user's intent, but Fixkar's database is the source of truth for platform availability.

---

## 6. Service and Skill Relationship

A Fixkar service can contain multiple skills or tasks.

The basic relationship can be understood as:

```text
Service
   ↓
Skills / Tasks
   ↓
Specific Work
```

For example, a user may ask:
> "Is service ke andar kaun-kaun se kaam available hain?"

The AI should:

```text
Identify Service
      ↓
Fetch Current Skills
      ↓
Check Active Skills
      ↓
Return Available Tasks
```

The AI must not invent skills or tasks.

---

## 7. Skills Are Also Dynamic

Skills associated with services are dynamic.

A service may have different skills/tasks configured by the platform.

Therefore, the AI should not maintain a static list of skills.

Instead:

```text
Service
   ↓
Backend
   ↓
Current Skills
   ↓
AI
   ↓
User
```

If an administrator adds a new skill to a service, the AI should be able to use that information through the backend without requiring this documentation file to be rewritten.

---

## 8. Service Types

Fixkar's service system supports different service types.

The currently implemented service types include:

* `skill_based`
* `specialized`

The AI should use the actual service type returned by the backend.
It should not assume the type of a service.

For example:

```text
Service Data
     ↓
type = skill_based
     ↓
AI explains according to the configured workflow
```

or:

```text
Service Data
     ↓
type = specialized
     ↓
AI explains according to the configured workflow
```

The backend data is the source of truth.

---

## 9. Service Skills and Booking Type

A service skill can have a booking type.

The currently implemented booking types include:

* `fixed`
* `inspection`

These types can affect how a service request or booking is handled.

The AI should use the actual booking type returned by the backend.
It must not assume that every service has a fixed price.

For example:

```text
Fixed Booking
      ↓
Configured price may be available
```

while:

```text
Inspection Booking
      ↓
Actual work/price may depend on inspection
```

The AI should explain the workflow based on the actual service and skill data.

---

## 10. Pricing

The AI must never invent service prices.

Pricing can depend on the configuration of the service/skill and, where applicable, the professional.

The platform can have different pricing sources such as:

* Admin-defined pricing

or:

* Professional-defined pricing

Therefore, when the user asks:
> "Is service ka price kitna hai?"

the AI should retrieve the relevant current pricing information.
The response should be based on actual platform data.

---

## 11. Professional-Specific Pricing

A service may exist on Fixkar, but the price offered by different professionals can be different when professional-defined pricing is applicable.

Therefore:

```text
Platform Service
      ↓
Service Skill
      ↓
Professional
      ↓
Professional's Configured Price
```

The AI must not provide a generic professional price unless the backend confirms it.

For example:

**User:**
> "Is professional ka charge kitna hai?"

The AI should retrieve that professional's actual configured pricing.
It should not respond with an estimated price from general knowledge.

---

## 12. Service Availability

There are two different concepts:

1. **Platform-level service availability**
   * Does Fixkar currently offer this service?
   * *This requires current service data.*

2. **Professional-level service availability**
   * Does this particular professional provide this service?
   * *This requires the professional's current profile/service/skill data.*

These two questions must not be confused.

For example:

```text
Service exists on Fixkar
        ↓
Does NOT automatically mean
        ↓
Every professional provides that service
```

---

## 13. Service Matching

Users may not use the exact service name stored in the database.
They may describe what they need using natural language.

For example:
> "Mere ghar ka pipe leak ho raha hai."

The AI should understand the user's intent.

The process should be:

```text
User's Natural Language
          ↓
AI Intent Understanding
          ↓
Search Relevant Fixkar Services / Skills
          ↓
Verify Match
          ↓
Return Suitable Result
```

The AI may use semantic understanding to find the relevant service.
However, it must verify the result against actual Fixkar data before claiming that the platform supports it.

---

## 14. What Happens If No Matching Service Exists?

If the user asks for a service and the backend does not return a matching service or skill, the AI should not invent one.

For example:

**User:**
> "Kya Fixkar par XYZ service available hai?"

If the service-data tool returns no matching service:

**AI:**
> "Mujhe current Fixkar service catalogue mein ye service available nahi mil rahi hai."

The AI can optionally guide the user to explore the currently available services.

---

## 15. Adding New Services

Fixkar services are managed dynamically.

When the platform administrator adds a new service:

```text
Admin
  ↓
Create Service
  ↓
Database
  ↓
Current Service Catalogue
```

The AI knowledge file does not need to be manually updated with the new service name.
The AI should retrieve the latest service data through the service tool.
This makes the AI system scalable.

---

## 16. Removing or Updating Services

The same principle applies when an existing service is updated or removed.

The AI should follow the latest backend data.

For example:

```text
Old Service Data
      ↓
Service Updated
      ↓
Database
      ↓
New Service Data
      ↓
AI Tool
      ↓
New AI Response
```

The AI should not continue presenting outdated service information from memory.

---

## 17. Active and Inactive Skills

Skills can have an active/inactive state.

The AI should respect the current state returned by the backend.

If a skill is inactive and is not returned as an available skill by the service-data endpoint, the AI should not present it as currently bookable.

The AI should always prefer current active platform data.

---

## 18. Service Questions vs Booking Questions

A service question and a booking question are different.

* **Service Question:**
  > "Fixkar par kaunsi services hain?"
  *(This requires service information.)*

* **Booking Question:**
  > "Mujhe ye service book karni hai."
  *(This may require the following flow:)*

```text
Service Data
      ↓
User Authentication
      ↓
Professional Search
      ↓
Availability
      ↓
Pricing
      ↓
Booking Tool
```

The AI should understand that knowing about a service is not the same as creating a booking.

---

## 19. Service Search and Professional Search

When a customer wants to find a professional for a particular service, the AI may need multiple pieces of information.

Conceptually:

```text
Customer Request
      ↓
Understand Required Service
      ↓
Verify Service Exists
      ↓
Identify Relevant Skills
      ↓
Use Location
      ↓
Find Suitable Professionals
      ↓
Check Professional Data
      ↓
Return Results
```

The AI should not directly invent professional recommendations.
When actual professionals are requested, the future AI tool should query the backend.

---

## 20. Service and Location

Service availability and professional availability are different.

A service may exist on Fixkar, but suitable professionals may not currently be available in a particular location.

Therefore:

```text
Service Exists
      ↓
Check Location
      ↓
Find Professionals
      ↓
Check Availability
      ↓
Return Actual Results
```

The AI must not say:
> "Yes, a professional is available near you."

unless the backend confirms it.

---

## 21. Service-Related AI Rules

The AI should follow these rules:

* **Rule 1 — Never invent a Fixkar service:** The AI must not create a service that does not exist in the current backend data.
* **Rule 2 — Never maintain a permanent service list:** The service catalogue is dynamic.
* **Rule 3 — Use the backend for current services:** Questions about currently available services require live service data.
* **Rule 4 — Verify service matching:** Understand the user's natural language, then verify the matching service/skill.
* **Rule 5 — Never invent pricing:** Use actual configured pricing data.
* **Rule 6 — Do not assume every professional provides every service:** A platform-level service and professional-level service capability are different.
* **Rule 7 — Respect service and skill status:** Use current active data.
* **Rule 8 — Do not confuse general knowledge with platform availability:** Knowing that a service exists in the real world does not mean Fixkar currently offers it.
* **Rule 9 — Do not promise booking availability from service data alone:** A service existing does not guarantee that a professional is available.
* **Rule 10 — Do not expose private data:** When service questions require professional/customer-specific information, the AI must follow authentication and authorization rules.

---

## 22. Example Conversations

### Example 1 — Available Services
**User:**
> "Fixkar par kaunsi services available hain?"

**AI process:**
```text
User
 ↓
Service Intent
 ↓
Get Current Services Tool
 ↓
Backend
 ↓
Current Services
 ↓
AI
 ↓
Response
```
The AI should return the services received from the backend. It should not use a manually written service list.

---

### Example 2 — Check a Service
**User:**
> "Kya Fixkar par ye service available hai?"

**AI process:**
```text
User Request
      ↓
Understand Service
      ↓
Search Current Services
      ↓
Verify
      ↓
Response
```

* **If found:** "Yes, ye service currently Fixkar par available hai."
* **If not found:** "Mujhe current Fixkar service catalogue mein ye service available nahi mil rahi hai."

---

### Example 3 — Find Tasks
**User:**
> "Is service ke andar kaun-kaun se kaam available hain?"

**AI process:**
```text
Service
   ↓
Get Current Skills
   ↓
Filter Active Skills
   ↓
Return Tasks
```

---

### Example 4 — Price
**User:**
> "Is service ka price kya hai?"

**AI process:**
```text
Service
   ↓
Skill
   ↓
Pricing Configuration
   ↓
Actual Price
   ↓
Response
```
*Note: The AI must not estimate the price.*

---

### Example 5 — Natural Language Request
**User:**
> "Mere ghar ka pipe leak ho gaya hai, kisi ko bulana hai."

**AI process:**
```text
User Intent
    ↓
Needs a home service
    ↓
Identify relevant service/skill
    ↓
Check Fixkar service data
```

If the user is authenticated and wants to actually hire someone, the process can continue toward:
```text
Service
   ↓
Location
   ↓
Professionals
   ↓
Availability
   ↓
Booking
```
The AI should only perform these actions when the appropriate backend tools and permissions are available.

---

## 23. Knowledge vs Live Data

This document provides knowledge about how Fixkar's service system works.
It does not contain the live service catalogue.

For example, this document can help the AI understand:
> *"Services are dynamic."*

But it cannot answer:
> *"Which services are available right now?"*

without accessing the current service data.

Therefore:

```text
Static Knowledge
      ↓
Understand Platform Rules
```
while:
```text
Live Service Data
      ↓
Know Current Services
```

Both are required.

---

## 24. Future Service Tool

The AI Assistant should eventually have a dedicated service tool.

For example:
* `getAvailableServices()` — Retrieves the current service information from the Fixkar backend.
* `getServiceSkills(serviceId)` — Retrieves the current skills/tasks associated with a service.

The final architecture can become:

```text
                         Gemini
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ↓             ↓             ↓
       Service Tool   Professional Tool  Booking Tool
             │             │             │
             ↓             ↓             ↓
         MongoDB        MongoDB        MongoDB
```

This allows the AI to understand the user's intent while using actual Fixkar data for factual answers and actions.

---

## 25. Source of Truth

For service-related information, the source of truth is:

```text
Fixkar Backend
      ↓
MongoDB
      ↓
Current Service Data
```

The AI's knowledge files explain the platform rules and architecture. They should not replace the database.

> **Core Principle:** Static knowledge explains how Fixkar works. Live backend data tells the AI what is currently available.

This separation ensures that the AI remains accurate even when Fixkar's service catalogue changes.
