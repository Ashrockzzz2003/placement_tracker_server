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
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accountStatus CHAR(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (id),
    CONSTRAINT CK_managerRole CHECK (managerRole='0' OR managerRole='1'),
    CONSTRAINT CK_accountStatus CHECK (accountStatus = '0' OR accountStatus = '1' OR accountStatus=2)
);
CREATE TABLE managementRegister (
    id INT NOT NULL AUTO_INCREMENT,
    managerEmail VARCHAR(255) NOT NULL UNIQUE,
    otp VARCHAR(6) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TABLE studentData (
    id INT NOT NULL AUTO_INCREMENT,
    studentRollNo CHAR(16) NOT NULL UNIQUE,
    studentEmail VARCHAR(255) NOT NULL UNIQUE,
    studentPassword VARCHAR(255) NOT NULL,
    studentName VARCHAR(255) NOT NULL,
    studentSection CHAR(1) NOT NULL,
    studentGender CHAR(1) NOT NULL DEFAULT 'O',
    studentBatch CHAR(4) NOT NULL,
    studentDept VARCHAR(10) NOT NULL,
    isHigherStudies CHAR(1) NOT NULL,
    isPlaced CHAR(1) NOT NULL DEFAULT '0',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CGPA VARCHAR(4) NULL,
    studentAccountStatus VARCHAR(1) NOT NULL DEFAULT '1',
    PRIMARY KEY (id),
    CONSTRAINT CK_isHigherStudies CHECK ( isHigherStudies='0' OR isHigherStudies='1'),
    CONSTRAINT CK_isPlaced CHECK ( isPlaced='0' OR isPlaced='1'),
    CONSTRAINT CK_studentGender CHECK (studentGender = 'M' OR studentGender = 'F' OR studentGender = 'O'),
    CONSTRAINT CK_studentAccountStatus CHECK (studentAccountStatus = '0' OR studentAccountStatus = '1' OR studentAccountStatus=2)
);
CREATE TABLE studentRegister (
    id INT NOT NULL AUTO_INCREMENT,
    studentEmail VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TABLE companyData (
    id INT NOT NULL AUTO_INCREMENT,
    companyName VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    managerId INT NULL,
    studentId INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (managerId) REFERENCES managementData(id),
    FOREIGN KEY (studentId) REFERENCES studentData(id),
    CONSTRAINT CK_NotNull CHECK (managerId IS NOT NULL OR studentId IS NOT NULL)
);
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
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    ),
    CONSTRAINT CK_Unique UNIQUE (studentId, companyId, ctc, jobRole)
);

insert into managementData (managerEmail,managerPassword,managerName,managerRole, accountStatus) values ('ashrockzzz2003@gmail.com','6f28f4faf56bb704ae154fc2d2b2ba0d72f8a9ea06c3b8a3ed0be6836da9e258','Ashwin Narayanan S', '1', '1');
insert into managementData (managerEmail,managerPassword,managerName,managerRole, accountStatus) VALUES ('hsheadone@gmail.com', 'a7ea0f1c90cdd8e3e6d0afeb8d3340f170e0ccc4042be277419217425817f20e', 'Bindu K R', '0', '0');

insert into companyData (companyName,managerId) values('ABOBE',2);
insert into companyData (companyName,managerId) values('ACCENTURE',2);
insert into companyData (companyName,managerId) values('ALSTOM',2);
insert into companyData (companyName,managerId) values('AMADEUS LABS',2);
insert into companyData (companyName,managerId) values('AMAZON',2);
insert into companyData (companyName,managerId) values('APPVIEWX',2);
insert into companyData (companyName,managerId) values('ARCADIA',2);
insert into companyData (companyName,managerId) values('ARISTA',2);
insert into companyData (companyName,managerId) values('ATLASSIAN',2);
insert into companyData (companyName,managerId) values('BNP PARIBAS',2);
insert into companyData (companyName,managerId) values('BNP PARIBAS ISPL',2);
insert into companyData (companyName,managerId) values('BNY MELLON',2);
insert into companyData (companyName,managerId) values('BOSCH',2);
insert into companyData (companyName,managerId) values('CAMS(COMPUTER AGE MANAGEMENT SEVICES)',2);
insert into companyData (companyName,managerId) values('CAPEGEMINI',2);
insert into companyData (companyName,managerId) values('CATERPILLAR',2);
insert into companyData (companyName,managerId) values('CERNER',2);
insert into companyData (companyName,managerId) values('CHARGEBEE',2);
insert into companyData (companyName,managerId) values('CISCO',2);
insert into companyData (companyName,managerId) values('COGNIZANT',2);
insert into companyData (companyName,managerId) values('COMVIVA',2);
insert into companyData (companyName,managerId) values('DATAFOUNDRY.AI',2);
insert into companyData (companyName,managerId) values('E2OPEN',2);
insert into companyData (companyName,managerId) values('EPIKINDIFI',2);
insert into companyData (companyName,managerId) values('EY',2);
insert into companyData (companyName,managerId) values('FIDILITY',2);
insert into companyData (companyName,managerId) values('FRACTAL ANALYSIS',2);
insert into companyData (companyName,managerId) values('GE',2);
insert into companyData (companyName,managerId) values('GENPACT',2);
insert into companyData (companyName,managerId) values('HASHED IN',2);
insert into companyData (companyName,managerId) values('HONEYWELL',2);
insert into companyData (companyName,managerId) values('HYPERVERGE',2);
insert into companyData (companyName,managerId) values('IBM',2);
insert into companyData (companyName,managerId) values('INCREFF',2);
insert into companyData (companyName,managerId) values('INFOSYS',2);
insert into companyData (companyName,managerId) values('INTUIT',2);
insert into companyData (companyName,managerId) values('KLA TENCOR',2);
insert into companyData (companyName,managerId) values('KPMG',2);
insert into companyData (companyName,managerId) values('L&T',2);
insert into companyData (companyName,managerId) values('LATENT VIEW ANALYTICS',2);
insert into companyData (companyName,managerId) values('LISTER TECHNOLOGIES',2);
insert into companyData (companyName,managerId) values('MCKINSEY',2);
insert into companyData (companyName,managerId) values('MERCEDES BENZ',2);
insert into companyData (companyName,managerId) values('MICRO FOCUS',2);
insert into companyData (companyName,managerId) values('MICROCHIP',2);
insert into companyData (companyName,managerId) values('MICROSOFT',2);
insert into companyData (companyName,managerId) values('NIELSENIQ',2);
insert into companyData (companyName,managerId) values('NOKIA',2);
insert into companyData (companyName,managerId) values('NPCI',2);
insert into companyData (companyName,managerId) values('OPTUM',2);
insert into companyData (companyName,managerId) values('ORACLE',2);
insert into companyData (companyName,managerId) values('PAY U',2);
insert into companyData (companyName,managerId) values('PROVIDENCE',2);
insert into companyData (companyName,managerId) values('PWC',2);
insert into companyData (companyName,managerId) values('RAZOR PAY',2);
insert into companyData (companyName,managerId) values('ROBERT BOSCH',2);
insert into companyData (companyName,managerId) values('ROOT QUOTIENT',2);
insert into companyData (companyName,managerId) values('SAHAJ',2);
insert into companyData (companyName,managerId) values('SAMSUNG ELECTRO-MECHANICS',2);
insert into companyData (companyName,managerId) values('SAP LABS',2);
insert into companyData (companyName,managerId) values('SCHLUMBERGER',2);
insert into companyData (companyName,managerId) values('SCHNEIDER ELECTRIC',2);
insert into companyData (companyName,managerId) values('SIGNIFY INNOVATION LABS',2);
insert into companyData (companyName,managerId) values('SS&C EZE',2);
insert into companyData (companyName,managerId) values('TALLY SOLUTIONS',2);
insert into companyData (companyName,managerId) values('TARGET',2);
insert into companyData (companyName,managerId) values('TATA COMMUNICATIONS',2);
insert into companyData (companyName,managerId) values('TCS',2);
insert into companyData (companyName,managerId) values('THE MATH COMPANY',2);
insert into companyData (companyName,managerId) values('TIGER ANALYTICS',2);
insert into companyData (companyName,managerId) values('TOSHIBA',2);
insert into companyData (companyName,managerId) values('TREDENCE ANALYTICS',2);
insert into companyData (companyName,managerId) values('TRIANZ',2);
insert into companyData (companyName,managerId) values('VALEO',2);
insert into companyData (companyName,managerId) values('VANENBURG',2);
insert into companyData (companyName,managerId) values('VERIZON',2);
insert into companyData (companyName,managerId) values('VERSA NETWORKS',2);
insert into companyData (companyName,managerId) values('VISTEON CORPORATION',2);
insert into companyData (companyName,managerId) values('VM WARE',2);
insert into companyData (companyName,managerId) values('VOLVO',2);
insert into companyData (companyName,managerId) values('WIPRO',2);
insert into companyData (companyName,managerId) values('WONKSKNOW TECHNOLOGIES',2);
insert into companyData (companyName,managerId) values('ZOOM RX',2);
insert into companyData (companyName,managerId) values('ZSCALER',2);
insert into companyData (companyName,managerId) values('[24]7.AI',2);

insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20108','cb.en.u4cse20108@cb.students.amrita.edu','cb.en.u4cse20108@cb.students.amrita.edu_B','N.Apoorva ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20121','cb.en.u4cse20121@cb.students.amrita.edu','cb.en.u4cse20121@cb.students.amrita.edu_B','Gadde Uday Kiran ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20153','cb.en.u4cse20153@cb.students.amrita.edu','cb.en.u4cse20153@cb.students.amrita.edu_B','G Rama Vamsidhar Reddy ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20466','cb.en.u4cse20466@cb.students.amrita.edu','cb.en.u4cse20466@cb.students.amrita.edu_E','T SUBHASH GUPTA ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20640','cb.en.u4cse20640@cb.students.amrita.edu','cb.en.u4cse20640@cb.students.amrita.edu_F','Nallabantu Sri Charan ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20068','cb.en.u4cse20068@cb.students.amrita.edu','cb.en.u4cse20068@cb.students.amrita.edu_A','THATAVARTHI HARSHITH ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20139','cb.en.u4cse20139@cb.students.amrita.edu','cb.en.u4cse20139@cb.students.amrita.edu_B','Mallavarapu Jashritha Reddy ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20008','cb.en.u4cse20008@cb.students.amrita.edu','cb.en.u4cse20008@cb.students.amrita.edu_A','APARNA A ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20337','cb.en.u4cse20337@cb.students.amrita.edu','cb.en.u4cse20337@cb.students.amrita.edu_D','MEKA VENKATA SAI TARUN ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20624','cb.en.u4cse20624@cb.students.amrita.edu','cb.en.u4cse20624@cb.students.amrita.edu_F','Kabilan ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20662','cb.en.u4cse20662@cb.students.amrita.edu','cb.en.u4cse20662@cb.students.amrita.edu_F','SRIRAM .R ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20648','cb.en.u4cse20648@cb.students.amrita.edu','cb.en.u4cse20648@cb.students.amrita.edu_F','S S PRAVIN SABARI BALA ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20025','cb.en.u4cse20025@cb.students.amrita.edu','cb.en.u4cse20025@cb.students.amrita.edu_A','V Harish Kumar ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20150','cb.en.u4cse20150@cb.students.amrita.edu','cb.en.u4cse20150@cb.students.amrita.edu_B','Pranesh R ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20611','cb.en.u4cse20611@cb.students.amrita.edu','cb.en.u4cse20611@cb.students.amrita.edu_F','Chowta Yashasvi ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20235','cb.en.u4cse20235@cb.students.amrita.edu','cb.en.u4cse20235@cb.students.amrita.edu_C','MAHASRI V ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20606','cb.en.u4cse20606@cb.students.amrita.edu','cb.en.u4cse20606@cb.students.amrita.edu_F','Ayyagari Sai Anish ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20138','cb.en.u4cse20138@cb.students.amrita.edu','cb.en.u4cse20138@cb.students.amrita.edu_B','LALITH GUPTHA. B ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20163','cb.en.u4cse20163@cb.students.amrita.edu','cb.en.u4cse20163@cb.students.amrita.edu_B','SUDIREDDY SHANMUKHI ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20346','cb.en.u4cse20346@cb.students.amrita.edu','cb.en.u4cse20346@cb.students.amrita.edu_D','Pranav Deepak ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20266','cb.en.u4cse20266@cb.students.amrita.edu','cb.en.u4cse20266@cb.students.amrita.edu_C','TEJASWINI BOYAPATI ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20311','cb.en.u4cse20311@cb.students.amrita.edu','cb.en.u4cse20311@cb.students.amrita.edu_D','CHARITHA UPPALAPATI ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20636','cb.en.u4cse20636@cb.students.amrita.edu','cb.en.u4cse20636@cb.students.amrita.edu_F','Malavika Vinodkumar ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20626','cb.en.u4cse20626@cb.students.amrita.edu','cb.en.u4cse20626@cb.students.amrita.edu_F','KARISHRAM B ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20616','cb.en.u4cse20616@cb.students.amrita.edu','cb.en.u4cse20616@cb.students.amrita.edu_F','Dineshsuriya D ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20642','cb.en.u4cse20642@cb.students.amrita.edu','cb.en.u4cse20642@cb.students.amrita.edu_F','K N NISHAANTH ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20622','cb.en.u4cse20622@cb.students.amrita.edu','cb.en.u4cse20622@cb.students.amrita.edu_F','Jai Kishoore R ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20604','cb.en.u4cse20604@cb.students.amrita.edu','cb.en.u4cse20604@cb.students.amrita.edu_F','Ardra Vinod ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20665','cb.en.u4cse20665@cb.students.amrita.edu','cb.en.u4cse20665@cb.students.amrita.edu_F','SYED ASHFAQ AHMED ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20352','cb.en.u4cse20352@cb.students.amrita.edu','cb.en.u4cse20352@cb.students.amrita.edu_D','Sai Sidharth Sriram ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20034','cb.en.u4cse20034@cb.students.amrita.edu','cb.en.u4cse20034@cb.students.amrita.edu_A','KONAKALLA BHAVA BHARATH SUHAS ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20071','cb.en.u4cse20071@cb.students.amrita.edu','cb.en.u4cse20071@cb.students.amrita.edu_A','VIGNESH KUMAR A ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20204','cb.en.u4cse20204@cb.students.amrita.edu','cb.en.u4cse20204@cb.students.amrita.edu_C','Akash P ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20218','cb.en.u4cse20218@cb.students.amrita.edu','cb.en.u4cse20218@cb.students.amrita.edu_C','DUPPALA VIJAYA RAGHAVA ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20617','cb.en.u4cse20617@cb.students.amrita.edu','cb.en.u4cse20617@cb.students.amrita.edu_F','ELAMBHARATHI P T ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20404','cb.en.u4cse20404@cb.students.amrita.edu','cb.en.u4cse20404@cb.students.amrita.edu_E','T S Aishwarya ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20602','cb.en.u4cse20602@cb.students.amrita.edu','cb.en.u4cse20602@cb.students.amrita.edu_F','Ajay Thayaananth P ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20447','cb.en.u4cse20447@cb.students.amrita.edu','cb.en.u4cse20447@cb.students.amrita.edu_E','Pradeep Karthik M ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20069','cb.en.u4cse20069@cb.students.amrita.edu','cb.en.u4cse20069@cb.students.amrita.edu_A','K VAISAKHKRISHNAN ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20258','cb.en.u4cse20258@cb.students.amrita.edu','cb.en.u4cse20258@cb.students.amrita.edu_C','Sharon Bianca R ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20422','cb.en.u4cse20422@cb.students.amrita.edu','cb.en.u4cse20422@cb.students.amrita.edu_E','Harini S ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20252','cb.en.u4cse20252@cb.students.amrita.edu','cb.en.u4cse20252@cb.students.amrita.edu_C','Sai Ramya Illuri ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20015','cb.en.u4cse20015@cb.students.amrita.edu','cb.en.u4cse20015@cb.students.amrita.edu_A','Chetanya Miglani ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20469','cb.en.u4cse20469@cb.students.amrita.edu','cb.en.u4cse20469@cb.students.amrita.edu_E','R Triambak ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20332','cb.en.u4cse20332@cb.students.amrita.edu','cb.en.u4cse20332@cb.students.amrita.edu_D','K LAKSHANA ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20053','cb.en.u4cse20053@cb.students.amrita.edu','cb.en.u4cse20053@cb.students.amrita.edu_A','RAM GOPAL ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20668','cb.en.u4cse20668@cb.students.amrita.edu','cb.en.u4cse20668@cb.students.amrita.edu_F','Vaidehi Sridhar ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20468','cb.en.u4cse20468@cb.students.amrita.edu','cb.en.u4cse20468@cb.students.amrita.edu_E','R C Tharan ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20330','cb.en.u4cse20330@cb.students.amrita.edu','cb.en.u4cse20330@cb.students.amrita.edu_D','Kota Venkata Leela Tejaswini ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20327','cb.en.u4cse20327@cb.students.amrita.edu','cb.en.u4cse20327@cb.students.amrita.edu_D','Keshav S ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20208','cb.en.u4cse20208@cb.students.amrita.edu','cb.en.u4cse20208@cb.students.amrita.edu_C','Aravind S ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20212','cb.en.u4cse20212@cb.students.amrita.edu','cb.en.u4cse20212@cb.students.amrita.edu_C','BHAVVUK D KALRA ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20354','cb.en.u4cse20354@cb.students.amrita.edu','cb.en.u4cse20354@cb.students.amrita.edu_D','Sanjay Balaji P ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20362','cb.en.u4cse20362@cb.students.amrita.edu','cb.en.u4cse20362@cb.students.amrita.edu_D','Srinithi R ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20041','cb.en.u4cse20041@cb.students.amrita.edu','cb.en.u4cse20041@cb.students.amrita.edu_A','K U Mukuntan ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20326','cb.en.u4cse20326@cb.students.amrita.edu','cb.en.u4cse20326@cb.students.amrita.edu_D','KAUSALYAA SRI ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20432','cb.en.u4cse20432@cb.students.amrita.edu','cb.en.u4cse20432@cb.students.amrita.edu_E','KOLLURI VENKATA SRAVANI ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20045','cb.en.u4cse20045@cb.students.amrita.edu','cb.en.u4cse20045@cb.students.amrita.edu_A','NISHANTH K ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20141','cb.en.u4cse20141@cb.students.amrita.edu','cb.en.u4cse20141@cb.students.amrita.edu_B','MEGHADHARSAN B ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20231','cb.en.u4cse20231@cb.students.amrita.edu','cb.en.u4cse20231@cb.students.amrita.edu_C','KISHORE A V ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20344','cb.en.u4cse20344@cb.students.amrita.edu','cb.en.u4cse20344@cb.students.amrita.edu_D','PAYILA RAMA PRAHARSH ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20418','cb.en.u4cse20418@cb.students.amrita.edu','cb.en.u4cse20418@cb.students.amrita.edu_E','DUVVURI ANANYA ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20659','cb.en.u4cse20659@cb.students.amrita.edu','cb.en.u4cse20659@cb.students.amrita.edu_F','SNEHA VARSHA M ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20131','cb.en.u4cse20131@cb.students.amrita.edu','cb.en.u4cse20131@cb.students.amrita.edu_B','KATHERAM VENKATA SAI RAM REDDY ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20631','cb.en.u4cse20631@cb.students.amrita.edu','cb.en.u4cse20631@cb.students.amrita.edu_F','KOMMULA S S S SREE RAMA SERATH CHANDRA ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20151','cb.en.u4cse20151@cb.students.amrita.edu','cb.en.u4cse20151@cb.students.amrita.edu_B','B PRIYADHARSHINI ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20159','cb.en.u4cse20159@cb.students.amrita.edu','cb.en.u4cse20159@cb.students.amrita.edu_B','SHARATH S R ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20048','cb.en.u4cse20048@cb.students.amrita.edu','cb.en.u4cse20048@cb.students.amrita.edu_A','POKURI SAISAMHITHA ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20049','cb.en.u4cse20049@cb.students.amrita.edu','cb.en.u4cse20049@cb.students.amrita.edu_A','PRADISHWARAN D ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20110','cb.en.u4cse20110@cb.students.amrita.edu','cb.en.u4cse20110@cb.students.amrita.edu_B','Aswinkumar K ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20250','cb.en.u4cse20250@cb.students.amrita.edu','cb.en.u4cse20250@cb.students.amrita.edu_C','Rishi Kunnath ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20002','cb.en.u4cse20002@cb.students.amrita.edu','cb.en.u4cse20002@cb.students.amrita.edu_A','Abinaya.s ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20415','cb.en.u4cse20415@cb.students.amrita.edu','cb.en.u4cse20415@cb.students.amrita.edu_E','DEVAGANGA V V ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20621','cb.en.u4cse20621@cb.students.amrita.edu','cb.en.u4cse20621@cb.students.amrita.edu_F','G Harshavardhan Tadikonda ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20646','cb.en.u4cse20646@cb.students.amrita.edu','cb.en.u4cse20646@cb.students.amrita.edu_F','PRADEEP PRABHAKARAN ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20650','cb.en.u4cse20650@cb.students.amrita.edu','cb.en.u4cse20650@cb.students.amrita.edu_F','RAJKUMAR ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20006','cb.en.u4cse20006@cb.students.amrita.edu','cb.en.u4cse20006@cb.students.amrita.edu_A','S AKASH ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20303','cb.en.u4cse20303@cb.students.amrita.edu','cb.en.u4cse20303@cb.students.amrita.edu_D','Adithi Balaji ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20018','cb.en.u4cse20018@cb.students.amrita.edu','cb.en.u4cse20018@cb.students.amrita.edu_A','Dharun N ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20052','cb.en.u4cse20052@cb.students.amrita.edu','cb.en.u4cse20052@cb.students.amrita.edu_A','Puvvada Sai Kiran ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20630','cb.en.u4cse20630@cb.students.amrita.edu','cb.en.u4cse20630@cb.students.amrita.edu_F','Kishore V ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20267','cb.en.u4cse20267@cb.students.amrita.edu','cb.en.u4cse20267@cb.students.amrita.edu_C','THISHI R ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20062','cb.en.u4cse20062@cb.students.amrita.edu','cb.en.u4cse20062@cb.students.amrita.edu_A','Shriinidhi Laxmanan ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20202','cb.en.u4cse20202@cb.students.amrita.edu','cb.en.u4cse20202@cb.students.amrita.edu_C','ABIRAMI S ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20239','cb.en.u4cse20239@cb.students.amrita.edu','cb.en.u4cse20239@cb.students.amrita.edu_C','P MEGHANA ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20434','cb.en.u4cse20434@cb.students.amrita.edu','cb.en.u4cse20434@cb.students.amrita.edu_E','LAKSHANA S ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20134','cb.en.u4cse20134@cb.students.amrita.edu','cb.en.u4cse20134@cb.students.amrita.edu_B','KODURU ANUSHA ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20236','cb.en.u4cse20236@cb.students.amrita.edu','cb.en.u4cse20236@cb.students.amrita.edu_C','Manaswini Kar ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20426','cb.en.u4cse20426@cb.students.amrita.edu','cb.en.u4cse20426@cb.students.amrita.edu_E','KAARTHIK R ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20427','cb.en.u4cse20427@cb.students.amrita.edu','cb.en.u4cse20427@cb.students.amrita.edu_E','KANAKAM HARIKA ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20145','cb.en.u4cse20145@cb.students.amrita.edu','cb.en.u4cse20145@cb.students.amrita.edu_B','M Nishanth ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20205','cb.en.u4cse20205@cb.students.amrita.edu','cb.en.u4cse20205@cb.students.amrita.edu_C','Akshita Prasanth Pallithodiyil ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20666','cb.en.u4cse20666@cb.students.amrita.edu','cb.en.u4cse20666@cb.students.amrita.edu_F','Tarun Ramaswamy ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20654','cb.en.u4cse20654@cb.students.amrita.edu','cb.en.u4cse20654@cb.students.amrita.edu_F','SATHI LAKSHMI PRIYATHA REDDY ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20217','cb.en.u4cse20217@cb.students.amrita.edu','cb.en.u4cse20217@cb.students.amrita.edu_C','DHEEPTHI PRIYANGHA S J ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20154','cb.en.u4cse20154@cb.students.amrita.edu','cb.en.u4cse20154@cb.students.amrita.edu_B','Rengaraj R ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20164','cb.en.u4cse20164@cb.students.amrita.edu','cb.en.u4cse20164@cb.students.amrita.edu_B','SURAJ S ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20437','cb.en.u4cse20437@cb.students.amrita.edu','cb.en.u4cse20437@cb.students.amrita.edu_E','MANISH S ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20023','cb.en.u4cse20023@cb.students.amrita.edu','cb.en.u4cse20023@cb.students.amrita.edu_A','PA.GURUDEV ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20050','cb.en.u4cse20050@cb.students.amrita.edu','cb.en.u4cse20050@cb.students.amrita.edu_A','M PRANAV ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20122','cb.en.u4cse20122@cb.students.amrita.edu','cb.en.u4cse20122@cb.students.amrita.edu_B','GIRI PRASATH R ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20213','cb.en.u4cse20213@cb.students.amrita.edu','cb.en.u4cse20213@cb.students.amrita.edu_C','Chintapalli Jithendra Durga Kumar ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20251','cb.en.u4cse20251@cb.students.amrita.edu','cb.en.u4cse20251@cb.students.amrita.edu_C','N Roshith Sai Sriram ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20264','cb.en.u4cse20264@cb.students.amrita.edu','cb.en.u4cse20264@cb.students.amrita.edu_C','SUGRIVU ROHIT ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20317','cb.en.u4cse20317@cb.students.amrita.edu','cb.en.u4cse20317@cb.students.amrita.edu_D','GALI LAHARESH ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20405','cb.en.u4cse20405@cb.students.amrita.edu','cb.en.u4cse20405@cb.students.amrita.edu_E','Akash R Prabhu ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20414','cb.en.u4cse20414@cb.students.amrita.edu','cb.en.u4cse20414@cb.students.amrita.edu_E','Dasari Harshavardhan Reddy ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20428','cb.en.u4cse20428@cb.students.amrita.edu','cb.en.u4cse20428@cb.students.amrita.edu_E','Karishma R S ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20443','cb.en.u4cse20443@cb.students.amrita.edu','cb.en.u4cse20443@cb.students.amrita.edu_E','NIRUPAMASHREE M A ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20607','cb.en.u4cse20607@cb.students.amrita.edu','cb.en.u4cse20607@cb.students.amrita.edu_F','BANDARU VENKATA SATYA SAI CHARAN KUMAR ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20635','cb.en.u4cse20635@cb.students.amrita.edu','cb.en.u4cse20635@cb.students.amrita.edu_F','Logkesh M ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20639','cb.en.u4cse20639@cb.students.amrita.edu','cb.en.u4cse20639@cb.students.amrita.edu_F','Mukkanti venkata sai karthik ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20246','cb.en.u4cse20246@cb.students.amrita.edu','cb.en.u4cse20246@cb.students.amrita.edu_C','PRANAV A S ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20227','cb.en.u4cse20227@cb.students.amrita.edu','cb.en.u4cse20227@cb.students.amrita.edu_C','Kanishk Aadhaw P ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20309','cb.en.u4cse20309@cb.students.amrita.edu','cb.en.u4cse20309@cb.students.amrita.edu_D','Avantika Balaji ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20653','cb.en.u4cse20653@cb.students.amrita.edu','cb.en.u4cse20653@cb.students.amrita.edu_F','SANGIREDDY SAINATH REDDY ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20201','cb.en.u4cse20201@cb.students.amrita.edu','cb.en.u4cse20201@cb.students.amrita.edu_C','M Abhinav ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20055','cb.en.u4cse20055@cb.students.amrita.edu','cb.en.u4cse20055@cb.students.amrita.edu_A','ROHITH P ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20222','cb.en.u4cse20222@cb.students.amrita.edu','cb.en.u4cse20222@cb.students.amrita.edu_C','S HARISH SANKARANARAYANAN ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20245','cb.en.u4cse20245@cb.students.amrita.edu','cb.en.u4cse20245@cb.students.amrita.edu_C','PARIPOORNA ','C','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20304','cb.en.u4cse20304@cb.students.amrita.edu','cb.en.u4cse20304@cb.students.amrita.edu_D','Aksita.G ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20307','cb.en.u4cse20307@cb.students.amrita.edu','cb.en.u4cse20307@cb.students.amrita.edu_D','Anne Sai Venkata Lokesh ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20343','cb.en.u4cse20343@cb.students.amrita.edu','cb.en.u4cse20343@cb.students.amrita.edu_D','Nouduri Sreenivas ','D','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20464','cb.en.u4cse20464@cb.students.amrita.edu','cb.en.u4cse20464@cb.students.amrita.edu_E','Sri Bhuvana Pathaneni ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20615','cb.en.u4cse20615@cb.students.amrita.edu','cb.en.u4cse20615@cb.students.amrita.edu_F','Dharshita R ','F','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20425','cb.en.u4cse20425@cb.students.amrita.edu','cb.en.u4cse20425@cb.students.amrita.edu_E','S Jayandar ','E','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20051','cb.en.u4cse20051@cb.students.amrita.edu','cb.en.u4cse20051@cb.students.amrita.edu_A','Preethi Prabha ','A','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20109','cb.en.u4cse20109@cb.students.amrita.edu','cb.en.u4cse20109@cb.students.amrita.edu_B','Arvapalli Alekhya ','B','2024','CSE',0,1);
insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentBatch,studentDept,isHigherStudies,isPlaced) values('CB.EN.U4CSE20348','cb.en.u4cse20348@cb.students.amrita.edu','cb.en.u4cse20348@cb.students.amrita.edu_D','PRIYANKA K ','D','2024','CSE',0,1);

insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(1,1,10.71,'Technical Consultant','2022-10-17',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(2,2,11.89,'Advanced Application Engineering Analyst','2022-11-11',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(3,2,11.89,'Advanced App Engineering Analyst','2022-11-11',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(4,2,11.89,'Accenture Advanced Engineering Hiring','2023-08-26',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(5,2,11.89,'Advanced App Engineering Analyst','2023-08-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(6,2,11.89,'Advance Application Engineer Analyst (AEH)','2023-08-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(7,3,6.8,'Graduate Engineer Trainee','2023-08-07',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(8,4,12.62,'Software Engineer (SWE)','2023-08-05',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(9,4,12.62,'SDE-1','2023-08-05',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(10,4,12.62,'Software development engineer ','2023-08-12',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(11,4,12.62,'Software Engineer - Development','2023-08-05',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(12,6,12.0,'Software Engineer ','2023-08-23',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(13,6,12.0,'Product Engineer','2023-08-23',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(14,6,12.0,'Software Developer ','2023-08-23',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(15,6,12.0,'Software Engineer ','2023-08-23',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(16,7,15.0,'SOFTWARE ENGINEER','2023-08-25',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(17,7,15.0,'Software Engineer','2023-08-25',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(18,10,6.0,'Application Developer','2023-09-13',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(19,10,6.0,'Developer ','2023-09-13',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(20,11,6.0,'Software Development Intern','2023-09-13',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(21,12,21.64,'Software Developer ','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(22,12,21.64,'Software Development Engineer','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(23,12,21.64,'Software Developer','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(24,13,7.0,'Associate Software Engineer ','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(25,13,7.0,'Mobility Software Development','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(26,13,7.0,'Mobility Software Development (Embedded)','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(27,14,6.0,'Not specified','2023-09-28',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(28,16,12.23,'Associate Engineer ','2023-07-25',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(29,16,12.23,'Associate Software Engineer','2023-07-25',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(30,16,16.0,'Associate Software Engineer','2023-07-25',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(31,19,12.23,'Business System Analyst','2023-08-18',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(32,21,6.5,'Product Development Engineer','2023-08-31',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(33,21,6.5,'Product development engineer','2023-08-31',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(34,21,6.5,'Product developer','2023-08-30',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(35,21,6.5,'Software Development Engineer','2023-08-30',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(36,23,8.0,'Associate Implementation Engineer','2023-09-25',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(37,23,8.0,'Associate Software Engineer','2023-09-25',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(38,26,12.0,'Software Engineer','2023-09-11',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(39,28,17.37,'Digital Technology Intern/Software Engineering Specialist','2023-08-07',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(40,28,15.11,'SW','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(41,28,15.11,'SW','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(42,28,4.8,'Did not Mention','2023-09-01',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(43,29,11.0,'NA','2023-10-09',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(44,29,11.0,'Analyst/Developer','2023-10-09',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(45,31,-1.0,'Data scientist ','2023-09-13',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(46,33,8.0,'Not informed','2023-10-04',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(47,33,3.6,'Software Developer Intern','2023-10-27',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(48,33,4.5,'Associate Systems Engineer ','2023-09-06',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(49,36,44.0,'Software Engineer','2023-03-09',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(50,40,8.5,'Data Analyst','2023-08-23',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(51,40,8.5,'Analyst','2023-08-23',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(52,40,8.5,'Analyst (Level 01)','2023-08-23',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(53,40,10.75,'Data Analyst','2023-08-23',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(54,40,6.5,'Data Analyst','2023-08-23',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(55,45,10.75,'Protocol System Test Engineer','2023-10-18',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(56,46,48.75,'SWE','2023-08-30',0,0,0,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(57,48,8.2,'Networking','2023-10-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(58,51,19.18,'Associate Software Engineer / Associate Application Developer ','2023-07-24',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(59,51,19.2,'Associate Software Engineer','2023-07-24',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(60,51,19.2,'Associate Software Engineer / Associate Application Developer ','2023-07-24',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(61,51,19.18,'FSGBU','2023-07-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(62,51,19.1,'Associate software engineer','2023-07-24',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(63,51,19.2,'Associate Software Engineer / Associate Application Developer','2023-07-24',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(64,51,19.18,'Associate Application Developer ','2023-07-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(65,51,19.1,'GBU','2023-07-24',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(66,53,20.0,'Software Development Engineer','2023-07-19',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(67,53,20.0,'Software Development Engineer','2023-08-26',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(68,54,8.9,'TC','2023-08-20',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(69,54,9.0,'RC','2023-08-29',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(70,54,9.0,'Salesforce','2023-09-26',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(71,54,9.0,'Risk Consultant','2023-08-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(72,54,8.99,'Technical consultant ','2023-08-22',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(73,54,8.9,'Technology consultant ','2023-08-23',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(74,54,9.0,'Risk Consultant','2023-08-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(75,54,9.0,'Risk Consultant','2023-08-24',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(76,54,9.0,'Technical consultant','2023-08-22',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(77,58,13.07,'Solutions consultant','2023-08-16',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(78,60,4.2,'UI/ UX Developer','2023-09-01',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(79,60,7.12,'Machine Learning Engineer (Image Processing)','2023-08-31',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(80,60,24.5,'Associate Software Developer','2023-10-17',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(81,60,24.0,'Software Developer','2023-08-28',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(82,61,15.0,'Test Analyst','2023-03-27',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(83,62,12.0,'Graduate Engineer Trainee,R&D ','2023-08-02',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(84,62,12.0,'R&D','2023-07-28',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(85,62,12.0,'R&D','2023-04-05',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(86,62,12.0,'R&D','2023-07-28',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(87,63,10.2,'IT TECHNICAL ROLE','2023-09-15',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(88,63,10.2,'IT Technical Engineer','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(89,63,10.2,'IT Technical Engineer','2023-09-15',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(90,63,10.2,'IT technical Engineer','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(91,63,10.2,'Not assigned','2023-09-15',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(92,61,19.73,'Fullstack Developer','2023-09-09',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(93,65,11.3,'Trainee- Software Engineer/DevOps Engineer','2023-08-10',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(94,65,11.3,'Software Engineer/ DevOps Engineer ','2023-08-10',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(95,67,7.5,'Application and software developer ','2023-10-09',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(96,71,9.0,'Software Engineer','2023-08-08',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(97,72,10.0,'Data Analyst','2023-09-28',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(98,72,10.0,'Analyst','2023-09-29',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(99,73,10.0,'NOT YET DECIDED','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(100,73,10.0,'Software Developer','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(101,73,10.0,'Software Engineer','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(102,73,10.0,'Software Engineer','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(103,73,10.0,'Software Developer','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(104,73,9.0,'Software Engineer','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(105,73,10.0,'Software engineer ','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(106,73,10.0,'Software Engineer ','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(107,73,10.0,'Software Engineer','2023-09-04',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(108,73,10.0,'SOFTWARE ENGINEER','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(109,73,10.0,'Not mentioned','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(110,73,10.0,'Software Engineer','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(111,73,10.0,'Software Developer','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(112,73,10.0,'Software Engineer','2023-09-05',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(113,73,10.0,'NA','2023-09-04',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(114,74,5.0,'Software R&D','2023-10-17',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(115,74,1.8,'Software RD Intern','2023-10-17',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(116,74,-1.0,'Software Engineer ','2023-10-17',1,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(117,75,7.0,'Associate Software Engineer','2023-09-18',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(118,76,9.74,'software engineer','2023-09-06',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(119,76,9.74,'SDE','2023-09-06',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(120,76,9.74,'Software Developer','2023-09-06',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(121,76,9.72,'SDE','2023-09-06',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(122,76,9.74,'Software Engineer','2023-09-06',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(123,76,9.74,'Software Developer ','2023-09-06',0,1,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(124,76,9.74,'NA','2023-09-06',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(125,76,9.74,'Software Engineer','2023-09-06',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(126,78,7.0,'Software Engineer','2023-08-25',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(127,80,7.5,'Associate Engineer','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(128,80,7.5,'Associate Engineer','2023-09-15',0,0,1,0);
insert into placementData (studentId,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive) values(129,80,7.5,'Associate Engineer','2023-09-25',0,0,1,0);



-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18001','cb.en.u4cse18001@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AAKASH KRISHNA R','A','M','2022','CSE','1','0','2023-09-24');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18002','cb.en.u4cse18002@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ABHI SUWETHA','A','F','2022','CSE','0','1','2023-09-25');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18003','cb.en.u4cse18003@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AKULA SUDHAMSHU','A','M','2022','CSE','0','1','2023-09-26');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18004','cb.en.u4cse18004@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ANIRUDH B','A','M','2022','CSE','1','0','2023-09-27');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18005','cb.en.u4cse18005@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ANVITHA YERNENI','A','F','2022','CSE','0','1','2023-09-28');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18006','cb.en.u4cse18006@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','SAI PRATEEK ATLURI','A','M','2022','CSE','1','0','2023-09-29');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18007','cb.en.u4cse18007@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AVULA SANDEEP REDDY','A','M','2022','CSE','0','1','2023-09-30');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18008','cb.en.u4cse18008@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','BALAJI D','A','M','2022','CSE','0','1','2023-10-01');

-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18101','cb.en.u4cse18101@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AADHITH S.','B','M','2022','CSE','0','1','2023-09-24');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18102','cb.en.u4cse18102@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ABDUL GOUSE SHAIK','B','M','2022','CSE','0','1','2023-09-25');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18104','cb.en.u4cse18104@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ACHANTA HARISH','B','M','2022','CSE','0','1','2023-09-26');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18105','cb.en.u4cse18105@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ADITHYA P VARMA','B','M','2022','CSE','0','1','2023-09-27');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18106','cb.en.u4cse18106@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','VENKATA SAI SRIRAM','B','M','2022','CSE','0','1','2023-09-28');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18107','cb.en.u4cse18107@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ANKITHA','B','F','2022','CSE','0','1','2023-09-29');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18108','cb.en.u4cse18108@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ARAVIND NP','B','M','2022','CSE','1','0','2023-09-30');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18109','cb.en.u4cse18109@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ARAVINDH S','B','M','2022','CSE','0','1','2023-10-01');

-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18201','cb.en.u4cse18201@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AADURU VENKATA HEMA','C','M','2022','CSE','0','0', '2023-09-24');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18202','cb.en.u4cse18202@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','S.AAKASH MUTHIAH','C','M','2022','CSE','0','0', '2023-09-25');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18203','cb.en.u4cse18204@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ABISHEK VASANTHAN A S','C','M','2022','CSE','0','1', '2023-09-26');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18204','cb.en.u4cse18205@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','M. S. ADARSH','C','M','2022','CSE','0','1', '2023-09-27');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18205','cb.en.u4cse18206@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ADITHI NARAYAN','C','F','2022','CSE','0','1', '2023-09-28');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18206','cb.en.u4cse18207@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AMBATI NAGA SREEHARSHA','C','M','2022','CSE','0','1', '2023-09-29');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18207','cb.en.u4cse18208@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ANAND DEVARAJAN','C','M','2022','CSE','0','0', '2023-09-30');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18208','cb.en.u4cse18209@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ARJUN DEV P.K','C','M','2022','CSE','0','1', '2023-10-01');

-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18301','cb.en.u4cse18301@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ABHILASH SASIKUMAR','D','M','2022','CSE','0','0', '2023-09-24');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18302','cb.en.u4cse18302@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ACHANTA RAMYA SRI','D','F','2022','CSE','0','1', '2023-09-25');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18303','cb.en.u4cse18303@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ADITHI GIRIDHARAN','D','F','2022','CSE','0','1', '2023-09-26');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18304','cb.en.u4cse18304@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','B AISHWARYA','D','F','2022','CSE','0','1', '2023-09-27');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18305','cb.en.u4cse18305@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ANANTHAPADMANABHA.M.','D','M','2022','CSE','0','1', '2023-09-28');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18306','cb.en.u4cse18306@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','SAI KAMAL','D','M','2022','CSE','0','1', '2023-09-29');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18307','cb.en.u4cse18307@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ASHWIN K','D','M','2022','CSE','0','1', '2023-09-30');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18308','cb.en.u4cse18308@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','VAIBHAV KRISHNA BANDLA','D','M','2022','CSE','0','1', '2023-10-01');

-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18401','cb.en.u4cse18401@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AADHITYA TEJASWIN P S','E','M','2022','CSE','1','0', '2023-09-24');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18402','cb.en.u4cse18402@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AADITYA UMASHANKAR','E','M','2022','CSE','0','1', '2023-09-25');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18403','cb.en.u4cse18403@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ABHINAAV MAANAV V','E','M','2022','CSE','0','1', '2023-09-26');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18404','cb.en.u4cse18404@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ABISHECK KATHIRVEL','E','M','2022','CSE','0','1', '2023-09-27');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18405','cb.en.u4cse18405@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','ADAPA CHIRANJEEVI','E','M','2022','CSE','0','1', '2023-09-28');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18406','cb.en.u4cse18406@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AISHWARYA S R','E','F','2022','CSE','0','1', '2023-09-29');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18407','cb.en.u4cse18407@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','TEJA VENKAT AKULA','E','M','2022','CSE','0','1', '2023-09-30');
-- insert into studentData (studentRollNo,studentEmail,studentPassword,studentName,studentSection,studentGender,studentBatch,studentDept,isHigherStudies,isPlaced,createdAt) values ('CB.EN.U4CSE18408','cb.en.u4cse18408@cb.students.amrita.edu','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','AKUTHOTA KALYAN SAI','E','M','2022','CSE','1','0', '2023-10-01');


-- insert into companyData (companyName,managerId) values('CISCO ',2);
-- insert into companyData (companyName,managerId) values('INTUIT',2);
-- insert into companyData (companyName,managerId) values('ROOT QUOTIENT',2);
-- insert into companyData (companyName,managerId) values('ARISTA',2);
-- insert into companyData (companyName,managerId) values('SAHAJ',2);
-- insert into companyData (companyName,managerId) values('EPIKINDIFI',2);
-- insert into companyData (companyName,managerId) values('PROVIDENCE GLOBAL',2);
-- insert into companyData (companyName,managerId) values('NIELSENIQ',2);
-- insert into companyData (companyName,managerId) values('INCREFF',2);
-- insert into companyData (companyName,managerId) values('MCKINSEY',2);
-- insert into companyData (companyName,managerId) values('APPVIEWX ',2);
-- insert into companyData (companyName,managerId) values('FIDILITY ',2);
-- insert into companyData (companyName,managerId) values('SAP LABS',2);
-- insert into companyData (companyName,managerId) values('MICROSOFT',2);
-- insert into companyData (companyName,managerId) values('TALLY SOLUTIONS',2);
-- insert into companyData (companyName,managerId) values('INFOSYS',2);
-- insert into companyData (companyName,managerId) values('EY INDIA',2);
-- insert into companyData (companyName,managerId) values('ORACLE',2);
-- insert into companyData (companyName,managerId) values('VERSA NETWORKS',2);
-- insert into companyData (companyName,managerId) values('AMAZON',2);
-- insert into companyData (companyName,managerId) values('IBM',2);
-- insert into companyData (companyName,managerId) values('KLA TENCOR',2);
-- insert into companyData (companyName,managerId) values('WONKSKNOW TECHNOLOGIES',2);
-- insert into companyData (companyName,managerId) values('HYPERVERGE',2);
-- insert into companyData (companyName,managerId) values('FRACTAL ANALYSIS',2);
-- insert into companyData (companyName,managerId) values('RAZOR PAY',2);
-- insert into companyData (companyName,managerId) values('VM WARE',2);
-- insert into companyData (companyName,managerId) values('PWC',2);
-- insert into companyData (companyName,managerId) values('ZOOM RX',2);
-- insert into companyData (companyName,managerId) values('CATTERPILLAR',2);
-- insert into companyData (companyName,managerId) values('TCS-DIGITAL',2);
-- insert into companyData (companyName,managerId) values('TCS-NINJA',2);
-- insert into companyData (companyName,managerId) values('ATLASSIAN',2);
-- insert into companyData (companyName,managerId) values('ROBERT BOSCH',2);
-- insert into companyData (companyName,managerId) values('[24]7.AI',2);
-- insert into companyData (companyName,managerId) values('HASHED IN',2);
-- insert into companyData (companyName,managerId) values('COGNIZANT-GENC NEXT',2);
-- insert into companyData (companyName,managerId) values('COGNIZANT-GENC ELEVATE ',2);
-- insert into companyData (companyName,managerId) values('COGNIZANT-GENC',2);
-- insert into companyData (companyName,managerId) values('PAY U',2);
-- insert into companyData (companyName,managerId) values('ALSTOM',2);
-- insert into companyData (companyName,managerId) values('VANENBURG',2);
-- insert into companyData (companyName,managerId) values('VERIZON',2);
-- insert into companyData (companyName,managerId) values('THE MATH COMPANY',2);
-- insert into companyData (companyName,managerId) values('LISTER TECHNOLOGIES',2);
-- insert into companyData (companyName,managerId) values('MERCEDES BENZ- TRUCK',2);
-- insert into companyData (companyName,managerId) values('MERECEDES BENZ-CARS',2);
-- insert into companyData (companyName,managerId) values('CHARGEBEE',2);
-- insert into companyData (companyName,managerId) values('OPTUM',2);
-- insert into companyData (companyName,managerId) values('MICRO FOCUS',2);
-- insert into companyData (companyName,managerId) values('SS&C EZE',2);
-- insert into companyData (companyName,managerId) values('ZSCALER',2);
-- insert into companyData (companyName,managerId) values('TIGER ANALYTICS',2);
-- insert into companyData (companyName,managerId) values('DATAFOUNDRY.AI',2);
-- insert into companyData (companyName,managerId) values('CAPEGEMINI',2);
-- insert into companyData (companyName,managerId) values('WIPRO',2);
-- insert into companyData (companyName,managerId) values('SCHNEIDER ELECTRIC',2);
-- insert into companyData (companyName,managerId) values('KPMG',2);
-- insert into companyData (companyName,managerId) values('TARGET ',2);
-- insert into companyData (companyName,managerId) values('L&T Technology services',2);
-- insert into companyData (companyName,managerId) values('Toshiba',2);
-- insert into companyData (companyName,managerId) values('CERNER',2);
-- insert into companyData (companyName,managerId) values('NPCI',2);

-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 3 , 51 , 8.0 , 'Associate SE' , '2021-05-05' , '0' , '0' , '1' , '0' , '2021-05-05'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 3 , 39 , 4.0 , 'Systems Analyst' , '2021-05-06' , '0' , '0' , '1' , '0' , '2021-05-06'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 3 , 56 , 3.6 , 'SE' , '2021-05-07' , '0' , '0' , '1' , '0' , '2021-05-07'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 5 , 56 , 3.6 , 'SE' , '2021-05-08' , '0' , '0' , '1' , '0' , '2021-05-08'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 5 , 39 , 4.0 , 'SDE' , '2021-05-09' , '0' , '0' , '1' , '0' , '2021-05-09'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 5 , 61 , 8.0 , 'SDE' , '2021-05-10' , '0' , '0' , '1' , '0' , '2021-05-10'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 7 , 32 , 3.6 , 'SE' , '2021-05-11' , '0' , '0' , '1' , '0' , '2021-05-11'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 7 , 37 , 6.75 , 'SE' , '2021-05-12' , '0' , '0' , '1' , '0' , '2021-05-12'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 8 , 31 , 7.0 , 'SE' , '2021-05-13' , '0' , '0' , '1' , '0' , '2021-05-13'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 9 , 21 , 7.25 , 'SD' , '2021-05-14' , '0' , '0' , '1' , '0' , '2021-05-14'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 12 , 18 , 16.65 , 'SDE' , '2021-05-15' , '0' , '0' , '1' , '0' , '2021-05-15'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 14 , 1 , 14.95 , 'SE' , '2021-05-16' , '0' , '0' , '1' , '0' , '2021-05-16'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 17 , 31 , 7.0 , 'SE' , '2021-05-17' , '0' , '0' , '1' , '0' , '2021-05-17'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 18 , 47 , 10.0 , 'SDE' , '2021-05-18' , '0' , '0' , '1' , '0' , '2021-05-18'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 19 , 48 , 18.0 , 'SE' , '2021-05-19' , '0' , '0' , '1' , '0' , '2021-05-19'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 19 , 19 , 7.0 , 'SE' , '2021-05-20' , '0' , '0' , '1' , '0' , '2021-05-20'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 20 , 11 , 5.0 , 'SE' , '2021-05-05' , '0' , '0' , '1' , '0' , '2021-05-05'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 20 , 47 , 10.0 , 'SDE' , '2021-05-06' , '0' , '0' , '1' , '0' , '2021-05-06'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 21 , 14 , 45.03 , 'SDE' , '2021-05-07' , '0' , '0' , '1' , '0' , '2021-05-07'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 22 , 11 , 10.5 , 'R&D' , '2021-05-08' , '0' , '0' , '1' , '0' , '2021-05-08'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 23 , 32 , 3.6 , 'SE' , '2021-05-09' , '0' , '0' , '1' , '0' , '2021-05-09'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 24 , 21 , 7.25 , 'SD' , '2021-05-10' , '0' , '0' , '1' , '0' , '2021-05-10'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 25 , 28 , 8.0 , 'Cyber Security Consultant' , '2021-05-11' , '0' , '0' , '1' , '0' , '2021-05-11');
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 26 , 30 , 10.35 , 'SE' , '2021-05-12' , '0' , '0' , '1' , '0' , '2021-05-12'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 27 , 2 , 32.9 , 'SE' , '2021-05-13' , '0' , '1' , '0' , '0' , '2021-05-13'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 28 , 51 , 8.0 , 'Associate SE' , '2021-05-14' , '0' , '0' , '1' , '0' , '2021-05-14'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 29 , 43 , 9.6 , 'SE' , '2021-05-15' , '0' , '0' , '1' , '0' , '2021-05-15'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 30 , 28 , 8.0 , 'Cyber Security Consultant' , '2021-05-16' , '0' , '0' , '1' , '0' , '2021-05-16'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 31 , 9 , 11.0 , 'Devops Engineer' , '2021-05-17' , '0' , '0' , '1' , '0' , '2021-05-17'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 34 , 28 , 8.0 , 'Cyber Security Consultant' , '2021-05-18' , '1' , '0' , '0' , '0' , '2021-05-18'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 35 , 4 , 15.0 , 'System Test Engineer' , '2021-05-19' , '0' , '0' , '1' , '0' , '2021-05-19'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 36 , 52 , 17.5 , 'Devops Engineer' , '2021-05-20' , '0' , '0' , '1' , '0' , '2021-05-20'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 36 , 11 , 10.5 , 'SE R&D' , '2021-05-21' , '0' , '0' , '1' , '0' , '2021-05-21'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 37 , 60 , 4.0 , 'SE' , '2021-05-22' , '0' , '0' , '1' , '0' , '2021-05-22'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 38 , 10 , 10.0 , 'Digital Analyst Jr.' , '2021-05-23' , '0' , '0' , '1' , '0' , '2021-05-23'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 38 , 16 , 3.6 , 'System Engineer' , '2021-05-24' , '0' , '0' , '1' , '0' , '2021-05-24'); 
-- insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( 39 , 43 , 9.66 , 'SE' , '2021-05-25' , '0' , '0' , '1' , '0' , '2021-05-25'); 

