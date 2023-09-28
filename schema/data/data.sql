DROP TABLE IF EXISTS placementData;
DROP TABLE IF EXISTS companyData;
DROP TABLE IF EXISTS studentRegister;
DROP TABLE IF EXISTS studentData;
DROP TABLE IF EXISTS managementRegister;
DROP TABLE IF EXISTS managementData;
CREATE TABLE managementData (
    id INT NOT NULL AUTO_INCREMENT,
    managerEmail VARCHAR(255) NOT NULL UNIQUE,
    managerPassword VARCHAR(255) NOT NULL,
    managerName VARCHAR(255) NOT NULL,
    managerRole CHAR(1) NOT NULL,
    createdAt DATE NOT NULL,
    accountStatus CHAR(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (id),
    CONSTRAINT CK_managerRole CHECK (managerRole='0' OR managerRole='1'),
    CONSTRAINT CK_accountStatus CHECK (accountStatus = '0' OR accountStatus = '1' OR accountStatus='2')
);
CREATE TABLE managementRegister (
    id INT NOT NULL AUTO_INCREMENT,
    managerEmail VARCHAR(255) NOT NULL UNIQUE,
    otp VARCHAR(6) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);
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
CREATE TABLE studentRegister (
    id INT NOT NULL AUTO_INCREMENT,
    studentEmail VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE companyData (
    id INT NOT NULL AUTO_INCREMENT,
    companyName VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATE NOT NULL,
    managerEmail VARCHAR(255) NULL,
    studentRollNo VARCHAR(255) NULL,
    PRIMARY KEY (id)
);
CREATE TABLE placementData (
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
    CONSTRAINT CK_isIntern CHECK (
        isIntern = '0'
        OR isIntern = '1'
    ),
    CONSTRAINT CK_isPPO CHECK (
        isPPO = '0'
        OR isPPO = '1'
    ),
    CONSTRAINT CK_isOnCampus CHECK (
        isOnCampus = '0'
        OR isOnCampus = '1'
    ),
    CONSTRAINT CK_isGirlsDrive CHECK (
        isGirlsDrive = '0'
        OR isGirlsDrive = '1'
    )
);

insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) values ('ashrockzzz2003@gmail.com','6f28f4faf56bb704ae154fc2d2b2ba0d72f8a9ea06c3b8a3ed0be6836da9e258','Ashwin Narayanan S', '1', '2023-09-22', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) values ('goxtham@gmail.com','#er5o6ui7$k89','Gowtham Govindh S', '0', '2023-09-24', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('saravana@amrita.edu', 'gyu32hr32', 'Saravanak Karthick', '0', '2023-09-24', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('harish@amrita.edu', 'h57i4uenc', 'Harish TS', '0', '2023-09-25', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('hirthick@amrita.edu', '7yb2fvs#@', 'Hirthick Raj D', '0', '2023-09-26', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('praveen@amrita.edu', '789gth$#@', 'Praveen N', '0', '2023-09-27', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('sajith@amrita.edu', '64yd3n20', 'Sajith Rajan P', '0', '2023-09-28', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('adhvaith@amrita.edu', '890hyuio#', 'Adhvaith Sankar SS', '0', '2023-09-24', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('pranav@amrita.edu', 'gvvwgv2ty', 'Pranav Kakula', '0', '2023-09-25', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole,createdAt, accountStatus) VALUES ('guru@amrita.edu', '67vgvgtgty', 'Guru Prasad', '0', '2023-09-26', '1');

insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18001','CB.EN.U4CSE18001@cb.students.amrita.edu','password','AAKASH KRISHNA R','A','M','2022','CSE','1','0','2023-09-24');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18002','CB.EN.U4CSE18002@cb.students.amrita.edu','password','ABHI SUWETHA','A','F','2022','CSE','0','1','2023-09-25');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18003','CB.EN.U4CSE18003@cb.students.amrita.edu','password','AKULA SUDHAMSHU','A','M','2022','CSE','0','1','2023-09-26');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18004','CB.EN.U4CSE18004@cb.students.amrita.edu','password','ANIRUDH B','A','M','2022','CSE','1','0','2023-09-27');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18005','CB.EN.U4CSE18005@cb.students.amrita.edu','password','ANVITHA YERNENI','A','F','2022','CSE','0','1','2023-09-28');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18006','CB.EN.U4CSE18006@cb.students.amrita.edu','password','SAI PRATEEK ATLURI','A','M','2022','CSE','1','0','2023-09-29');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18007','CB.EN.U4CSE18007@cb.students.amrita.edu','password','AVULA SANDEEP REDDY','A','M','2022','CSE','0','1','2023-09-30');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18008','CB.EN.U4CSE18008@cb.students.amrita.edu','password','BALAJI D','A','M','2022','CSE','0','1','2023-10-01');

insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18101','CB.EN.U4CSE18101@cb.students.amrita.edu','password','AADHITH S.','B','M','2022','CSE','0','1','2023-09-24');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18102','CB.EN.U4CSE18102@cb.students.amrita.edu','password','ABDUL GOUSE SHAIK','B','M','2022','CSE','0','1','2023-09-25');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18104','CB.EN.U4CSE18104@cb.students.amrita.edu','password','ACHANTA HARISH','B','M','2022','CSE','0','1','2023-09-26');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18105','CB.EN.U4CSE18105@cb.students.amrita.edu','password','ADITHYA P VARMA','B','M','2022','CSE','0','1','2023-09-27');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18106','CB.EN.U4CSE18106@cb.students.amrita.edu','password','VENKATA SAI SRIRAM','B','M','2022','CSE','0','1','2023-09-28');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18107','CB.EN.U4CSE18107@cb.students.amrita.edu','password','ANKITHA','B','F','2022','CSE','0','1','2023-09-29');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18108','CB.EN.U4CSE18108@cb.students.amrita.edu','password','ARAVIND NP','B','M','2022','CSE','1','0','2023-09-30');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18109','CB.EN.U4CSE18109@cb.students.amrita.edu','password','ARAVINDH S','B','M','2022','CSE','0','1','2023-10-01');

insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18201','CB.EN.U4CSE18201@cb.students.amrita.edu','password','AADURU VENKATA HEMA','C','M','2022','CSE','0','0', '2023-09-24');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18202','CB.EN.U4CSE18202@cb.students.amrita.edu','password','S.AAKASH MUTHIAH','C','M','2022','CSE','0','0', '2023-09-25');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18203','CB.EN.U4CSE18204@cb.students.amrita.edu','password','ABISHEK VASANTHAN A S','C','M','2022','CSE','0','1', '2023-09-26');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18204','CB.EN.U4CSE18205@cb.students.amrita.edu','password','M. S. ADARSH','C','M','2022','CSE','0','1', '2023-09-27');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18205','CB.EN.U4CSE18206@cb.students.amrita.edu','password','ADITHI NARAYAN','C','F','2022','CSE','0','1', '2023-09-28');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18206','CB.EN.U4CSE18207@cb.students.amrita.edu','password','AMBATI NAGA SREEHARSHA','C','M','2022','CSE','0','1', '2023-09-29');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18207','CB.EN.U4CSE18208@cb.students.amrita.edu','password','ANAND DEVARAJAN','C','M','2022','CSE','0','0', '2023-09-30');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18208','CB.EN.U4CSE18209@cb.students.amrita.edu','password','ARJUN DEV P.K','C','M','2022','CSE','0','1', '2023-10-01');

insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18301','CB.EN.U4CSE18301@cb.students.amrita.edu','password','ABHILASH SASIKUMAR','D','M','2022','CSE','0','0', '2023-09-24');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18302','CB.EN.U4CSE18302@cb.students.amrita.edu','password','ACHANTA RAMYA SRI','D','F','2022','CSE','0','1', '2023-09-25');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18303','CB.EN.U4CSE18303@cb.students.amrita.edu','password','ADITHI GIRIDHARAN','D','F','2022','CSE','0','1', '2023-09-26');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18304','CB.EN.U4CSE18304@cb.students.amrita.edu','password','B AISHWARYA','D','F','2022','CSE','0','1', '2023-09-27');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18305','CB.EN.U4CSE18305@cb.students.amrita.edu','password','ANANTHAPADMANABHA.M.','D','M','2022','CSE','0','1', '2023-09-28');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18306','CB.EN.U4CSE18306@cb.students.amrita.edu','password','SAI KAMAL','D','M','2022','CSE','0','1', '2023-09-29');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18307','CB.EN.U4CSE18307@cb.students.amrita.edu','password','ASHWIN K','D','M','2022','CSE','0','1', '2023-09-30');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18308','CB.EN.U4CSE18308@cb.students.amrita.edu','password','VAIBHAV KRISHNA BANDLA','D','M','2022','CSE','0','1', '2023-10-01');

insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18401','CB.EN.U4CSE18401@cb.students.amrita.edu','password','AADHITYA TEJASWIN P S','E','M','2022','CSE','1','0', '2023-09-24');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18402','CB.EN.U4CSE18402@cb.students.amrita.edu','password','AADITYA UMASHANKAR','E','M','2022','CSE','0','1', '2023-09-25');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18403','CB.EN.U4CSE18403@cb.students.amrita.edu','password','ABHINAAV MAANAV V','E','M','2022','CSE','0','1', '2023-09-26');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18404','CB.EN.U4CSE18404@cb.students.amrita.edu','password','ABISHECK KATHIRVEL','E','M','2022','CSE','0','1', '2023-09-27');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18405','CB.EN.U4CSE18405@cb.students.amrita.edu','password','ADAPA CHIRANJEEVI','E','M','2022','CSE','0','1', '2023-09-28');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18406','CB.EN.U4CSE18406@cb.students.amrita.edu','password','AISHWARYA S R','E','F','2022','CSE','0','1', '2023-09-29');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18407','CB.EN.U4CSE18407@cb.students.amrita.edu','password','TEJA VENKAT AKULA','E','M','2022','CSE','0','1', '2023-09-30');
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18408','CB.EN.U4CSE18408@cb.students.amrita.edu','password','AKUTHOTA KALYAN SAI','E','M','2022','CSE','1','0', '2023-10-01');


