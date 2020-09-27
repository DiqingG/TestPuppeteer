// import puppeteer from "puppeteer-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ProductBuyer } from "./ProductBuyer";
import { waitOption } from "./scripts/utils";
import { Product } from "./Product";
import { Browser, LaunchOptions } from "puppeteer";
import puppeteer from "puppeteer";
import winston from "winston";
import cron from "cron";
import MetaData from "./MetaData";
import { Database } from "arangojs";
import moment from "moment";
// const ipad = devices["iPad Pro landscape"];
const url = "https://www.bestbuy.com/";
// const logger = winston.createLogger({
//     level: "info",
//     format: winston.format.json(),
//     defaultMeta: { service: "user-service" },
//     transports: [
//         //
//         // - Write all logs with level `error` and below to `error.log`
//         // - Write all logs with level `info` and below to `combined.log`
//         //
//         new winston.transports.File({ filename: "error.log", level: "error" }),
//         new winston.transports.File({ filename: "combined.log" }),
//     ],
// });
// if (process.env.NODE_ENV !== "production") {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple(),
//         })
//     );
// }
let chromeIsRuinning = false;
const db = new Database({
  url: "http://localhost:8529",
});
const dbName = "Products";
const connectToDb = async () => {
  if (db.name === dbName) {
    return;
  }
  try {
    await db.login("root", "localtest");
    const dbs = (await db.listDatabases()) as string[];
    if (!dbs || dbs.indexOf(dbName) < 0) {
      await db.createDatabase(dbName, [{ username: "root" }]);
    }
    db.useDatabase(dbName);
    const collections = await db.listCollections();
    const collection = db.collection("Products");
    if (
      collections.length === 0 ||
      collections.filter((c: any) => c.name === dbName).length === 0
    ) {
      await collection.create();
    }
  } catch (e) {
    console.error(e);
  }
};

const main = async () => {
  // puppeteer.use(StealthPlugin());
  await connectToDb();
  chromeIsRuinning = true;
  const metaData = new MetaData();
  console.log("Checking started at", metaData.startTime);
  let browser: Browser;
  try {
    const launchConfig: LaunchOptions = {
      headless: true,
      ignoreDefaultArgs: ["--enable-automation"],
      // devtools: true,
      defaultViewport: { width: 1280, height: 1800 },
      args: [
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        // "--timeout=30000",
        // "--no-first-run",
        // "--no-zygote",
        // "--single-process",
        // // "--proxy-server='direct://'",
        // // "--proxy-bypass-list=*",
        // "--deterministic-fetch",
      ],
      dumpio: true,
    };
    // if (process.env.NODE_ENV === "production") {
    //     launchConfig.executablePath = "google-chrome-unstable";
    // }
    browser = await puppeteer.launch(launchConfig);
    const page = await browser.newPage();
    // await page.emulate(ipad);
    page.setDefaultTimeout(30000);
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    );
    // await page.setGeolocation({
    //     latitude: 34.052235,
    //     longitude: -118.243683,
    // });

    console.log("Navigating to " + url);
    await page.goto(url, waitOption);
    console.log("Home page loaded");
    const switchconsole: Product = {
      name: "switch",
      searchKey: "Nintendo - Switch 32GB Console",
      sku: "6364255",
      website: "www.bestbuy.com",
      inStock: false,
      datetime: metaData.startTime,
    };
    const buyer = new ProductBuyer(page, switchconsole, db);
    await buyer.buy();
    metaData.success = true;
  } catch (e) {
    console.error(e);
    metaData.errored = true;
  } finally {
    console.log("Done");
    await browser.close();
    chromeIsRuinning = false;
    metaData.endTime = new Date();
    metaData.calculateRuntime();
    console.log(JSON.stringify(metaData));
  }
};

(async () => {
  const job = cron.job(
    "*/2 * * * *",
    async () => {
      if (!chromeIsRuinning) {
        await main();
        console.log("Next job is scheduled at:", job.nextDate().toDate());
      }
    },
    () => {
      db.close();
    },
    undefined,
    undefined,
    undefined,
    true
  );
  // @ts-ignore
  console.log(job.nextDates(10).map((date) => date.toString()));
  job.start();

  const stopJob = cron.job(moment(new Date()).add(1, "days"), () => {
    job.stop();
    console.log("stopped+++++++++++++++++++++++++++++++++++");
  });
  stopJob.start();
})();

// red switch = data-sku-id="6364255"
