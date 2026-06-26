import express from "express";
import { professionalSitemap } from "../controllers/seo/sitemap.controller.js";
import { sitemapIndex } from "../controllers/seo/sitemap.controller.js";

const seoRouter = express.Router();

seoRouter.get("/sitemap-professionals.xml", professionalSitemap);
seoRouter.get("/sitemap.xml", sitemapIndex)

export default seoRouter;