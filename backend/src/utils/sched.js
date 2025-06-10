import crawler from "../crawl/crawl.js";

class Scheduler {
  /**
   * Chạy tất cả các crawler đã đăng ký
   */
  async runAllCrawlers() {
    console.log("🔄 Running scheduled crawlers...");

    // Gọi các hàm crawler đã đăng ký
    crawler.hcmut_crawler();

    // Thêm các crawler khác nếu cần
    // crawler.future_crawler();
    // ...

    console.log("🏁 All scheduled crawlers completed");
  }

  /**
   * Bắt đầu chạy tất cả crawler theo lịch trình mỗi 10 phút
   */
  async startCrawlerSchedule() {
    this.runAllCrawlers();

    // Thiết lập lịch trình chạy mỗi 10 phút
    const TEN_MINUTES = 60 * 10 * 1000;
    this.intervalId = setInterval(() => this.runAllCrawlers(), TEN_MINUTES);
    this.isRunning = true;

    console.log("🕒 Crawler schedule started - running every 10 minutes");
  }
}

export default new Scheduler();
