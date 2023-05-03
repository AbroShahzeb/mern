const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Token = require('../models/Token')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../config/mail')
const { v4 } = require('uuid')
const { activateEmailSubject, activateEmail } = require('../config/emails')


const registerUser = asyncHandler( async (req, res) => {
    const { username, email, password } = req.body

    // if any one the field is empty
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please provide all fields")
    }

    // check if the user already exists
    let user = await User.findOne({ email })

    if (user) 
        return res.json({ message: 'User with this email address already exists' })
   
    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(password, salt)

    // create user
    user = await User.create({
        username, 
        email,
        password: hashedPassword,
    })

    // create token
    const token = await Token.create({
        userId: user._id,
        token: v4()
    })

    // send token to user email for activating account
    sendEmail(email, activateEmailSubject(username), activateEmail(username, token.token))

    res.json({
        message: `Registered successfully. Check your email for activating account!`
    })
    


})


const ActivateAccount = asyncHandler( async (req, res) => {
    const token = await Token.findOne({ token: req.params.id })

    if (token) {
        const user = await User.findById(token.userId)
        user.status = 'active'
        user.save()
        await Token.findByIdAndDelete(token._id)

        return res.status(200).json({ message: 'You activated the account' })

    }

    res.status(400)
    res.json({ message: 'Invalid url entered' })


})


const resetPassword = asyncHandler( async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })


    if (user) {
        const token = await Token.create({
            userId: user._id,
            token: v4()
        })

        const link = `http://localhost:${process.env.PORT}/user/reset-password/${user._id}/${token.token}`

        sendEmail(email, 'Reset password', `<h3>Reset link <a href=${link}>Click here</a></h3>`)
        return res.status(200).json({ message: 'Password reset link sent to your email. Please check' })

    }
    
    res.status(400).json({ message: 'We couldn\'t find the account with given email' })

})

const setNewPassword = asyncHandler( async (req, res) => {
    const { userId, token } = req.params
    const { password } = req.body

    const _token = await Token.find({ userId, token })

    if (_token) {
        const user = await User.findById(userId)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user.password = hashedPassword
        user.save()
        return res.status(200).json({ message: 'Password reset successfully' })
    } 

    res.status(400).json({ message: 'Broken link' })

})

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) 
        throw new Error('Please provide all fields')
    
    
    const user = await User.findOne({ email })

    
    if (user && user.status === 'pending') {
        const token = await Token.create({
            userId: user._id,
            token: v4()
        })
        const link = `http://localhost:${process.env.PORT}/user/activate-account/${token.token}`

        sendEmail(email, activateEmailSubject(user.username), activateEmail(user.username, link))
        return res.json({ message: 'You haven\'t activated your account, check your email to activate your account' })
    }

    if (!user) {
        throw new Error('No user with provided email exists')
    }

    if (( await bcrypt.compare(password, user.password) )) {
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email
        })
    } else {
        throw new Error('Invalid Credentials')
    }
})





module.exports = {
    registerUser,
    ActivateAccount,
    resetPassword,
    setNewPassword,
    loginUser
}