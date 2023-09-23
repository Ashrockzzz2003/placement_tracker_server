const fs = require('fs');

const insertData = (db) => {
    db.query(`INSERT INTO managementData (managerEmail, managerPassword, managerName, managerRole, createdAt) VALUES
    ('ashrockzzz2003@gmail.com', 'admin#amrita_pt', 'Ashwin Narayanan S', '1', ${new Date().toISOString().slice(0, 19).split('T')[0].toString()});`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to insert into managementData table");
            console.log(err);
        } else {
            console.log("[MESSAGE]: Inserted into managementData table");
        }
    });

}

module.exports = insertData;
