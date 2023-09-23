const createTables = (db) => {
    db.query(`CREATE TABLE managementData (
        managerEmail VARCHAR(255) NOT NULL,
        managerName VARCHAR(255) NOT NULL,
        role CHAR(1) NOT NULL,
        createdAt DATE NOT NULL,
        PRIMARY KEY (managerEmail)
    );`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create managementData table");
            console.log(err);
        } else {
            console.log("[MESSAGE]: Created managementData table");
        }
    });

    db.query(`CREATE TABLE studentData (
        studentRollNo CHAR(16) NOT NULL UNIQUE,
        studentName VARCHAR(255) NOT NULL,
        studentSection CHAR(1) NOT NULL,
        studentGender CHAR(1) NOT NULL,
        studentBatch CHAR(4) NOT NULL,
        studentDept VARCHAR(10) NOT NULL,
        isHigherStudies CHAR(1) NOT NULL,
        isPlaced CHAR(1) NOT NULL DEFAULT '0',
        createdAt DATE NOT NULL,
    
        CGPA VARCHAR(4) NULL,
        PRIMARY KEY (studentRollNo)
    );`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create studentData table");
            console.log(err);
        } else {
            console.log("[MESSAGE]: Created studentData table");
        }
    });

    db.query(`CREATE TABLE jobData (
        id INT NOT NULL AUTO_INCREMENT,
        companyName VARCHAR(255) NOT NULL,
        ctc FLOAT NOT NULL,
        role VARCHAR(255) NOT NULL,
        opportunityStatus CHAR(1) NOT NULL,
        totalHires INT NOT NULL DEFAULT 0,
        createdAt DATE NOT NULL,
        managerEmail VARCHAR(255) NULL,
        studentRollNo VARCHAR(255) NULL,
    
        PRIMARY KEY (id),
        FOREIGN KEY (companyName) REFERENCES companyData(companyName),
        FOREIGN KEY (managerEmail) REFERENCES managementData(managerEmail),
        FOREIGN KEY (studentRollNo) REFERENCES studentData(studentRollNo),
        UNIQUE (companyName, role, ctc)
    );`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create jobData table");
            console.log(err);
        } else {
            console.log("[MESSAGE]: Created jobData table");
        }
    });

    db.query(`CREATE TABLE placementData (
        id INT NOT NULL AUTO_INCREMENT,
    
        studentRollNo VARCHAR(255) NOT NULL,
        studentSection CHAR(1) NOT NULL,
        studentGender CHAR(1) NOT NULL,
    
        jobID INT NOT NULL,
        isIntern VARCHAR(1) NOT NULL,
        isPPO VARCHAR(1) NOT NULL,
        isOnCampus VARCHAR(1) NOT NULL,
        extra VARCHAR(500),
        createdAt DATE NOT NULL,
    
        PRIMARY KEY (id),
        FOREIGN KEY (studentRollNo) REFERENCES studentData(studentRollNo),
        FOREIGN KEY (jobID) REFERENCES jobData(id)
    );`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create placementData table");
            console.log(err);
        } else {
            console.log("[MESSAGE]: Created placementData table");
        }
    });
}

module.exports = createTables;