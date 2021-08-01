const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendEmail = require('../utils/email')

const users_get = async (req, res) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, url: 1, author: 1 })
    res.json(users)
}

const user_register = async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body

    if (!password || password.length < 6) throw 'Password of 6 or more characters must be entered'

    const passwordHash = bcrypt.hashSync(password, 10)

    const newUser = new User({
        email,
        username,
        passwordHash,
        firstName,
        lastName,
        // verificationToken: crypto.randomBytes(40).toString('hex'),
    })

    // temp
    newUser.verified = Date.now()
    newUser.verificationToken = undefined

    const savedUser = await newUser.save()
    // await sendEmail({
    //     to: email,
    //     subject: 'Email Verification',
    //     text: `Click <a href='http://localhost:3000/verify-email?token=${savedUser.verificationToken}'>here</a> to verify your email.`,
    //     html: 
    //         `<h4>Email Verification</h4>
    //          <p>Click the link below to verify your email.</p>
    //          <p><a href='http://localhost:3000/verify-email?token=${savedUser.verificationToken}'>http://localhost:3000/verify-email?token=${savedUser.verificationToken}</a></p>`
    // })
    res.json({ message: 'registration successful' })
}

const user_verify = async (request, response) => {
    const { token } = request.body
    
    const user = await User.findOne({ verificationToken: token })

    if (!user || !user.verificationToken) throw 'verification failed'

    user.verified = Date.now()
    user.verificationToken = undefined
    await user.save()
    response.json({ message: 'verification successful' })
}

const user_login = async (request, response) => {
    const { body } = request
    if (!body.username || !body.password) throw 'missing credentials'

    const user = await User.findOne({ username: body.username })

    if (!user || !(bcrypt.compareSync(body.password, user.passwordHash))) throw 'invalid username or password'
    else if (!user.verified) throw 'please verify your account'

    // what we get after we decode the token
    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '15min' } )

    const refreshToken = new RefreshToken({
        user: user.id,
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 7*24*60*60*1000)
    })
    await refreshToken.save()

    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000),
        sameSite: 'strict'
    }
    
    response.cookie('refreshToken', refreshToken.token, cookieOptions)
    response.json({ username: user.username, id: user._id, token })
}

const user_refresh = async (request, response) => {
    const rToken = request.cookies.refreshToken

    const refreshToken = await RefreshToken.findOne({ token: rToken }).populate('user')

    if (!refreshToken || !refreshToken.isActive) throw 'invalid token'

    RefreshToken.revoked = Date.now()

    const { user } = refreshToken
    const newRefreshToken = new RefreshToken({
        user: user.id,
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 7*24*60*60*1000)
    })

    await refreshToken.save()
    await newRefreshToken.save()

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '15min' } )

    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000),
        sameSite: 'strict'
    }
    
    response.cookie('refreshToken', newRefreshToken.token, cookieOptions)
    response.json({ username: user.username, id: user._id, token })
}

const user_revoke = async (request, response) => {
    const rToken = request.cookies.refreshToken

    const refreshToken = await RefreshToken.findOne({ token: rToken }).populate('user')
    
    if (!refreshToken || !refreshToken.isActive) throw 'invalid token'

    refreshToken.revoked = Date.now()
    await refreshToken.save()
    response.json({ message: 'token revoked' })
}

const user_forgot = async (request, response) => {
    const { email } = request.body

    const user = await User.findOne({ email })

    // return ok to prevent email enumeration
    if (!user) return response.json({ message: 'check email for reset instructions' })

    // create reset token that expires in 1 day
    user.resetToken = {
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 24*60*60*1000)
    }

    await user.save()

    // await sendEmail({
    //     to: email,
    //     subject: 'Reset Password',
    //     text: `Click <a href='http://localhost:3000/reset-password?token=${user.resetToken.token}'>here</a> to reset your password.`,
    //     html:
    //         `<h4>Reset Password</h4>
    //          <p>Click the link below to reset your password.</p>
    //          <p><a href='http://localhost:3000/reset-password?token=${user.resetToken.token}'>http://localhost:3000/reset-password?token=${user.resetToken.token}</a></p>`
    // })
    response.json({ message: 'check email for reset instructions' })
}

const user_validate = async (request, response) => {
    const user = await User.findOne({
        'resetToken.token': request.body.token,
        'resetToken.expires': { $gt: Date.now() }
    })

    if (!user || !user.resetToken) throw 'token invalid or expired'
    
    response.json({ message: 'token is valid' })
}

const user_reset = async (request, response) => {
    const user = await User.findOne({
        'resetToken.token': request.body.token,
        'resetToken.expires': { $gt: Date.now() }
    })

    if (!user || !user.resetToken) throw 'token invalid or expired'

    user.passwordHash = bcrypt.hashSync(request.body.password, 10)
    user.resetToken = undefined
    user.verified = Date.now()
    
    await user.save()
    response.json({ message: 'password reset successful' })
}

module.exports = {
    users_get,
    user_register,
    user_login,
    user_refresh,
    user_revoke,
    user_verify,
    user_forgot,
    user_validate,
    user_reset
}