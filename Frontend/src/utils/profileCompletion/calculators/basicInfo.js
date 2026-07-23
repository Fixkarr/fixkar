import { calculateScore } from "../helper/calculateScore.js";
import { PROFILE_SECTIONS } from "../profileSchema.js"
import {buildRecommendation} from "../helper/buildRecommendation.js"
export const calculateBasicInfo = (professional) => {
    const maxScore = PROFILE_SECTIONS.basicInfo.maxScore;

      const fields = [
        {
            title: "Profile Photo",
            completed: !!professional?.profilePicture,
            action: "/professional/profile"
        },
        {
            title: "Full Name",
            completed: !!professional?.userId?.fullName,
            action: "/professional/profile"
        },
        {
            title: "Description",
            completed: !!professional?.description,
            action: "/professional/profile"
        },
        {
            title: "Address",
            completed: !!professional?.address?.addressLine,
            action: "/professional/profile"
        }
    ];

     const total = fields.length;

      const completed = fields.filter(field => field.completed).length;
       const score = calculateScore(
        completed,
        total,
        maxScore
    );

     const remainingScore = maxScore - score;

       const recommendations = fields
        .filter(field => !field.completed)
        .map(field =>
            buildRecommendation(
                field.title,
                `Complete your ${field.title.toLowerCase()} to improve your profile score.`,
                maxScore / total,
                field.action
            )
        );

         return {
        id: "basicInfo",
        title: "Basic Information",
        score,
        maxScore,
        completed,
        total,
        percentage: (completed / total) * 100,
        remainingScore,
        recommendations
    };

}