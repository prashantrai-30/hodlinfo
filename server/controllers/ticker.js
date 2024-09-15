const Ticker = require("../models/ticker");
const axios = require("axios");

exports.fetchAndStoreData = async (req, res) => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = Object.values(response.data);

    // Take top 10 tickers
    const top10Tickers = tickers.slice(0, 10);

    // Clear existing data
    await Ticker.deleteMany({});

    // Store new data
    for (const ticker of top10Tickers) {
      const newTicker = new Ticker({
        name: ticker.name,
        last: parseFloat(ticker.last),
        buy: parseFloat(ticker.buy),
        sell: parseFloat(ticker.sell),
        volume: parseFloat(ticker.volume),
        base_unit: ticker.base_unit,
      });
      await newTicker.save();
    }

    console.log("Top 10 tickers updated successfully");
  } catch (error) {
    console.error("Error fetching or storing data:", error);
  }
};

exports.getTicker = async (req, res) => {
  try {
    const tickers = await Ticker.find().sort({ volume: -1 });
    res.status(200).json(tickers);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
};

exports.bestprice = async (req, res) => {
  try {
    const bestPrices = await Ticker.aggregate([
      {
        $project: {
          name: 1,
          last_price: "$last",
          buy_price: "$buy",
          sell_price: "$sell",
          volume: 1,
          base_unit: 1,
          best_price: {
            $avg: ["$buy", "$sell"],
          },
        },
      },
      {
        $match: {
          buy_price: { $ne: 0 },
          sell_price: { $ne: 0 },
        },
      },
      {
        $sort: { volume: -1 },
      },
    ]);

    res.json(bestPrices);
  } catch (error) {
    console.error("Error fetching best prices:", error);
    res.status(500).json({ error: "Error fetching best prices" });
  }
};
