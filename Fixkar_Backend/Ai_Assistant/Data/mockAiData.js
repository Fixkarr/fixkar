const mockAIData = {
  greeting: {
    keywords: ["hello", "hi", "hey", "hii", "namaste", "good morning", "good evening"],
    responses: [
      "Hello! Welcome to Fixkar. How can I help you today?",
      "Hi! Welcome to Fixkar. What can I help you with?",
    ],
  },

  fixkar_information: {
    keywords: [
      "what is fixkar",
      "about fixkar",
      "fixkar kya hai",
      "fixkar ke bare me",
      "what does fixkar do",
    ],
    responses: [
      "Fixkar is a service marketplace that connects customers with verified professionals for home and local service requirements.",
      "Fixkar helps customers find and hire professionals such as electricians, plumbers, carpenters, painters and other service providers.",
    ],
  },

  available_services: {
    keywords: [
      "services",
      "available services",
      "what services",
      "services available",
      "fixkar services",
      "which services",
    ],
    responses: [
      "Fixkar offers services such as electrician, plumber, carpenter, painter, labour, civil work and other professional services. Available services may vary by location.",
    ],
  },

  electrician: {
    keywords: [
      "electrician",
      "electrical service",
      "electric work",
      "electrician chahiye",
      "electrician service",
    ],
    responses: [
      "You can find electricians on Fixkar by selecting the electrician service and searching for professionals available near your location.",
    ],
  },

  plumber: {
    keywords: [
      "plumber",
      "plumbing",
      "plumber chahiye",
      "plumbing service",
      "water leakage",
    ],
    responses: [
      "You can hire a plumber through Fixkar. Select the plumbing service and search for available professionals near your location.",
    ],
  },

  carpenter: {
    keywords: [
      "carpenter",
      "carpentry",
      "furniture work",
      "wood work",
      "carpenter chahiye",
    ],
    responses: [
      "Fixkar can help you find carpenters for furniture, woodwork, repair and other carpentry requirements.",
    ],
  },

  painter: {
    keywords: [
      "painter",
      "painting",
      "paint work",
      "house painting",
      "painter chahiye",
    ],
    responses: [
      "You can find painting professionals on Fixkar for home, room and other painting requirements.",
    ],
  },

  search_professional: {
    keywords: [
      "find professional",
      "find a professional",
      "professional search",
      "search professional",
      "professional chahiye",
      "worker chahiye",
    ],
    responses: [
      "To find a professional, select the required service and search for professionals available near your location.",
    ],
  },

  nearby_professional: {
    keywords: [
      "nearby professional",
      "professionals near me",
      "near me",
      "nearby worker",
      "mere paas professional",
      "nearby service",
    ],
    responses: [
      "Fixkar can help you discover professionals near your location. Make sure your location is enabled for better results.",
    ],
  },

  hire_professional: {
    keywords: [
      "hire professional",
      "hire a professional",
      "how to hire",
      "professional hire",
      "hire worker",
      "kaise hire kare",
    ],
    responses: [
      "Choose a service, select a professional, review their profile and pricing, then send a hire request to start the booking process.",
    ],
  },

  booking: {
    keywords: [
      "booking",
      "book service",
      "make booking",
      "new booking",
      "service booking",
      "booking kaise kare",
    ],
    responses: [
      "To make a booking, select the required service, choose a professional and submit your booking request with the required details.",
    ],
  },

  booking_status: {
    keywords: [
      "booking status",
      "check booking",
      "booking kaha hai",
      "my booking",
      "booking update",
      "booking ka status",
    ],
    responses: [
      "You can check your current and previous bookings from the My Bookings section of your Fixkar account.",
    ],
  },

  booking_acceptance: {
    keywords: [
      "professional accepted",
      "booking accepted",
      "accept booking",
      "professional accept",
      "booking accept",
    ],
    responses: [
      "Once a professional accepts your booking request, you can continue with the next steps of the service process from your booking details.",
    ],
  },

  booking_rejection: {
    keywords: [
      "booking rejected",
      "professional rejected",
      "booking decline",
      "booking declined",
      "professional declined",
    ],
    responses: [
      "If a professional rejects your request, you can search for another available professional and create a new booking request.",
    ],
  },

  cancel_booking: {
    keywords: [
      "cancel booking",
      "cancel my booking",
      "booking cancel",
      "cancel service",
      "booking cancellation",
    ],
    responses: [
      "You can cancel an eligible booking from the booking details section. Any applicable cancellation charges will be shown before confirmation.",
    ],
  },

  professional_verification: {
    keywords: [
      "verified professional",
      "professional verified",
      "verification",
      "verified worker",
      "are professionals verified",
    ],
    responses: [
      "Fixkar follows a professional verification process before approving professionals on the platform. Verification may include profile and document checks.",
    ],
  },

  professional_profile: {
    keywords: [
      "professional profile",
      "worker profile",
      "view professional",
      "professional details",
      "profile details",
    ],
    responses: [
      "A professional profile can contain their service information, skills, pricing, profile details, experience and other relevant information.",
    ],
  },

  professional_rating: {
    keywords: [
      "rating",
      "ratings",
      "professional rating",
      "review",
      "reviews",
      "rating kaise dekhe",
    ],
    responses: [
      "You can check a professional's ratings and reviews from their profile before making a booking.",
    ],
  },

  payment: {
    keywords: [
      "payment",
      "pay",
      "payment kaise kare",
      "service payment",
      "pay for service",
    ],
    responses: [
      "Fixkar supports online payment for eligible bookings. The payment amount is determined by the booking and applicable charges.",
    ],
  },

  online_payment: {
    keywords: [
      "online payment",
      "pay online",
      "razorpay",
      "online pay",
      "digital payment",
    ],
    responses: [
      "For eligible bookings, customers can complete payments online through the available payment gateway.",
    ],
  },

  cash_payment: {
    keywords: [
      "cash payment",
      "cash",
      "pay cash",
      "cash me payment",
      "cash se payment",
    ],
    responses: [
      "If cash payment is available for your booking, the professional can confirm the cash payment after receiving the service amount from the customer.",
    ],
  },

  platform_fee: {
    keywords: [
      "platform fee",
      "commission",
      "fixkar commission",
      "service fee",
      "platform charges",
    ],
    responses: [
      "Fixkar may charge a platform commission on professional earnings according to the applicable service and platform rules.",
    ],
  },

  offer: {
    keywords: [
      "offer",
      "offers",
      "discount",
      "discount offer",
      "fixkar offer",
      "available offer",
    ],
    responses: [
      "Fixkar may provide promotional offers and coupons for eligible customers. Available offers can be checked from the Offers section.",
    ],
  },

  coupon: {
    keywords: [
      "coupon",
      "coupon code",
      "promo code",
      "coupon kaise use kare",
      "discount coupon",
    ],
    responses: [
      "If you have an eligible Fixkar coupon, you can claim it and apply it to an eligible booking according to its terms and conditions.",
    ],
  },

  claim_coupon: {
    keywords: [
      "claim coupon",
      "coupon claim",
      "claim offer",
      "offer claim",
      "coupon kaise claim kare",
    ],
    responses: [
      "You can claim an available coupon from the Offers section. After claiming it, the coupon can be applied to an eligible booking.",
    ],
  },

  coupon_not_working: {
    keywords: [
      "coupon not working",
      "coupon invalid",
      "coupon invalid hai",
      "promo code not working",
      "discount not applying",
    ],
    responses: [
      "If your coupon is not working, check its validity, eligibility, minimum booking requirements and whether it has already been used.",
    ],
  },

  wallet: {
    keywords: [
      "wallet",
      "professional wallet",
      "my wallet",
      "wallet balance",
      "wallet kaise dekhe",
    ],
    responses: [
      "Professionals can view their wallet balance, earnings and transaction history from the Professional Wallet section.",
    ],
  },

  professional_earnings: {
    keywords: [
      "professional earnings",
      "earnings",
      "my earnings",
      "professional income",
      "kitna earn kiya",
    ],
    responses: [
      "Professionals can track their earnings from completed bookings through their wallet and transaction history.",
    ],
  },

  withdrawal: {
    keywords: [
      "withdraw",
      "withdrawal",
      "withdraw money",
      "money withdraw",
      "wallet se paisa nikale",
      "withdrawal kaise kare",
    ],
    responses: [
      "Verified professionals can request withdrawal of their eligible wallet balance after adding and verifying their bank details.",
    ],
  },

  withdrawal_pending: {
    keywords: [
      "withdrawal pending",
      "withdraw pending",
      "withdrawal request",
      "withdraw request",
      "payment pending",
    ],
    responses: [
      "Withdrawal requests are processed according to Fixkar's payment process. You can check the status of your withdrawal from your wallet.",
    ],
  },

  bank_details: {
    keywords: [
      "bank details",
      "add bank account",
      "bank account",
      "bank details add",
      "bank verify",
    ],
    responses: [
      "Professionals can add their bank details from the Bank Details section. Bank verification may be required before withdrawal.",
    ],
  },

  milestone: {
    keywords: [
      "milestone",
      "professional milestone",
      "milestone system",
      "rank",
      "professional rank",
      "rank system",
    ],
    responses: [
      "Fixkar's professional milestone system rewards professionals as they complete more bookings. Professionals progress through Bronze, Silver, Gold, Platinum and Diamond ranks.",
    ],
  },

  professional_rank: {
    keywords: [
      "bronze",
      "silver",
      "gold",
      "platinum",
      "diamond",
      "professional rank",
      "rank kaise badhega",
    ],
    responses: [
      "Professional ranks progress through five tiers: Bronze, Silver, Gold, Platinum and Diamond. Each tier has five levels, and completed bookings increase the professional's rank score.",
    ],
  },

  milestone_progress: {
    keywords: [
      "milestone progress",
      "rank progress",
      "how to increase rank",
      "rank increase",
      "milestone kaise complete",
      "rank kaise increase",
    ],
    responses: [
      "A professional's milestone progress increases through completed bookings. As the number of completed bookings increases, the professional moves through the rank levels.",
    ],
  },

  professional_credits: {
    keywords: [
      "credits",
      "professional credits",
      "credits balance",
      "credits kaise milega",
      "credits kaise milte hain",
    ],
    responses: [
      "Professionals can earn credits through eligible Fixkar activities and milestone rewards. Their available credits can be viewed from the wallet.",
    ],
  },

  become_professional: {
    keywords: [
      "become professional",
      "join as professional",
      "register as professional",
      "professional registration",
      "worker registration",
      "professional kaise bane",
    ],
    responses: [
      "To become a Fixkar professional, you need to complete the professional onboarding process and provide the required profile and verification information.",
    ],
  },

  professional_documents: {
    keywords: [
      "professional documents",
      "documents required",
      "verification documents",
      "professional verification documents",
      "documents upload",
    ],
    responses: [
      "Professional onboarding may require identity and profile documents for verification. The exact documents required are shown during the onboarding process.",
    ],
  },

  location: {
    keywords: [
      "location",
      "change location",
      "service location",
      "location change",
      "address",
    ],
    responses: [
      "Fixkar uses your service location to help you find professionals available near you. Make sure your location or service address is correct before booking.",
    ],
  },

  customer_support: {
    keywords: [
      "support",
      "customer support",
      "help",
      "help me",
      "complaint",
      "issue",
      "problem",
    ],
    responses: [
      "I'm here to help with Fixkar-related questions. For booking, payment or account-specific issues, please use the appropriate support option available in your Fixkar account.",
    ],
  },

  account: {
    keywords: [
      "account",
      "my account",
      "profile",
      "account settings",
      "update profile",
    ],
    responses: [
      "You can manage your Fixkar profile and account information from your account settings.",
    ],
  },

  safety: {
    keywords: [
      "safe",
      "safety",
      "is fixkar safe",
      "professional safety",
      "customer safety",
    ],
    responses: [
      "Fixkar is designed to provide a structured way for customers and professionals to connect, with professional verification and booking information helping improve trust and transparency.",
    ],
  },

  fallback: {
    responses: [
      "I'm currently focused on helping with Fixkar services, bookings, professionals, payments, offers, wallet and account-related questions.",
      "I can help you with Fixkar bookings, services, professionals, payments, offers, wallet, milestones and other platform-related questions.",
      "I couldn't understand that completely. Try asking something like 'How can I book a professional?', 'How does payment work?', or 'How do professional milestones work?'",
    ],
  },
};

export default mockAIData;