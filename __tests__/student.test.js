const request = require("supertest");
const app = require("../app");

describe("Student API endpoints", () => {
  test("POST /api/student/addStudent exists", async () => {
    const res = await request(app).post("/api/student/addStudent").send({});
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/student/getAllStudentData exists", async () => {
    const res = await request(app).post("/api/student/getAllStudentData").send({});
    expect(res.statusCode).toBe(200);
  });
});
