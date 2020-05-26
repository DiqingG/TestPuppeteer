import { Page } from "puppeteer";
import { getAccount, screenShotPath, waitOption } from "./scripts/utils";
import { Product } from "./Product";

const signInUrl = "https://www.bestbuy.com/signin";

export class ProductBuyer {
    readonly page: Page;
    readonly product: Product;

    constructor(page: Page, product: Product) {
        this.page = page;
        this.product = product;
    }

    async buy() {
        console.log("Trying to sign in....");
        await this.login();
        console.log("Searching product....");
        await this.searchProduct();
        console.log("Checking in stock....");
        const inStock = await this.checkInStock();
        if (inStock) {
            console.log("Adding to cart...");
            // await addToCart()
            console.log("Checking out..");
        } else {
            console.warn("Item is not in stock, stopping execution.....");
        }

        return Promise.resolve();
    }

    private async login() {
        // get username and password from env var
        const { username, password } = getAccount();
        if (!username || !password) {
            console.error("No username & password found. Exiting");
            return process.exit(0);
        }
        // sign in
        await this.page.goto(signInUrl, waitOption);
        await this.screenshot("login-page-loaded.png");
        const emailInput = (await this.page.$x("//input[@type='email']"))[0];
        await emailInput.type(username);
        const passwordInput = (await this.page.$x("//input[@type='password']"))[0];
        await passwordInput.type(password);
        await this.screenshot("login-filled.png");
        await Promise.all([passwordInput.press("Enter"), this.page.waitForNavigation(waitOption)]);
    }

    private async searchProduct() {
        console.log("Searching " + this.product.name);
        console.log("Wait for 5s for modal to load");
        await this.page.waitFor(5000);
        // check if there is a modal, if yes, close it
        await this.screenshot("check-modal.png");
        const closeButton = await this.page.$(".c-close-icon");
        if (closeButton) {
            console.log("close modal");
            closeButton.click();
            await this.screenshot("modal-dismissed.png");
        }
        const searchbox = await this.page.$("#gh-search-input");
        console.log("Typing " + this.product.searchKey);
        await searchbox.type(this.product.searchKey, { delay: 200 });
        await this.screenshot("search-filled.png");
        console.log("Wait for search results to load");
        await Promise.all([searchbox.press("Enter"), this.page.waitForNavigation(waitOption)]);
        await this.screenshot("search-result.png");
        console.log("Search finished");
    }

    private async checkInStock(): Promise<boolean> {
        let inStock = false;
        await this.page.$eval(
            `[data-sku-id='${this.product.sku}'] .fulfillment-add-to-cart-button button`,
            (ele: HTMLButtonElement) => {
                inStock = !ele.disabled;
            }
        );
        if (!inStock) {
            console.warn("Item sold out... check back later");
        } else {
            console.log("Item is in stock, can proceed to checkout");
        }
        return inStock;
    }

    private async screenshot(filename: string) {
        await this.page.screenshot({ path: screenShotPath(filename), type: "png" });
    }
}
