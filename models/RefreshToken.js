const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: String,
    expires: Date,
    revoked: Date
})

// create property that doesn't persist in database
refreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires
})

refreshTokenSchema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)