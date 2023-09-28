/* Ashwin */
-- role: 0 -> Teacher, 1 -> Admin, 2 -> Student.
-- accountStatus: 0 -> WAITLIST, 1 -> ACTIVE, 2 -> BLOCKED
-- all OTP valid only for 5 minutes.
-- Management table
CREATE TABLE managementData (
    id INT NOT NULL AUTO_INCREMENT,
    managerEmail VARCHAR(255) NOT NULL UNIQUE,
    managerPassword VARCHAR(255) NOT NULL,
    managerName VARCHAR(255) NOT NULL,
    managerRole CHAR(1) NOT NULL,
    createdAt DATE NOT NULL,
    accountStatus CHAR(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (id),
    CONSTRAINT CK_managerRole CHECK (managerRole='0' OR managerRole='1')
    CONSTRAINT CK_accountStatus CHECK (accountStatus = '0' OR accountStatus = '1' OR accountStatus='2')
);

-- This will act like a temporary table. Once the manager verifies their email, the data will be moved to managementData table.
-- managerEmail is UNIQUE to ensure that only 1 entry for manager. If the manager tries to register again, new OTP will be updated.
CREATE TABLE managementRegister (
    id INT NOT NULL AUTO_INCREMENT,
    managerEmail VARCHAR(255) NOT NULL UNIQUE,
    otp VARCHAR(6) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);
-- Student table
-- isHigherStudies: 0 -> NO, 1 -> YES
-- studentSection: A - Z. more than that is not practical.
-- studentGender: 'M' or 'F'
-- studentBatch: 4 digit number (YYYY)
-- studentDept: CSE only for now. Can be extended later.
-- CGPA: 4 digit number (X.XX)
-- studentRollNo: CB.EN.U4CSEXXXXX (X -> 0-9). Can be extended later.
-- studentDob: YYYY-MM-DD
-- studentAccountStatus 0 -> WaitList, 1 -> Active, 2 -> Deactivated.
-- isPlaced: 0 -> NO, 1 -> INTERN, 2 -> JOB (Just to show a preview of the data. Can be extended with more options later.)
CREATE TABLE studentData (
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
    studentAccountStatus VARCHAR(1) NOT NULL DEFAULT '1',
    PRIMARY KEY (id),
    CONSTRAINT CK_isHigherStudies CHECK ( isHigherStudies='0' OR isHigherStudies='1'),
    CONSTRAINT CK_isPlaced CHECK ( isPlaced='0' OR isPlaced='1'),
    CONSTRAINT CK_studentGender CHECK (studentGender = 'M' OR studentGender = 'F' OR studentGender = 'O'),
    CONSTRAINT CK_studentAccountStatus CHECK (studentAccountStatus = '0' OR studentAccountStatus = '1' OR studentAccountStatus='2')
);
-- This will act like a temporary table. Once the student verifies their email, the data will be moved to studentData table.
CREATE TABLE studentRegister (
    id INT NOT NULL AUTO_INCREMENT,
    studentEmail VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);
-- Jobs table
-- student has access to make an entry to this table if it's off-campus, this will be done in front-end.
CREATE TABLE companyData (
    id INT NOT NULL AUTO_INCREMENT,
    companyName VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATE NOT NULL,
    managerEmail VARCHAR(255) NULL,
    studentRollNo VARCHAR(255) NULL,
    PRIMARY KEY (id)
);
-- Placement table
-- isIntern: 0 -> no, 1 -> yes
-- isPPO: 0 -> no, 1 -> yes
-- isOnCampus: 0 -> no, 1 -> yes
-- extra: string with extra data. Can be used to store anything.
CREATE TABLE placementData (
    id INT NOT NULL AUTO_INCREMENT,
    studentId INT NOT NULL,
    companyId INT NOT NULL,
    ctc FLOAT NOT NULL,
    jobRole VARCHAR(255) NOT NULL,
    jobLocation VARCHAR(255) DEFAULT NULL,
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
);
/*
 1. login
 2. register
 
 -- only managers
 3. placement_statistics
 a. batch statistics
 b. overall statistics
 4. all_students with placement_data
 a. batch wise
 b. section_wise
 
 6. all_companies (UNIQUE companyName)
 7. get_comapany_data (ctc, role, opportunityStatus, totalHires, createdAt for a particular companyName (jobId will be UNIQUEID))
 8. get_student_for_ctc_role_company (get placementData by jobID joined with studentData on studentRollNo)
 
 7. add_student
 a. student registers by themselves
 b. manager adds student
 8. update_student
 a. student updates their data
 b. manager updates student data
 9. delete_student
 b. manager deletes student data
 10. get_student_data by studentRollNo.
 
 10. add_teacher
 a. teacher adds themselves
 b. manager adds teacher
 11. update_teacher
 a. teacher updates their data
 b. admin updates teacher data
 12. delete_teacher
 b. admin deletes teacher data
 
 13. add_job
 a. student adds job
 b. manager adds job
 
 14. update_job
 b. manager updates job data
 c. student can modify only their job
 
 
 --FORGOT PASSWORD
 --RESET PASSWORD
 --RESEND OTP
 */