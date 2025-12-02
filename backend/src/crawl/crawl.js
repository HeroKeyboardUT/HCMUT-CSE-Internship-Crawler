// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";
// import { dataPath } from "../utils/dataConfig.js";

// class crawler {
//   async hcmut_crawler() {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto("https://internship.cse.hcmut.edu.vn/", {
//       waitUntil: "networkidle0",
//     });

//     await page.waitForSelector("div.logo-box");
//     const logos = await page.$$("div.logo-box");

//     const results = [];

//     for (let i = 0; i < logos.length; i++) {
//       const logo = logos[i];

//       const companyId = await logo.$eval("figure", (el) =>
//         el.getAttribute("data-id")
//       );

//       // Gọi API và parse JSON
//       const data = await page.evaluate(async (id) => {
//         const url = `/home/company/id/${id}?t=${Date.now()}`;
//         const res = await fetch(url).catch((error) => {
//           console.error("Failed to fetch data:", error);
//         });
//         const json = await res.json();
//         return json;
//       }, companyId);

//       // Bảo vệ: Nếu response lỗi
//       if (!data || !data.item) {
//         console.log(`❌ Không lấy được dữ liệu công ty ID: ${companyId}`);
//         continue;
//       }

//       const item = data.item;

//       results.push({
//         index: i + 1,
//         id: item._id,
//         shortname: item.shortname,
//         fullname: item.fullname,
//         address: item.address,
//         email: item.contactEmails,
//         image: item.image,
//         description: item.description,
//         work: item.work,
//         studentRegister: item.studentRegister,
//         studentAccepted: item.studentAccepted,
//         maxAcceptedStudent: item.maxAcceptedStudent,
//         internshipFiles: item.internshipFiles.map((f) => ({
//           name: f.name,
//           url: f.path,
//         })),
//       });

//       console.log(`✅ Công ty ${i + 1} | ${item.fullname}`);
//     }

//     await browser.close();

//     // Lưu kết quả vào file JSON
//     const filePath = path.join(dataPath, "hcmutCompany.json");
//     fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
//     console.log(`🎉 Đã lưu ${results.length} công ty vào hcmutCompany.json`);
//     return results;
//   }

//   async future_crawler() {
//     // Tương tự như hcmut_crawler, nhưng với trang web khác
//   }
// }

// export default new crawler();

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { dataPath } from "../utils/dataConfig.js";

class crawler {
  async hcmut_crawler() {
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      // Thêm timeout cho page.goto
      try {
        await page.goto("https://internship.cse.hcmut.edu.vn/", {
          waitUntil: "networkidle",
          timeout: 15000, // 15s timeout
        });
      } catch (err) {
        console.error("❌ Không thể truy cập trang web:", err.message);
        return [];
      }

      // Thêm timeout cho waitForSelector
      try {
        await page.waitForSelector("div.logo-box", { timeout: 10000 });
      } catch (err) {
        console.error("❌ Không tìm thấy selector logo-box:", err.message);
        return [];
      }

      const logos = await page.$$("div.logo-box");
      const results = [];

      for (let i = 0; i < logos.length; i++) {
        const logo = logos[i];

        let companyId;
        try {
          companyId = await logo.$eval("figure", (el) =>
            el.getAttribute("data-id")
          );
        } catch (err) {
          console.error(
            `❌ Không lấy được data-id cho logo ${i + 1}:`,
            err.message
          );
          continue;
        }

        // Gọi API nội bộ từ chính trang
        let data;
        try {
          data = await page.evaluate(async (id) => {
            const url = `/home/company/id/${id}?t=${Date.now()}`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
            try {
              const res = await fetch(url, { signal: controller.signal });
              clearTimeout(timeout);
              const json = await res.json();
              return json;
            } catch (error) {
              clearTimeout(timeout);
              return null;
            }
          }, companyId);
        } catch (err) {
          console.error(
            `❌ Lỗi khi gọi API cho công ty ID: ${companyId}`,
            err.message
          );
          continue;
        }

        if (!data || !data.item) {
          console.log(`❌ Không lấy được dữ liệu công ty ID: ${companyId}`);
          continue;
        }

        const item = data.item;

        results.push({
          index: i + 1,
          id: item._id,
          shortname: item.shortname,
          fullname: item.fullname,
          address: item.address,
          email: item.contactEmails,
          image: item.image,
          description: item.description,
          work: item.work,
          studentRegister: item.studentRegister,
          studentAccepted: item.studentAccepted,
          maxAcceptedStudent: item.maxAcceptedStudent,
          internshipFiles: item.internshipFiles.map((f) => ({
            name: f.name,
            url: f.path,
          })),
        });

        console.log(`✅ Công ty ${i + 1} | ${item.fullname}`);
      }

      await browser.close();

      const filePath = path.join(dataPath, "hcmutCompany.json");
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
      console.log(`🎉 Đã lưu ${results.length} công ty vào hcmutCompany.json`);
      return results;
    } catch (err) {
      console.error("❌ Lỗi không xác định trong crawler:", err.message);
      if (browser) await browser.close();
      return [];
    }
  }

  async future_crawler() {
    // TODO: future crawler
  }
}

export default new crawler();