insert into companyData (companyName,createdAt,managerEmail) values('CISCO ','2021-08-07','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('INTUIT','2021-08-07','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ROOT QUOTIENT','2021-12-07','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ARISTA','2021-12-08','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('SAHAJ','2021-12-09','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('EPIKINDIFI','2021-12-10','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('PROVIDENCE GLOBAL','2021-12-11','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('NIELSENIQ','2021-12-12','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('INCREFF','2021-12-13','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('MCKINSEY','2021-12-14','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('APPVIEWX ','2021-12-15','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('FIDILITY ','2021-12-16','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('SAP LABS','2021-12-17','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('MICROSOFT','2021-12-18','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('TALLY SOLUTIONS','2021-12-19','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('INFOSYS','2021-12-20','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('EY INDIA','2021-12-21','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ORACLE','2021-08-07','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('VERSA NETWORKS','2021-08-08','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('AMAZON','2021-08-09','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('IBM','2021-08-10','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('KLA TENCOR','2021-08-11','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('WONKSKNOW TECHNOLOGIES','2021-08-12','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('HYPERVERGE','2021-08-13','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('FRACTAL ANALYSIS','2021-08-14','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('RAZOR PAY','2021-08-15','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('VM WARE','2021-08-16','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('PWC','2021-08-17','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ZOOM RX','2021-08-18','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('CATTERPILLAR','2021-08-19','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('TCS-DIGITAL','2021-08-20','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('TCS-NINJA','2021-08-21','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ATLASSIAN','2021-08-22','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ROBERT BOSCH','2021-08-23','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('[24]7.AI','2021-08-24','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('HASHED IN','2021-08-25','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('COGNIZANT-GENC NEXT','2021-08-26','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('COGNIZANT-GENC ELEVATE ','2021-08-27','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('COGNIZANT-GENC','2021-08-28','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('PAY U','2021-08-29','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ALSTOM','2021-08-30','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('VANENBURG','2021-08-31','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('VERIZON','2021-09-01','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('THE MATH COMPANY','2021-09-02','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('LISTER TECHNOLOGIES','2021-09-03','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('MERCEDES BENZ- TRUCK','2021-09-04','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('MERECEDES BENZ-CARS','2021-09-05','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('CHARGEBEE','2021-09-06','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('OPTUM','2021-09-07','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('MICRO FOCUS','2021-09-08','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('SS&C EZE','2021-09-09','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('ZSCALER','2021-09-10','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('TIGER ANALYTICS','2021-09-11','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('DATAFOUNDRY.AI','2021-09-12','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('CAPEGEMINI','2021-09-13','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('WIPRO','2021-09-14','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('SCHNEIDER ELECTRIC','2021-09-15','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('KPMG','2021-09-16','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('TARGET ','2021-09-17','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('L&T Technology services','2021-09-18','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('Toshiba','2021-09-19','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('CERNER','2021-09-20','goxtham@gmail.com');
insert into companyData (companyName,createdAt,managerEmail) values('NPCI','2021-09-21','goxtham@gmail.com');

insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 3 , 51 , 8.0 , 'Associate SE' , '2021-05-05' , '0' , '0' , '1' , '0' , '2021-05-05'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 3 , 39 , 4.0 , 'Systems Analyst' , '2021-05-06' , '0' , '0' , '1' , '0' , '2021-05-06'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 3 , 56 , 3.6 , 'SE' , '2021-05-07' , '0' , '0' , '1' , '0' , '2021-05-07'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 5 , 56 , 3.6 , 'SE' , '2021-05-08' , '0' , '0' , '1' , '0' , '2021-05-08'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 5 , 39 , 4.0 , 'SDE' , '2021-05-09' , '0' , '0' , '1' , '0' , '2021-05-09'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 5 , 61 , 8.0 , 'SDE' , '2021-05-10' , '0' , '0' , '1' , '0' , '2021-05-10'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 7 , 32 , 3.6 , 'SE' , '2021-05-11' , '0' , '0' , '1' , '0' , '2021-05-11'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 7 , 37 , 6.75 , 'SE' , '2021-05-12' , '0' , '0' , '1' , '0' , '2021-05-12'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 8 , 31 , 7.0 , 'SE' , '2021-05-13' , '0' , '0' , '1' , '0' , '2021-05-13'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 9 , 21 , 7.25 , 'SD' , '2021-05-14' , '0' , '0' , '1' , '0' , '2021-05-14'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 12 , 18 , 16.65 , 'SDE' , '2021-05-15' , '0' , '0' , '1' , '0' , '2021-05-15'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 14 , 1 , 14.95 , 'SE' , '2021-05-16' , '0' , '0' , '1' , '0' , '2021-05-16'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 17 , 31 , 7.0 , 'SE' , '2021-05-17' , '0' , '0' , '1' , '0' , '2021-05-17'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 18 , 47 , 10.0 , 'SDE' , '2021-05-18' , '0' , '0' , '1' , '0' , '2021-05-18'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 19 , 48 , 18.0 , 'SE' , '2021-05-19' , '0' , '0' , '1' , '0' , '2021-05-19'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 19 , 19 , 7.0 , 'SE' , '2021-05-20' , '0' , '0' , '1' , '0' , '2021-05-20'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 20 , 11 , 5.0 , 'SE' , '2021-05-05' , '0' , '0' , '1' , '0' , '2021-05-05'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 20 , 47 , 10.0 , 'SDE' , '2021-05-06' , '0' , '0' , '1' , '0' , '2021-05-06'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 21 , 14 , 45.03 , 'SDE' , '2021-05-07' , '0' , '0' , '1' , '0' , '2021-05-07'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 22 , 11 , 10.5 , 'R&D' , '2021-05-08' , '0' , '0' , '1' , '0' , '2021-05-08'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 23 , 32 , 3.6 , 'SE' , '2021-05-09' , '0' , '0' , '1' , '0' , '2021-05-09'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 24 , 21 , 7.25 , 'SD' , '2021-05-10' , '0' , '0' , '1' , '0' , '2021-05-10'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 25 , 28 , 8.0 , 'Cyber Security Consultant' , '2021-05-11' , '0' , '0' , '1' , '0' , '2021-05-11');
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 26 , 30 , 10.35 , 'SE' , '2021-05-12' , '0' , '0' , '1' , '0' , '2021-05-12'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 27 , 2 , 32.9 , 'SE' , '2021-05-13' , '0' , '1' , '0' , '0' , '2021-05-13'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 28 , 51 , 8.0 , 'Associate SE' , '2021-05-14' , '0' , '0' , '1' , '0' , '2021-05-14'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 29 , 43 , 9.6 , 'SE' , '2021-05-15' , '0' , '0' , '1' , '0' , '2021-05-15'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 30 , 28 , 8.0 , 'Cyber Security Consultant' , '2021-05-16' , '0' , '0' , '1' , '0' , '2021-05-16'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 31 , 9 , 11.0 , 'Devops Engineer' , '2021-05-17' , '0' , '0' , '1' , '0' , '2021-05-17'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 34 , 28 , 8.0 , 'Cyber Security Consultant' , '2021-05-18' , '1' , '0' , '0' , '0' , '2021-05-18'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 35 , 4 , 15.0 , 'System Test Engineer' , '2021-05-19' , '0' , '0' , '1' , '0' , '2021-05-19'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 36 , 52 , 17.5 , 'Devops Engineer' , '2021-05-20' , '0' , '0' , '1' , '0' , '2021-05-20'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 36 , 11 , 10.5 , 'SE R&D' , '2021-05-21' , '0' , '0' , '1' , '0' , '2021-05-21'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 37 , 60 , 4.0 , 'SE' , '2021-05-22' , '0' , '0' , '1' , '0' , '2021-05-22'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 38 , 10 , 10.0 , 'Digital Analyst Jr.' , '2021-05-23' , '0' , '0' , '1' , '0' , '2021-05-23'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 38 , 16 , 3.6 , 'System Engineer' , '2021-05-24' , '0' , '0' , '1' , '0' , '2021-05-24'); 
insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 39 , 43 , 9.66 , 'SE' , '2021-05-25' , '0' , '0' , '1' , '0' , '2021-05-25'); 

