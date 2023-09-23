const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const otpTokenValidator = require('../middleware/otpTokenValidator');

const generateOTP = require("../middleware/otpGenerator");
const TEMPLATE_OTP = require("../mail/template_otp");
const sendEmail = require("../mail/mailer");

const fs = require('fs');
const validator = require('validator');

module.exports = {
    test: async (req, res) => {
        return res.status(200).send({ "message": 'Ok' });
    },

    userRegister: async (req, res) => {
        if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "0" && req.body.userRole !== "1")) {
            return res.status(400).send({ "message": "Check userRole!" });
        }

        if (req.body.userRole === "0") {

            if (req.body.managerEmail === null || req.body.managerEmail === undefined || req.body.managerEmail === "") {
                return res.status(400).send({ "message": "Check managerEmail!" });
            }

            if (req.body.managerPassword === null || req.body.managerPassword === undefined || req.body.managerPassword === "") {
                return res.status(400).send({ "message": "Check managerPassword!" });
            }

            if (req.body.managerName === null || req.body.managerName === undefined || req.body.managerName === "") {
                return res.status(400).send({ "message": "Check managerName!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData WRITE, managementRegister WRITE`);

                let [manager] = await db_connection.query(`SELECT * FROM managementData WHERE managerEmail = ?`, [req.body.managerEmail]);

                if (manager.length > 0) {
                    return res.status(400).send({ "message": "Manager already registered!" });
                }

                const otp = generateOTP();

                [manager] = await db_connection.query(`SELECT * from managementRegister WHERE managerEmail = ?`, [req.body.managerEmail]);

                if (manager.length > 0) {
                    await db_connection.query(`UPDATE managementRegister SET otp = ? WHERE managerEmail = ?`, [otp, req.body.managerEmail]);
                } else {
                    await db_connection.query(`INSERT INTO managementRegister (managerEmail, otp, createdAt) VALUES (?, ?, ?)`, [req.body.managerEmail, otp, new Date().toISOString().slice(0, 19).split('T')[0]]);
                }

                const mailOptions = {
                    from: "Amrita Placement Tracker <auth.amrita.placements@gmail.com>",
                    to: "someone@gmail.com",
                    subject: "Registration OTP Verification",
                    html: TEMPLATE_OTP(otp, req.body.managerEmail),
                }

                await sendEmail(mailOptions, async (info) => {
                    if (info.messageId) {
                        console.log("[MESSAGE]: Email sent: %s", info.messageId);
                        const secret_token = await otpTokenGenerator({
                            "userEmail": req.body.managerEmail,
                            "userRole": req.body.userRole,
                            "managerName": req.body.managerName,
                            "managerRole": req.body.userRole,
                            "managerPassword": req.body.managerPassword
                        });

                        return res.status(200).send({ "message": "OTP sent.", "SECRET_TOKEN": secret_token });
                    } else {
                        console.log(info);
                        const time = new Date();
                        fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - managerRegister - ${info}\n`);
                        return res.status(500).send({ "message": "Email not sent." });
                    }
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - managerRegister - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        } else if (req.body.userRole === "1") {
            // Student Registration
        }
    },

    userRegisterVerify: [
        otpTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "0" && req.body.userRole !== "1")) {
                return res.status(400).send({ "message": "Check userRole!" });
            }

            if (req.body.userRole === "0") {

                if (req.body.managerEmail === null || req.body.managerEmail === undefined || req.body.managerEmail === "") {
                    return res.status(400).send({ "message": "Check managerEmail!" });
                }

                if (req.body.managerPassword === null || req.body.managerPassword === undefined || req.body.managerPassword === "") {
                    return res.status(400).send({ "message": "Check managerPassword!" });
                }

                if (req.body.managerName === null || req.body.managerName === undefined || req.body.managerName === "") {
                    return res.status(400).send({ "message": "Check managerName!" });
                }

                if (req.body.otp === null || req.body.otp === undefined || req.body.otp === "") {
                    return res.status(400).send({ "message": "Check otp!" });
                }

                let db_connection = await db.promise().getConnection();

                try {

                    await db_connection.query(`LOCK TABLES managementData WRITE, managementRegister WRITE`);

                    let [check_1] = await db_connection.query(`DELETE FROM managerRegister WHERE managerEmail = ? AND otp = ?`, [req.body.managerEmail, req.body.otp]);

                    await db_connection.query(`UNLOCK TABLES`);

                    if (check_1.affectedRows === 1) {

                        await db_connection.query(`LOCK TABLES managementData WRITE`);

                        let [check_2] = await db_connection.query(`SELECT * FROM managementData WHERE managerEmail = ?`, [req.body.managerEmail]);

                        if (check_2.length > 0) {
                            return res.status(400).send({ "message": "Manager already registered!" });
                        }

                        let [res_1] = await db_connection.query(`INSERT INTO managementData (managerEmail, managerPassword, managerName, managerRole, createdAt) VALUES (?, ?, ?, ?, ?)`, [req.body.managerEmail, req.body.managerPassword, req.body.managerName, req.body.userRole, new Date().toISOString().slice(0, 19).split('T')[0]]);

                        await db_connection.query(`UNLOCK TABLES`);

                        if (res_1.affectedRows === 1) {
                            const secret_token = await webTokenGenerator({
                                "userEmail": req.body.managerEmail,
                                "userRole": req.body.userRole,
                            });

                            return res.status(200).send({
                                "message": "Manager registered!",
                                "SECRET_TOKEN": secret_token,
                                "managerEmail": req.body.managerEmail,
                                "managerName": req.body.managerName,
                                "managerRole": req.body.userRole
                            });

                        } else {
                            return res.status(400).send({ "message": "Manager registration failed!" });
                        }

                    } else {
                        return res.status(400).send({ "message": "Invalid OTP" });
                    }

                } catch (err) {
                    console.log(err);
                    const time = new Date();
                    fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - managerRegister - ${err}\n`);
                    return res.status(500).send({ "message": "Internal Server Error." });
                } finally {
                    await db_connection.query(`UNLOCK TABLES`);
                }


            } else if (req.body.userRole === "1") {

            }


        }
    ],
}