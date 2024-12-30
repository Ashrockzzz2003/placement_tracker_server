const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const [otpTokenValidator, resetPasswordValidator] = require('../middleware/otpTokenValidator');

const generateOTP = require("../middleware/otpGenerator");
const passwordGenerator = require('secure-random-password');

const crypto = require('crypto');

const mailer = require('../mail/mailer');

const fs = require('fs');
const validator = require('validator');
const tokenValidator = require('../middleware/webTokenValidator');

module.exports = {
    studentRegister: async (req, res) => {
        /*
        JSON
        {
            "studentRollNo": "<roll_no>",
            "studentEmail": "<email_id>",
            "studentName": "<name>",
            "studentPassword": "<password>",
            "studentSection": "<section>",
            "studentGender": "<M/F/O>"
            "studentBatch": "<batch>",
            "studentDept": "<dept>",
            "isHigherStudies": "<0/1>",
            "isPlaced": "<0/1>",
            "CGPA": "<XX.XX>"
        }
        */

        if (req.body.studentEmail === null || req.body.studentEmail === undefined || req.body.studentEmail === "" || !validator.isEmail(req.body.studentEmail) ||
            req.body.studentPassword === null || req.body.studentPassword === undefined || req.body.studentPassword === "") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.studentRollNo === null || req.body.studentRollNo === undefined || req.body.studentRollNo === "" || req.body.studentName === null || req.body.studentName === undefined || req.body.studentName === "" || req.body.studentSection === null || req.body.studentSection === undefined || req.body.studentSection === "" || req.body.studentGender === null || req.body.studentGender === undefined || req.body.studentGender === "" || req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "" || req.body.studentDept === null || req.body.studentDept === undefined || req.body.studentDept === "" || req.body.isHigherStudies === null || req.body.isHigherStudies === undefined || req.body.isHigherStudies === "" || req.body.isPlaced === null || req.body.isPlaced === undefined || req.body.isPlaced === "" || req.body.CGPA === null || req.body.CGPA === undefined || req.body.CGPA === "") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.studentGender !== "M" && req.body.studentGender !== "F" && req.body.studentGender !== "O") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.isHigherStudies !== "0" && req.body.isHigherStudies !== "1") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.isPlaced !== "0" && req.body.isPlaced !== "1") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (parseFloat(req.body.CGPA) < 0 || parseFloat(req.body.CGPA) > 10) {
            return res.status(400).send({ "message": "Missing details." });
        }

        // if (req.body.studentEmail.split("@")[1] !== "cb.students.amrita.edu") {
        //     return res.status(400).send({ "message": "Missing details." });
        // }

        let db_connection = await db.promise().getConnection();

        try {
            await db_connection.query(`LOCK TABLES studentData READ, managementData READ`);

            // check if student email already registered
            const [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ? or studentRollNo = ?`, [req.body.studentEmail, req.body.studentRollNo]);
            const [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ?`, [req.body.studentEmail]);
            if (student.length > 0 || manager.length > 0) {
                await db_connection.query(`UNLOCK TABLES`);
                return res.status(400).send({ "message": "Student already registered!" });
            }

            const otp = generateOTP();

            await db_connection.query(`LOCK TABLES studentRegister WRITE`);

            let [student_2] = await db_connection.query(`SELECT * from studentRegister WHERE studentEmail = ?`, [req.body.studentEmail]);

            if (student_2.length === 0) {
                await db_connection.query(`INSERT INTO studentRegister (studentEmail, otp) VALUES (?, ?)`, [req.body.studentEmail, otp]);
            } else {
                await db_connection.query(`UPDATE studentRegister SET otp = ?, createdAt = ? WHERE studentEmail = ?`, [otp, Date.now(), req.body.studentEmail]);
            }



            const secret_token = await otpTokenGenerator({
                "userEmail": req.body.studentEmail,
                "userRole": "2",
                "studentRollNo": req.body.studentRollNo,
                "studentName": req.body.studentName,
                "studentPassword": req.body.studentPassword,
                "studentSection": req.body.studentSection,
                "studentGender": req.body.studentGender,
                "studentBatch": req.body.studentBatch,
                "studentDept": req.body.studentDept,
                "isHigherStudies": req.body.isHigherStudies,
                "isPlaced": req.body.isPlaced,
                "CGPA": req.body.CGPA
            });

            //console.log(req.body.studentEmail, otp);
            mailer.loginOTP(req.body.studentName, otp, req.body.studentEmail);
            await db_connection.query(`UNLOCK TABLES`);

            return res.status(200).send({
                "message": "OTP sent to email.",
                "SECRET_TOKEN": secret_token,
                "studentEmail": req.body.studentEmail,
                "studentRollNo": req.body.studentRollNo,
            });

        } catch (err) {
            console.log(err);
            const time = new Date();
            fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - studentRegister - ${err}\n`);
            return res.status(500).send({ "message": "Internal Server Error." });
        } finally {
            await db_connection.query(`UNLOCK TABLES`);
            db_connection.release();
        }
    },

    studentVerify: [
        /*
        JSON
        {
            "otp":"<otp>"
        }
        */
        otpTokenValidator,
        async (req, res) => {
            if (req.authorization_tier !== "2" || req.body.studentEmail === null || req.body.studentEmail === undefined ||
                req.body.studentEmail === "" || !validator.isEmail(req.body.studentEmail) ||
                req.body.studentRollNo === null || req.body.studentRollNo === undefined || req.body.studentRollNo === "" ||
                req.body.studentPassword === null || req.body.studentPassword === undefined || req.body.studentPassword === "" ||
                req.body.otp === null || req.body.otp === undefined || req.body.otp === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            if (req.body.studentName === null || req.body.studentName === undefined || req.body.studentName === "" ||
                req.body.studentSection === null || req.body.studentSection === undefined || req.body.studentSection === "" ||
                req.body.studentGender === null || req.body.studentGender === undefined || req.body.studentGender === "" ||
                req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "" ||
                req.body.studentDept === null || req.body.studentDept === undefined || req.body.studentDept === "" ||
                req.body.isHigherStudies === null || req.body.isHigherStudies === undefined || req.body.isHigherStudies === "" ||
                req.body.isPlaced === null || req.body.isPlaced === undefined || req.body.isPlaced === "" ||
                req.body.CGPA === null || req.body.CGPA === undefined || req.body.CGPA === "") {
                console.log(req);
                return res.status(400).send({ "message": "Access Restricted!" });
            }


            let db_connection = await db.promise().getConnection();
            try {
                await db_connection.query(`LOCK TABLES studentRegister WRITE, studentData WRITE`);

                //let check = await db_connection.query(`Delete from studentRegister where studentEmail = ? and otp = ?`, [req.body.studentEmail,req.body.otp]);
                //console.log(check);
                const [check_1] = await db_connection.query(`Delete from studentRegister where studentEmail = ? and otp = ?`, [req.body.studentEmail, req.body.otp]);
                if (check_1.affectedRows === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Invalid OTP!" });
                }

                let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ? or studentRollNo = ?`, [req.body.studentEmail, req.body.studentRollNo]);

                if (student.length > 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Student already registered!" });
                }
                else {
                    await db_connection.query(`INSERT INTO studentData (studentRollNo, studentEmail, studentName, studentPassword, studentSection, studentGender, studentBatch, studentDept, isHigherStudies, isPlaced, CGPA, studentAccountStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.studentRollNo, req.body.studentEmail, req.body.studentName, req.body.studentPassword, req.body.studentSection, req.body.studentGender, req.body.studentBatch, req.body.studentDept, req.body.isHigherStudies, req.body.isPlaced, req.body.CGPA, "1"]);
                    await db_connection.query(`UNLOCK TABLES`);
                }

                const secret_token = await webTokenGenerator({
                    "userEmail": req.body.studentEmail,
                    "userRole": "2"
                });

                return res.status(200).send({
                    "message": "Student verifed successfully!",
                    "SECRET_TOKEN": secret_token,
                    "studentEmail": req.body.studentEmail,
                    "studentName": req.body.studentName,
                    "studentRollNo": req.body.studentRollNo,
                    "studentId": req.body.id,
                    "studentSection": req.body.studentSection,
                    "studentGender": req.body.studentGender,
                    "studentBatch": req.body.studentBatch,
                    "studentDept": req.body.studentDept,
                    "isHigherStudies": req.body.isHigherStudies,
                    "isPlaced": req.body.isPlaced,
                    "CGPA": req.body.CGPA
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - studentVerify - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        }
    ],

    studentEditData : [
        tokenValidator,
        async (req, res) => {
        /*
        JSON
        {
            "studentRollNo": "<roll_no>",
            "studentEmail": "<email_id>",
            "studentName": "<name>",
            "studentSection": "<section>",
            "studentGender": "<M/F/O>",
            "studentBatch": "<batch>",
            "studentDept": "<dept>",
            "isHigherStudies": "<0/1>",
            "isPlaced": "<0/1>",
            "CGPA": "<XX.XX>"
        }
        */
     
        if (req.body.studentEmail === null || req.body.studentEmail === undefined || req.body.studentEmail === "" || req.body.studentName === null || req.body.studentName === undefined || req.body.studentName === "" || req.body.studentSection === null || req.body.studentSection === undefined || req.body.studentSection === "" || req.body.studentGender === null || req.body.studentGender === undefined || req.body.studentGender === "" || req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "" || req.body.studentDept === null || req.body.studentDept === undefined || req.body.studentDept === "" || req.body.isHigherStudies === null || req.body.isHigherStudies === undefined || req.body.isHigherStudies === "" ||  req.body.CGPA === null || req.body.CGPA === undefined || req.body.CGPA === "") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.studentGender !== "M" && req.body.studentGender !== "F" && req.body.studentGender !== "O") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.isHigherStudies !== "0" && req.body.isHigherStudies !== "1") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (parseFloat(req.body.CGPA) < 0 || parseFloat(req.body.CGPA) > 10) {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.body.studentEmail.split("@")[1] !== "cb.students.amrita.edu") {
            return res.status(400).send({ "message": "Missing details." });
        }

        if (req.authorization_tier !== "0" && req.authorization_tier !== "1" && req.authorization_tier !== "2")
        {
            return res.status(400).send({ "message": "Access Restricted!" });
        }

        let db_connection = await db.promise().getConnection();

        try {

            if (req.authorization_tier === "1" || req.authorization_tier === "0"){
                //return res.status(400).send({ "message": "Functionality Not Available Yet!" });
                await db_connection.query(`LOCK TABLES studentData WRITE`);
                    
                await db_connection.query(`UPDATE  studentData SET studentName = ?, studentSection = ?, studentGender = ?, studentBatch = ?, isHigherStudies = ?, CGPA = ? where studentEmail = ?`, [req.body.studentName, req.body.studentSection, req.body.studentGender, req.body.studentBatch, req.body.isHigherStudies, req.body.CGPA ,req.body.studentEmail]);
                    
                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({ "message": "Student Data Updated!" });
            
            }
            if (req.authorization_tier === "2"){
                if (req.body.userEmail !== req.body.studentEmail){
                    return res.status(400).send({ "message": "Access Restricted!" });
                }
                else{
                    await db_connection.query(`LOCK TABLES studentData WRITE`);
                    
                    await db_connection.query(`UPDATE  studentData SET studentName = ?, studentSection = ?, studentGender = ?, studentBatch = ?, isHigherStudies = ?, CGPA = ? where studentEmail = ?`, [req.body.studentName, req.body.studentSection, req.body.studentGender, req.body.studentBatch, req.body.isHigherStudies, req.body.CGPA ,req.body.userEmail]);
                    
                    await db_connection.query(`UNLOCK TABLES`);

                    return res.status(200).send({ "message": "Student Data Updated!" });
                }

            }

        } catch (err) {
            console.log(err);
            const time = new Date();
            fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - studentEditData - ${err}\n`);
            return res.status(500).send({ "message": "Internal Server Error." });
        } finally {
            await db_connection.query(`UNLOCK TABLES`);
            db_connection.release();
        }
        },
    ],

    addStudent: [
        /*
        JSON
        {
            "studentRollNo": "<roll_no>",
            "studentEmail": "<email_id>",
            "studentName": "<name>",
            "studentSection": "<section>",
            "studentGender": "<M/F/O>"
            "studentBatch": "<batch>",
            "studentDept": "<dept>",
            "isHigherStudies": "<0/1>",
            "isPlaced": "<0/1>",
            "CGPA": "<XX.XX>"
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || (req.body.userRole !== "1" && req.body.userRole !== "0")) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            if (req.body.studentEmail === null || req.body.studentEmail === undefined || req.body.studentEmail === "" || !validator.isEmail(req.body.studentEmail)) {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (req.body.studentRollNo === null || req.body.studentRollNo === undefined || req.body.studentRollNo === "" || req.body.studentName === null || req.body.studentName === undefined || req.body.studentName === "" || req.body.studentSection === null || req.body.studentSection === undefined || req.body.studentSection === "" || req.body.studentGender === null || req.body.studentGender === undefined || req.body.studentGender === "" || req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "" || req.body.studentDept === null || req.body.studentDept === undefined || req.body.studentDept === "" || req.body.isHigherStudies === null || req.body.isHigherStudies === undefined || req.body.isHigherStudies === "" || req.body.isPlaced === null || req.body.isPlaced === undefined || req.body.isPlaced === "" || req.body.CGPA === null || req.body.CGPA === undefined || req.body.CGPA === "") {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (req.body.studentGender !== "M" && req.body.studentGender !== "F" && req.body.studentGender !== "O") {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (req.body.isHigherStudies !== "0" && req.body.isHigherStudies !== "1") {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (req.body.isPlaced !== "0" && req.body.isPlaced !== "1") {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (parseFloat(req.body.CGPA) < 0 || parseFloat(req.body.CGPA) > 10) {
                return res.status(400).send({ "message": "Missing details." });
            }

            if (req.body.studentEmail.split("@")[1] !== "cb.students.amrita.edu") {
                return res.status(400).send({ "message": "Missing details." });
            }

            let db_connection = await db.promise().getConnection();

            try {

                await db_connection.query(`LOCK TABLES studentData WRITE, managementData READ`);

                // check if actually admin or manager
                let [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                if (manager.length === 0 || manager[0].accountStatus !== "1") {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.studentEmail]);
                if (student.length > 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(400).send({ "message": "Student already registered!" });
                }

                // generate a random password for the manager.
                const studentPassword = passwordGenerator.randomPassword({
                    length: 8,
                    characters: [passwordGenerator.lower, passwordGenerator.upper, passwordGenerator.digits]
                });

                // sha256 hash the password.
                const passwordHashed = crypto.createHash('sha256').update(studentPassword).digest('hex');

                // Email the password to the student.
                mailer.studentCreated(req.body.studentName, req.body.studentEmail, studentPassword);

                await db_connection.query(`INSERT INTO studentData (studentRollNo, studentEmail, studentName, studentPassword, studentSection, studentGender, studentBatch, studentDept, isHigherStudies, isPlaced, CGPA, studentAccountStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.studentRollNo, req.body.studentEmail, req.body.studentName, passwordHashed, req.body.studentSection, req.body.studentGender, req.body.studentBatch, req.body.studentDept, req.body.isHigherStudies, req.body.isPlaced, req.body.CGPA, "1"]);

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({ "message": "Added Student!" });
            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - addStudent - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        },
    ],

    getAllStudentData: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                (req.authorization_tier !== "0" && req.authorization_tier !== "1") ||
                req.body.batch === null || req.body.batch === undefined || req.body.batch === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData s READ, companyData c READ, placementData p READ`);

                let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);
                if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                [students] = await db_connection.query(`select s.id as studentId, s.studentRollNo, s.studentEmail,
                s.studentName, s.studentGender, s.studentDept, s.studentBatch, s.studentSection, s.studentEmail,
                s.isHigherStudies, s.isPlaced, s.cgpa, s.studentAccountStatus,
                p.id as placementId, p.companyId, c.companyName, p.ctc, p.jobRole,
                p.jobLocation, p.placementDate, p.isIntern, p.isPPO, p.isOnCampus, p.isGirlsDrive,
                p.extraData from studentData s left join placementData p on s.id=p.studentId left join
                companyData c on p.companyId=c.id WHERE s.studentBatch = ? ORDER BY s.studentSection;`, [req.body.batch]);

                if (students.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(200).send({ "message": "No Student Data Found!", "students": students });
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "All Student Data Fetched!",
                    "students": students
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getAllStudentData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ],

    getAllPlacedStudentsData: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                (req.authorization_tier !== "0" && req.authorization_tier !== "1") ||
                req.body.batch === null || req.body.batch === undefined || req.body.batch === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData s READ, companyData c READ, placementData p READ`);

                let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);
                if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                [students] = await db_connection.query(`select s.id as studentId, s.studentRollNo, s.studentEmail,
                s.studentName, s.studentGender, s.studentDept, s.studentBatch, s.studentSection, s.studentEmail,
                s.isHigherStudies, s.cgpa, s.studentAccountStatus,
                p.id as placementId, p.companyId, c.companyName, p.ctc, p.jobRole,
                p.jobLocation, p.placementDate, p.isIntern, p.isPPO, p.isOnCampus, p.isGirlsDrive,
                p.extraData from studentData s left join placementData p on s.id=p.studentId left join
                companyData c on p.companyId=c.id WHERE s.studentBatch = ? AND p.id IS NOT NULL ORDER BY s.studentSection, s.studentEmail;`, [req.body.batch]);

                if (students.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(200).send({ "message": "No Student Data Found!", "placementData": students });
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "All Student Data Fetched!",
                    "placementData": students
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getAllStudentData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ],
    
    getStudentPlacements: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                (req.authorization_tier !== "0" && req.authorization_tier !== "1" && req.authorization_tier !== "2")) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let studentId = req.body.studentId;

            if ((req.authorization_tier === "1" || req.authorization_tier === "0") && (studentId === null || studentId === undefined || studentId === "")) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                if (req.authorization_tier === "0" || req.authorization_tier === "1") {

                    await db_connection.query(`LOCK TABLES managementData READ`);

                    let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);
                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    await db_connection.query(`UNLOCK TABLES`);

                    await db_connection.query(`LOCK TABLES studentData READ`);

                    let [student] = await db_connection.query(`SELECT 
                    id AS studentId,
                    studentRollNo,
                    studentEmail,
                    studentName,
                    studentSection,
                    studentGender,
                    studentBatch,
                    studentDept,
                    isHigherStudies,
                    isPlaced,
                    CGPA,
                    studentAccountStatus from studentData WHERE id = ?`, [studentId]);

                    if (student.length === 0) {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(400).send({ "message": "Student Not Registered!" });
                    }

                    await db_connection.query(`UNLOCK TABLES`);

                    await db_connection.query(`LOCK TABLES placementData p READ, companyData c READ`);

                    let [studentPlacementData] = await db_connection.query(`select p.id as placementID, companyID, companyName, ctc, jobRole, jobLocation, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, extraData from placementData p left join companyData c on p.companyId = c.id WHERE p.studentId = ? ORDER BY p.ctc;`, [studentId]);

                    if (studentPlacementData.length === 0) {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(200).send({ 
                            "placementData": [],
                            "student": student[0],
                            "message": "No Placement Data Found!" 
                        });
                    }

                    await db_connection.query(`UNLOCK TABLES`);

                    return res.status(200).send({
                        "message": "Placement Data Fetched!",
                        "student": student[0],
                        "placementData": studentPlacementData
                    });

                } else if (req.authorization_tier === "2") {
                    await db_connection.query(`LOCK TABLES studentData READ`);

                    let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    await db_connection.query(`UNLOCK TABLES`);

                    await db_connection.query(`LOCK TABLES placementData p READ, companyData c READ`);

                    let [studentPlacementData] = await db_connection.query(`select p.id as placementID, companyID, companyName, ctc, jobRole, jobLocation, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, extraData from placementData p left join companyData c on p.companyId = c.id WHERE p.studentId = ? ORDER BY p.ctc;`, [student[0]["id"]]);

                    if (studentPlacementData.length === 0) {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(200).send({ 
                            "placementData": [],
                            "message": "No Placement Data Found!" 
                        });
                    }

                    await db_connection.query(`UNLOCK TABLES`);

                    return res.status(200).send({
                        "message": "Placement Data Fetched!",
                        "placementData": studentPlacementData
                    });
                }

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getStudentPlacements - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ]

}


