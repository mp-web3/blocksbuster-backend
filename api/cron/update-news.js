const axios = require("axios");
require("dotenv").config({ path: "../../.env" });
const { connectToDatabase } = require("../../lib/database");

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const response = await axios.get(process.env.GNEWS_URI);
    const data = response.data;
    const articleList = data.articles.map((article) => ({
      id: article.title,
      title: article.title,
      description: article.description,
      publishedAt: article.publishedAt,
      author: article.source.name,
      image: article.image,
      url: article.url,
    }));
    const articleCollection = db.collection("fetchedarticles");
    await articleCollection.deleteMany({});
    await articleCollection.insertMany(articleList);
    console.log("Fetched and saved articles to MongoDB");
    res.status(200).send("Articles updated successfully");
  } catch (error) {
    console.error("Error fetching and saving articles:", error);
    res.status(500).send("Error: " + error.message);
  }
};
