# Fixkar Professional Profile and Professional Dashboard Knowledge

## Purpose

This document teaches the Fixkar AI Assistant how the professional
side of the Fixkar platform works after a professional has completed
onboarding and received approval.

The AI should use this document to understand:

- Professional profile management
- Profile completion
- Profile information updates
- Profile picture updates
- Skills management
- Service-specific skills
- Charges and pricing
- Specialized-service pricing
- Visiting charges
- Work gallery
- Gallery upload and deletion
- Bank details submission
- Bank verification status
- Profile health
- Reviews
- Professional profile visibility
- Common profile-related problems
- When the AI can answer directly
- When live professional data is required
- When the AI must not guess

The backend is the final authority for the professional's actual
account state.

---

# 1. Professional Profile

After a professional is approved on Fixkar, they can manage their
professional profile.

The professional profile represents the information customers can use
to understand and evaluate the professional.

The profile can contain information such as:

- Professional name
- Profession
- Profile picture
- Description
- Address
- Location
- Skills
- Charges
- Work gallery
- Reviews
- Other professional information supported by the platform

The profile is not only a personal profile.

It is also the professional's public representation on Fixkar.

---

# 2. Professional Profile Architecture

Conceptually:

```text
Professional Account
       ↓
Professional Profile
       ├── Basic Information
       ├── Profile Picture
       ├── Description
       ├── Address / Location
       ├── Skills
       ├── Charges
       ├── Gallery
       ├── Reviews
       └── Verification / Bank Information
The AI should understand that these sections have different purposes.

# 3. Completing the Professional Profile

A newly approved professional should complete their profile before
trying to maximize their chances of receiving suitable booking
opportunities.
The current professional profile flow uses information such as:

Description
+
Selected Skills
+
Charges
+
Gallery
+
Reviews
+
Verification
The backend's profile completion functionality specifically updates:

Description
Selected skills
Charges-related state
Specialized-service visiting charge
Specialized-service task pricing
The professional must provide a description when completing the
profile.
# 4. Professional Description
The professional can add a description to explain their professional
background and services.
Example:

"I am an experienced home service professional with several years
of practical experience."
The description helps customers understand the professional.
The backend requires a non-empty description when completing the
profile.
If the professional tries to complete the profile without a
description, the backend returns:
Description is required
Therefore, if a professional asks:

"Profile complete nahi ho raha, description kaise add karu?"
the AI should explain that the professional needs to provide a valid
profile description.

# 5. Updating Basic Profile Information

A professional can update supported basic information from their
profile.
The current implementation supports updating:

Full name
Description
Address
Latitude
Longitude
The backend updates the user and professional records as appropriate.
# 6. Updating Name
The professional can update their full name.
The name must be a valid non-empty string.
The backend trims the value before updating it.
If the update fails because of a system problem, the AI should not
invent the reason.
If the backend provides a clear validation error, the AI can explain
that error.
If the backend returns a generic internal server error, the AI should
not guess the technical cause.
7. Updating Address
A professional can update their address.
The address information contains:

Address Line
Latitude
Longitude
The backend stores the professional's location as a GeoJSON Point.
Conceptually:

Professional
      ↓
Address
      ↓
Latitude + Longitude
      ↓
Location Point
This location information is important because Fixkar uses location
for professional discovery and matching.
The AI should not tell a professional that their location was updated
unless the backend confirms the update.
8. Address Update Validation
For an address update, the backend expects:

Address text
Valid latitude
Valid longitude
If these values are invalid, the update may not be applied.
If a professional reports:

"Address save nahi ho raha."
the AI should first check the actual backend response if a live
profile tool is available.
It should not assume that the problem is caused by Google Maps,
MongoDB, frontend code, or any other technical component unless that
information is actually available.
9. Profile Picture
A professional can change their profile picture from the
professional profile.
The profile picture is uploaded to the platform's cloud image
storage.
The current implementation uses Cloudinary for professional profile
pictures.
The flow is:

Professional
      ↓
Select Image
      ↓
Upload
      ↓
Cloudinary
      ↓
Profile Picture URL
      ↓
Professional Profile Updated
10. Replacing Profile Picture
When a professional replaces an existing profile picture, the backend
stores the new picture and removes the previous Cloudinary asset when
the old public ID is available.
Therefore, the professional does not need to manually delete the old
profile picture first.
The system handles the replacement.
11. Profile Picture Errors
Possible backend-level problems include:

Profile picture required
or:

Failed to upload your profile picture
or:

Professional not found
or:

Internal server error
The AI should respond based on the actual error when that information
is available.
It must not assume that every upload error is caused by file size,
internet speed, Cloudinary, or another specific technical problem.
12. Skills
Skills are one of the most important parts of a professional profile.
Customers use professional skills to understand what specific work
the professional can perform.
The professional can update their selected skills.
The relationship is:

Professional
      ↓
Profession / Service
      ↓
Available Skills
      ↓
Professional Selects Skills
      ↓
Selected Skills
13. Skills Are Dynamic
The AI must remember that Fixkar services and skills are dynamic.
The professional should only be able to select skills that belong to
their configured profession/service.
The backend validates the selected skills against the professional's
service.
Therefore:

Professional Service
       ↓
Current Service Skills
       ↓
Professional Selects
       ↓
Backend Validation
The AI must never invent skill names.
If a professional asks:

"Main kaunsi skills add kar sakta hoon?"
the AI should retrieve the professional's current service/skill data
when a live tool is available.
14. Active Skills
When updating skills, the backend checks that the selected skills:

Exist
Belong to the professional's service
Are active
Therefore, an inactive skill cannot simply be added by sending its
ID.
If the backend rejects a skill selection, the AI should communicate
the actual platform-level reason when available.
15. Updating Skills
The professional can update their selected skills.
The flow is:

Professional Profile
       ↓
My Skills
       ↓
Update Skills
       ↓
Select Current Available Skills
       ↓
Backend Validation
       ↓
Save Selected Skills
The professional can also reset their selected skill list by sending
an empty array where the current backend flow allows it.
16. Skills and Charges
Skills and charges are connected.
For specialized services, the professional can define pricing for
selected skills/tasks.
The flow is:

Select Skill
      ↓
Define Price
      ↓
Save Skill + Price
If a professional selects a specialized-service skill but does not
provide a valid price, the backend rejects the update.
17. Service Type and Professional Charges
The professional's pricing workflow depends on the service type.
The current backend distinguishes:

skill_based
specialized
The AI must use the actual service type instead of assuming how a
professional's pricing works.
18. Specialized Service Charges
For a specialized service, the professional must provide:

Visiting charge
Price for each selected skill/task
The backend validates the visiting charge.
The visiting charge must be:

Present
Numeric
Greater than or equal to zero
The AI should explain that specialized-service pricing requires the
applicable pricing information.
19. Specialized Task Pricing
For each selected skill under a specialized service, the professional
must define a valid price.
Conceptually:

Specialized Service
        ↓
Selected Skill A → Price A
Selected Skill B → Price B
Selected Skill C → Price C
If one selected skill does not have a valid price, the backend rejects
the update.
Example backend-level validation:

Set a valid price for <skill>
Therefore, if a professional says:

"Skill select ho rahi hai lekin profile save nahi ho rahi."
the AI should consider whether the required pricing information is
missing, but should verify the actual backend response before
claiming that this is the reason.
20. Visiting Charge
For specialized services, the professional can define a visiting
charge.
The visiting charge is separate from individual task pricing.
Conceptually:

Task Price
     +
Visiting Charge
     =
Applicable Booking Amount
The exact final booking amount depends on the booking workflow and
other applicable pricing rules.
The AI should not calculate a customer's final booking price only from
this document.
21. Non-Specialized Services
The backend does not apply the same professional-defined visiting
charge and task-pricing validation to every service type.
For example, the completeProfile and updateSkills controllers only
store professional-defined visiting charge and task pricing when the
service type is specialized.
Therefore, the AI must not tell every professional:

"You must enter a visiting charge."
It should first determine the professional's actual service type.
22. Charges Defined State
The professional profile contains an isChargesDefined state.
This allows the application to know whether the professional has
defined the applicable charges.
The profile UI can display a warning when charges have not been
defined.
Conceptually:

Charges Defined?
      │
   ┌──┴──┐
  No     Yes
  ↓       ↓
Warning  Show Charges
The AI can explain this concept when a professional asks why their
profile says that charges are not defined.
23. Work Gallery
Professionals can showcase their previous work using the profile
gallery.
The gallery supports media such as:

Images
Videos
The gallery is intended to help customers understand the
professional's work.
The professional profile UI describes the gallery as a place to
showcase their best work to customers.
24. Gallery Upload Flow
The gallery upload architecture is:

Professional
      ↓
Select Media
      ↓
Upload Media
      ↓
Cloud Storage
      ↓
Media URL + Public ID
      ↓
Gallery Record
      ↓
Professional Gallery
The current gallery backend stores:

Professional ID
Media URL
Media type
Public ID
25. Gallery Limit
The current backend limits a professional's gallery to:

20 items
If the professional already has 20 gallery items, another upload is
rejected with:
Gallery limit reached
Therefore, if a professional asks:

"Gallery mein aur photo upload nahi ho rahi."
and the backend confirms that the gallery contains 20 items, the AI
can explain the gallery limit.
26. Gallery Media Types
The professional gallery can contain:

image
video
The frontend displays images and videos differently and allows the
professional to preview them.
The AI should not claim that an unsupported media type can be
uploaded unless the current backend confirms it.
27. Deleting Gallery Media
A professional can delete media from their gallery.
The flow is:

Professional
      ↓
Select Gallery Item
      ↓
Delete
      ↓
Backend
      ↓
Gallery Item Removed
The frontend calls the media deletion endpoint with the media ID.
If deletion fails, the AI should use the actual error information when
available.
28. Gallery Upload Errors
Possible errors include:

Professional not found
Gallery limit reached
Media upload failed
The AI should explain these errors when confirmed.
If the system returns a generic error such as:

Internal server error
the AI should not claim to know the underlying development cause.
29. Bank Details
Professional payout requires bank information.
The professional can submit bank details from the professional side.
The current bank-detail flow requires:

Bank name
Branch
Account holder name
Account number
IFSC
PAN number
Passbook image
UPI can also be provided.
30. Bank Detail Validation
The backend validates the submitted bank information.
PAN is checked against the expected PAN format.
IFSC is normalized to uppercase and must have a length of 11
characters.
The passbook image is mandatory.
Therefore:

Bank Details
      ↓
PAN Validation
      ↓
IFSC Validation
      ↓
Passbook Image
      ↓
Submit
If validation fails, the backend returns an error.
The AI should explain the actual validation error instead of guessing.
31. Bank Passbook Image
A passbook image is required when submitting bank details.
The image is uploaded to Cloudinary under the professional bank-proof
storage path.
The backend stores the resulting document URL with the bank details.
The AI should treat bank proof as sensitive information.
It should never expose bank account details to another user.
32. Bank Verification Status
After bank details are submitted, the professional's bank verification
status becomes:
pending
The professional cannot submit another bank-detail request while the
current request is already pending.
The backend returns:

Bank details already submitted and under review
if another submission is attempted while verification is pending.
33. Bank Verification Flow
The current documented backend flow is:

Professional
      ↓
Enter Bank Details
      ↓
Enter PAN
      ↓
Enter IFSC
      ↓
Upload Passbook
      ↓
Submit
      ↓
bankVerificationStatus = pending
      ↓
Verification Process
This document does not assume a final verification status or
verification timeline unless the backend provides that information.
The AI must not invent a verification time.
34. Bank Verification Questions
If a professional asks:

"Bank verification pending kyu hai?"
the AI can explain that submitted bank details are currently under
review if the live professional data confirms:
bankVerificationStatus = pending
If the AI cannot access the current status, it should not claim that
the status is pending.
35. Profile Health
Fixkar's professional profile experience includes a profile-health /
profile-completion concept.
The current profile-health structure contains sections such as:

Basic Information
Skills
Charges
Gallery
Reviews
Verification
These sections are intended to help professionals identify areas of
their profile that can be improved.
36. Profile Health Recommendations
The current profile-health structure can recommend improvements such
as:
Add More Skills
Upload Gallery
Complete Charges
The purpose is to help professionals improve the quality and
completeness of their profile.
The AI can explain why these areas matter.
For example:

Skills
  ↓
Helps customers understand what work you provide

Gallery
  ↓
Shows examples of your work

Charges
  ↓
Helps define applicable pricing information
37. Profile Health Is Not the Same as Verification
The AI must distinguish:

Profile Completion
from:

Verification
A professional can have a profile that is incomplete even after being
approved.
Likewise, completing profile sections does not automatically mean that
all verification requirements are completed.
The AI must not say:

"Your profile is verified because it is complete."
unless live verification data confirms it.
38. Profile Health Data Must Be Treated Carefully
The repository currently contains profile-health structure and example
completion values.
These values should not automatically be treated as the current
professional's live score.
For a specific professional:

"Profile health kitni hai?"
the AI should use live profile-health data if such a backend source is
available.
If no live profile-health tool exists, the AI should not invent a
percentage.
39. Reviews
Reviews are part of the professional profile.
Customers can review professionals after eligible services.
Reviews help customers understand the professional's reputation.
The AI can explain the general purpose of reviews.
However, questions such as:

"Mere profile par kitni reviews hain?"
"Average rating kya hai?"
"Latest review kya hai?"
require live professional data.
The AI must not guess these values.
40. Professional Profile Visibility
A professional's profile can contain:

Professional information
Skills
Charges
Gallery
Reviews
A complete and informative profile can help customers understand the
professional's capabilities.
However, the AI must not guarantee that completing a particular section
will result in a specific number of bookings.
It can explain that profile completeness is intended to improve the
professional's presentation and visibility.
41. Profile Sharing
The professional profile has a shareable profile URL.
The frontend generates the professional profile URL using the
professional's short code.
The professional can:

Share their profile
Copy their profile URL
The AI can explain this feature if asked.
It should not invent or expose another professional's private
profile URL.
42. Professional Profile Update Flow
A general profile-update flow is:

Professional
      ↓
Open My Profile
      ↓
Choose Section
      ↓
Edit Information
      ↓
Frontend Validation
      ↓
Backend Validation
      ↓
Database Update
      ↓
Updated Professional Profile
The backend is the final authority.
43. Skill Update Flow
Professional
      ↓
My Skills
      ↓
Select Skills
      ↓
Backend Checks Service
      ↓
Backend Checks Skill
      ↓
Backend Checks Active Status
      ↓
If Specialized:
    Validate Visiting Charge
    Validate Task Pricing
      ↓
Save
      ↓
Updated Profile
44. Profile Completion Flow
Approved Professional
       ↓
Complete Profile
       ↓
Add Description
       ↓
Select Skills
       ↓
Define Applicable Charges
       ↓
Upload Gallery
       ↓
Add / Maintain Profile Information
       ↓
Submit Updates
       ↓
Profile Becomes More Complete
The exact required fields depend on the professional's service type
and the current backend implementation.
45. Common Professional Questions
Question
"Profile kaise complete karu?"
AI should explain
The professional should complete the profile by adding the required
description, selecting applicable skills, defining applicable
charges, and adding useful profile information such as gallery media.
The exact pricing requirements depend on the professional's service
type.
Question
"Skills kaise add karu?"
AI should explain
Open the professional profile's skills section, select applicable
skills from the available skills for the professional's service, and
save the changes.
The backend validates that the selected skills belong to the
professional's service and are active.
Question
"Specialized service mein price kaise set karu?"
AI should explain
For specialized services, the professional must define a valid
visiting charge and a valid price for each selected skill/task.
Question
"Gallery mein photo kaise upload karu?"
AI should explain
Use the professional gallery's upload option and add supported media.
The current backend allows up to 20 gallery items.
Question
"Bank details kaise submit karu?"
AI should explain
Provide the required bank details, PAN, IFSC, and passbook image, then
submit them for verification.
46. Error Handling Rules
The AI must distinguish between:

User Input / Validation Error
and:

System / Development Error
However, the AI must not determine the technical root cause by
guessing.
47. User Validation Error
If the backend gives a clear validation message, the AI can explain it.
Examples:

Description is required
Invalid skills selected for this service
Gallery limit reached
Invalid PAN number format
Invalid IFSC code
Passbook image is required
Set a valid price for <skill>
The AI can explain what the professional needs to correct.
48. System Error
If the backend returns something such as:

Internal server error
the AI should not guess the development cause.
It should not say:

"MongoDB connection problem hai."
or:

"Cloudinary down hai."
unless the actual system/tool response confirms that.
Correct response:

"I’m unable to complete this request right now because the system
returned an error.

I don't want to guess the cause and give you incorrect information.

Please try again later. If the problem continues, contact Fixkar
Support for assistance."
49. Development Issue Detection
The AI should only classify an issue as a development/system problem
when reliable system information explicitly indicates it.
Examples of evidence can include:

500 Internal Server Error
or a backend tool explicitly returning:

SYSTEM_ERROR
or:

SERVICE_UNAVAILABLE
Without such evidence, the AI should not diagnose the underlying
technical cause.
50. Tool Failure
If the future AI tool used to retrieve professional information fails:

AI
 ↓
Professional Tool
 ↓
Tool Error
the AI should not replace the missing information with a guess.
Instead:

"I’m unable to retrieve your professional profile information right
now.

I don't want to provide incorrect information.

Please try again later or contact Fixkar Support if the problem
continues."
51. Unknown Professional Information
If the user asks:

"What is my current profile completion percentage?"
and no live profile-health data is available, the AI must not
calculate or invent the percentage.
It should say:

"I’m unable to verify your current profile-health score from the
available information."
and guide the user to the profile-health section or support when
appropriate.
52. Live Data Rule
The following questions require live professional data:

"What skills have I selected?"

"Are my charges defined?"

"What is my profile completion score?"

"How many gallery items do I have?"

"Is my bank verification pending?"

"How many reviews do I have?"

"What is my current rating?"

"Which services are configured on my profile?"
The AI should use an authenticated professional tool when available.
53. Never Expose Sensitive Data
Professional bank information is sensitive.
The AI must never expose:

Full bank account number
Private banking information
PAN unnecessarily
Passbook image
Private verification documents
to another user.
Even when answering the professional themselves, sensitive data
should only be shown when the platform explicitly authorizes the
information to be returned.
54. AI Decision Flow for Professional Questions
The AI should process professional questions using:

Professional Question
        ↓
Understand Intent
        ↓
Which profile section?
        ↓
┌───────┼────────┬────────┬─────────┐
↓       ↓        ↓        ↓         ↓
Basic  Skills  Charges  Gallery   Bank
        ↓
Is this general knowledge?
        │
   ┌────┴────┐
  YES        NO
   ↓          ↓
Knowledge   Live Data
              ↓
          Tool Available?
           /         \
         YES          NO
          ↓            ↓
        Verify      Do Not Guess
          ↓            ↓
       Answer       Explain Limitation
55. General Knowledge vs Live Professional Data
General Question
"Professional profile mein gallery ka kya use hai?"
The AI can answer from this document.

Live Question
"Meri gallery mein kitne photos hain?"
The AI needs live professional data.

Action Question
"Ek photo meri gallery se delete kar do."
The AI needs an authorized gallery-management tool.
The AI must not claim the image was deleted without backend
confirmation.
56. Professional Profile Knowledge Rules
The AI must follow these rules:

Rule 1
Do not invent professional skills.

Rule 2
Do not invent professional charges.

Rule 3
Do not invent profile-health scores.

Rule 4
Do not invent bank-verification status.

Rule 5
Do not invent gallery contents.

Rule 6
Do not expose private bank information.

Rule 7
Do not assume a service type.

Rule 8
Check whether the service is specialized before explaining
professional-defined task pricing.
Rule 9
Do not diagnose technical errors without evidence.

Rule 10
If a system error is confirmed and cannot be resolved through the
available information, guide the professional to Fixkar Support.
57. Complete Professional Profile Journey
The overall professional profile journey can be understood as:

Professional Approved
        ↓
Open Professional Dashboard
        ↓
Complete Basic Profile
        ↓
Add Description
        ↓
Update Profile Picture
        ↓
Select Skills
        ↓
Define Applicable Charges
        ↓
Upload Work Gallery
        ↓
Submit Bank Details
        ↓
Bank Verification
        ↓
Collect Reviews Through Completed Work
        ↓
Monitor Profile Health
        ↓
Improve Profile
This is a general representation of the professional-side
functionality.
The actual current state of a particular professional must always
come from live backend data.
58. Final AI Principle
The AI should understand the professional platform deeply, but it
must distinguish between:
How Fixkar works
and:

What is currently true for this professional
For example:

"Professional profile mein charges kaise work karte hain?"
can be answered using this knowledge.
But:

"Mere charges defined hain ya nahi?"
requires live professional data.
And:

"System error aa raha hai, kya problem hai?"
requires actual error information.
If the error information does not reveal the cause, the AI must not
guess.
The correct behaviour is:

Known
  ↓
Answer

Requires Live Data
  ↓
Use Tool

Unknown / Unverified
  ↓
Do Not Guess

Confirmed System Error
  ↓
Explain What Is Known
  ↓
Ask User to Try Again / Contact Support
The Fixkar AI Assistant must always prefer a truthful limitation over a confident but incorrect technical explanation.
(isko bhi md file mein convert karo)
