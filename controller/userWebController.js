const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const otpTokenValidator = require('../middleware/otpTokenValidator');

const generateOTP = require("../middleware/otpGenerator");
const passwordGenerator = require('secure-random-password');

const crypto = require('crypto');

const mailer = require('../mail/mailer');

const fs = require('fs');
const validator = require('validator');

module.exports = {
    test: async (req, res) => {
        return res.status(200).send({ "message": 'Ok' });
    },

    toggleOfficialAccountStatus: [
        /*
        Headers: {
            "Authorization": "Bearer <SECRET_TOKEN>"
        }

        JSON
        {
            "managerId": "<manager_id>",
            "accountStatus": "<0/1/2>"
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || req.body.userRole !== "1") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            if (req.body.managerId === null || req.body.managerId === undefined || req.body.managerId === "" || req.body.accountStatus === null || req.body.accountStatus === undefined || req.body.accountStatus === "") {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (req.body.accountStatus !== "0" && req.body.accountStatus !== "1" && req.body.accountStatus !== "2") {
                return res.status(400).send({ "message": "Invalid account status!" });
            }

            let db_connection = await db.promise().getConnection();

            try {

                await db_connection.query(`LOCK TABLES managementData WRITE`);

                // check if actually admin
                let [admin] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ? AND managerRole = ?`, [req.body.userEmail, "1"]);

                if (admin.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                // check if manager exists.

                let [manager] = await db_connection.query(`SELECT * from managementData WHERE id = ?`, [req.body.managerId]);

                if (manager.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Manager doesn't exist!" });
                }

                // 2 -> 0, 0 -> 2, 1 -> 2
                // Only the manager themselves can change their account status from 0 to 1.
                if ((manager[0].accountStatus === "2" && req.body.accountStatus === "0") || (manager[0].accountStatus === "0" && req.body.accountStatus === "2") || (manager[0].accountStatus === "1" && req.body.accountStatus === "2")) {
                    await db_connection.query(`UPDATE managementData SET accountStatus = ? WHERE id = ?`, [req.body.accountStatus, req.body.managerId]);
                    await db_connection.query(`UNLOCK TABLES`);

                    if (req.body.accountStatus === "2") {
                        // send mail
                        mailer.accountDeactivated(manager[0].managerName, manager[0].managerEmail);
                    }

                    return res.status(200).send({ "message": "Account status updated!", "accountStatus": req.body.accountStatus });
                }

                await db_connection.query(`UNLOCK TABLES`);
                return res.status(400).send({ "message": "Action not permitted" });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - toggleOfficialAccountStatus - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            }

        }
    ],

    getRegisteredOfficials: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || req.body.userRole !== "1") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ`);

                // check if actually admin
                let [admin] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ? AND managerRole = ?`, [req.body.userEmail, "1"]);

                if (admin.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                // select all fields except password.

                let [managers] = await db_connection.query(`SELECT id, managerEmail, managerName, managerRole, createdAt, accountStatus from managementData WHERE managerRole = ?`, ["0"]);

                if (managers.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(200).send({ "message": "No managers registered!", "managers": [] });
                }

                await db_connection.query(`UNLOCK TABLES`);
                return res.status(200).send({ "message": "Managers fetched!", "managers": managers });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getRegisteredOfficials - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        },
    ],

    registerOfficial: [
        /*
        Headers: {
            "Authorization": "Bearer <SECRET_TOKEN>"
        }
        JSON
        {
            "managerEmail": "<email_id>",
            "managerName": "<name>",
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || req.body.userRole !== "1") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            if (req.body.managerEmail === null || req.body.managerEmail === undefined || req.body.managerEmail === "" || !validator.isEmail(req.body.managerEmail) || req.body.managerName === null || req.body.managerName === undefined || req.body.managerName === "") {
                return res.status(400).send({ "message": "Missing details." });
            }

            let db_connection = await db.promise().getConnection();

            try {
                // check if the manager is already registered.
                await db_connection.query(`LOCK TABLES managementData WRITE`);

                // check if actually admin
                let [admin] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ? AND managerRole = ?`, [req.body.userEmail, "1"]);

                if (admin.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                let [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ?`, [req.body.managerEmail]);

                if (manager.length > 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Manager already registered!" });
                }

                // generate a random password for the manager.
                const managerPassword = passwordGenerator.randomPassword({
                    length: 8,
                    characters: [passwordGenerator.lower, passwordGenerator.upper, passwordGenerator.digits]
                });

                // sha256 hash the password.
                const passwordHashed = crypto.createHash('sha256').update(managerPassword).digest('hex');

                // Email the password to the manager.
                mailer.officialCreated(req.body.managerName, req.body.managerEmail, managerPassword);
                // console.log(managerPassword);
                // console.log(passwordHashed);

                await db_connection.query(`INSERT INTO managementData (managerEmail, managerName, managerPassword, managerRole, createdAt, accountStatus) VALUES (?, ?, ?, ?, ?, ?)`, [req.body.managerEmail, req.body.managerName, passwordHashed, "0", new Date(), "0"]);

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({ "message": "Manager registered!" });
            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - registerOfficial - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        },
    ],

    userLogin: async (req, res) => {
        /*
        JSON
        {
            "userEmail": "<email_id>",
            "userPassword": "<password>"
        }
        */
        if (req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || req.body.userPassword === null || req.body.userPassword === undefined || req.body.userPassword === "") {
            return res.status(400).send({ "message": "Missing details." });
        }

        let db_connection = await db.promise().getConnection();

        try {
            await db_connection.query(`LOCK TABLES studentData READ, managementData READ`);

            let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ? AND studentPassword = ?`, [req.body.userEmail, req.body.userPassword]);

            if (student.length > 0) {
                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.userEmail,
                    "userRole": "2",
                });

                await db_connection.query(`UNLOCK TABLES`);

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
            }

            let [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ? AND managerPassword = ?`, [req.body.userEmail, req.body.userPassword]);

            if (manager.length > 0) {
                if (manager[0].accountStatus === "0") {
                    // send otp to the manager's email. First time verification.
                    const otp = generateOTP();

                    await db_connection.query(`LOCK TABLES managementRegister WRITE`);

                    let [manager_2] = await db_connection.query(`SELECT * from managementRegister WHERE managerEmail = ?`, [req.body.userEmail]);

                    if (manager_2.length === 0) {
                        await db_connection.query(`INSERT INTO managementRegister (managerEmail, otp, createdAt) VALUES (?, ?, ?)`, [req.body.userEmail, otp, new Date()]);
                    } else {
                        await db_connection.query(`UPDATE managementRegister SET otp = ?, createdAt = ? WHERE managerEmail = ?`, [otp, new Date(), req.body.userEmail]);
                    }

                    

                    // send mail
                    mailer.loginOTP(manager[0].managerName, otp, manager[0].managerEmail);

                    const secret_token = await otpTokenGenerator({
                        "userEmail": manager[0].managerEmail,
                        "userRole": manager[0].managerRole,
                    });

                    await db_connection.query(`UNLOCK TABLES`);

                    return res.status(200).send({
                        "message": "First time login! OTP sent to email.",
                        "SECRET_TOKEN": secret_token,
                        "managerEmail": manager[0].managerEmail,
                        "managerName": manager[0].managerName,
                    });
                }

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.userEmail,
                    "userRole": manager[0].managerRole,
                });

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Manager logged in!",
                    "SECRET_TOKEN": secret_token,
                    "managerEmail": manager[0].managerEmail,
                    "managerName": manager[0].managerName,
                    "managerRole": manager[0].managerRole,
                    "managerId": manager[0].id,
                    "accountStatus": manager[0].accountStatus,
                });
            }

            await db_connection.query(`UNLOCK TABLES`);

            return res.status(400).send({ "message": "Invalid email or password!" });
        } catch (err) {
            console.log(err);
            const time = new Date();
            fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - userLogin - ${err}\n`);
            return res.status(500).send({ "message": "Internal Server Error." });
        } finally {
            await db_connection.query(`UNLOCK TABLES`);
            db_connection.release();
        }
    },

    loginVerify: [
        otpTokenValidator,
        async (req, res) => {
            if (req.authorization_tier !== "0" || req.managerEmail === null || req.managerEmail === undefined || req.managerEmail === "" || !validator.isEmail(req.managerEmail) || req.body.otp === null || req.body.otp === undefined || req.body.otp === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {

                await db_connection.query(`LOCK TABLES managementRegister WRITE, managementData WRITE`);

                let [check_1] = await db_connection.query(`DELETE from managementRegister WHERE managerEmail = ? AND otp = ?`, [req.managerEmail, req.body.otp]);

                if (check_1.affectedRows === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Invalid OTP!" });
                }

                let [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ?`, [req.managerEmail]);

                if (manager.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Manager doesn't exist!" });
                }

                await db_connection.query(`UPDATE managementData SET accountStatus = ? WHERE managerEmail = ?`, ["1", req.managerEmail]);

                await db_connection.query(`UNLOCK TABLES`);

                const secret_token = await webTokenGenerator({
                    "userEmail": req.managerEmail,
                    "userRole": manager[0].managerRole,
                });

                return res.status(200).send({
                    "message": "Manager verifed successfully!",
                    "SECRET_TOKEN": secret_token,
                    "managerEmail": manager[0].managerEmail,
                    "managerName": manager[0].managerName,
                    "managerRole": manager[0].managerRole,
                    "managerId": manager[0].id,
                    "accountStatus": manager[0].accountStatus,
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - loginVerify - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        }
    ]
}