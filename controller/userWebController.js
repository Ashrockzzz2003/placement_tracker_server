const { db } = require('../connection')

const webTokenGenerator = require('../middleware/webTokenGenerator');
const webTokenValidator = require('../middleware/webTokenValidator');

const fs = require('fs');
const validator = require('validator');

module.exports = {
    test: async (req, res) => {
        return res.status(200).send({ "message": 'Ok' });
    },

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
            await db_connection.query("LOCK TABLES loginHistory WRITE, user WRITE;");

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
            await db_connection.query("UNLOCK TABLES;");
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
            await db_connection.query("LOCK TABLES user WRITE;");

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
            await db_connection.query("UNLOCK TABLES;");
        }
    }
}