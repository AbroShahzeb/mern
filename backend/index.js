const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { connectDB } = require('./config/db')
const { errorHandler } = require('./middlewares/errorMiddleware')
const { sendEmail } = require('./config/mail')
const userRoutes = require('./routes/userRoutes')

const app = express()

// sendEmail('shahzebaliabro12345@gmail.com', 'Test email', '<h1>This is a test</h1>')


connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({
        message: 'App is running'
    })
})

app.use('/user', userRoutes)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`App listening on: PORT ${process.env.PORT}`.cyan.underline)
})