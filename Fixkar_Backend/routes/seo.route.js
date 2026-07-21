import express from "express";
import { sitemapController } from "../controllers/seo/generateSitemap.js";

const seoRouter = express.Router();



seoRouter.get("/sitemap.xml", sitemapController);

export default seoRouter;