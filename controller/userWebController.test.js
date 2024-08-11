const userWebController = require('../controller/userWebController');
const userLogin = userWebController.userLogin;
const mysql = require('mysql2/promise');
const { db } = require('../connection')

jest.mock('mysql2/promise');

describe('userLogin', () => {
  let mockConnection;
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
    mockConnection = {
      query: mockQuery,
      release: jest.fn(),
    };
    mysql.createPool.mockReturnValue({
      promise: jest.fn().mockReturnValue({
        getConnection: jest.fn().mockResolvedValue(mockConnection),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ "message": "Missing details." });
  });

  it('should return 200 and student data for valid student login', async () => {
    const req = {
      body: {
        userEmail: 'student@example.com',
        userPassword: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const mockStudentData = [{
      studentEmail: 'student@example.com',
      studentName: 'John Doe',
      studentRollNo: '12345',
      id: 1,
      studentSection: 'A',
      studentGender: 'M',
      studentBatch: '2023',
      studentDept: 'CS',
      isHigherStudies: '0',
      isPlaced: '1',
      CGPA: '3.5',
      studentAccountStatus: '1',
    }];

    mockQuery.mockResolvedValueOnce([mockStudentData, []]);
    mockQuery.mockResolvedValueOnce([[], []]);

    await userLogin(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(3); // Including the UNLOCK TABLES query
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      message: "Student logged in!",
      studentEmail: 'student@example.com',
      studentName: 'John Doe',
      // ... other student data
    }));
  });

  it('should return 400 for invalid credentials', async () => {
    const req = {
      body: {
        userEmail: 'invalid@example.com',
        userPassword: 'wrongpassword',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockQuery.mockResolvedValueOnce([[], []]);
    mockQuery.mockResolvedValueOnce([[], []]);

    await userLogin(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(3); // Including the UNLOCK TABLES query
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ "message": "Invalid email or password!" });
  });

  // Add more test cases for different scenarios (e.g., manager login, deactivated account, etc.)
});