const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');

const fs = require('fs');
const validator = require('validator');

module.exports = {
    allPlacements: [
        webTokenValidator,
        async (req, res) => {

            if (req.userEmail === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {
                    let [placements] = await db_connection.query(`SELECT * FROM placements`);

                    for (let i = 0; i < placements.length; i++) {
                        let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [placements[i].studentRollNo]);

                        if (student.length === 0) {
                            return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                        }

                        let [studentOffers] = await db_connection.query(`SELECT COUNT(*) AS noOfOffers FROM placements WHERE studentRollNo = ?`, [placements[i].studentRollNo]);
                        student[0].noOfOffers = studentOffers[0].noOfOffers;
                        placements[i].student = student[0];

                        let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [placements[i].companyID]);

                        if (company.length === 0) {
                            return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                        }

                        companyOffers = await db_connection.query(`SELECT COUNT(*) AS noOfOffers FROM placements WHERE companyID = ?`, [placements[i].companyID]);
                        company[0].noOfOffers = companyOffers[0].noOfOffers;
                        placements[i].company = company[0];
                    }

                    return res.status(200).send({ "message": 'OK', "data": placements });
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, allPlacements, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

    addPlacement: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined || req.body.studentRollNo === undefined || req.body.companyID === undefined || req.body.role === undefined || req.body.ctc === undefined || req.body.datePlaced === undefined || req.body.isPPO === undefined || req.body.isOnCampus === undefined || req.body.location === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.studentRollNo === '' || req.body.companyID === '' || req.body.role === '' || req.body.ctc === '' || req.body.datePlaced === '' || req.body.isPPO === '' || req.body.isOnCampus === '' || req.body.location === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL OR STUDENTROLLNO OR COMPANYID OR ROLE OR CTC OR DATEPLACED OR PPO OR ONCAMPUS OR LOCATION' });
            }

            if (!validator.isInt(req.body.companyID)) {
                return res.status(400).send({ "message": 'INVALID COMPANYID' });
            }

            if (req.body.isPPO !== '0' && req.body.isPPO !== '1') {
                return res.status(400).send({ "message": 'INVALID PPO' });
            }

            if (req.body.isOnCampus !== '0' && req.body.isOnCampus !== '1') {
                return res.status(400).send({ "message": 'INVALID ONCAMPUS' });
            }

            if (!validator.isFloat(req.body.ctc)) {
                return res.status(400).send({ "message": 'INVALID CTC' });
            }

            if (req.body.ctc < 0) {
                return res.status(400).send({ "message": 'INVALID CTC' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {

                    let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [req.body.studentRollNo]);

                    if (student.length === 0) {
                        return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                    }

                    let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [req.body.companyID]);

                    if (company.length === 0) {
                        return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                    }

                    let [placement] = await db_connection.query(`SELECT * FROM placements WHERE studentRollNo = ? AND companyID = ? AND ctc = ? AND role = ?`, [req.body.studentRollNo, req.body.companyID, req.body.ctc, req.body.role]);


                    if (placement.length !== 0) {
                        return res.status(409).send({ "message": 'PLACEMENT ALREADY EXISTS WITH SAME CTC and COMPANY and role for this STUDENT' });
                    }

                    if (req.body.extra === undefined || req.body.extra === '') {
                        req.body.extra = "";
                    }

                    await db_connection.query(`INSERT INTO placements (studentRollNo, companyID, role, ctc, datePlaced, isPPO, isOnCampus, extra, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.studentRollNo, req.body.companyID, req.body.role, req.body.ctc, req.body.datePlaced, req.body.isPPO, req.body.isOnCampus, req.body.extra, req.body.location]);

                    return res.status(201).send({ "message": 'CREATED' });
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, addPlacement, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

    updatePlacement: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined || req.body.placementID === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.placementID === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL OR PLACEMENTID' });
            }

            if (!validator.isInt(req.body.placementID)) {
                return res.status(400).send({ "message": 'INVALID PLACEMENTID' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {

                    let [placement] = await db_connection.query(`SELECT * FROM placements WHERE id = ?`, [req.body.placementID]);

                    if (placement.length === 0) {
                        return res.status(404).send({ "message": 'PLACEMENT NOT FOUND' });
                    }

                    if (req.body.extra === undefined || req.body.extra === '') {
                        req.body.extra = "";
                    }

                    // req.body.studentRollNo, req.body.companyID, req.body.role, req.body.ctc, req.body.datePlaced, req.body.isPPO, req.body.isOnCampus, req.body.extra, req.body.location

                    const [newPlacement] = {
                        id: req.body.placementID
                    };

                    if (req.body.studentRollNo !== undefined && req.body.studentRollNo !== '') {
                        let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [req.body.studentRollNo]);

                        if (student.length === 0) {
                            return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                        }

                        newPlacement.studentRollNo = req.body.studentRollNo;
                    }

                    if (req.body.companyID !== undefined && req.body.companyID !== '') {
                        let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [req.body.companyID]);

                        if (company.length === 0) {
                            return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                        }

                        newPlacement.companyID = req.body.companyID;
                    }

                    if (req.body.role !== undefined && req.body.role !== '') {
                        newPlacement.role = req.body.role;
                    }

                    if (req.body.ctc !== undefined && req.body.ctc !== '') {
                        newPlacement.ctc = req.body.ctc;
                    }

                    if (req.body.datePlaced !== undefined && req.body.datePlaced !== '') {
                        newPlacement.datePlaced = req.body.datePlaced;
                    }

                    if (req.body.isPPO !== undefined && req.body.isPPO !== '') {
                        newPlacement.isPPO = req.body.isPPO;
                    }

                    if (req.body.isOnCampus !== undefined && req.body.isOnCampus !== '') {
                        newPlacement.isOnCampus = req.body.isOnCampus;
                    }

                    if (req.body.extra !== undefined && req.body.extra !== '') {
                        newPlacement.extra = req.body.extra;
                    }

                    if (req.body.location !== undefined && req.body.location !== '') {
                        newPlacement.location = req.body.location;
                    }

                    // check for duplicate
                    let [duplicatePlacement] = await db_connection.query(`SELECT * FROM placements WHERE studentRollNo = ? AND companyID = ? AND role = ? AND ctc = ? AND datePlaced = ? AND isPPO = ? AND isOnCampus = ? AND extra = ? AND location = ?`, [newPlacement.studentRollNo, newPlacement.companyID, newPlacement.role, newPlacement.ctc, newPlacement.datePlaced, newPlacement.isPPO, newPlacement.isOnCampus, newPlacement.extra, newPlacement.location]);

                    if (duplicatePlacement.length !== 0) {
                        return res.status(409).send({ "message": 'DUPLICATE PLACEMENT' });
                    }

                    // cehck for duplicate student with same rollno, company, role and ctc
                    let [duplicatePlacement2] = await db_connection.query(`SELECT * FROM placements WHERE studentRollNo = ? AND companyID = ? AND role = ? AND ctc = ?`, [newPlacement.studentRollNo, newPlacement.companyID, newPlacement.role, newPlacement.ctc]);

                    if (duplicatePlacement2.length !== 0) {
                        return res.status(409).send({ "message": 'DUPLICATE PLACEMENT' });
                    }

                    await db_connection.query(`UPDATE placements SET studentRollNo = ?, companyID = ?, role = ?, ctc = ?, datePlaced = ?, isPPO = ?, isOnCampus = ?, extra = ?, location = ? WHERE id = ?`, [newPlacement.studentRollNo, newPlacement.companyID, newPlacement.role, newPlacement.ctc, newPlacement.datePlaced, newPlacement.isPPO, newPlacement.isOnCampus, newPlacement.extra, newPlacement.location, newPlacement.id]);

                    return res.status(200).send({ "message": 'UPDATED' });

                }
            } catch (err) {
                db_connection.rollback();

                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, updatePlacement, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

    // Companies
    companyPlacements: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined || req.body.companyID === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.companyID === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL OR COMPANYID' });
            }

            if (!validator.isInt(req.body.companyID)) {
                return res.status(400).send({ "message": 'INVALID COMPANYID' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {

                    let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [req.body.companyID]);

                    if (company.length === 0) {
                        return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                    }

                    let responseData = {
                        "company": company[0],
                        "placements": []
                    }

                    // placement data of company
                    let [placements] = await db_connection.query(`SELECT * FROM placements WHERE companyID = ?`, [req.body.companyID]);


                    for (let i = 0; i < placements.length; i++) {
                        let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [placements[i].studentRollNo]);

                        if (student.length === 0) {
                            return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                        }

                        let [studentOffers] = await db_connection.query(`SELECT COUNT(*) AS noOfOffers FROM placements WHERE studentRollNo = ?`, [placements[i].studentRollNo]);

                        student[0].noOfOffers = studentOffers[0].noOfOffers;
                        placements[i].student = student[0];
                    }

                    responseData.placements = placements;
                    responseData.noOfOffers = placements.length;

                    return res.status(200).send({ "message": 'OK', "data": responseData });
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, companyPlacements, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

    allCompanies: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {

                    let [companies] = await db_connection.query(`SELECT * FROM company`);

                    for (let i = 0; i < companies.length; i++) {
                        let [placementData] = await db_connection.query(`SELECT * FROM placements WHERE companyID = ?`, [companies[i].id]);

                        if (placementData.length === 0) {
                            companies[i].noOfOffers = 0;
                            companies[i].placementData = [];
                            continue;
                        }

                        companies[i].noOfOffers = placementData.length;

                        for (let j = 0; j < placementData.length; j++) {
                            let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [placementData[j].studentRollNo]);

                            if (student.length === 0) {
                                return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                            }

                            placementData[j].student = student[0];
                        }

                        companies[i].placementData = placementData;

                    }

                    return res.status(200).send({ "message": 'OK', "data": companies });
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, allCompanies, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

    addCompany: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined || req.body.companyName === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.companyName === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL OR COMPANYNAME' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {
                    if (user[0].userRole !== '1' && user[0].userRole !== '0') {
                        return res.status(403).send({ "message": 'FORBIDDEN' });
                    }

                    let [company] = await db_connection.query(`SELECT * FROM company WHERE lower(companyName) = ?`, [req.body.companyName.toString().toLowerCase()]);

                    if (company.length !== 0) {
                        return res.status(409).send({ "message": 'COMPANY ALREADY EXISTS' });
                    }

                    await db_connection.query(`INSERT INTO company (companyName) VALUES (?)`, [req.body.companyName]);

                    return res.status(200).send({ "message": 'CREATED' });
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, addCompany, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            }
        }
    ],

    updateCompany: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined || req.body.companyID === undefined || req.body.companyName === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.companyID === '' || req.body.companyName === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL OR COMPANYID OR COMPANYNAME' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.userEmail]);

                if (user.length === 0) {
                    return res.status(404).send({ "message": 'USER NOT FOUND' });
                } else {
                    if (user[0].userRole !== '1' && user[0].userRole !== '0') {
                        return res.status(403).send({ "message": 'FORBIDDEN' });
                    }

                    let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [req.body.companyID]);

                    if (company.length === 0) {
                        return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                    }

                    let [companyName] = await db_connection.query(`SELECT * FROM company WHERE lower(companyName) = ?`, [req.body.companyName.toString().toLowerCase()]);

                    console.log(companyName);

                    if (companyName.length !== 0) {
                        return res.status(409).send({ "message": 'COMPANY ALREADY EXISTS' });
                    }

                    await db_connection.query(`UPDATE company SET companyName = ? WHERE id = ?`, [req.body.companyName, req.body.companyID]);

                    return res.status(200).send({ "message": 'OK' });
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, updateCompany, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            }
        }
    ],

    deleteCompany: [
        webTokenValidator,
        async (req, res) => {
            if (req.userEmail === undefined || req.userRole === undefined || req.body.companyID === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.companyID === '' || req.userRole === '') {
                return res.status(400).send({ "message": 'INVALID USEREMAIL OR COMPANYID' });
            }

            if (req.userRole !== '1') {
                return res.status(403).send({ "message": 'FORBIDDEN' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [req.body.companyID]);

                if (company.length === 0) {
                    return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                }

                // delete from placements
                await db_connection.query(`DELETE FROM placement WHERE companyID = ?`, [req.body.companyID]);

                // delete from company
                await db_connection.query(`DELETE FROM company WHERE id = ?`, [req.body.companyID]);

                return res.status(200).send({ "message": 'OK' });
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, deleteCompany, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            }
        }
    ],

    // Test passed
    userLogin: async (req, res) => {
        if (req.body.userEmail === undefined || req.body.userPassword === undefined) {
            return res.status(400).send({ "message": 'BAD REQUEST' });
        };

        if (req.body.userEmail === '' || req.body.userPassword === '') {
            return res.status(400).send({ "message": 'INVALID USEREMAIL OR PASSWORD' });
        };

        // todo: PREVENT SQL INJECTION

        let db_connection = await db.promise().getConnection();
        try {
            let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ? AND userPassword = ?`, [req.body.userEmail, req.body.userPassword]);

            if (user.length === 0) {
                return res.status(404).send({ "message": 'INVALID USEREMAIL OR PASSWORD' });
            } else {
                const token = await webTokenGenerator({
                    userEmail: user[0].userEmail,
                    fullName: user[0].fullName,
                    userRole: user[0].userRole,
                    createdAt: user[0].createdAt
                });

                db_connection.query(`INSERT INTO loginHistory (userEmail, loginTime) VALUES (?, ?)`, [user[0].userEmail, Date.now()]);


                return res.json({
                    userEmail: user[0].userEmail,
                    fullName: user[0].fullName,
                    userRole: user[0].userRole,
                    createdAt: user[0].createdAt,
                    SECRET_TOKEN: token
                });
            }
        } catch (err) {
            console.log(err);
            const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, userLogin, ${istTime}]: ${err}\n\n`);
            return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
        } finally {
            db_connection.release();
        }
    },

    // Test passed
    userRegister: async (req, res) => {
        if (req.body.userEmail === undefined || req.body.userPassword === undefined || req.body.fullName === undefined) {
            return res.status(400).send({ "message": 'BAD REQUEST' });
        }

        if (req.body.userEmail === '' || req.body.userPassword === '' || req.body.fullName === '') {
            return res.status(400).send({ "message": 'INVALID USEREMAIL OR PASSWORD OR FULLNAME' });
        }

        if (!validator.isEmail(req.body.userEmail)) {
            return res.status(400).send({ "message": 'INVALID USEREMAIL' });
        }

        let db_connection = await db.promise().getConnection();
        try {
            let [user] = await db_connection.query(`SELECT * FROM user WHERE userEmail = ?`, [req.body.userEmail]);

            if (user.length !== 0) {
                return res.status(409).send({ "message": 'USER ALREADY EXISTS' });
            } else {
                db_connection.query(`INSERT INTO user (userEmail, userPassword, fullName, createdAt, userRole) VALUES (?, ?, ?, ?, ?)`, [req.body.userEmail, req.body.userPassword, req.body.fullName, Date.now(), '0']);

                return res.status(200).send({ "message": 'USER REGISTERED' });
            }
        }
        catch (err) {
            console.log(err);
            const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            fs.appendFileSync(`error_logs/errorLogs.txt`, `[ERROR, submitData, ${istTime}]: ${err}\n\n`);
            return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
        }
        finally {
            db_connection.release();
        }
    }
}