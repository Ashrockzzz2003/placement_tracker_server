const otpGenerator = require('otp-generator')

const generateOTP = () => {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
}

module.exports = generateOTP;