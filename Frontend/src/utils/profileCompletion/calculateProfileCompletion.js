import { calculateBasicInfo } from "./calculators/basicInfo.js";
import { calculateSkills } from "./calculators/skills.js";
import { calculateCharges } from "./calculators/charges.js";
import { calculateGallery } from "./calculators/gallery.js";
import { calculateReviews } from "./calculators/reviews.js";
import { calculateVerification } from "./calculators/verification.js";

export const calculateProfileCompletion = (professional) => {

    const sections = [

        calculateBasicInfo(professional),

        calculateSkills(professional),

        calculateCharges(professional),

        calculateGallery(professional),

        calculateReviews(professional),

        calculateVerification(professional)

    ];

    const totalScore = Number(
        sections
            .reduce((sum, section) => sum + section.score, 0)
            .toFixed(2)
    );

    const maxScore = sections.reduce(
        (sum, section) => sum + section.maxScore,
        0
    );

    const percentage = Number(
        ((totalScore / maxScore) * 100).toFixed(2)
    );

    const completedSections = sections.filter(
        section => section.score === section.maxScore
    ).length;

    const remainingScore = Number(
        (maxScore - totalScore).toFixed(2)
    );

    const recommendations = sections
        .flatMap(section => section.recommendations)
        .sort((a, b) => b.scoreGain - a.scoreGain);

    const nextRecommendation =
        recommendations.length > 0
            ? recommendations[0]
            : null;

    const getProfileLevel = (percentage) => {

    if (percentage >= 90)
        return "Excellent";

    if (percentage >= 75)
        return "Good";

    if (percentage >= 50)
        return "Average";

    if (percentage >= 25)
        return "Needs Improvement";

    return "Incomplete";

};

    return {

        score: totalScore,

        maxScore,

        percentage,

        remainingScore,

        completedSections,

        totalSections: sections.length,

        sections,

        recommendations,

        nextRecommendation,
        level : getProfileLevel(percentage)

    };

};