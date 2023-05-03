const mongoose = require('mongoose')
const asyncErrorHandler = require('express-async-handler')
const colors = require('colors')

const connectDB = asyncErrorHandler(async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`MongoDB connected: ${conn.connection.host}`.magenta.underline)
    } catch (e) {
        console.log(e)
    }
})

module.exports = {
    connectDB,
}