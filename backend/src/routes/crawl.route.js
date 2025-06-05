import express from "express";
import crawlController from "../controllers/crawl.controller.js";

export const crawlRouter = express.Router();

// Define the route for crawling
crawlRouter.get("/hcmut", crawlController.hcmutCrawl);
