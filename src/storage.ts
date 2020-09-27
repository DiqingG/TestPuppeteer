// import { Datastore } from "@google-cloud/datastore";
import { Product } from "./Product";
import path from "path";
import { Database, aql } from "arangojs";
import { CollectionType } from "arangojs/lib/cjs/collection";
// import cassandra from "cassandra-driver";
// const datastore = new Datastore({
//     projectId: "productbuyer",
//     keyFile: path.resolve(__dirname, "../ProductBuyer-a740c9dc7949.json"),
// });

const couchDbConfig = {};

// export const saveProduct = async (product: Product) => {
//     const request = {
//         key: datastore.key("Product"),
//         data: {
//             sku: product.sku,
//             date: product.datetime,
//             website: product.website,
//             inStock: product.inStock,
//             searchKey: product.searchKey,
//         },
//     };
//     // await datastore
//     //     .save(request)
//     //     .then((res) => {
//     //         console.log(`Product ${product.name} saved`);
//     //         console.log(JSON.stringify(res));
//     //     })
//     //     .catch((e) => {
//     //         console.log(e);
//     //     });
// };

// // store it to couch db
// let dbClient: cassandra.Client;

// // connect to cassandra
// const getClient = () => {
//     if (dbClient) {
//         return dbClient;
//     }
//     const client = new cassandra.Client({
//         contactPoints: ["127.0.0.1", "9042"],
//         localDataCenter: "datacenter1",
//         keyspace: "test",
//     });
//     dbClient = client;
//     return dbClient;
// };

// const prepared = "INSERT INTO";

// export const saveProduct = async (product: Product) => {};
export const saveProduct = async (db: Database, product: Product) => {
    // const request = {
    //     key: datastore.key("Product"),
    //     data: {
    //         sku: product.sku,
    //         date: product.datetime,
    //         website: product.website,
    //         inStock: product.inStock,
    //         searchKey: product.searchKey,
    //     },
    // };
    const data = product;
    console.log(data);
    const query = aql`INSERT ${data} INTO Products`;
    // console.log(query);
    try {
        const result = await db.query(query);
        console.debug("Stored in db +++++++++++++++++++++++++++++++++++++++++++");
    } catch (e) {
        console.error(e);
    }
    // await datastore
    //     .save(request)
    //     .then((res) => {
    //         console.log(`Product ${product.name} saved`);
    //         console.log(JSON.stringify(res));
    //     })
    //     .catch((e) => {
    //         console.log(e);
    //     });
};
