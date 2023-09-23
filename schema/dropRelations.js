const dropTables = (db) => {
    db.query(`DROP TABLE IF EXISTS placementData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop placementData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped placementData table");
        }
    });

    db.query(`DROP TABLE IF EXISTS companyData`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop companyData table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped companyData table");
        }
    });

    db.query(`DROP TABLE IF EXISTS studentRegister`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop studentRegister table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped studentRegister table");
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

    db.query(`DROP TABLE IF EXISTS managementRegister`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop managementRegister table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped managementRegister table");
        }
    });

    db.query(`DROP TABLE IF EXISTS managementData`, (err, result) => {
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