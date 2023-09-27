const mailer = require('nodemailer');
const fs = require('fs');
const TEMPLATE_OFFICIAL_CREATED = require('./template_acc_reg');
const TEMPLATE_OTP = require('./template_otp');
const TEMPLATE_ACCOUNT_DEACTIVATED = require('./template_account_deactivated');
const TEMPLATE_PWRESET_OTP = require('./template_pwreset_otp');

const transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'auth.amrita.placements@gmail.com',
        pass: 'hultomvgjxgpueki'
    }
});

module.exports = {
    officialCreated: (fullName, userEmail, password) => {
        var mailOptions = {
            from: {
                name: "Amrita Placement Tracker",
                address: 'auth.amrita.placements@gmail.com'
            },
            to: userEmail,
            subject: 'Welcome to Amrita Placement Tracker',
            html: TEMPLATE_OFFICIAL_CREATED(userEmail, fullName, password)
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('officialCreated Email sent: ' + userEmail);
            }
        });
    },

    reset_PW_OTP: (userName, otp, userEmail) => {
        var mailOptions = {
            from: {
                name: "Amrita Placement Tracker",
                address: 'auth.amrita.placements@gmail.com'
            },
            to: userEmail,
            subject: 'Reset Password OTP - Amrita Placement Tracker',
            html: TEMPLATE_PWRESET_OTP(otp, userName)
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                //console.log('error while sending otp');
            } else {
                console.log('PasswordResetOTP Email sent: ' + userEmail);
            }
        });
    },

    loginOTP: (userName, otp, userEmail) => {
        var mailOptions = {
            from: {
                name: "Amrita Placement Tracker",
                address: 'auth.amrita.placements@gmail.com'
            },
            to: userEmail,
            subject: 'Account Registration OTP - Amrita Placement Tracker',
            html: TEMPLATE_OTP(otp, userName)
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                //console.log('error while sending otp');
            } else {
                console.log('loginOtp Email sent: ' + userEmail);
            }
        });
    },

    accountDeactivated: (fullName, userEmail) => {
        var mailOptions = {
            from: {
                name: "Amrita Placement Tracker",
                address: 'auth.amrita.placements@gmail.com'
            },
            to: userEmail,
            subject: 'Account Deactivated - Amrita Placement Tracker',
            html: TEMPLATE_ACCOUNT_DEACTIVATED(userEmail, fullName)
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('officialCreated Email sent: ' + userEmail);
            }
        });
    }
        
}