import { useMemo } from "react";
import { calculateProfileCompletion } from "../utils/profileCompletion/calculateProfileCompletion";


export const useProfileCompletion = (professionalInfo) => {

    const profileCompletion = useMemo(() => {

        if (!professionalInfo)
            return null;

        return calculateProfileCompletion(professionalInfo);

    }, [professionalInfo]);

    return profileCompletion;

};