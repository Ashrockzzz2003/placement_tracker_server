const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// --- MOCKS ---

// Mock Database
jest.mock("../connection", () => {
    const mockQuery = jest.fn();
    const mockRelease = jest.fn();
    const mockConnection = {
        query: mockQuery,
        release: mockRelease,
        escape: (val) => `'${val}'` // Simple escape mock
    };
    const mockGetConnection = jest.fn().mockResolvedValue(mockConnection);

    return {
        db: {
            promise: jest.fn().mockReturnValue({
                getConnection: mockGetConnection,
            }),
        },
    };
});

// Mock Token Generators
jest.mock("../middleware/webTokenGenerator", () => jest.fn().mockResolvedValue("mock_web_token"));
jest.mock("../middleware/otpTokenGenerator", () => jest.fn().mockResolvedValue("mock_otp_token"));
jest.mock("../middleware/otpGenerator", () => jest.fn().mockReturnValue("123456"));

// Mock Middleware Validators
jest.mock("../middleware/webTokenValidator", () => (req, res, next) => {
    // Simulate valid token for tests that need it
    req.authorization_tier = "2"; // Default to student for testing
    // If request has specific token headers, adjust mock behavior if needed
    next();
});

jest.mock("../middleware/otpTokenValidator", () => {
    const middleware = (req, res, next) => {
        req.authorization_tier = "2";
        // Extract email if needed from body for context, but mainly just pass through
        // The controller often expects req.managerEmail or req.studentEmail populate by this middleware
        if (req.body.userEmail) req.managerEmail = req.body.userEmail;
        next();
    };
    // The module exports [otpTokenValidator, resetPasswordValidator]
    return {
        __esModule: true, // If it was es module, but it's cjs. 
        // The require in controller uses destructuring: const [otp, reset] = require...
        // So we should export an array or object depending on how it's required.
        // File: controller/auth.js: line 6: const [ otpTokenValidator, resetPasswordValidator, ] = require("../middleware/otpTokenValidator");
        // So we must export an array.
        default: [middleware, middleware]
    };
});

// Fix for CommonJS require of array destructuring
// The mock above might fail if jest doesn't handle the array return well for commonjs requires in the controller
// Let's refine the mock for otpTokenValidator based on how it's used.
// The controller does: const [v1, v2] = require(...)
jest.mock("../middleware/otpTokenValidator", () => {
    const mw = (req, res, next) => {
        // Mock setting some values that the validator typically sets
        req.authorization_tier = "2";
        if (req.body.userEmail) req.managerEmail = req.body.userEmail;
        next();
    };
    return [mw, mw];
});

// Mock Mailer
jest.mock("../mail/mailer", () => ({
    loginOTP: jest.fn(),
    reset_PW_OTP: jest.fn(),
}));

// Mock FS to prevent log writing
jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    appendFileSync: jest.fn(),
}));

// Mock Config if needed
jest.mock("../config", () => ["cb.students.amrita.edu", "amrita.edu"]); // validDomains

const authRoutes = require("../routes/auth");
const { db } = require("../connection");

const app = express();
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

