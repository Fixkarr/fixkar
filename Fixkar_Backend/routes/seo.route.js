import express from "express";

const seoRouter = express.Router();

import { sitemapController } from "../../controllers/seo/generateSitemap.js";

seoRouter.get("/sitemap.xml", sitemapController);

export default seoRouter;