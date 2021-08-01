require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

let EMAIL_FROM = process.env.EMAIL_FROM

let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

module.exports = { PORT, MONGODB_URI, EMAIL_FROM, SENDGRID_API_KEY }