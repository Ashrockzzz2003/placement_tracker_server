const unlockTables = "UNLOCK TABLES";

const toggleOfficialAccountStatus = 
{
    locks: {
        lockManagerData: "LOCK TABLES managementData WRITE"
    },
    queries: {
        checkIfUserIsAdmin: "SELECT * from managementData WHERE managerEmail = ? AND managerRole = ?",
        checkIfManagerExists: "SELECT * from managementData WHERE id = ?",
        changeAccountStatus: "UPDATE managementData SET accountStatus = ? WHERE id = ?"
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