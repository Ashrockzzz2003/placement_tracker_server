const fs = require('fs');

const insertData = (db) => {
    db.query(`INSERT INTO role values ('1', 'ADMIN')`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Data Inserted into role table.");
        }
    });

    db.query(`INSERT INTO role values ('0', 'USER')`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Data Inserted into role table.");
        }
    });

    db.query(`INSERT INTO user (fullName, userEmail, userPassword, userRole, createdAt) values ('ADMIN', 'admin@fte.amrita.edu', '1q2w3e4r', '1', '${Date.now()}')`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Data Inserted into users table.");
        }
    });

    // execute the sql script
    fs.readFile('./schema/CSE_A.sql', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            db.query(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("[MESSAGE]: Data Inserted into student table.");
                }
            });
        }
    });

    fs.readFile('./schema/CSE_B.sql', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            db.query(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("[MESSAGE]: Data Inserted into student table.");
                }
            });
        }
    });

    fs.readFile('./schema/CSE_C.sql', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            db.query(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("[MESSAGE]: Data Inserted into student table.");
                }
            });
        }
    });

    fs.readFile('./schema/CSE_D.sql', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            db.query(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("[MESSAGE]: Data Inserted into student table.");
                }
            });
        }
    });

    fs.readFile('./schema/CSE_E.sql', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            db.query(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("[MESSAGE]: Data Inserted into student table.");
                }
            });
        }
    });

    fs.readFile('./schema/company.sql', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            db.query(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("[MESSAGE]: Data Inserted into company table.");
                }
            });
        }
    });

}

module.exports = insertData;