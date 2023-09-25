const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const otpTokenValidator = require('../middleware/otpTokenValidator');

const generateOTP = require("../middleware/otpGenerator");
const TEMPLATE_OTP = require("../mail/template_otp");
const sendEmail = require("../mail/mailer");
const passwordGenerator = require('secure-random-password');

const fs = require('fs');
const validator = require('validator');

module.exports = {
    test: async (req, res) => {
        return res.status(200).send({ "message": 'Ok' });
    },

    newManager: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userRole !== "1" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail)) {
                return res.status(400).send({ "message": "Bad Details" });
            }

            if (req.body.managerEmail === null || req.body.managerEmail === undefined || req.body.managerEmail === "" || !validator.isEmail(req.body.managerEmail) || req.body.managerName === null || req.body.managerName === undefined || req.body.managerName === "" || req.body.managerRole === null || req.body.managerRole === undefined || req.body.managerRole === "" || req.body.managerRole !== "0") {
                return res.status(400).send({ "message": "Bad Details" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                // check if it's really admin
                await db_connection.query(`LOCK TABLES managementData READ`);

                let [admin] = await db_connection.query(`SELECT * FROM managementData WHERE managerEmail = ? AND managerRole = '1'`, [req.body.userEmail]);

                if (admin.length === 0) {
                    return res.status(400).send({ "message": "Access Restricted!" });
                }

                await db_connection.query(`UNLOCK TABLES`);

                // check if manager already exists
                await db_connection.query(`LOCK TABLES managementData READ`);

                let [manager] = await db_connection.query(`SELECT * FROM managementData WHERE managerEmail = ?`, [req.body.managerEmail]);

                if (manager.length > 0) {
                    return res.status(400).send({ "message": "Manager already registered!" });
                }

                await db_connection.query(`UNLOCK TABLES`);

                // generate a strong password
                const strongPassword = passwordGenerator.randomPassword({ characters: [password.lower, password.upper, password.digits] })

                // insert into managementData
                await db_connection.query(`LOCK TABLES managementData WRITE`);

                let [res_1] = await db_connection.query(`INSERT INTO managementData (managerEmail, managerPassword, managerName, managerRole, createdAt) VALUES (?, ?, ?, ?, ?)`, [req.body.managerEmail, strongPassword, req.body.managerName, req.body.managerRole, new Date().toISOString().slice(0, 19).split('T')[0]]);

                await db_connection.query(`UNLOCK TABLES`);

                // send email to manager with password and login Instructions

                if (res_1.affectedRows === 1) {
                    return res.status(200).send({
                        "message": "Manager registered!",
                        "id": res_1.insertId,
                        "managerEmail": req.body.managerEmail,
                        "managerName": req.body.managerName,
                        "managerRole": req.body.managerRole,
                    });
                }

                return res.status(400).send({ "message": "Manager registration failed!" });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - newManager - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        },
    ],

    userLogin: async (req, res) => {
        if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "0" && req.body.userRole !== "1" && req.body.userRole !== "2")) {
            return res.status(400).send({ "message": "Bad Details" });
        }

        if (req.body.userRole === "0" || req.body.userRole === "1") {
            if (req.body.managerEmail === null || req.body.managerEmail == undefined || req.body.managerEmail === "" || !validator.isEmail(req.body.managerEmail)) {
                return res.status(400).send({ "message": "Bad Details" });
            }

            if (req.body.managerPassword === null || req.body.managerPassword === undefined || req.body.managerPassword === "") {
                return res.status(400).send({ "message": "Bad Details" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ`);

                let [manager] = await db_connection.query(`SELECT * from managerData WHERE managerEmail = ? AND managerPassword = ?`, [req.body.managerEmail, req.body.managerPassword]);

                if (manager.length === 0) {
                    return res.status(400).send({ "message": "Invalid email or password!" });
                }

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.managerEmail,
                    "userRole": req.body.userRole,
                });

                return res.status(200).send({
                    "message": "Manager logged in!",
                    "SECRET_TOKEN": secret_token,
                    "managerEmail": manager[0].managerEmail,
                    "managerName": manager[0].managerName,
                    "managerRole": manager[0].managerRole,
                    "managerId": manager[0].id,
                });
            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - managerLogin - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        } else if (req.body.userRole === "2") {

            if (req.body.studentEmail === null || req.body.studentEmail == undefined || req.body.studentEmail === "" || !validator.isEmail(req.body.studentEmail)) {
                return res.status(400).send({ "message": "Check studentEmail!" });
            }

            if (req.body.studentPassword === null || req.body.studentPassword === undefined || req.body.studentPassword === "") {
                return res.status(400).send({ "message": "Check studentPassword!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES studentData READ`);

                let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ? AND studentPassword = ?`, [req.body.studentEmail, req.body.studentPassword]);

                if (student.length === 0) {
                    return res.status(400).send({ "message": "Invalid email or password!" });
                }

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.studentEmail,
                    "userRole": req.body.userRole,
                });

                return res.status(200).send({
                    "message": "Student logged in!",
                    "SECRET_TOKEN": secret_token,
                    "studentEmail": student[0].studentEmail,
                    "studentName": student[0].studentName,
                    "studentRollNo": student[0].studentRollNo,
                    "studentId": student[0].id,
                    "studentSection": student[0].studentSection,
                    "studentGender": student[0].studentGender,
                    "studentBatch": student[0].studentBatch,
                    "studentDept": student[0].studentDept,
                    "isHigherStudies": student[0].isHigherStudies,
                    "isPlaced": student[0].isPlaced,
                    "CGPA": student[0].CGPA,
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - studentLogin - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        } else {
            return res.status(400).send({ "message": "Access Restricted!" });
        }
    },

    userRegister: async (req, res) => {
        if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "0" && req.body.userRole !== "1")) {
            return res.status(400).send({ "message": "Bad Details" });
        }

        if (req.body.userRole === "0") {

            if (req.body.managerEmail === null || req.body.managerEmail === undefined || req.body.managerEmail === "") {
                return res.status(400).send({ "message": "Bad Details" });
            }

            if (req.body.managerPassword === null || req.body.managerPassword === undefined || req.body.managerPassword === "") {
                return res.status(400).send({ "message": "Bad Details" });
            }

            if (req.body.managerName === null || req.body.managerName === undefined || req.body.managerName === "") {
                return res.status(400).send({ "message": "Bad Details" });
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

        } else if (req.body.userRole === "2") {
            // Student Registration
        } else {
            return res.status(400).send({ "message": "Access Restricted!" });
        }
    },

    userRegisterVerify: [
        otpTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "0" && req.body.userRole !== "1")) {
                return res.status(400).send({ "message": "Bad Details" });
            }

            if (req.body.userRole === "0") {

                if (req.body.managerEmail === null || req.body.managerEmail === undefined || req.body.managerEmail === "") {
                    return res.status(400).send({ "message": "Bad Details" });
                }

                if (req.body.managerPassword === null || req.body.managerPassword === undefined || req.body.managerPassword === "") {
                    return res.status(400).send({ "message": "Bad Details" });
                }

                if (req.body.managerName === null || req.body.managerName === undefined || req.body.managerName === "") {
                    return res.status(400).send({ "message": "Bad Details" });
                }

                if (req.body.otp === null || req.body.otp === undefined || req.body.otp === "") {
                    return res.status(400).send({ "message": "Bad Details" });
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


            } else if (req.body.userRole === "2") {

            } else {
                return res.status(400).send({ "message": "Access Restricted!" });
            }


        }
    ],
}