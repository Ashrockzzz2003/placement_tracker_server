require('dotenv').config();
const paseto = require('paseto');
const {V4: {sign}} = paseto;
const fs = require('fs');
const secret_key = process.env.SECRET_KEY;

async function createOtpToken(data) {
    data.secret_key = secret_key;
    const private_key = fs.readFileSync('./RSA/private_key.pem');
    var token = "";
    token = await sign(data, private_key, { expiresIn: '5 m' });

    return token;
}

module.exports = createOtpToken;