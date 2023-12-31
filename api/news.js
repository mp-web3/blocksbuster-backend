import { connectToDatabase } from "../lib/database";
require('dotenv').config({path: "../.env"});

module.exports = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = await db.collection(process.env.NEWS);

        const newsArray = await collection.find().limit(6).toArray();
        res.status(200).json(newsArray);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
}