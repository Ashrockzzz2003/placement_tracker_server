const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const [otpTokenValidator, resetPasswordValidator] = require('../middleware/otpTokenValidator');

const generateOTP = require("../middleware/otpGenerator");

const mailer = require('../mail/mailer');
const queries = require('../schema/queries/userWebControllerQueries');

const fs = require('fs');
const validator = require('validator');
const tokenValidator = require('../middleware/webTokenValidator');

module.exports = {
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
            //await db_connection.query(`LOCK TABLES studentData READ, managementData READ`);
            await db_connection.query(queries.userLogin.locks.lockStudentDataAndManagementData);

            //let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ? AND studentPassword = ?`, [req.body.userEmail, req.body.userPassword]);
            let [student] = await db_connection.query(queries.userLogin.queries.checkStudentLoginCredentials, [req.body.userEmail, req.body.userPassword]);

            if (student.length > 0) {

                if (student[0].studentAccountStatus === "2") {
                    await db_connection.query(queries.unlockTables);
                    return res.status(401).send({ "message": "Your Account has been deactivated. Check you mail for further instructions." });
                } else if (student[0].studentAccountStatus !== "1") {
                    await db_connection.query(queries.unlockTables);
                    return res.status(401).send({ "message": "Access Restricted." });
                }

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.userEmail,
                    "userRole": "2",
                });

                await db_connection.query(queries.unlockTables);

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
                    "CGPA": student[0].CGPA
                });
            }

            //let [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ? AND managerPassword = ?`, [req.body.userEmail, req.body.userPassword]);
            let [manager] = await db_connection.query(queries.userLogin.queries.checkManagerLoginCredentials, [req.body.userEmail, req.body.userPassword]);

            if (manager.length > 0) {
                if (manager[0].accountStatus === "2") {
                    await db_connection.query(queries.unlockTables);
                    return res.status(401).send({ "message": "Your Account has been deactivated. Check you mail for further instructions." });
                }

                if (manager[0].accountStatus === "0") {
                    // send otp to the manager's email. First time verification.
                    const otp = generateOTP();

                    //await db_connection.query(`LOCK TABLES managementRegister WRITE`);
                    await db_connection.query(queries.userLogin.locks.lockManagementRegister);

                    //let [manager_2] = await db_connection.query(`SELECT * from managementRegister WHERE managerEmail = ?`, [req.body.userEmail]);
                    let [manager_2] = await db_connection.query(queries.userLogin.queries.checkIfManagerIsRegistered, [req.body.userEmail]);

                    if (manager_2.length === 0) {
                        //await db_connection.query(`INSERT INTO managementRegister (managerEmail, otp) VALUES (?, ?)`, [req.body.userEmail, otp]);
                        await db_connection.query(queries.userLogin.queries.registerManager, [req.body.userEmail, otp]);
                    } else {
                        //await db_connection.query(`UPDATE managementRegister SET otp = ?, createdAt = ? WHERE managerEmail = ?`, [otp, Date.now(), req.body.userEmail]);\
                        await db_connection.query(queries.userLogin.queries.updateManagerOtp, [otp, Date.now(), req.body.userEmail]);
                    
                    }


                    // send mail
                    mailer.loginOTP(manager[0].managerName, otp, manager[0].managerEmail);

                    const secret_token = await otpTokenGenerator({
                        "userEmail": manager[0].managerEmail,
                        "userRole": manager[0].managerRole,
                    });

                    await db_connection.query(queries.unlockTables);

                    return res.status(201).send({
                        "message": "First time login! OTP sent to email.",
                        "SECRET_TOKEN": secret_token,
                        "managerEmail": manager[0].managerEmail,
                        "managerName": manager[0].managerName,
                    });
                } else if (manager[0].accountStatus !== "1") {
                    await db_connection.query(queries.unlockTables);
                    return res.status(401).send({ "message": "Access Restricted." });
                }

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.userEmail,
                    "userRole": manager[0].managerRole,
                });

                await db_connection.query(queries.unlockTables);

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

            await db_connection.query(queries.unlockTables);

            return res.status(400).send({ "message": "Invalid email or password!" });
        } catch (err) {
            console.log(err);
            const time = new Date();
            fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - userLogin - ${err}\n`);
            return res.status(500).send({ "message": "Internal Server Error." });
        } finally {
            await db_connection.query(queries.unlockTables);
            db_connection.release();
        }
    },

    loginVerify: [
        /*
        JSON
        {
            "otp":"<otp>",
            "newPassword": "<password>"
        }
        */
        otpTokenValidator,
        async (req, res) => {
            if (req.authorization_tier !== "0" || req.managerEmail === null || req.managerEmail === undefined || req.managerEmail === "" || !validator.isEmail(req.managerEmail) || req.body.otp === null || req.body.otp === undefined || req.body.otp === "" || req.body.newPassword === null || req.body.newPassword === undefined || req.body.newPassword === "") {
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
                    return res.status(401).send({ "message": "Manager doesn't exist!" });
                }

                await db_connection.query(`UPDATE managementData SET accountStatus = ?, managerPassword = ? WHERE managerEmail = ?`, ["1", req.body.newPassword, req.managerEmail]);

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
    ],

    forgotPassword: async (req, res) => {
        /*
        JSON
        {
            "userEmail": "<email_id>"
        }
        */
        if (req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail)) {
            return res.status(400).send({ "message": "Missing details." });
        }

        let db_connection = await db.promise().getConnection();

        try {

            await db_connection.query(`LOCK TABLES studentData READ, managementData READ`);
            let [student] = await db_connection.query(`SELECT studentName,studentAccountStatus from studentData where studentEmail = ?`, [req.body.userEmail]);
            let [manager] = await db_connection.query(`SELECT managerName,managerRole,accountStatus from managementData where managerEmail = ?`, [req.body.userEmail]);

            if (student.length === 0 && manager.length === 0) {
                await db_connection.query(`UNLOCK TABLES`);
                return res.status(401).send({ "message": "User doesn't exist!" });
            }
            await db_connection.query(`UNLOCK TABLES`);

            const otp = generateOTP();
            let name = "";
            let userRole = "";

            if (manager.length === 0) {

                // console.log(student[0]);

                if (student[0].studentAccountStatus === "2") {
                    return res.status(401).send({ "message": "Your Account has been deactivated by admin due to security reasons. Check you mail for further instructions." });
                } else if (student[0].studentAccountStatus === "0") {
                    return res.status(401).send({ "message": "Your Account has not been activated yet. Check you mail for further instructions and login with the password in mail to proceed." });
                } else if (student[0].studentAccountStatus !== "1") {
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                await db_connection.query(`LOCK TABLES studentRegister WRITE`);
                name = student[0]["studentName"];
                userRole = "2";

                let [student_2] = await db_connection.query(`SELECT * from studentRegister WHERE studentEmail = ?`, [req.body.userEmail]);

                if (student_2.length === 0) {
                    await db_connection.query(`INSERT INTO studentRegister (studentEmail, otp) VALUES (?, ?)`, [req.body.userEmail, otp]);
                } else {
                    await db_connection.query(`UPDATE studentRegister SET otp = ?, createdAt = ? WHERE studentEmail = ?`, [otp, Date.now(), req.body.userEmail]);
                }
                await db_connection.query(`UNLOCK TABLES`);
            } else {

                // console.log(manager[0]);

                if (manager[0].accountStatus === "2") {
                    return res.status(401).send({ "message": "Your Account has been deactivated by admin due to security reasons. Check you mail for further instructions." });
                } else if (manager[0].accountStatus === "0") {
                    return res.status(401).send({ "message": "Your Account has not been activated yet. Check you mail for further instructions and login with the password in mail to proceed." });
                } else if (manager[0].accountStatus !== "1") {
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                await db_connection.query(`LOCK TABLES managementRegister WRITE`);
                name = manager[0]["managerName"];
                userRole = manager[0]["managerRole"];
                let [manager_2] = await db_connection.query(`SELECT * from managementRegister WHERE managerEmail = ?`, [req.body.userEmail]);

                if (manager_2.length === 0) {
                    await db_connection.query(`INSERT INTO managementRegister (managerEmail, otp) VALUES (?, ?)`, [req.body.userEmail, otp]);
                } else {
                    await db_connection.query(`UPDATE managementRegister SET otp = ?, createdAt = ? WHERE managerEmail = ?`, [otp, Date.now(), req.body.userEmail]);
                }
                await db_connection.query(`UNLOCK TABLES`);
            }
            //console.log(name);

            const secret_token = await otpTokenGenerator({
                "userEmail": req.body.userEmail,
                "userRole": userRole
            });

            mailer.reset_PW_OTP(name, otp, req.body.userEmail);

            return res.status(200).send({
                "message": "OTP sent to email.",
                "SECRET_TOKEN": secret_token,
                "userEmail": req.body.userEmail
            });


        } catch (err) {
            console.log(err);
            const time = new Date();
            fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - forgotPassword - ${err}\n`);
            return res.status(500).send({ "message": "Internal Server Error." });
        } finally {
            await db_connection.query(`UNLOCK TABLES`);
            db_connection.release();
        }

    },

    resetPasswordVerify: [
        /*
        JSON
        {
            "otp":"<otp>"
        }
        */
        resetPasswordValidator,
        async (req, res) => {
            if ((req.authorization_tier !== "2" && req.authorization_tier !== "1" && req.authorization_tier !== "0") || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || req.body.otp === null || req.body.otp === undefined || req.body.otp === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {

                await db_connection.query(`LOCK TABLES studentRegister WRITE, managementRegister WRITE, studentData WRITE, managementData WRITE`);

                let check_1 = null;
                if (req.authorization_tier === "2") {
                    [check_1] = await db_connection.query(`DELETE from studentRegister WHERE studentEmail = ? AND otp = ?`, [req.body.userEmail, req.body.otp]);
                } else if (req.authorization_tier === "1" || req.authorization_tier === "0") {
                    [check_1] = await db_connection.query(`DELETE from managementRegister WHERE managerEmail = ? AND otp = ?`, [req.body.userEmail, req.body.otp]);
                }

                if (check_1.affectedRows === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Invalid OTP!" });
                }

                await db_connection.query(`UNLOCK TABLES`);

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.userEmail,
                    "userRole": req.authorization_tier
                });

                return res.status(200).send({
                    "message": "Otp verified successfully!",
                    "SECRET_TOKEN": secret_token
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - resetPassword - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        },
    ],

    resetPassword: [
        /*
        JSON
        {
            "userPassword":"<userPassword>"
        }
        */
        tokenValidator,
        async (req, res) => {
            if ((req.authorization_tier !== "2" && req.authorization_tier !== "1" && req.authorization_tier !== "0") || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || req.body.userPassword === null || req.body.userPassword === undefined || req.body.userPassword === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {

                await db_connection.query(`LOCK TABLES studentData WRITE, managementData WRITE`);

                if (req.authorization_tier === "2") {
                    await db_connection.query(`UPDATE studentData SET studentPassword = ? WHERE studentEmail = ?`, [req.body.userPassword, req.body.userEmail]);
                } else if (req.authorization_tier === "1" || req.authorization_tier === "0") {
                    await db_connection.query(`UPDATE managementData SET managerPassword = ? WHERE managerEmail = ?`, [req.body.userPassword, req.body.userEmail]);
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Password reset successfull!",
                    "userEmail": req.body.userEmail
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - resetPassword - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ]
}
