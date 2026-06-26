import { Professional } from "../../models/userModel.js";


export const professionalSitemap = async (req, res) => {
     try {
    const professionals = await Professional.find(
      {
        onBoarded: true,
        status: "approved",
      },
      "slug updatedAt userId"
    );

    const urls = professionals
      .map((pro) => {
        return `
        <url>
          <loc>${process.env.FRONTEND_URL}/professional/profile/visit/${pro.userId}/${pro.slug}</loc>
          <lastmod>${new Date(pro.updatedAt).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }

}