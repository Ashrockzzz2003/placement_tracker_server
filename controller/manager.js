const { db } = require('../connection')

const webTokenValidator = require('../middleware/webTokenValidator');

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

                let [managers] = await db_connection.query(`SELECT id, managerEmail, managerName, managerRole, createdAt, accountStatus from managementData WHERE id != ?`, [admin[0].id]);

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
                await db_connection.query(`LOCK TABLES managementData WRITE, studentData READ`);

                // check if actually admin
                let [admin] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ? AND managerRole = ?`, [req.body.userEmail, "1"]);

                if (admin.length === 0) {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                let [manager] = await db_connection.query(`SELECT * from managementData WHERE managerEmail = ?`, [req.body.managerEmail]);
                let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.managerEmail]);
                if (manager.length > 0 || student.length > 0) {
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

                await db_connection.query(`INSERT INTO managementData (managerEmail, managerName, managerPassword, managerRole, accountStatus) VALUES (?, ?, ?, ?, ?)`, [req.body.managerEmail, req.body.managerName, passwordHashed, "0", "0"]);

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

    addCompany: [
        /*
        JSON
        {
            companyName: "<company_name>"
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                (req.body.userRole !== "0" && req.body.userRole !== "1" && req.body.userRole !== "2") ||
                req.body.companyName === null || req.body.companyName === undefined || req.body.companyName === "") {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            let company = null;

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, companyData WRITE`);
                if (req.body.userRole === "0" || req.body.userRole === "1") {
                    let [manager] = await db_connection.query(`SELECT accountStatus,id from managementData WHERE managerEmail = ?`, [req.body.userEmail]);
                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    try {
                        company = await db_connection.query(`INSERT INTO companyData (companyName, managerId) VALUES (?, ?)`, [req.body.companyName, manager[0]["id"]]);
                    } catch (err) {
                        return res.status(400).send({ "message": "Company Registered Already!" });
                    }

                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    try {
                        company = await db_connection.query(`INSERT INTO companyData (companyName, studentId) VALUES (?, ?)`, [req.body.companyName, student[0]["id"]]);
                    } catch (err) {
                        console.log(err);
                        return res.status(400).send({ "message": "Company Registered Already!" });
                    }
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({ "message": "Company added!", "companyId": company[0]["insertId"], "companyName": req.body.companyName });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - addCompany - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        }
    ],

    getTop5Placements: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || (req.body.userRole !== "1" && req.body.userRole !== "0")) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ`);

                const [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                    await db_connection.query(`UNLOCK TABLES`);
                    return res.status(401).send({ "message": "Access Restricted!" });
                }

                await db_connection.query(`LOCK TABLES placementData READ, studentData READ, companyData READ`);

                const [placements] = await db_connection.query(`SELECT studentName,studentRollNo,studentSection,studentDept,companyName,ctc,jobRole,jobLocation,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,extraData from placementData INNER JOIN studentData ON placementData.studentId = studentData.id INNER JOIN companyData ON placementData.companyId = companyData.id ORDER BY ctc DESC LIMIT 10`);

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Top 5 placements fetched!",
                    "placements": placements
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getTop5Placements - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        },
    ],

    getCompanies: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) || (req.body.userRole !== "1" && req.body.userRole !== "2" && req.body.userRole !== "0")) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, companyData READ`);

                let companies = null;

                if (req.body.userRole === "1" || req.body.userRole === "0") {

                    let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    companies = await db_connection.query(`SELECT companyName,id from companyData`);
                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT studentAccountStatus from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    companies = await db_connection.query(`SELECT companyName,id from companyData`);
                }
                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Companies fetched!",
                    "companies": companies[0]
                });
            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getCompanies - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ],

    addPlacementData: [
        /*
        JSON
        {
            "studentRollNo":"<studentRollNo>", //Optional for student, Compulsory if manager adds student
            "companyId":<companyId> INTEGER,
            "ctc":<ctc> FLOAT,
            "jobRole":"<jobRole>",
            "jobLocation":"<jobLocation>", //Optional
            "placementDate":"<placementDate>",
            "isIntern":"<0/1>",
            "isPPO":"<0/1>",
            "isOnCampus":"<0/1>",
            "isGirlsDrive":"<0/1>",
            "extraData":"<extraData>" //Optional
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "1" && req.body.userRole !== "0" && req.body.userRole !== "2") ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                req.body.companyId === null || req.body.companyId === undefined || req.body.companyId === "" || isNaN(req.body.companyId) ||
                req.body.ctc === null || req.body.ctc === undefined || req.body.ctc === "" || isNaN(req.body.ctc) ||
                req.body.jobRole === null || req.body.jobRole === undefined || req.body.jobRole === "" ||
                req.body.placementDate === null || req.body.placementDate === undefined || req.body.placementDate === "" ||
                req.body.isIntern === null || req.body.isIntern === undefined || req.body.isIntern === "" || (req.body.isIntern !== "0" && req.body.isIntern !== "1") ||
                req.body.isPPO === null || req.body.isPPO === undefined || req.body.isPPO === "" || (req.body.isPPO !== "0" && req.body.isPPO !== "1") ||
                req.body.isOnCampus === null || req.body.isOnCampus === undefined || req.body.isOnCampus === "" || (req.body.isOnCampus !== "0" && req.body.isOnCampus !== "1") ||
                req.body.isGirlsDrive === null || req.body.isGirlsDrive === undefined || req.body.isGirlsDrive === "" || (req.body.isGirlsDrive !== "0" && req.body.isGirlsDrive !== "1")
            ) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }


            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, placementData WRITE`);

                if (req.body.userRole === "0" || req.body.userRole === "1") {

                    let [manager] = await db_connection.query(`SELECT accountStatus,id from managementData WHERE managerEmail = ?`, [req.body.userEmail]);
                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    if (req.body.studentRollNo === null || req.body.studentRollNo === undefined || req.body.studentRollNo === "") {
                        return res.status(400).send({ "message": "Missing Details!" });
                    }

                    [studentId] = await db_connection.query(`SELECT id from studentData WHERE studentRollNo = ?`, [req.body.studentRollNo]);
                    if (studentId.length === 0) {
                        return res.status(400).send({ "message": "Student Not registered!" });
                    }
                    studentId = studentId[0]["id"];

                    try {
                        if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }
                        else if ((req.jobLocation !== null || req.body.jobLocation !== undefined || req.body.jobLocation !== "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, jobLocation, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }
                        else if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData !== null || req.body.extraData !== undefined || req.body.extraData !== "")) {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, extraData, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }
                        else {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, jobLocation, extraData, placementDate, isIntern, isPPo, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }

                    } catch (err) {
                        return res.status(400).send({ "message": "Placement Registered Already!" });
                    }

                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    let [studentId] = await db_connection.query(`SELECT id from studentData WHERE studentEmail = ?`, [req.body.userEmail]);
                    studentId = studentId[0]["id"];
                    try {
                        if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }
                        else if ((req.jobLocation !== null || req.body.jobLocation !== undefined || req.body.jobLocation !== "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, jobLocation, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }
                        else if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData !== null || req.body.extraData !== undefined || req.body.extraData !== "")) {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, extraData, placementDate, isIntern, isPPO, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }
                        else {
                            await db_connection.query(`INSERT INTO placementData (companyId, ctc, jobRole, jobLocation, extraData, placementDate, isIntern, isPPo, isOnCampus, isGirlsDrive, studentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, studentId]);
                        }

                    } catch (err) {
                        return res.status(400).send({ "message": "Placement Registered Already!" });
                    }
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({ "message": "Placement Data added!" });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - addPlacementData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ],


    editPlacementDataById: [
        /*
        JSON
        {
            "studentRollNo":"<studentRollNo>", //Optional for student, Compulsory if manager adds student
            "companyId":<companyId> INTEGER,
            "ctc":<ctc> FLOAT,
            "jobRole":"<jobRole>",
            "jobLocation":"<jobLocation>", //Optional
            "placementDate":"<placementDate>",
            "isIntern":"<0/1>",
            "isPPO":"<0/1>",
            "isOnCampus":"<0/1>",
            "isGirlsDrive":"<0/1>",
            "extraData":"<extraData>" //Optional
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "1" && req.body.userRole !== "0" && req.body.userRole !== "2") ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                req.body.companyId === null || req.body.companyId === undefined || req.body.companyId === "" || isNaN(req.body.companyId) ||
                req.body.ctc === null || req.body.ctc === undefined || req.body.ctc === "" || isNaN(req.body.ctc) ||
                req.body.jobRole === null || req.body.jobRole === undefined || req.body.jobRole === "" ||
                req.body.placementDate === null || req.body.placementDate === undefined || req.body.placementDate === "" ||
                req.body.isIntern === null || req.body.isIntern === undefined || req.body.isIntern === "" || (req.body.isIntern !== "0" && req.body.isIntern !== "1") ||
                req.body.isPPO === null || req.body.isPPO === undefined || req.body.isPPO === "" || (req.body.isPPO !== "0" && req.body.isPPO !== "1") ||
                req.body.isOnCampus === null || req.body.isOnCampus === undefined || req.body.isOnCampus === "" || (req.body.isOnCampus !== "0" && req.body.isOnCampus !== "1") ||
                req.body.isGirlsDrive === null || req.body.isGirlsDrive === undefined || req.body.isGirlsDrive === "" || (req.body.isGirlsDrive !== "0" && req.body.isGirlsDrive !== "1") ||
                req.body.placementID === null || req.body.placementID === undefined || req.body.placementID === "" || isNaN(req.body.placementID)
            ) {
                //console.log("test 1");
                return res.status(400).send({ "message": "Access Restricted!" });
            }


            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, placementData WRITE`);

                if (req.body.userRole === "0" || req.body.userRole === "1") {

                    let [manager] = await db_connection.query(`SELECT accountStatus,id from managementData WHERE managerEmail = ?`, [req.body.userEmail]);
                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    if (req.body.studentRollNo === null || req.body.studentRollNo === undefined || req.body.studentRollNo === "") {
                        return res.status(400).send({ "message": "Missing Details!" });
                    }

                    // [studentId] = await db_connection.query(`SELECT id from studentData WHERE studentRollNo = ?`, [req.body.studentRollNo]);
                    // if (studentId.length === 0) {
                    //     return res.status(400).send({ "message": "Student Not registered!" });
                    // }
                    // studentId = studentId[0]["id"];

                    try {
                        if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, placementDate=?, isIntern=?, isPPO=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }
                        else if ((req.jobLocation !== null || req.body.jobLocation !== undefined || req.body.jobLocation !== "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, jobLocation=?, placementDate=?, isIntern=?, isPPO=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }
                        else if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData !== null || req.body.extraData !== undefined || req.body.extraData !== "")) {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, extraData=?, placementDate=?, isIntern=?, isPPO=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }
                        else {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, jobLocation=?, extraData=?, placementDate=?, isIntern=?, isPPo=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }

                    } catch (err) {
                        return res.status(400).send({ "message": "Placement Update Error!" });
                    }

                }
                else if (req.body.userRole === "2") {

                    [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        //console.log("test 2");
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }           
                    
                    [studentId] = await db_connection.query('SELECT studentId from placementData WHERE id=?', [req.body.placementID]);
                    //console.log(studentId[0],student[0]["id"]);
                    if (studentId.length === 0 || studentId[0]["studentId"] !== student[0]["id"]) {
                        await db_connection.query(`UNLOCK TABLES`);
                        console.log("test 3");
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                    try {
                        if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, placementDate=?, isIntern=?, isPPO=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }
                        else if ((req.jobLocation !== null || req.body.jobLocation !== undefined || req.body.jobLocation !== "") &&
                            (req.body.extraData === null || req.body.extraData === undefined || req.body.extraData === "")) {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, jobLocation=?, placementDate=?, isIntern=?, isPPO=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }
                        else if ((req.jobLocation === null || req.body.jobLocation === undefined || req.body.jobLocation === "") &&
                            (req.body.extraData !== null || req.body.extraData !== undefined || req.body.extraData !== "")) {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, extraData=?, placementDate=?, isIntern=?, isPPO=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }
                        else {
                            await db_connection.query(`UPDATE placementData SET companyId=?, ctc=?, jobRole=?, jobLocation=?, extraData=?, placementDate=?, isIntern=?, isPPo=?, isOnCampus=?, isGirlsDrive=? where id=?`, [req.body.companyId, req.body.ctc, req.body.jobRole, req.body.jobLocation, req.body.extraData, req.body.placementDate, req.body.isIntern, req.body.isPPO, req.body.isOnCampus, req.body.isGirlsDrive, req.body.placementID]);
                        }

                    } catch (err) {
                        return res.status(400).send({ "message": "Placement Update Error!" });
                    }
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({ "message": "Placement Data Updated!" });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - editPlacementDataById - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ],


    getCompanyHireData: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "1" && req.body.userRole !== "0" && req.body.userRole !== "2") ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail)) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, placementData p READ, companyData c READ, studentData s READ`);

                if (req.body.userRole === "0" || req.body.userRole === "1") {

                    let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }
                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                }

                // extract section wise hire count for each company

                // [companyHireData] = await db_connection.query(`select p.companyId, c.companyName, p.ctc, p.jobRole, 
                //     count(p.id) as totalHires from placementData p left join companyData c 
                //     on p.companyId = c.id group by p.companyId, p.ctc, p.jobRole order by p.companyId;`);

                [companyHireData] = await db_connection.query(`select p.companyId, c.companyName, p.ctc, p.jobRole, s.studentSection, COUNT(p.id) AS totalHires FROM placementData p join companyData c on p.companyId=c.id join studentData s on p.studentId=s.id group by p.companyId, p.ctc, p.jobRole, s.studentSection order by p.companyId, p.ctc, p.jobRole, s.studentSection;`);

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Company Wise Placement Data Fetched!",
                    "companyHireData": companyHireData
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getCompanyHireData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        }
    ],



    getCompanyHireDatabyBatch: [
        /*
        JSON
        {
            "studentBatch": "<studentBatch>"
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "1" && req.body.userRole !== "0" && req.body.userRole !== "2") ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                (req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "" || isNaN(req.body.studentBatch))) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, placementData p READ, companyData c READ, studentData s READ`);

                if (req.body.userRole === "0" || req.body.userRole === "1") {

                    let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }
                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                }

                // extract section wise hire count for each company

                // [companyHireData] = await db_connection.query(`select p.companyId, c.companyName, p.ctc, p.jobRole, 
                //     count(p.id) as totalHires from placementData p left join companyData c 
                //     on p.companyId = c.id group by p.companyId, p.ctc, p.jobRole order by p.companyId;`);

                [companyHireData] = await db_connection.query(`select p.companyId, c.companyName, p.ctc, p.jobRole, s.studentSection, COUNT(p.id) AS totalHires FROM placementData p join companyData c on p.companyId=c.id join studentData s on p.studentId=s.id WHERE s.studentBatch = ? group by p.companyId, p.ctc, p.jobRole, s.studentSection order by p.companyId, p.ctc, p.jobRole, s.studentSection;`, [req.body.studentBatch]);

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Company Wise Placement Data Fetched!",
                    "companyHireData": companyHireData
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getCompanyHireData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        }
    ],

    getCompanyHireDataById: [
        /*
        JSON
        {
            "companyId":<companyId> INTEGER,
            "studentBatch": "<studentBatch>"
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "1" && req.body.userRole !== "0" && req.body.userRole !== "2") ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                req.body.companyId === null || req.body.companyId === undefined || req.body.companyId === "" || isNaN(req.body.companyId)) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData s READ, placementData p READ, companyData c READ`);

                if (req.body.userRole === "0" || req.body.userRole === "1") {

                    let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }
                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT * from studentData s WHERE s.studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                }

                [companyName] = await db_connection.query(`select c.companyName from companyData c where id = ?`, [req.body.companyId]);
                if (companyName.length === 0) {
                    return res.status(400).send({ "message": "Company Not Registered!" });
                }
                companyName = companyName[0]["companyName"];

                if (req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "") {
                    [companyHireData] = await db_connection.query(` select s.studentDept,s.studentSection,count(p.id) as totalHires
                from placementData p left join studentData s on p.studentId = s.id
                where companyId = ? group by s.studentDept,s.studentSection;`, [req.body.companyId]);

                    [companyHireData2] = await db_connection.query(`select s.studentRollNo, s.studentEmail, s.studentName,
                s.studentGender, s.studentBatch, s.studentDept, s.isHigherStudies, s.studentSection, 
                s.isPlaced, s.CGPA, p.ctc, p.jobRole, p.jobLocation, p.placementDate, p.isIntern, p.isPPO, p.isOnCampus, 
                p.isGirlsDrive, p.extraData from studentData s right join placementData p on 
                s.id = p.studentId where p.companyId = ?;`, [req.body.companyId]);
                } else {
                    [companyHireData] = await db_connection.query(` select s.studentDept,s.studentSection,count(p.id) as totalHires
                from placementData p left join studentData s on p.studentId = s.id
                where companyId = ? AND s.studentBatch = ? group by s.studentDept,s.studentSection`, [req.body.companyId, req.body.studentBatch]);

                    [companyHireData2] = await db_connection.query(`select s.studentRollNo, s.studentEmail, s.studentName,
                s.studentGender, s.studentBatch, s.studentDept, s.isHigherStudies, s.studentSection, 
                s.isPlaced, s.CGPA, p.ctc, p.jobRole, p.jobLocation, p.placementDate, p.isIntern, p.isPPO, p.isOnCampus, 
                p.isGirlsDrive, p.extraData from studentData s right join placementData p on 
                s.id = p.studentId where p.companyId = ? AND s.studentBatch = ?`, [req.body.companyId, req.body.studentBatch]);
                }

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Placement Data Fetched for " + companyName + "!",
                    "companyName": companyName,
                    "deptSectionWiseHires": companyHireData,
                    "allHiredStudents": companyHireData2
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getCompanyHireData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }
        }
    ],


    getCompanyHireDatabyBatch: [
        /*
        JSON
        {
            "studentBatch": "<studentBatch>"
        }
        */
        webTokenValidator,
        async (req, res) => {
            if (req.body.userRole === null || req.body.userRole === undefined || req.body.userRole === "" || (req.body.userRole !== "1" && req.body.userRole !== "0" && req.body.userRole !== "2") ||
                req.body.userEmail === null || req.body.userEmail === undefined || req.body.userEmail === "" || !validator.isEmail(req.body.userEmail) ||
                (req.body.studentBatch === null || req.body.studentBatch === undefined || req.body.studentBatch === "" || isNaN(req.body.studentBatch))) {
                return res.status(400).send({ "message": "Access Restricted!" });
            }

            let db_connection = await db.promise().getConnection();

            try {
                await db_connection.query(`LOCK TABLES managementData READ, studentData READ, placementData p READ, companyData c READ, studentData s READ`);

                if (req.body.userRole === "0" || req.body.userRole === "1") {

                    let [manager] = await db_connection.query(`SELECT accountStatus from managementData WHERE managerEmail = ?`, [req.body.userEmail]);

                    if (manager.length === 0 || manager[0]["accountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }
                }
                else if (req.body.userRole === "2") {
                    let [student] = await db_connection.query(`SELECT * from studentData WHERE studentEmail = ?`, [req.body.userEmail]);

                    if (student.length === 0 || student[0]["studentAccountStatus"] !== "1") {
                        await db_connection.query(`UNLOCK TABLES`);
                        return res.status(401).send({ "message": "Access Restricted!" });
                    }

                }

                // extract section wise hire count for each company

                // [companyHireData] = await db_connection.query(`select p.companyId, c.companyName, p.ctc, p.jobRole, 
                //     count(p.id) as totalHires from placementData p left join companyData c 
                //     on p.companyId = c.id group by p.companyId, p.ctc, p.jobRole order by p.companyId;`);

                [companyHireData] = await db_connection.query(`select p.companyId, c.companyName, p.ctc, p.jobRole, s.studentSection, COUNT(p.id) AS totalHires FROM placementData p join companyData c on p.companyId=c.id join studentData s on p.studentId=s.id WHERE s.studentBatch = ? group by p.companyId, p.ctc, p.jobRole, s.studentSection order by p.companyId, p.ctc, p.jobRole, s.studentSection;`, [req.body.studentBatch]);

                await db_connection.query(`UNLOCK TABLES`);

                return res.status(200).send({
                    "message": "Company Wise Placement Data Fetched!",
                    "companyHireData": companyHireData
                });

            } catch (err) {
                console.log(err);
                const time = new Date();
                fs.appendFileSync('logs/errorLogs.txt', `${time.toISOString()} - getCompanyHireData - ${err}\n`);
                return res.status(500).send({ "message": "Internal Server Error." });
            } finally {
                await db_connection.query(`UNLOCK TABLES`);
                db_connection.release();
            }

        }
    ]
}
