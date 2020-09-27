const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/index.ts"),
    devtool: "inline-source-map",
    target: "node",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    externals: {
        puppeteer: "require('puppeteer')",
        dotenv: "require('dotenv')",
        "@google-cloud/datastore": "require('@google-cloud/datastore')",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
        ],
    },
};
