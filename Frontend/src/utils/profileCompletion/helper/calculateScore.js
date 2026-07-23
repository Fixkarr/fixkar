export const calculateScore = (
    completed,
    total,
    maxScore
) => {

    if(total === 0)
        return 0;

    return Number(
        ((completed/total)*maxScore).toFixed(2)
    );

}

export  const hasValue = (value) => {

    if(value == null) return false;

    if(Array.isArray(value))
        return value.length > 0;

    return value.toString().trim() !== "";

}