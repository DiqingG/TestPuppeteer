import { Page } from "puppeteer";
import { screenshot } from "./screenshot";
import { waitOption } from "..";

export async function searchProduct(page: Page, productName: string) {
    console.log("Searching via search box...");
    const searchbox = await page.$("#gh-search-input");
    await searchbox.type(productName);
    console.log("Wait for search results to load");
    await Promise.all([searchbox.press("Enter"), page.waitForNavigation(waitOption)]);
    await screenshot(page, "search-result.png");
    console.log("Search finished");
}
