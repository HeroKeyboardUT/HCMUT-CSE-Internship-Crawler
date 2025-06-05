import express from "express";
import cors from "cors";
import { crawlRouter } from "./routes/crawl.route.js";
import Scheduler from "./utils/sched.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// Routes
app.use("/api/crawl", crawlRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Crawl API: http://localhost:${PORT}/api/crawl/hcmut`);
});

// Crawler
Scheduler.startCrawlerSchedule();

// import express from "express";
// import fs from "fs";
// import puppeteer from "puppeteer";
// import cors from "cors";
// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON
// app.use(express.json());
// app.use(cors());

// // API endpoint to fetch company data
// app.get("/api/companies", (req, res) => {
//   try {
//     const data = fs.readFileSync("companies.json", "utf-8");
//     const companies = JSON.parse(data);
//     res.json(companies);
//   } catch (error) {
//     console.error("Error reading companies.json:", error);
//     res.status(500).json({ error: "Failed to fetch company data" });
//   }
// });

// // Future crawler integration
// app.post("/api/crawl", async (req, res) => {
//   const { url, selector } = req.body;
//   try {
//     const data = await crawlWebsite(url, selector);
//     res.json({ data });
//   } catch (error) {
//     console.error("Error during crawling:", error);
//     res.status(500).json({ error: "Failed to crawl website" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// async function crawl() {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto("https://internship.cse.hcmut.edu.vn/", {
//     waitUntil: "networkidle0",
//   });

//   await page.waitForSelector("div.logo-box");
//   const logos = await page.$$("div.logo-box");

//   const results = [];

//   for (let i = 0; i < logos.length; i++) {
//     const logo = logos[i];

//     const companyId = await logo.$eval("figure", (el) =>
//       el.getAttribute("data-id")
//     );

//     // Gọi API và parse JSON
//     const data = await page.evaluate(async (id) => {
//       const url = `/home/company/id/${id}?t=${Date.now()}`;
//       const res = await fetch(url).catch((error) => {
//         console.error("Failed to fetch data:", error);
//       });
//       const json = await res.json();
//       return json;
//     }, companyId);

//     // Bảo vệ: Nếu response lỗi
//     if (!data || !data.item) {
//       console.log(`❌ Không lấy được dữ liệu công ty ID: ${companyId}`);
//       continue;
//     }

//     const item = data.item;

//     results.push({
//       index: i + 1,
//       id: item._id,
//       shortname: item.shortname,
//       fullname: item.fullname,
//       address: item.address,
//       email: item.contactEmails,
//       image: item.image,
//       description: item.description,
//       work: item.work,
//       studentRegister: item.studentRegister,
//       studentAccepted: item.studentAccepted,
//       maxAcceptedStudent: item.maxAcceptedStudent,
//       internshipFiles: item.internshipFiles.map((f) => ({
//         name: f.name,
//         url: f.path,
//       })),
//     });

//     console.log(`✅ Công ty ${i + 1} | ${item.fullname}`);
//   }

//   await browser.close();

//   fs.writeFileSync("companies.json", JSON.stringify(results, null, 2));
//   console.log(`🎉 Đã lưu ${results.length} công ty vào companies.json`);
// }

// crawl();
