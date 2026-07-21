export const generateFaqs = (professionalInfo)=>{
    const name = professionalInfo?.userId?.fullName.trim() || "This professional";
    const profession = professionalInfo?.profession?.name || "this profession";
    const skills = professionalInfo?.selectedSkills?.map(s=> s.name) || [];

    const location = professionalInfo?.address?.addressLine || "nearby location";
    const experience = professionalInfo?.charges?.summary?.find(item => item.label.toLowerCase().includes("experience"))?.value || "not specified";
    const material = professionalInfo?.charges?.summary?.find(item =>
      item.label.toLowerCase().includes("material")
    )?.value;
    const workCharge =
    professionalInfo?.charges?.summary?.find(item =>
      item.label.toLowerCase().includes("charge")
    )?.value;
     const averageRating =
  professionalInfo?.reviews?.length
    ? (
        professionalInfo.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / professionalInfo.reviews.length
      ).toFixed(1)
    : 0 || "no ratings yet";

    const reviewCount = professionalInfo?.reviews?.length || 0;
     const faqs = [];

     if (skills.length) {
    faqs.push({
      question: `What ${profession.toLowerCase()} services does ${name} provide?`,
      answer: `${name} provides ${skills.join(", ")}.`
    });
  }

   if (experience) {
    faqs.push({
      question: `How much experience does ${name} have?`,
      answer: `${name} has ${experience} of experience as a ${profession.toLowerCase()}.`
    });
  }

  // Location
  if (location) {
    faqs.push({
      question: `Which areas does ${name} serve?`,
      answer: `${name} provides ${profession.toLowerCase()} services in ${location} and nearby areas.`
    });
  }

   if (material) {
    faqs.push({
      question: `Who provides the materials for the work?`,
      answer: material
    });
  }

  if (workCharge) {
    faqs.push({
      question: `What is the cost of the works?`,
      answer: workCharge
    });
  }

  if (averageRating !== "no ratings yet") {
    faqs.push({
      question: `What are the ratings for ${name}?`,
      answer: `The average rating for ${name} is ${averageRating} and ${reviewCount} reviews.`
    });
  }


    if (professionalInfo?.status === "approved") {
    faqs.push({
      question: `Is ${name} verified on FixKar?`,
      answer: `Yes, ${name} is a verified ${profession.toLowerCase()} on FixKar.`
    });
  }

    faqs.push({
    question: `How can I book ${name}?`,
    answer: `You can book ${name} directly through FixKar after viewing the profile, availability and pricing.`
  })

  return faqs;
}


export const generateAbout = (professionalInfo, id) => {
     const name = professionalInfo?.userId?.fullName.trim();
    const profession = professionalInfo?.profession?.name;
    const skills = professionalInfo?.selectedSkills?.map(s=> s.name) || [];

    const location = professionalInfo?.address?.addressLine;
    const experience = professionalInfo?.charges?.summary?.find(item => item.label.toLowerCase().includes("experience"))?.value;
     const description =
        professionalInfo?.description;

       return `${name} is a verified ${profession?.toLowerCase()} in ${location}. ${
        experience
            ? `With ${experience} of experience,`
            : ""
    } ${name} specializes in ${skills}. ${
        description
            ? `${name} says - ${description}` 
            : ""
    } Customers can hire ${name} through Fixkar Smart Solutions for reliable ${profession?.toLowerCase()} services. They can visit https://www.fixkarr.com/professional/profile/visit/${id}/${professionalInfo?.slug} to view the profile and book ${name} for your ${profession?.toLowerCase()} needs. Visit fixkarr.com for more information and to explore other verified professionals in your area.`;

}