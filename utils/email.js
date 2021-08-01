const config = require('./config')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(config.SENDGRID_API_KEY)

const sendEmail = async ({ to, from = config.EMAIL_FROM, text, subject, html }) => {
    await sgMail.send({ to, from, subject, text, html })
}

module.exports = sendEmail