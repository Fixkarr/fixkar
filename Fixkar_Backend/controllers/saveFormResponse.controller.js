import { Professional } from "../models/userModel.js";
import { Form } from "./Admin/AdminModels/form.model.js";
import { FormResponse } from "./Admin/AdminModels/formResponse.js";

export const saveFormResponse = async (req,res)=>{
    try {
        const {formId, responses} = req.body;
        const form = await Form.findById(formId);
        
        if(!form){
            return res.status(404).json({
                message : "Form not found!"
            })
        }

        const summary = [];

        form.sections.forEach((section) => {
        section.fields.forEach((field) => {
        const value = responses[field.fieldId];

        if (!field.summary || value === undefined || value === "") return;

        let formattedValue = "";

        /* ===== FORMAT VALUE BY TYPE ===== */
        switch (field.type) {
          case "checkbox":
            formattedValue = value.join(", ");
            break;

          case "table":
            formattedValue = value
              .map(
                (row) => `${row.label} - ₹${row.charge}`
              )
              .join(", ");
            break;

          default:
            formattedValue = `${value}${
              field.ui?.unit ? " " + field.ui.unit : ""
            }`;
        }

          summary.push({
          label: field.summary,         
          value: formattedValue,        
          group: section.title         
        });
      });
    });

     const responseDoc = await FormResponse.create({
      formId: form._id,
      formKey: form.key,
      purpose: form.purpose,

      filledBy: req.userId,
      responses,
      summary
    });

    if(form.target?.entity === 'service'){
        const professional = await Professional.findOne({userId : req.userId});
         if (!professional) {
            return res.status(404).json({ message: "Professional not found" });
        }

        if(professional.profession?.toString() !== form.target.entityId.toString()){
            return res.status(400).json({ message: "Form does not belong to your profession" });
        }

        professional.charges = responseDoc._id;
        professional.isChargesDefined = true;
        await professional.save();

         const updatedProfessional = await Professional.findById(professional._id).select('-poi -dob').populate("userId", '-password').populate({
            path: "reviews",
            options: {
              sort: { createdAt: -1 },
              limit: 10   // latest 5 reviews
            }
          })
          .populate({
            path: "gallery",
            options: {
              sort: { createdAt: -1 },
              limit: 20   // latest 6 images
            }
          }).populate({
            path : "profession",
            select : "name image skills",
            populate : {
              path : "skills",
              select : "name"
            }
          }).populate({
            path : "selectedSkills",
            select : "name"
          }).populate('charges');

         return res.status(201).json({
            message: "Form response saved",
            user: updatedProfessional   
        });
    }

    if(form.target?.entity === 'offer'){
      
    }


    } catch (error) {
    console.error("FORM RESPONSE ERROR:", err);
    res.status(500).json({ message: "Failed to save form response" });
    }
}