const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// Mocks
jest.mock("../connection", () => {
    const mockQuery = jest.fn();
    const mockRelease = jest.fn();
    const mockConnection = {
        query: mockQuery,
        release: mockRelease,
    };
    const mockGetConnection = jest.fn().mockResolvedValue(mockConnection);

    return {
        db: {
            promise: jest.fn().mockReturnValue({
                getConnection: mockGetConnection,
            }),
        },
        // Export the mocks so we can manipulate them in tests if needed, 
        // though typically we rely on the implementation details or resetting mocks.
        // For simplicity, we'll access them via the required module or setup in beforeEach appropriately.
    };
});

jest.mock("../middleware/webTokenValidator", () => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ ERROR: "No Token. Warning." });
        }
        const token = authHeader.split(" ")[1];
        if (token === "admin") {
            req.body.userRole = "1";
            req.body.userEmail = "admin@example.com";
            next();
        } else if (token === "manager") {
            req.body.userRole = "0";
            req.body.userEmail = "manager@example.com";
            next();
        } else if (token === "student") {
            req.body.userRole = "2";
            req.body.userEmail = "student@example.com";
            next();
        } else {
            return res.status(401).send({ ERROR: "Unauthorized access. Warning." });
        }
    };
});

jest.mock("../mail/mailer", () => ({
    accountDeactivated: jest.fn(),
    officialCreated: jest.fn(),
}));

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    appendFileSync: jest.fn(),
}));


const managerRoutes = require("../routes/manager");
const { db } = require("../connection");

const app = express();
app.use(bodyParser.json());
app.use("/api/manager", managerRoutes);

