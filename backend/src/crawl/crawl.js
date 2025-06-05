import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { dataPath } from "../utils/dataConfig.js";

class crawler {
  async hcmut_crawler() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://internship.cse.hcmut.edu.vn/", {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector("div.logo-box");
    const logos = await page.$$("div.logo-box");

    const results = [];

    for (let i = 0; i < logos.length; i++) {
      const logo = logos[i];

      const companyId = await logo.$eval("figure", (el) =>
        el.getAttribute("data-id")
      );

      // Gọi API và parse JSON
      const data = await page.evaluate(async (id) => {
        const url = `/home/company/id/${id}?t=${Date.now()}`;
        const res = await fetch(url).catch((error) => {
          console.error("Failed to fetch data:", error);
        });
        const json = await res.json();
        return json;
      }, companyId);

      // Bảo vệ: Nếu response lỗi
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

    // Lưu kết quả vào file JSON
    const filePath = path.join(dataPath, "hcmutCompany.json");
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`🎉 Đã lưu ${results.length} công ty vào hcmutCompany.json`);
    return results;
  }

  async future_crawler() {
    // Tương tự như hcmut_crawler, nhưng với trang web khác
  }
}

export default new crawler();
