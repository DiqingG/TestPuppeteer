export const setUp = async (browser: any) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, hright: 1800 });
    return page;
};
