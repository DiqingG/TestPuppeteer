import { config } from "dotenv";
import * as path from "path";
import { NavigationOptions } from "puppeteer";

export const getAccount = () => {
    /**
     * Need a better way to get credentials
     */
    if (process.env.NODE_ENV !== "production") {
        // @ts-ignore
        config(path.resolve(__dirname, ".env"));
    }
    const username = process.env.USERNAME || "";
    const password = process.env.PASSWORD || "";
    return { username, password };
};

export const waitOption: NavigationOptions = { waitUntil: "domcontentloaded" };

export const screenShotPath = (name: string) => `./screenshot/${name}`;
