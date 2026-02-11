import { Bank } from "../AdminModels/bank.model.js";

export const getBanks = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim().length < 3) {
      return res.status(200).json([]);
    }

    const banks = await Bank.find({
      isActive: true,
      name: { $regex: search.trim(), $options: "i" } // case-insensitive search
    })
      .limit(20) // 🚀 limit results (important for performance)
      .select("name code -_id")
      .sort({ name: 1 });

    res.status(200).json(banks);

  } catch (err) {
    console.error("Bank search error:", err);
    res.status(500).json({ message: "Failed to fetch banks" });
  }
};
