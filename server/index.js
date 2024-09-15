const express = require('express');
const {connect} = require('./config/database')
const cors = require('cors');
const {fetchAndStoreData} = require('./controllers/ticker')
const tickerRoutes = require('./routes/tickerRoute')
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

setInterval(fetchAndStoreData, 60 * 1000);

fetchAndStoreData();

app.use('/api/v1/tickers',tickerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
  connect();
  console.log("database id connected")
});