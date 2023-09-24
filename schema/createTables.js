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

const createTables = async (db) => {
    try {
      await queryAsync(db, `CREATE TABLE managementData (
          id INT NOT NULL AUTO_INCREMENT,
          managerEmail VARCHAR(255) NOT NULL UNIQUE,
          managerPassword VARCHAR(255) NOT NULL,
          managerName VARCHAR(255) NOT NULL,
          managerRole CHAR(1) NOT NULL,
          createdAt DATE NOT NULL,
          PRIMARY KEY (id),
          CONSTRAINT CK_managerRole CHECK (managerRole='0' OR managerRole='1' OR managerRole='2')
      );`);
      console.log("[MESSAGE]: Created managementData table");
    } catch (err) {
        console.log("[ERROR]: Failed to create managementData Table");
        console.error(err);
    }
  
      
    try {
      await queryAsync(db, `CREATE TABLE managementRegister (
          id INT NOT NULL AUTO_INCREMENT,
          managerEmail VARCHAR(255) NOT NULL UNIQUE,
          otp VARCHAR(6) NOT NULL,
          createdAt DATETIME NOT NULL,
          PRIMARY KEY (id)
      );`);
      console.log("[MESSAGE]: Created managementRegister table");
    } catch (err) {
        console.log("[ERROR]: Failed to create managementRegister Table");
        console.error(err);
    }
  
      
    try{
      await queryAsync(db, `CREATE TABLE studentData (
          id INT NOT NULL AUTO_INCREMENT,
          studentRollNo CHAR(16) NOT NULL UNIQUE,
          studentEmail VARCHAR(255) NOT NULL UNIQUE,
          studentPassword VARCHAR(255) NOT NULL,
          studentName VARCHAR(255) NOT NULL,
          studentSection CHAR(1) NOT NULL,
          studentGender CHAR(1) NOT NULL,
          studentBatch CHAR(4) NOT NULL,
          studentDept VARCHAR(10) NOT NULL,
          isHigherStudies CHAR(1) NOT NULL,
          isPlaced CHAR(1) NOT NULL DEFAULT '0',
          createdAt DATE NOT NULL,
          CGPA VARCHAR(4) NULL,
          PRIMARY KEY (id),
          CONSTRAINT CK_isHigherStudies CHECK ( isHigherStudies='0' OR isHigherStudies='1'),
          CONSTRAINT CK_isPlaced CHECK ( isPlaced='0' OR isPlaced='1'),
          CONSTRAINT CK_studentGender CHECK (studentGender = 'M' OR studentGender = 'F' OR studentGender = 'O')
      );`);
      console.log("[MESSAGE]: Created studentData table");
    } catch (err) {
        console.log("[ERROR]: Failed to create studentData Table");
        console.error(err);
    }

    try{
      await queryAsync(db, `CREATE TABLE studentRegister (
          id INT NOT NULL AUTO_INCREMENT,
          studentEmail VARCHAR(255) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          createdAt DATETIME NOT NULL,
          PRIMARY KEY (id)
      );`);
      console.log("[MESSAGE]: Created studentRegister table");
    } catch (err) {
        console.log("[ERROR]: Failed to create studentRegister Table");
        console.error(err);
    }

    try{
      await queryAsync(db, `CREATE TABLE companyData (
          id INT NOT NULL AUTO_INCREMENT,
          companyName VARCHAR(255) NOT NULL UNIQUE,
          createdAt DATE NOT NULL,
          managerEmail VARCHAR(255) NULL,
          studentRollNo VARCHAR(255) NULL,
          PRIMARY KEY (id)
      );`);
      console.log("[MESSAGE]: Created companyData table");
    } catch (err) {
        console.log("[ERROR]: Failed to create companyData Table");
        console.error(err);
    }

    try{
      await queryAsync(db, `CREATE TABLE placementData (
          id INT NOT NULL AUTO_INCREMENT,
          studentId INT NOT NULL,
          companyId INT NOT NULL,
          ctc FLOAT NOT NULL,
          jobRole VARCHAR(255) NOT NULL,
          placementDate DATE NOT NULL,
          isIntern VARCHAR(1) NOT NULL,
          isPPO VARCHAR(1) NOT NULL,
          isOnCampus VARCHAR(1) NOT NULL,
          isGirlsDrive VARCHAR(1) NOT NULL,
          extraData VARCHAR(1000),
          createdAt DATE NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (studentId) REFERENCES studentData(id),
          FOREIGN KEY (companyId) REFERENCES companyData(id),
          CONSTRAINT CK_isIntern CHECK ( isIntern='0' OR isIntern='1'),
          CONSTRAINT CK_isPPO CHECK ( isPPO='0' OR isPPO='1'),
          CONSTRAINT CK_isOnCampus CHECK ( isOnCampus='0' OR isOnCampus='1'),
          CONSTRAINT CK_isGirlsDrive CHECK ( isGirlsDrive='0' OR isGirlsDrive='1')
      );`);
  
      console.log("[MESSAGE]: Created placementData table");
    } catch (err) {
      console.log("[ERROR]: Failed to create placementData Table");
      console.error(err);
    }
  };
  
  // Function to promisify the database query
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
  createTables(db);