const userWebController = require('../controller/userWebController');
const { db } = require('../connection');
const queries = require('../schema/queries/userWebControllerQueries');
const validator = require('validator');

jest.mock('../connection', () => ({
  db: {
    promise: jest.fn().mockReturnValue({
      getConnection: jest.fn(),
    }),
  },
}));

jest.mock('validator', () => ({
  isEmail: jest.fn().mockReturnValue(true),
}));

jest.mock('../middleware/webTokenGenerator', () => ({
  default: jest.fn().mockResolvedValue('mocked-token'),
}));

jest.mock('../schema/queries/userWebControllerQueries', () => ({
  userLogin: {
    locks: {
      lockStudentDataAndManagementData: 'LOCK TABLES ...',
    },
    queries: {
      checkStudentLoginCredentials: 'SELECT * FROM ...',
      checkManagerLoginCredentials: 'SELECT * FROM ...',
    },
  },
  unlockTables: 'UNLOCK TABLES',
}));

jest.mock('../middleware/webTokenGenerator', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue('mocked-token'),
}));

describe('userLogin', () => {
  let mockConnection;
  let mockQuery;

  beforeEach(() => {
    mockQuery = jest.fn();
    mockConnection = {
      query: mockQuery,
      release: jest.fn(),
    };
    db.promise().getConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    mockQuery
      .mockResolvedValueOnce([[mockStudentData], []]) // Student login check
      .mockResolvedValueOnce([[], []]) // Manager login check
      .mockResolvedValueOnce([]) // UNLOCK TABLES
      .mockResolvedValueOnce([]); // Final UNLOCK TABLES in finally block

    await userWebController.userLogin(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      message: "Student logged in!",
      studentEmail: 'student@example.com',
      studentName: 'John Doe',
      // ... other student data
    }));
  });

  // Add more test cases here...
});