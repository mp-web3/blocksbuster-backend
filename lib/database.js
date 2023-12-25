const MongoClient = require("mongodb").MongoClient;
require("dotenv").config({ path: "../.env" });

export const connectToDatabase = async () => {
  return MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      let db = client.db(process.env.DATABASE);
      console.log(`Connencted to ${process.env.DATABASE}`);
      return db;
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB: ", error);
    });
};