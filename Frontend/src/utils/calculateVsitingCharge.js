export const calculateVisitingCharge = (distanceInKm) => {

    const baseCharge = Number(distanceInKm);
    if(baseCharge <= 10){
        return 25
    }
    return Math.round(baseCharge + (baseCharge - 5) * 3);
}