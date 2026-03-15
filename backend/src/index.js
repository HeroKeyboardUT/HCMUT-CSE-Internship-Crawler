import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import { chromium } from "playwright";

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();
const CRAWL_TIMEOUT_MS = 15000;
const CRAWL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let cachedCompanies = [];
let lastCrawledAt = 0;
let crawlingPromise = null;

const normalizeCompanyData = (item, index) => ({
  index,
  id: item?._id || "",
  shortname: item?.shortname || "",
  fullname: item?.fullname || "",
  address: item?.address || "",
  email: item?.contactEmails || [],
  image: item?.image || "",
  description: item?.description || "",
  work: item?.work || "",
  studentRegister: item?.studentRegister || 0,
  studentAccepted: item?.studentAccepted || 0,
  maxAcceptedStudent: item?.maxAcceptedStudent || 0,
  internshipFiles: (item?.internshipFiles || []).map((file) => ({
    name: file?.name || "",
    url: file?.path || "",
  })),
});

const crawlHcmutCompanies = async () => {
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://internship.cse.hcmut.edu.vn/", {
      waitUntil: "domcontentloaded",
      timeout: CRAWL_TIMEOUT_MS,
    });

    await page.waitForSelector("div.logo-box", { timeout: 10000 });
    const logos = await page.$$("div.logo-box");

    const results = [];

    for (let i = 0; i < logos.length; i += 1) {
      const logo = logos[i];

      let companyId;
      try {
        companyId = await logo.$eval("figure", (el) =>
          el.getAttribute("data-id"),
        );
      } catch (error) {
        console.error(`Skip logo ${i + 1}: missing data-id.`, error.message);
        continue;
      }

      if (!companyId) {
        continue;
      }

      const data = await page.evaluate(async (id) => {
        const url = `/home/company/id/${id}?t=${Date.now()}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);

          if (!response.ok) {
            return null;
          }

          return await response.json();
        } catch (_error) {
          clearTimeout(timeout);
          return null;
        }
      }, companyId);

      if (!data?.item) {
        continue;
      }

      results.push(normalizeCompanyData(data.item, i + 1));
    }

    return results;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const getHcmutCompanies = async (forceRefresh = false) => {
  const shouldUseCache = !forceRefresh && cachedCompanies.length > 0;

  if (shouldUseCache) {
    return cachedCompanies;
  }

  if (!crawlingPromise) {
    crawlingPromise = crawlHcmutCompanies()
      .then((companies) => {
        cachedCompanies = companies;
        lastCrawledAt = Date.now();
        return companies;
      })
      .finally(() => {
        crawlingPromise = null;
      });
  }

  return crawlingPromise;
};

const startCrawlSchedule = () => {
  // Warm up cache once at startup.
  getHcmutCompanies(true)
    .then((companies) => {
      console.log(`✅ Initial crawl completed: ${companies.length} companies.`);
    })
    .catch((error) => {
      console.error("❌ Initial crawl failed:", error.message);
    });

  setInterval(() => {
    getHcmutCompanies(true)
      .then((companies) => {
        console.log(
          `🔄 Hourly crawl completed: ${companies.length} companies.`,
        );
      })
      .catch((error) => {
        console.error("❌ Hourly crawl failed:", error.message);
      });
  }, CRAWL_INTERVAL_MS);
};

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  }),
);

app.get("/api/crawl/hcmut", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";

  try {
    const companies = await getHcmutCompanies(forceRefresh);

    return res.status(200).json({
      companies,
      lastCrawledAt,
      total: companies.length,
    });
  } catch (error) {
    console.error("Crawler failed:", error.message);
    return res.status(500).json({
      message: "Failed to crawl HCMUT companies",
      error: error.message,
      lastCrawledAt,
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Crawl API: http://localhost:${PORT}/api/crawl/hcmut`);
  console.log("⏱️ Auto crawl schedule: every 1 hour");

  startCrawlSchedule();
});
