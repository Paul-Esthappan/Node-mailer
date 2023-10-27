const mongoose = require('mongoose')


const nodemailerSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
    },
    otp: {
        type: String,
        required:true,
    },
    otpExpiraction: {
        type: Date,
        required:true,
    }

})

const nodemailers = mongoose.model('Nodemailer', nodemailerSchema)
module.exports = nodemailers