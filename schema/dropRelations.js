const dropTables = (db) => {
    db.query(`DROP TABLE IF EXISTS placements`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop placements table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped placements table");
        }
    });

    db.query(`DROP TABLE IF EXISTS student`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop student table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped student table");
        }
    });

    db.query(`DROP TABLE IF EXISTS company`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop company table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped company table");
        }
    });

    db.query(`DROP TABLE IF EXISTS loginHistory`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop user table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped user table");
        }
    });

    db.query(`DROP TABLE IF EXISTS user`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop user table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped user table");
        }
    });

    db.query(`DROP TABLE IF EXISTS role`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to drop role table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Dropped role table");
        }
    });
}

module.exports = dropTables;