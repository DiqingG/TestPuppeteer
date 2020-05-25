import { searchProduct } from "./scripts/searchProduct";
import { screenshot } from "./scripts/screenshot";
import { NavigationOptions, launch } from "puppeteer";
import { login } from "./scripts/login";

const url = "https://www.bestbuy.com/";

export const waitOption: NavigationOptions = { timeout: 0, waitUntil: "domcontentloaded" };

(async () => {
    const browser = await launch();
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1800 });
        console.log("Navigating to " + url);
        await page.goto(url, waitOption);
        console.log("Home page loaded");
        // await screenshot(page, "bestbuy.png");
        console.log("Trying to sign in....");
        await login(page);
        await searchProduct(page, "switch console");
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Done");
        await browser.close();
    }
})();

// red switch = data-sku-id="6364255"
