import { calculateScore } from "../helper/calculateScore.js";
import { PROFILE_SECTIONS } from "../profileSchema.js"
import {buildRecommendation} from "../helper/buildRecommendation.js"

export const calculateSkills = (professional) => {

    const maxScore = PROFILE_SECTIONS.skills.maxScore;

    const total = professional?.profession?.skills?.length || 0;

    const completed = professional?.selectedSkills?.length || 0;

    const score = calculateScore(
        completed,
        total,
        maxScore
    );

    const remainingScore = maxScore - score;

    const recommendations = [];

    if (completed < total) {
        recommendations.push(
            buildRecommendation(
                "Add More Skills",
                `Add ${total - completed} more skills you can perform to increase your visibility.`,
                remainingScore,
                "/professional/profile"
            )

        );

    }

    return {

        id: "skills",

        title: "Skills",

        score,

        maxScore,

        completed,

        total,

        percentage: total === 0
            ? 0
            : Number(((completed / total) * 100).toFixed(2)),

        remainingScore,

        recommendations

    };

};