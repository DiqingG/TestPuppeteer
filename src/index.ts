// import puppeteer from "puppeteer-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ProductBuyer } from "./ProductBuyer";
import { waitOption } from "./scripts/utils";
import { Product } from "./Product";
import { Browser, launch, devices } from "puppeteer";
import winston from "winston";
// const ipad = devices["iPad Pro landscape"];
const url = "https://www.bestbuy.com/";
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}
(async () => {
    // puppeteer.use(StealthPlugin());
    let browser: Browser;
    try {
        browser = await launch({
            headless: true,
            ignoreDefaultArgs: ["--enable-automation"],
            // devtools: true,
            defaultViewport: { width: 1280, height: 1800 },
            // args: ["--no-first-run"],
            dumpio: true,
        });
        const page = await browser.newPage();
        // await page.emulate(ipad);
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
        });
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        );
        // await page.setViewport();
        logger.log("info", "Navigating to " + url);
        await page.goto(url, waitOption);
        logger.log("info", "Home page loaded");
        const switchconsole: Product = { name: "switch", searchKey: "Nintendo - Switch 32GB Console", sku: "6364255" };
        const buyer = new ProductBuyer(page, switchconsole);
        await buyer.buy();
    } catch (e) {
        logger.log("error", e);
    } finally {
        logger.log("info", "Done");
        await browser.close();
    }
})();

// red switch = data-sku-id="6364255"
