import { Page } from "puppeteer";
const screenShotPath = (name: string) => `./screenshot/${name}`;

export async function screenshot(page: Page, name: string) {
    await page.screenshot({ path: screenShotPath(name), type: "png" });
}
