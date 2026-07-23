import { calculateScore, hasValue } from "../helper/calculateScore.js";
import { PROFILE_SECTIONS } from "../profileSchema.js"
import {buildRecommendation} from "../helper/buildRecommendation.js"

export const calculateCharges = (professional) => {

    const config = PROFILE_SECTIONS.charges;

    const summary = professional?.charges?.summary || [];

    // Work Charges wala question
    const workCharge = summary.find(item =>
        item?.label?.toLowerCase().includes("charge")
    );

    // Baaki saare normal questions
    const normalQuestions = summary.filter(item =>
        !item.label.toLowerCase().includes("charge")
    );

    const totalQuestions = normalQuestions.length;

    

    const completedQuestions =
normalQuestions.filter(
item=>hasValue(item.value)
).length;

    const questionScore = calculateScore(
        completedQuestions,
        totalQuestions,
        config.questions.maxScore
    );
    const recommendations = [];

    if (completedQuestions < totalQuestions) {

    recommendations.push(
        buildRecommendation(
            "Complete Pricing Questions",
            `Complete ${totalQuestions - completedQuestions} remaining questions.`,
            config.questions.maxScore - questionScore,
            "/professional/profile"
        )
    );

}

    // Work Charge Score
    let workScore = 0;
    let completedWorks = 0;

    if (workCharge?.value?.trim()) {

        // "Switch - ₹250, Fan - ₹500"
        const works = workCharge.value
            .split(",")
            .filter(item => item.trim());

        const completedWorks = works.filter(item => {
            const [label, charge] = item.split("₹");

            return label?.trim() && charge?.trim();
        }).length;

        const validRows = Math.min(
    completedWorks,
    config.workCharge.targetRows
);

        workScore = calculateScore(
            validRows,
            config.workCharge.targetRows,
            config.workCharge.maxScore
        );

        if (completedWorks < config.workCharge.targetRows) {

            recommendations.push(
                buildRecommendation(
                    "Add More Work and their Charges",
                    `Define charges for ${config.workCharge.targetRows - completedWorks} more works.`,
                    config.workCharge.maxScore - workScore,
                    "/professional/profile"
                )
            );

        }

    }

    return {

        id: "charges",

        title: "Charges",

        score: questionScore + workScore,

        maxScore: config.maxScore,

        completed: completedQuestions + completedWorks,

        total: totalQuestions + config.workCharge.targetRows,

        percentage: Number(
            (((questionScore + workScore) / config.maxScore) * 100).toFixed(2)
        ),

        recommendations

    };

}