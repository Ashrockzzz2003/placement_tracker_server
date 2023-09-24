const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sql003',
    database: 'placement_tracker',
    waitForConnections: true,
    connectionLimit: 11,
    queueLimit: 0
});

const fs = require('fs');

const insertData = async (db) => {
    try {
        await executeSqlScript(db, './managementData.sql', 'managementData');
        await executeSqlScript(db, './managementRegister.sql', 'managementRegister');
        await executeSqlScript(db, './CSE_A.sql', 'studentData');
        await executeSqlScript(db, './CSE_B.sql', 'studentData');
        await executeSqlScript(db, './CSE_C.sql', 'studentData');
        await executeSqlScript(db, './CSE_D.sql', 'studentData');
        await executeSqlScript(db, './CSE_E.sql', 'studentData');
        await executeSqlScript(db, './studentRegister.sql', 'studentRegister');
        await executeSqlScript(db, './companyData.sql', 'companyData');
        await executeSqlScript(db, './placementData.sql', 'placementData');
    } catch (err) {
        console.error(err);
    }
};

const executeSqlScript = (db, filePath, tableName) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const queries = fileContent.split('\n');

    return Promise.all(queries.map(async (query) => {
        const cleanedQuery = query.trim();
        if (cleanedQuery !== '') {
            try {
                await queryAsync(db, cleanedQuery);
                console.log(`[MESSAGE]: Data Inserted into ${tableName} table.`);
            } catch (err) {
                throw new Error(`[Error]: Failed to insert data into ${tableName} table - ${err.message}`);
            }
        }
    }));
};

const queryAsync = (db, query) => {
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

insertData(db);

module.exports = insertData;