describe("Manager API Endpoints", () => {
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();
        // detailed setup
        mockConnection = {
            query: jest.fn(),
            release: jest.fn(),
        };

        // We need to make sure the mocked getConnection returns OUR mockConnection for this test run
        const { db } = require("../connection");
        const mockedGetConnection = db.promise().getConnection;
        mockedGetConnection.mockResolvedValue(mockConnection);
    });

    /**
     * GET /test
     */
    describe("GET /api/manager/test", () => {
        it("should return 200 OK", async () => {
            const res = await request(app).get("/api/manager/test");
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: "Ok" });
        });
    });

    /**
     * POST /toggleOfficialStatus
     */
    describe("POST /api/manager/toggleOfficialStatus", () => {
        it("should allow admin to toggle manager status (0 -> 2)", async () => {
            // Mock queries:
            // 1. LOCK TABLES
            // 2. Check admin
            // 3. Check manager
            // 4. Update status
            // 5. UNLOCK TABLES

            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1, managerEmail: "admin@example.com", managerRole: "1" }]]) // Check admin
                .mockResolvedValueOnce([[{ id: 2, accountStatus: "0", managerName: "Test Manager", managerEmail: "manager@test.com" }]]) // Check manager
                .mockResolvedValueOnce([]) // UPDATE
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .post("/api/manager/toggleOfficialStatus")
                .set("Authorization", "Bearer admin")
                .send({
                    managerId: 2,
                    accountStatus: "2"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Account status updated!");
        });

        it("should return 400 for invalid status transition (admin trying 0 -> 1)", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1, managerEmail: "admin@example.com", managerRole: "1" }]]) // Check admin
                .mockResolvedValueOnce([[{ id: 2, accountStatus: "0", managerName: "Test Manager" }]]) // Check manager (current 0)
                .mockResolvedValueOnce([]); // UNLOCK (in fail path)

            const res = await request(app)
                .post("/api/manager/toggleOfficialStatus")
                .set("Authorization", "Bearer admin")
                .send({
                    managerId: 2,
                    accountStatus: "1" // 0 -> 1 is invalid for admin
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Action not permitted");
        });

    });

    /**
     * GET /getRegisteredOfficials
     */
    describe("GET /api/manager/getRegisteredOfficials", () => {
        it("should return list of managers for admin", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1 }]]) // Query admin
                .mockResolvedValueOnce([
                    [{ id: 2, managerName: "Manager 2" }, { id: 3, managerName: "Manager 3" }]
                ]) // Query managers
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .get("/api/manager/getRegisteredOfficials")
                .set("Authorization", "Bearer admin")
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Managers fetched!");
            expect(res.body.managers).toHaveLength(2);
        });
    });

    /**
     * POST /registerOfficial
     */
    describe("POST /api/manager/registerOfficial", () => {
        it("should register a new official successfully", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1 }]]) // Check admin
                .mockResolvedValueOnce([[]]) // Check manager exist
                .mockResolvedValueOnce([[]]) // Check student exist
                .mockResolvedValueOnce([]) // INSERT
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .post("/api/manager/registerOfficial")
                .set("Authorization", "Bearer admin")
                .send({
                    managerEmail: "new@manager.com",
                    managerName: "New Manager"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Manager registered!");
        });

        it("should fail if manager already exists", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1 }]]) // Check admin
                .mockResolvedValueOnce([[{ id: 5 }]]) // Check manager exist (found)
                .mockResolvedValueOnce([[]]) // Check student exist
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .post("/api/manager/registerOfficial")
                .set("Authorization", "Bearer admin")
                .send({
                    managerEmail: "existing@manager.com",
                    managerName: "Existing Manager"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Manager already registered!");
        });
    });

    /**
     * POST /addCompany
     */
    describe("POST /api/manager/addCompany", () => {
        it("should add a company as admin", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1, accountStatus: "1" }]]) // Check manager/accountStatus
                .mockResolvedValueOnce([{ insertId: 10 }]) // INSERT
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .post("/api/manager/addCompany")
                .set("Authorization", "Bearer admin")
                .send({
                    companyName: "Google"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.companyId).toBe(10);
        });
    });

    /**
    * GET /getCompanies
    */
    describe("GET /api/manager/getCompanies", () => {
        it("should fetch companies", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1, accountStatus: "1" }]]) // Check manager
                .mockResolvedValueOnce([[{ id: 10, companyName: "Google" }]]) // SELECT companies
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .get("/api/manager/getCompanies")
                .set("Authorization", "Bearer admin");

            expect(res.statusCode).toBe(200);
            expect(res.body.companies).toHaveLength(1);
        });
    });

    /**
     * GET /getTopFivePlacements
     */
    describe("GET /api/manager/getTopFivePlacements", () => {
        it("should return top placements", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1, accountStatus: "1" }]]) // Check manager
                .mockResolvedValueOnce([]) // LOCK again (nested in code? No, sequential lock calls in code)
                .mockResolvedValueOnce([[{ studentName: "S1", ctc: 20 }]]) // SELECT
                .mockResolvedValueOnce([]); // UNLOCK

            // Note: The code calls LOCK twice? 
            // Line 476: LOCK TABLES managementData READ, studentData READ
            // Line 495: LOCK TABLES placementData READ, studentData READ, companyData READ
            // Wait, you can't accumulate locks like that in MySQL usually without UNLOCK immediately or it releases connection locks?
            // Actually, `LOCK TABLES` releases previous locks. 
            // So the test mocks should match the sequence.

            // Re-reading controller code:
            // 476: LOCK ...
            // 480: SELECT ...
            // 495: LOCK ... (This releases previous locks implicitly)
            // 499: SELECT ...
            // 503: UNLOCK ...

            const res = await request(app)
                .get("/api/manager/getTopFivePlacements")
                .set("Authorization", "Bearer admin");

            expect(res.statusCode).toBe(200);
            expect(res.body.placements).toHaveLength(1);
        });
    });

    /**
     * POST /addPlacementData
     */
    describe("POST /api/manager/addPlacementData", () => {
        it("should successfully add placement data", async () => {
            const placementData = {
                studentRollNo: "123",
                companyId: 10,
                ctc: 2000000,
                jobRole: "SDE",
                placementDate: "2023-12-01",
                isIntern: "0",
                isPPO: "0",
                isOnCampus: "1",
                isGirlsDrive: "0",
                jobLocation: "Bangalore"
            };

            mockConnection.query
                .mockResolvedValueOnce([]) // LOCK
                .mockResolvedValueOnce([[{ id: 1, accountStatus: "1" }]]) // Check manager
                .mockResolvedValueOnce([[{ id: 50, studentName: "Student" }]]) // Check student
                .mockResolvedValueOnce([]) // INSERT
                .mockResolvedValueOnce([]); // UNLOCK

            const res = await request(app)
                .post("/api/manager/addPlacementData")
                .set("Authorization", "Bearer admin")
                .send(placementData);

            expect(res.statusCode).toBe(200);
        });
    });

});
