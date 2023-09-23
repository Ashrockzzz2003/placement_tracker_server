const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "auth.amrita.placements@gmail.com",
        pass: "Authamrita123",
    },
});

const sendEmail = async (mailOptions, callback) => {
    try {
        const info = await transporter.sendMail(mailOptions)
        callback(info);
    } catch (error) {
        callback(error);
    }
};

module.exports = sendEmail;