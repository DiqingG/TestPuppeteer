import { Page } from "puppeteer";
import { screenshot } from "./screenshot";
import { waitOption } from "..";
import { config } from "dotenv";
import * as path from "path";

const getAccount = () => {
    if (process.env.NODE_ENV !== "production") {
        // @ts-ignore
        config(path.resolve(__dirname, ".env"));
    }
    const username = process.env.USERNAME || "";
    const password = process.env.PASSWORD || "";
    return { username, password };
};

const signInUrl = "https://www.bestbuy.com/signin";

export const login = async (page: Page) => {
    // get username and password from env var
    const { username, password } = getAccount();
    if (!username || !password) {
        console.error("No username & password found. Exiting");
        process.exit(1);
    }
    // sign in
    await page.goto(signInUrl, waitOption);
    await screenshot(page, "login-page-loaded.png");
    const emailInput = (await page.$x("//input[@type='email']"))[0];
    await emailInput.type(username);
    const passwordInput = (await page.$x("//input[@type='password']"))[0];
    await passwordInput.type(password);
    await screenshot(page, "login-filled.png");
    await Promise.all([passwordInput.press("Enter"), page.waitForNavigation(waitOption)]);
};