describe("Auth API Endpoints", () => {
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup fresh mock connection for each test
        mockConnection = {
            query: jest.fn(),
            release: jest.fn(),
        };
        const { db } = require("../connection");
        db.promise().getConnection.mockResolvedValue(mockConnection);
    });

    describe("POST /api/auth/login", () => {
        it("should return 200 for valid student login", async () => {
            // Mock DB:
            // 1. Lock
            // 2. Check student (found)
            // 3. Unlock

            mockConnection.query
                .mockResolvedValueOnce([]) // Lock
                .mockResolvedValueOnce([[{
                    studentAccountStatus: "1",
                    studentEmail: "test@cb.students.amrita.edu",
                    studentName: "Test Student",
                    id: 1,
                    // other fields
                }]]) // Check student
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    userEmail: "test@cb.students.amrita.edu",
                    userPassword: "password123"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Student logged in!");
            expect(res.body.SECRET_TOKEN).toBe("mock_web_token");
        });

        it("should return 401 if student account deactivated", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // Lock
                .mockResolvedValueOnce([[{ studentAccountStatus: "2" }]]) // Check student
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    userEmail: "test@cb.students.amrita.edu",
                    userPassword: "password123"
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toContain("deactivated");
        });

        it("should return 200 for valid manager login", async () => {
            // Mock DB:
            // 1. Lock
            // 2. Check student (not found)
            // 3. Check manager (found)
            // 4. Unlock

            mockConnection.query
                .mockResolvedValueOnce([]) // Lock
                .mockResolvedValueOnce([[]]) // Check student
                .mockResolvedValueOnce([[{
                    accountStatus: "1",
                    managerEmail: "manager@amrita.edu",
                    managerName: "Test Manager",
                    managerRole: "1",
                    id: 10
                }]]) // Check manager
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    userEmail: "manager@amrita.edu",
                    userPassword: "password123"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Manager logged in!");
        });

        it("should return 400 for invalid credentials (user not found)", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // Lock
                .mockResolvedValueOnce([[]]) // Check student
                .mockResolvedValueOnce([[]]) // Check manager
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    userEmail: "unknown@amrita.edu",
                    userPassword: "password123"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Invalid email or password!");
        });
    });

    describe("POST /api/auth/studentRegister", () => {
        it("should register valid student", async () => {
            // Mock DB:
            // 1. Lock
            // 2. Check exist (none)
            // 3. Lock register
            // 4. Check register (none)
            // 5. Insert register
            // 6. Unlock

            mockConnection.query
                .mockResolvedValueOnce([]) // Lock data
                .mockResolvedValueOnce([[]]) // Check student data
                .mockResolvedValueOnce([[]]) // Check manager data
                .mockResolvedValueOnce([]) // Lock register
                .mockResolvedValueOnce([[]]) // Check register
                .mockResolvedValueOnce([]) // Insert register
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/studentRegister")
                .send({
                    studentEmail: "new@cb.students.amrita.edu",
                    studentPassword: "pass",
                    studentRollNo: "CB.EN.U4CSE20001",
                    studentName: "New Student",
                    studentSection: "A",
                    studentGender: "M",
                    studentBatch: "2024",
                    studentDept: "CSE",
                    isHigherStudies: "0",
                    isPlaced: "0",
                    CGPA: "9.0"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("OTP sent to email.");
        });

        it("should return 400 for invalid domain", async () => {
            const res = await request(app)
                .post("/api/auth/studentRegister")
                .send({
                    studentEmail: "invalid@gmail.com", // Bad domain
                    studentPassword: "pass",
                    studentRollNo: "CB.EN.U4CSE20001",
                    studentName: "New Student",
                    studentSection: "A",
                    studentGender: "M",
                    studentBatch: "2024",
                    studentDept: "CSE",
                    isHigherStudies: "0",
                    isPlaced: "0",
                    CGPA: "9.0"
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Missing details.");
        });
    });

    describe("POST /api/auth/forgotPassword", () => {
        it("should send OTP for existing student", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // Lock
                .mockResolvedValueOnce([[{ studentName: "S1", studentAccountStatus: "1" }]]) // Check student
                .mockResolvedValueOnce([[]]) // Check manager
                .mockResolvedValueOnce([]) // Unlock (line 334)
                .mockResolvedValueOnce([]) // Lock register
                .mockResolvedValueOnce([[]]) // Check register
                .mockResolvedValueOnce([]) // Insert register
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/forgotPassword")
                .send({ userEmail: "s1@cb.students.amrita.edu" });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("OTP sent to email.");
        });

        it("should return 401 if user doesn't exist", async () => {
            mockConnection.query
                .mockResolvedValueOnce([]) // Lock
                .mockResolvedValueOnce([[]]) // Check student
                .mockResolvedValueOnce([[]]) // Check manager
                .mockResolvedValueOnce([]); // Unlock

            const res = await request(app)
                .post("/api/auth/forgotPassword")
                .send({ userEmail: "unknown@amrita.edu" });

            expect(res.statusCode).toBe(401);
        });
    });
});
