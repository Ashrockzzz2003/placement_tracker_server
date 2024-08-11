const tableNames = require("../tableNames"); 

const unlockTables = "UNLOCK TABLES";

const toggleOfficialAccountStatus = 
{
    locks: {
        lockManagerData: `LOCK TABLES ${tableNames.managementData} WRITE`
    },
    queries: {
        checkIfUserIsAdmin: `SELECT * from ${tableNames.managementData.name} WHERE ${tableNames.managementData.managerEmail} = ? AND ${tableNames.managementData.role} = ?`,
        checkIfManagerExists: `SELECT * from ${tableNames.managementData.name} WHERE ${tableNames.managementData.id} = ?`,
        changeAccountStatus: `UPDATE ${tableNames.managementData.name} SET ${tableNames.managementData.accountStatus} = ? WHERE ${tableNames.managementData.id} = ?`
    }
}

const userLogin = 
{
    locks: {
        lockStudentDataAndManagementData: "LOCK TABLES studentData READ, managementData READ",
        lockManagementRegister: "LOCK TABLES managementRegister WRITE"
    },
    queries: {
        checkStudentLoginCredentials: "SELECT * FROM studentData WHERE studentEmail = ? AND studentPassword = ?",
        checkManagerLoginCredentials: "SELECT * FROM managementData WHERE managerEmail = ? AND managerPassword = ?",
        checkIfManagerIsRegistered: "SELECT * FROM managementRegister WHERE managerEmail = ?",
        registerManager: "INSERT INTO managementRegister (managerEmail, otp) VALUES (?, ?)",
        updateManagerOtp: "UPDATE managementRegister SET otp = ?, createdAt = ? WHERE managerEmail = ?",
    }
}

module.exports = { unlockTables, toggleOfficialAccountStatus, userLogin };