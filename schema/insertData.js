const fs = require('fs');

const insertData = (db) => {
    try {
        fs.readFile('./schema/data/data.sql', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                db.query(data, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`[MESSAGE]: Data Inserted into tables.`);
                    }
                });
            }
        });
    } catch (err) {
        console.error(err);
    }
};


module.exports = insertData;