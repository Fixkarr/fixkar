import {Professional} from "../../models/userModel.js"
export const sitemapController = async (req,res) =>{
    try {
    const professionals = await Professional.find({
      status: "approved",
    })
      .select("_id slug updatedAt")
      .lean();

    res.json(professionals);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}