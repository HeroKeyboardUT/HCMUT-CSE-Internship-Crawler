import crawlModel from "../models/crawl.model.js";

class crawlController {
  async hcmutCrawl(req, res) {
    try {
      const data = await crawlModel.hcmut_crawl();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error during crawling:", error);
      res.status(500).json({ error: "Failed to crawl data" });
    }
  }
}

export default new crawlController();
