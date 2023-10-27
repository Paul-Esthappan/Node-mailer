const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const mailer = require("../models/models");
const nodemailers = require("../models/models");
const transpoter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  // secure:true
});

function generateOTP() {
  return Math.floor(1000 + Math.random() * 5000);
}
const updateOTPExpiration = async (email) => {
  const otp = generateOTP();
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    const updatedUser = await mailer.findOneAndUpdate(
      { email },
      { $set: { otpExpiration } },
      { $set: { otp } },
      { new: true }
    );

      
    if (updatedUser) {
      return updatedUser;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error("Failed to update OTP expiration: " + err.message);
  }
};

const signup = async (req, res) => {
  const { email } = req.body;
  console.log("email", email);

  console.log("email : ", email);

  try {
    const userdata = await nodemailers.findOne({ email });
    if (userdata) {
      const otp = generateOTP();
      const otpExpiraction = new Date(Date.now() + 5 * 60 * 1000);
        
             userdata.otp = otp;
            userdata.otpExpiraction = otpExpiraction;


      await userdata.save();

      //sent otp via mail
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "your otp",
        text: `Your opt is shown below with validity of 5 min ${otp}`,
      };
        const info = await transpoter.sendMail(mailOptions);
        
        return res.status(200).json({ message: "OTP sent Successful", otp });
        

    } else {
        const otp = generateOTP();
        const otpExpiraction = new Date(Date.now() + 5 * 60 * 1000);

                 const user = new mailer({
                email,
                otp,
                otpExpiraction
                 });
             await user.save();
            
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Your OTP',
                text: `Your OTP is shown below with a validity of 5 minutes: ${otp}`
            };

            const info = await transpoter.sendMail(mailOptions);

            return res.status(200).json({ message: "OTP sent successfully", otp });
      }
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: "Error sending OTP" });
    }
};

const forgotpassword = async (req, res) => {
  const { email, otp } = req.body;
  console.log("email", email, "otp sens", otp);

  try {
    const userdata = await nodemailers.findOne({ email });
    console.log("userdatass is", userdata);

    if (userdata) {
      // Check if OTP matches
      if (otp === userdata.otp) {
        const currenttime = new Date(Date.now());
        console.log("ctime", currenttime);
        if (userdata.otpExpiraction > currenttime) {
          return res.status(200).json({ message: "OTP valid" });
        } else {
          return res.status(500).json({ message: "OTP expried" });
        }
      } else {
        return res.status(500).json({ message: "OTP invalid" });
      }
    } else {
      return res.status(500).json({ message: "user not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error , not valid  OTP" });
  }
};

module.exports = { signup, forgotpassword };
