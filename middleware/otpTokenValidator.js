require('dotenv').config();
const paseto = require('paseto');
const { V4: { verify } } = paseto;
const fs = require('fs');
const secret_key = process.env.SECRET_KEY;

async function otpTokenValidator(req, res, next) {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader && tokenHeader.split(' ')[1];

    if (tokenHeader == null || token == null) {
        res.status(401).send({
            "ERROR": "No Token. Warning."
        });
        return;
    }

    const public_key = fs.readFileSync('./RSA/public_key.pem');
    try {
        const payLoad = await verify(token, public_key);
        if (payLoad["secret_key"] == secret_key) {
            req.authorization_tier = payLoad["userRole"];

            if (req.authorization_tier == "0") {
                req.managerEmail = payLoad["userEmail"];
            } else if (req.authorization_tier == "2") {
                req.body.studentEmail = payLoad["userEmail"];
                req.body.studentRollNo = payLoad["studentRollNo"];
                req.body.studentPassword = payLoad["studentPassword"];
                req.body.studentName = payLoad["studentName"];
                req.body.studentSection = payLoad["studentSection"];
                req.body.studentGender = payLoad["studentGender"];
                req.body.studentBatch = payLoad["studentBatch"];
                req.body.studentDept = payLoad["studentDept"];
                req.body.isHigherStudies = payLoad["isHigherStudies"];
                req.body.isPlaced = payLoad["isPlaced"];
                req.body.CGPA = payLoad["CGPA"];
            }
            
            next();
            return;
        } else {
            res.status(401).send({
                "ERROR": "Unauthorized access. Warning."
            });
            return;
        }
    } catch (err) {
        res.status(401).send({
            "ERROR": "Unauthorized access. Warning."
        });
        return;
    }

}

async function resetPasswordValidator(req, res, next) {
    const tokenHeader = req.headers.authorization;
    //console.log("tokenHeader:", tokenHeader);
    const token = tokenHeader && tokenHeader.split(' ')[1];
    //console.log("token:", token);

    if (tokenHeader == null || token == null) {
        res.status(401).send({
            "ERROR": "No Token. Warning."
        });
        return;
    }

    const public_key = fs.readFileSync('./RSA/public_key.pem');
    try {
        const payLoad = await verify(token, public_key);
        if (payLoad["secret_key"] == secret_key) {
            req.authorization_tier = payLoad["userRole"];
            req.body.userEmail = payLoad["userEmail"];
            next();
            return;
        } else {
            res.status(401).send({
                "ERROR": "Unauthorized access. Warning."
            });
            return;
        }
    } catch (err) {
        res.status(401).send({
            "ERROR": "Unauthorized access. Warning."
        });
        return;
    }

}

module.exports = [otpTokenValidator, resetPasswordValidator];