export const calculateProfileCompletion = (professional) => {
      return {
    totalScore: 0,

    sections:[
        {
            id:"basicInfo",
            title:"Basic Information",
            score:0,
            maxScore:10,
            completed:0,
            total:4,
            percentage:0,
            recommendations:[]
        }
    ],

    recommendations:[]
}
}