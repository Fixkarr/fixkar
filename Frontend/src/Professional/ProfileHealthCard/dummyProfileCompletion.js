export const dummyProfileCompletion = {
    percentage: 44.85,
    score: 44.85,
    maxScore: 100,
    level: "Needs Improvement",

    completedSections: 1,
    totalSections: 6,

    nextRecommendation: {
        title: "Add More Skills",
        message: "Complete your remaining skills to improve visibility.",
        scoreGain: 8,
        action: "/professional/profile/skills"
    },

    recommendations: [
        {
            title: "Upload Gallery",
            message: "Upload work photos.",
            scoreGain: 10,
            action: "/professional/profile/gallery"
        },
        {
            title: "Complete Charges",
            message: "Add pricing details.",
            scoreGain: 15,
            action: "/professional/profile/charges"
        }
    ],

    sections: [
        {
            id: "basic",
            title: "Basic Information",
            completed: 4,
            total: 4,
            percentage: 100,
            score: 10,
            maxScore: 10,
            action: "/professional/profile/basic"
        },
        {
            id: "skills",
            title: "Skills",
            completed: 5,
            total: 10,
            percentage: 50,
            score: 10,
            maxScore: 20,
            action: "/professional/profile/skills"
        },
        {
            id: "charges",
            title: "Charges",
            completed: 3,
            total: 6,
            percentage: 50,
            score: 15,
            maxScore: 30,
            action: "/professional/profile/charges"
        },
        {
            id: "gallery",
            title: "Gallery",
            completed: 2,
            total: 10,
            percentage: 20,
            score: 2,
            maxScore: 10,
            action: "/professional/profile/gallery"
        },
        {
            id: "reviews",
            title: "Reviews",
            completed: 4,
            total: 20,
            percentage: 20,
            score: 4,
            maxScore: 20,
            action: "/professional/profile/reviews"
        },
        {
            id: "verification",
            title: "Verification",
            completed: 0,
            total: 1,
            percentage: 0,
            score: 0,
            maxScore: 10,
            action: "/professional/profile/verification"
        }
    ]
};