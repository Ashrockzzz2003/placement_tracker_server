const request = require("supertest");
const app = require("../app");

describe("Student API endpoints", () => {

  test("POST /api/student/addStudent should exist", async () => {
    const res = await request(app)
      .post("/api/student/addStudent")
      .send({}); // empty body on purpose

    expect(res.statusCode).not.toBe(404);
    expect(res.statusCode).not.toBe(500);
  });

  test("POST /api/student/getAllStudentData should exist", async () => {
    const res = await request(app)
      .post("/api/student/getAllStudentData")
      .send({});

    expect(res.statusCode).not.toBe(404);
    expect(res.statusCode).not.toBe(500);
  });

  test("POST /api/student/getAllPlacedStudentData should exist", async () => {
    const res = await request(app)
      .post("/api/student/getAllPlacedStudentData")
      .send({});

    expect(res.statusCode).not.toBe(404);
    expect(res.statusCode).not.toBe(500);
  });

});
