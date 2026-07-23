import { PROFILE_SECTIONS } from "../profileSchema.js";
import { calculateScore } from "../helper/calculateScore.js";
import { buildRecommendation } from "../helper/buildRecommendation.js";

export const calculateGallery = (professional) => {

    const config = PROFILE_SECTIONS.gallery;

    const gallery = professional?.gallery || [];

    const total = config.targetMedia;

    const completed = Math.min(
        gallery.length,
        total
    );

    const score = calculateScore(
        completed,
        total,
        config.maxScore
    );

    const recommendations = [];

    if (completed < total) {

        recommendations.push(

            buildRecommendation(

                "Upload More Work Photos or Videos",

                `Upload ${total - completed} more work photos or videos to showcase your experience.`,

                Number((config.maxScore - score).toFixed(2)),

                "/professional/profile"

            )

        );

    }

    return {

        id: "gallery",

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

}