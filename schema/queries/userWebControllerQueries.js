const tableNames = require("../tableNames"); 

const unlockTables = "UNLOCK TABLES";

const toggleOfficialAccountStatus = 
{
    locks: {
        lockManagerData: `LOCK TABLES ${tableNames.managementData.table_name} WRITE`
    },
    queries: {
        checkIfUserIsAdmin: `SELECT * from ${tableNames.managementData.table_name} WHERE ${tableNames.managementData.managerEmail} = ? AND ${tableNames.managementData.managerRole} = ?`,
        checkIfManagerExists: `SELECT * from ${tableNames.managementData.table_name} WHERE ${tableNames.managementData.id} = ?`,
        changeAccountStatus: `UPDATE ${tableNames.managementData.table_name} SET ${tableNames.managementData.accountStatus} = ? WHERE ${tableNames.managementData.id} = ?`
    }
}

const userLogin = 
{
    locks: {
        lockStudentDataAndManagementData: `LOCK TABLES ${tableNames.studentData.table_name} READ, ${tableNames.managementData.table_name} READ`,
        lockManagementRegister: `LOCK TABLES ${tableNames.managementRegister.table_name} WRITE`
    },
    queries: {
        checkStudentLoginCredentials: `SELECT * FROM ${tableNames.studentData.table_name} WHERE ${tableNames.studentData.studentEmail} = ? AND ${tableNames.studentData.studentPassword} = ?`,
        checkManagerLoginCredentials: `SELECT * FROM ${tableNames.managementData.table_name} WHERE ${tableNames.managementData.managerEmail} = ? AND ${tableNames.managementData.managerPassword} = ?`,
        checkIfManagerIsRegistered: `SELECT * FROM ${tableNames.managementRegister.table_name} WHERE ${tableNames.managementRegister.managerEmail} = ?`,
        registerManager: `INSERT INTO ${tableNames.managementRegister.table_name} (${tableNames.managementRegister.managerEmail}, ${tableNames.managementRegister.otp}) VALUES (?, ?)`,
        updateManagerOtp: `UPDATE ${tableNames.managementRegister.table_name} SET ${tableNames.managementRegister.otp} = ?, ${tableNames.managementRegister.createdAt} = ? WHERE ${tableNames.managementRegister.managerEmail} = ?`,
    }
}

module.exports = { unlockTables, toggleOfficialAccountStatus, userLogin };