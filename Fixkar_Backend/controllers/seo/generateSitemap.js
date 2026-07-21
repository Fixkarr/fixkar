import {Professional} from "../../models/userModel.js"
export const sitemapController = async (req,res) =>{
    try {
    const professionals = await Professional.find({
      status: "approved",
    })
      .select("_id slug updatedAt")
      .lean()

      const urls = professionals
      .map((professional) => {
        return `
<url>
  <loc>https://www.fixkarr.com/professional/profile/visit/${professional.userId}/${professional.slug}</loc>
  <lastmod>${professional.updatedAt.toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}