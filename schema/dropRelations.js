const dropTables = (db) => {
    db.query(`DROP TABLE IF EXISTS managementData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop managementData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped managementData table");
        }
    });

    db.query(`DROP TABLE IF EXISTS studentData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop studentData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped studentData table");
        }
    });

    db.query(`DROP TABLE IF EXISTS jobData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop jobData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped jobData table");
        }
    });

    db.query(`DROP TABLE IF EXISTS placementData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop placementData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped placementData table");
        }
    });

    db.query(`DROP TABLE IF EXISTS mangementData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop managementData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped managementData table");
        }
    });
}

module.exports = dropTables;