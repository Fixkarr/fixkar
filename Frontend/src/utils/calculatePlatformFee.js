export const calculatePlatformFee = (visitCharge, CancelCharge = 50, commissionPercent = 5)=>{
    return ((visitCharge + CancelCharge)* commissionPercent)/100
}   