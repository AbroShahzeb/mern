const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email address'],
        validate: [isEmail, 'Please provide a valid email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active'],
        default: 'pending'
    }
},{
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)