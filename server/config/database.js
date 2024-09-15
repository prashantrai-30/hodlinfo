const mongoose = require('mongoose')
require("dotenv").config();
exports.connect = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
}