const createTables = (db) => {
    db.query(`CREATE TABLE company (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        companyName VARCHAR(200) NOT NULL
    )`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create company table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Created company table");
        }
    });

    db.query(`CREATE TABLE student (
        rollNo VARCHAR(100) PRIMARY KEY NOT NULL,
        fullName VARCHAR(200) NOT NULL,
        gender VARCHAR(1) NOT NULL,
        section VARCHAR(1) NOT NULL,
        batch VARCHAR(4) NOT NULL,
        campus VARCHAR(100) NOT NULL,
        dept VARCHAR(100) NOT NULL,
        isHigherStudies VARCHAR(1) NOT NULL
    )`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create student table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Created student table");
        }
    });

    db.query(`CREATE TABLE placements (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                studentRollNo VARCHAR(100) NOT NULL,
                companyID INT NOT NULL,
                role VARCHAR(200) NOT NULL,
                ctc VARCHAR(100) NOT NULL,
                datePlaced VARCHAR(200) NOT NULL,
                isPPO VARCHAR(1) NOT NULL,
                isOnCampus VARCHAR(1) NOT NULL,
                extra VARCHAR(500),
                location VARCHAR(200) NOT NULL,
                FOREIGN KEY (studentRollNo) REFERENCES student(rollNo),
                FOREIGN KEY (companyID) REFERENCES company(id)
    )`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create placements table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Created placements table");
        }
    });

    db.query(`CREATE TABLE role (
        id VARCHAR(1) PRIMARY KEY NOT NULL,
        roleName VARCHAR(200) NOT NULL
    )`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create role table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Created role table");
        }
    });

    db.query(`CREATE TABLE user (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        fullName VARCHAR(200) NOT NULL,
        userEmail VARCHAR(200) NOT NULL UNIQUE,
        userPassword VARCHAR(200) NOT NULL,
        userRole VARCHAR(1) NOT NULL,
        createdAt VARCHAR(500) NOT NULL,
        FOREIGN KEY (userRole) REFERENCES role(id)
    )`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create user table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Created user table");
        }
    });

    db.query(`CREATE TABLE loginHistory (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        userEmail VARCHAR(200) NOT NULL,
        loginTime VARCHAR(500) NOT NULL,
        FOREIGN KEY (userEmail) REFERENCES user(userEmail)
        )`, (err, result) => {
        if (err) {
            console.log("[ERROR]: Failed to create loginHistory table");
            console.log(err);
        }
        else {
            console.log("[MESSAGE]: Created loginHistory table");
        }
    });

}

module.exports = createTables;