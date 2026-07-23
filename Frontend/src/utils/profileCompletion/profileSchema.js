export const PROFILE_SECTIONS = {
  basicInfo: { title : "Basic information", maxScore: 10 },
  skills: { title : "Skills", maxScore: 20 },
  charges: { 
    title : "Charges", 
    maxScore: 30,  
    workCharge : { targetRows: 10, maxScore: 20 },
    questions: {
            maxScore: 10
        }, 

},
  gallery: { title : "Gallery", maxScore: 10, targetMedia : 10 },
  reviews: { title : "Reviews", maxScore: 20,   targetReviews: 20 },
  verification: {
    title: "Verification",
    maxScore: 10,

    fields: [
        {
            title: "Bank Account",
            key: "bankVerified",
            action:"/professional/home"
        }
    ]
}

};
