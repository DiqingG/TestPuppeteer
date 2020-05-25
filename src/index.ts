import { launch } from "puppeteer";
import { ProductBuyer } from "./ProductBuyer";
import { waitOption } from "./scripts/utils";
import { Product } from "./Product";

const url = "https://www.bestbuy.com/";

(async () => {
    const browser = await launch();
    try {
        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
        );
        await page.setViewport({ width: 1280, height: 1800 });
        console.log("Navigating to " + url);
        await page.goto(url, waitOption);
        console.log("Home page loaded");
        const switchconsole: Product = { name: "switch", searchKey: "switch console", sku: "6364255" };
        const buyer = new ProductBuyer(page, switchconsole);
        await buyer.buy();
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Done");
        await browser.close();
    }
})();

// red switch = data-sku-id="6364255"
