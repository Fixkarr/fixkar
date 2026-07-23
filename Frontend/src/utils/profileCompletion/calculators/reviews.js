import { PROFILE_SECTIONS } from "../profileSchema.js";
import { calculateScore } from "../helper/calculateScore.js";
import { buildRecommendation } from "../helper/buildRecommendation.js";

export const calculateReviews = (professional) => {

    const config = PROFILE_SECTIONS.reviews;

    const reviews = professional?.reviews || [];

    const total = config.targetReviews;

    const completed = Math.min(
        reviews.length,
        total
    );

    const score = calculateScore(
        completed,
        total,
        config.maxScore
    );

    const recommendations = [];

    // Review Recommendation
    if (completed < total) {

        recommendations.push(

            buildRecommendation(

                "Get More Reviews",

                `Receive ${total - completed} more customer reviews to improve your profile.`,

                Number((config.maxScore - score).toFixed(2)),

                "/professional/profile"

            )

        );

    }

    // Average Rating
    const averageRating =
        reviews.length === 0
            ? 0
            : Number(
                (
                    reviews.reduce(
                        (sum, review) => sum + (review.rating || 0),
                        0
                    ) / reviews.length
                ).toFixed(1)
            );

    // Low Rating Recommendation
    if (
        reviews.length > 0 &&
        averageRating < config.minimumRating
    ) {

        recommendations.push(

            buildRecommendation(

                "Improve Customer Rating",

                `Your average rating is ${averageRating}. Try providing better service to reach ${config.minimumRating}+ stars.`,

                0,

                "/professional/profile"

            )

        );

    }

    return {

        id: "reviews",

        title: config.title,

        score,

        maxScore: config.maxScore,

        completed,

        total,

        averageRating,

        percentage: Number(
            ((score / config.maxScore) * 100).toFixed(2)
        ),

        recommendations

    };

};