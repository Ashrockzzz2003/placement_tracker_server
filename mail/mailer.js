const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        "user": "",
        "pass": ""
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = sendMail;