const axios = require("axios");
require("dotenv").config({ path: "../../.env" });
const { connectToDatabase } = require("../../lib/database");

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();

    const CHANNEL_IDS = [
      "UCAl9Ld79qaZxp9JzEOwd3aA",
      "UCtvTdPZWUwW4whk9CLlCBug",
      "UCTHq3W46BiAYjKUYZq2qm-Q",
      "UCBeLEwM-yhIKuIxHTx0VzdQ",
    ];
    const videoList = [];

    for (const channelId of CHANNEL_IDS) {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&regionCode=IT&type=video&videoDuration=long&key=${process.env.YOUTUBE_API_KEY}`);
      const data = response.data;
      for (const video of data.items) {
        const videoId = video.id.videoId;
        const snippet = video.snippet;
        videoList.push({
          id: videoId,
          title: snippet.title,
          channelTitle: snippet.channelTitle,
          description: snippet.description,
          publishedAt: snippet.publishedAt,
        });
      }
    }

    videoList.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const videoCollection = db.collection("fetchedvideos");
    await videoCollection.deleteMany({});
    await videoCollection.insertMany(videoList);
    console.log("Fetched and saved videos to MongoDB");
    res.status(200).send("Videos updated successfully");
  } catch (error) {
    console.error("Error fetching and saving videos:", error);
    res.status(500).send("Error: " + error.message);
  }
};
