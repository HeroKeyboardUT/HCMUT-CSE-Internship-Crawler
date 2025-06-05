import fs from "fs";
import path from "path";
import { dataPath } from "../utils/dataConfig.js";

class crawlModel {
  async hcmut_crawl() {
    const filePath = path.join(dataPath, "hcmutCompany.json");

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ error: "File dữ liệu công ty không tồn tại" });
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const companies = JSON.parse(data);
    return companies;
  }
}

export default new crawlModel();
