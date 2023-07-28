const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');

const fs = require('fs');
const validator = require('validator');

module.exports = {
    test: async (req, res) => {
        return res.status(200).send({ "message": 'Ok' });
    },

    // students
    getStudent: [
        webTokenValidator,
        async (req, res) => {
            if (req.body.rollNo === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.body.rollNo === '') {
                return res.status(400).send({ "message": 'INVALID ROLLNO' });
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [req.body.rollNo]);

                if (student.length === 0) {
                    return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                } else {

                    let [placement] = await db_connection.query(`SELECT * FROM placements WHERE studentRollNo = ?`, [req.body.rollNo]);

                    if (placement.length === 0) {
                        student[0].placement = [];
                        student[0].noOfOffers = 0;
                        return res.status(200).send({ "message": 'STUDENT FOUND', "data": student[0] });
                    } else {
                        
                        for (let i = 0; i < placement.length; i++) {
                            let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [placement[i].companyID]);

                            if (company.length === 0) {
                                return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                            }

                            placement[i].company = company[0];

                        }

                        student[0].placement = placement;
                        student[0].noOfOffers = placement.length;

                        return res.status(200).send({ "message": 'STUDENT FOUND', "data": student[0] });
                    }
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, getStudent, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

    allStudents: [
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

                    let [students] = await db_connection.query(`SELECT * FROM student`);

                    if (students.length === 0) {
                        return res.status(200).send({ "message": 'NO STUDENTS FOUND', "data": [] });
                    } else {
                        // attach placement details of each student
                        for (let i = 0; i < students.length; i++) {
                            let [placement] = await db_connection.query(`SELECT * FROM placements WHERE studentRollNo = ?`, [students[i].rollNo]);

                            if (placement.length === 0) {
                                students[i].placement = [];
                            } else {
                                let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [placement[0].companyID]);
                                
                                if (company.length === 0) {
                                    return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                                }

                                placement[0].company = company[0];
                                students[i].placement = placement;
                            }

                            students[i].noOfOffers = students[i].placement.length;
                        }

                        return res.status(200).send({ "message": 'OK', "data": students });
                    }
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, allStudents, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }        
    ],

    addStudent: [
        webTokenValidator,
        async (req, res) => {
            // rollNo VARCHAR(100) PRIMARY KEY NOT NULL,
            // fullName VARCHAR(200) NOT NULL,
            // gender VARCHAR(1) NOT NULL,
            // section VARCHAR(1) NOT NULL,
            // batch VARCHAR(4) NOT NULL,
            // campus VARCHAR(100) NOT NULL,
            // dept VARCHAR(100) NOT NULL,
            // isHigherStudies VARCHAR(1) NOT NULL

            if (req.userEmail === undefined || req.body.rollNo === undefined || req.body.fullName === undefined || req.body.gender === undefined || req.body.section === undefined || req.body.batch === undefined || req.body.campus === undefined || req.body.dept === undefined || req.body.isHigherStudies === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.userEmail === '' || req.body.rollNo === '' || req.body.fullName === '' || req.body.gender === '' || req.body.section === '' || req.body.batch === '' || req.body.campus === '' || req.body.dept === '' || req.body.isHigherStudies === '') {
                return res.status(400).send({"message": 'INVALID PARAMETERS'});
            }

            if (req.body.isHigherStudies !== '0' && req.body.isHigherStudies !== '1') {
                return res.status(400).send({ "message": 'INVALID HIGHER STUDIES PARAMETER' });
            }

            if (req.body.gender !== 'M' && req.body.gender  !== 'F') {
                return res.status(400).send({"message": "INVALID GENDER PARAMETER"});
            }

            if (req.body.section.length !== 1) {
                return res.status(400).send({"message": "INVALID SECTION PARAMETER"});
            }

            let db_connection = await db.promise().getConnection();

            try {

                // check duplicate rollno
                let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [req.body.rollNo]);

                if (student.length !== 0) {
                    return res.status(400).send({"message": "DUPLICATE ROLLNO"});
                }

                // add student. write code to insert

                await db_connection.query(`INSERT INTO student (rollNo, fullName, gender, section, batch, campus, dept, isHigherStudies) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [req.body.rollNo, req.body.fullName, req.body.gender, req.body.section, req.body.batch, req.body.campus, req.body.dept, req.body.isHigherStudies]);

                return res.status(200).send({ "message": 'OK' });

            } catch (err) {
                console.log(err);

                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, addStudent, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            }
        }
    ],

    updateStudent: [
        webTokenValidator,
        async (req, res) => {
            // rollNo VARCHAR(100) PRIMARY KEY NOT NULL,
            // fullName VARCHAR(200) NOT NULL,
            // gender VARCHAR(1) NOT NULL,
            // section VARCHAR(1) NOT NULL,
            // batch VARCHAR(4) NOT NULL,
            // campus VARCHAR(100) NOT NULL,
            // dept VARCHAR(100) NOT NULL,
            // isHigherStudies VARCHAR(1) NOT NULL

            if (req.userEmail === undefined || req.body.rollNo === undefined) {
                return res.status(400).send({ "message": 'BAD REQUEST' });
            }

            if (req.userEmail === '' || req.body.rollNo === '') {
                return res.status(400).send({ "message": 'INVALID PARAMETERS' });
            }

            if (req.body.fullName === undefined && req.body.gender === undefined && req.body.section === undefined && req.body.batch === undefined && req.body.campus === undefined && req.body.dept === undefined && req.body.isHigherStudies === undefined) {
                return res.status(400).send({ "message": 'NO PARAMETERS FOUND TO UPDATE' });
            }

            if (req.body.fullName === '' && req.body.gender === '' && req.body.section === '' && req.body.batch === '' && req.body.campus === '' && req.body.dept === '' && req.body.isHigherStudies === '') {
                return res.status(400).send({ "message": 'INVALID PARAMETERS FOUND TO UPDATE' });
            }

            if (req.body.isHigherStudies !== undefined && req.body.isHigherStudies !== '' && req.body.isHigherStudies !== '0' && req.body.isHigherStudies !== '1') {
                return res.status(400).send({ "message": 'INVALID HIGHER STUDIES PARAMETER' });
            }

            if (req.body.gender !== undefined && req.body.gender !== '' && req.body.gender !== 'M' && req.body.gender  !== 'F') {
                return res.status(400).send({"message": "INVALID GENDER PARAMETER"});
            }

            if (req.body.section !== undefined && req.body.section !== '' && req.body.section.length !== 1) {
                return res.status(400).send({"message": "INVALID SECTION PARAMETER"});
            }

            let db_connection = await db.promise().getConnection();

            try {
                let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [req.body.rollNo]);

                if (student.length === 0) {
                    return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                }

                let [newStudent] = student[0];

                if (req.body.fullName !== undefined && req.body.fullName !== '') {
                    newStudent.fullName = req.body.fullName;
                }

                if (req.body.gender !== undefined && req.body.gender === '') {
                    newStudent.gender = req.body.gender;
                }

                if (req.body.section !== undefined && req.body.section !== '') {
                    newStudent.section = req.body.section;
                }

                if (req.body.batch !== undefined && req.body.batch !== '') {
                    newStudent.batch = req.body.batch;
                }

                if (req.body.campus !== undefined && req.body.campus !== '') {
                    newStudent.campus = req.body.campus;
                }

                if (req.body.dept !== undefined && req.body.dept !== '') {
                    newStudent.dept = req.body.dept;
                }

                if (req.body.isHigherStudies !== undefined && req.body.isHigherStudies !== '') {
                    newStudent.isHigherStudies = req.body.isHigherStudies;
                }


                // execute update query

                await db_connection.query(`UPDATE student SET fullName = ?, gender = ?, section = ?, batch = ?, campus = ?, dept = ?, isHigherStudies = ? WHERE rollNo = ?`, [newStudent.fullName, newStudent.gender, newStudent.section, newStudent.batch, newStudent.campus, newStudent.dept, newStudent.isHigherStudies, req.body.rollNo]);

                return res.status(200).send({ "message": 'OK' });

            } catch (err) {
                console.log(err);

                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, updateStudent, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            }
        }    
    ],

    // placements
    getPlacement: [
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
                    } else {

                        let [student] = await db_connection.query(`SELECT * FROM student WHERE rollNo = ?`, [placement[0].studentRollNo]);

                        if (student.length === 0) {
                            return res.status(404).send({ "message": 'STUDENT NOT FOUND' });
                        }

                        let [studentOffers] = await db_connection.query(`SELECT COUNT(*) AS noOfOffers FROM placements WHERE studentRollNo = ?`, [placement[0].studentRollNo]);

                        student[0].noOfOffers = studentOffers[0].noOfOffers;

                        placement[0].student = student[0];

                        let [company] = await db_connection.query(`SELECT * FROM company WHERE id = ?`, [placement[0].companyID]);
                        
                        if (company.length === 0) {
                            return res.status(404).send({ "message": 'COMPANY NOT FOUND' });
                        }

                        let [companyOffers] = await db_connection.query(`SELECT COUNT(*) AS noOfOffers FROM placements WHERE companyID = ?`, [placement[0].companyID]);

                        company[0].noOfOffers = companyOffers[0].noOfOffers;

                        placement[0].company = company[0];

                        return res.status(200).send({ "message": 'OK', "data": placement[0] });

                    }
                }
            } catch (err) {
                console.log(err);
                const istTime = Date.now().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                fs.appendFileSync(`logs/errorLogs.txt`, `[ERROR, getPlacement, ${istTime}]: ${err}\n\n`);
                return res.status(500).send({ "message": 'INTERNAL SERVER ERROR' });
            } finally {
                db_connection.release();
            }
        }
    ],

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

                    const [newPlacement] = placement[0];

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
                await db_connection.query(`DELETE FROM placements WHERE companyID = ?`, [req.body.companyID]);

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