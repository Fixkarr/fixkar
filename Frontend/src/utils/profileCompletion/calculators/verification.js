import { PROFILE_SECTIONS } from "../profileSchema.js";
import { calculateScore } from "../helper/calculateScore.js";
import { buildRecommendation } from "../helper/buildRecommendation.js";

export const calculateVerification = (professional) => {

    const config = PROFILE_SECTIONS.verification;

    const fields = config.fields;

    const total = fields.length;

    const completed = fields.filter(field =>
        professional?.[field.key]
    ).length;

    const score = calculateScore(
        completed,
        total,
        config.maxScore
    );

    const recommendations = [];

    fields.forEach(field => {

        if (!professional?.[field.key]) {

            recommendations.push(

                buildRecommendation(
                    `Verify ${field.title}`,
                    `Complete your ${field.title.toLowerCase()} verification.`,
                    Number((config.maxScore / total).toFixed(2)),
                     field.action
                )

            );

        }

    });

    return {

        id: "verification",

        title: config.title,

        score,

        maxScore: config.maxScore,

        completed,

        total,

        percentage: Number(
            ((score / config.maxScore) * 100).toFixed(2)
        ),

        recommendations

    };

};