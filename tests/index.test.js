const { app } = require("../src/index");
const request = require("supertest");

describe("Testing /api/user CRUD with no session or JWT", () => {
  test("should respond with status 401 when tryin to get all users", async () => {
    const res = await request(app).get("/api/user").send();
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when tryin to get user by id", async () => {
    const res = await request(app)
      .get("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a7")
      .send();
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to create a new user", async () => {
    const res = await request(app)
      .post("/api/user")
      .send({ email: "example@example.com", password: "1234" });
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to update a user", async () => {
    const res = await request(app)
      .put("/api/user")
      .send({ email: "user1Updated@example.com", password: "asdf" });
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to delete a user", async () => {
    const res = await request(app)
      .delete("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a7")
      .send();
    expect(res.status).toBe(401);
  });
});

describe("Testing /api/teacher CRUD with no session or JWT", () => {
  test("should respond with status 401 when tryin to get all teachers", async () => {
    const res = await request(app).get("/api/teacher").send();
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when tryin to get teacher by id", async () => {
    const res = await request(app)
      .get("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b0")
      .send();
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to create a new teacher", async () => {
    const res = await request(app).post("/api/teacher").send({
      id: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      dni: "11111111A",
      name: "Teacher",
      last_name: "One",
      date_of_birth: "1996-05-25",
      UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
    });
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to update a teacher", async () => {
    const res = await request(app).put("/api/teacher").send({
      id: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      dni: "11111111A",
      name: "Teacher",
      last_name: "OneUpdated",
      date_of_birth: "1996-05-25",
      UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
    });
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to delete a teacher", async () => {
    const res = await request(app)
      .delete("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b0")
      .send();
    expect(res.status).toBe(401);
  });
});

describe("Testing /api/student CRUD with no session or JWT", () => {
  test("should respond with status 401 when tryin to get all students", async () => {
    const res = await request(app).get("/api/student").send();
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when tryin to get student by id", async () => {
    const res = await request(app)
      .get("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d232")
      .send();
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to create a new student", async () => {
    const res = await request(app).post("/api/student").send({
      id: "9be30696-84bf-4faa-a6b8-6dafc6a7d232",
      dni: "00000001A",
      name: "Student",
      last_name: "One",
      date_of_birth: "1996-05-25",
      TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
    });
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to update a student", async () => {
    const res = await request(app).put("/api/student").send({
      id: "9be30696-84bf-4faa-a6b8-6dafc6a7d232",
      dni: "00000001A",
      name: "Student",
      last_name: "One",
      date_of_birth: "1996-05-25",
      TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
    });
    expect(res.status).toBe(401);
  });

  test("should respond with status 401 when trying to delete a student", async () => {
    const res = await request(app)
      .delete("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d232")
      .send();
    expect(res.status).toBe(401);
  });
});

describe("Testing /api/user CRUD whit session authorization", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    token = res.headers.authorization;
  });

  test("GET /api/user should respond with an array of users", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("All users found");
    expect(res.body.allUsers).toBeInstanceOf(Array);
    expect(res.body.allUsers.length).toBeGreaterThan(0);
  });

  test("GET /api/user/:id should respond with an object containing the user data", async () => {
    const res = await request(app)
      .get("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a7")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User found");
    expect(res.body.userById).toHaveProperty(
      "id",
      "22fdbaac-5e36-40e1-87d0-ffb45146d7a7"
    );
  });

  test("POST /api/user should create a new user and return the new user object", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", token)
      .send({ email: "example101@example.com", password: "1234" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User created succesfully");
    expect(res.body.newUser).toHaveProperty("email", "example101@example.com");
  });

  test("PUT /api/user/:id should update the user with the provided id", async () => {
    const res = await request(app)
      .put("/api/user/75112abd-e7aa-4bbd-af4a-3747e6f533c1")
      .set("Authorization", token)
      .send({ email: "user2Updated@example.com", password: "1234" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully");
    expect(res.body.updatedUser).toHaveProperty(
      "email",
      "user2Updated@example.com"
    );
  });

  test("DELETE /api/user/:id should delete the user with the provided id", async () => {
    const res = await request(app)
      .delete("/api/user/3c90241d-e28c-45a7-9d0b-a2456d1d2638")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("User deleted successfully");
  });

  test("GET /api/user/:id/active should return  the user status", async () => {
    const res = await request(app)
      .get("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a7/active")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.userStatus).toEqual({ active: true });
  });

  test("GET /api/user/:id/active should throw if user does not exists", async () => {
    const res = await request(app)
      .get("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a6/active")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found provided id");
  });

  test("POST /api/user/:id/active should return the user status if user already active", async () => {
    const res = await request(app)
      .post("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a7/active")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("User already active");
  });

  test("POST /api/user/:id/active should throw if user does not exists", async () => {
    const res = await request(app)
      .post("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a6/active")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found provided id");
  });

  test("POST /api/user/:id/active should change active to true if user is not active", async () => {
    const res = await request(app)
      .post("/api/user/5b256b11-1b2c-4de7-9ccc-86cc553dd4a3/active")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("User status updated");
    expect(res.body.activeUser.active).toBe(true);
  });
});

describe("Testing /api/teacher CRUD whit session authorization", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    token = res.headers.authorization;
  });

  test("GET /api/teacher should respond with an array of teachers", async () => {
    const res = await request(app)
      .get("/api/teacher")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("All teachers found");
    expect(res.body.allTeachers).toBeInstanceOf(Array);
    expect(res.body.allTeachers.length).toBeGreaterThan(0);
  });

  test("GET /api/teacher/:id should respond with an object containing the teacher data", async () => {
    const res = await request(app)
      .get("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b0")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Teacher by id found");
    expect(res.body.teacherById).toHaveProperty(
      "id",
      "5e052f07-d7da-452e-b0a2-9ee607cb93b0"
    );
  });

  test("POST /api/teacher should create a new teacher and return the new teacher object", async () => {
    const res = await request(app)
      .post("/api/teacher")
      .set("Authorization", token)
      .send({
        dni: "12121212W",
        name: "Testing",
        last_name: "Teacher",
        date_of_birth: "2000-10-01",
        UserId: "651bf859-ef3d-4824-bdca-50dc937060a3",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("New teacher created");
    expect(res.body.newTeacher).toHaveProperty("name", "Testing");
  });

  test("PUT /api/teacher/:id should update the teacher with the provided id", async () => {
    const res = await request(app)
      .put("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b0")
      .set("Authorization", token)
      .send({
        dni: "11111111A",
        name: "TeacherUpdated",
        last_name: "One",
        date_of_birth: "1996-05-25",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Teacher updated succesfully");
    expect(res.body.updatedTeacher).toHaveProperty("name", "TeacherUpdated");
  });

  test("DELETE /api/teacher/:id should delete the teacher with the provided id", async () => {
    const res = await request(app)
      .delete("/api/teacher/d864009c-d072-4a0d-b13c-e34b48f8ed01")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Teacher deleted successfully");
  });

  test("GET /api/teacher/:teacher_id/students should return students associated", async () => {
    const res = await request(app)
      .get("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b0/students")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.associatedStudents).toBeInstanceOf(Array);
    expect(res.body.associatedStudents[0]).toBeInstanceOf(Object);
  });

  test("GET /api/teacher/:teacher_id/students should return error if teacher id does not exists", async () => {
    const res = await request(app)
      .get("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b1/students")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Teacher not found with provided id");
  });
});

describe("Testing /api/student CRUD whit session authorization", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    token = res.headers.authorization;
  });

  test("GET /api/student should respond with an array of students", async () => {
    const res = await request(app)
      .get("/api/student")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("All students found");
    expect(res.body.allStudents).toBeInstanceOf(Array);
    expect(res.body.allStudents.length).toBeGreaterThan(0);
  });

  test("GET /api/student/:id should respond with an object containing the student data", async () => {
    const res = await request(app)
      .get("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d232")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Student by id found");
    expect(res.body.studentById).toHaveProperty(
      "id",
      "9be30696-84bf-4faa-a6b8-6dafc6a7d232"
    );
  });

  test("POST /api/student should create a new student and return the new student object", async () => {
    const res = await request(app)
      .post("/api/student")
      .set("Authorization", token)
      .send({
        dni: "21212121M",
        name: "Testing",
        last_name: "Student",
        date_of_birth: "2000-10-01",
        TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("New student created");
    expect(res.body.newStudent).toHaveProperty("name", "Testing");
  });

  test("PUT /api/student/:id should update the student with the provided id", async () => {
    const res = await request(app)
      .put("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d232")
      .set("Authorization", token)
      .send({
        dni: "00000001A",
        name: "StudentUpdated",
        last_name: "One",
        date_of_birth: "1996-05-25",
        TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Student updated succesfully");
    expect(res.body.updatedStudent).toHaveProperty("name", "StudentUpdated");
  });

  test("DELETE /api/student/:id should delete the student with the provided id", async () => {
    const res = await request(app)
      .delete("/api/student/d03dd89d-ddba-44e4-83a0-1edf417a3eb3")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Student deleted successfully");
  });
});

describe("Testing /api/user CRUD with wrong or missing parameters", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    token = res.headers.authorization;
  });

  test("GET /api/user:id should throw an error when user id does not exists", async () => {
    const res = await request(app)
      .get("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a6")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found for provided user id");
  });

  test("POST /api/user should throw an error when email is already in use", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", token)
      .send({ email: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(
      "User already registered with provided email"
    );
  });

  test("POST /api/user should throw an error if email has invalid format or password is missing", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", token)
      .send({ email: "user1", password: "" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        value: "user1",
        msg: "Invalid value",
        param: "email",
        location: "body",
      },
      {
        value: "",
        msg: "Invalid value",
        param: "password",
        location: "body",
      },
    ]);
  });

  test("PUT /api/user/:id should throw an error if the user does not exist", async () => {
    const res = await request(app)
      .put("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a6")
      .set("Authorization", token)
      .send({
        email: "user@example.com",
        password: "1234",
        active: "true",
        type: "no-admin",
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found provided id");
  });
  test("PUT /api/user/:id should throw an error if params are missing", async () => {
    const res = await request(app)
      .put("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a7")
      .set("Authorization", token)
      .send({ email: "", password: "", active: "", type: "" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      {
        value: "",
        msg: "Invalid value",
        param: "email",
        location: "body",
      },
      {
        value: "",
        msg: "Invalid value",
        param: "password",
        location: "body",
      },
    ]);
  });

  test("DELETE /api/user/:id should throw an error if the user does not exist", async () => {
    const res = await request(app)
      .delete("/api/user/22fdbaac-5e36-40e1-87d0-ffb45146d7a6")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found for provided user id");
  });
});

describe("Testing /api/teacher CRUD with wrong or missing parameters", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    token = res.headers.authorization;
  });

  test("GET /api/teacher:id should throw an error when teacher id does not exists", async () => {
    const res = await request(app)
      .get("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b1")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Teacher not found for provided id");
  });

  test("POST /api/teacher should throw an error when dni is already in use", async () => {
    const res = await request(app)
      .post("/api/teacher")
      .set("Authorization", token)
      .send({
        dni: "11111111A",
        name: "Teacher",
        last_name: "One",
        date_of_birth: "1996-05-25",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(
      "Teacher already registered with provided dni"
    );
  });

  test("POST /api/teacher should throw an error if has missing parameters", async () => {
    const res = await request(app)
      .post("/api/teacher")
      .set("Authorization", token)
      .send({
        dni: "",
        name: "",
        last_name: "",
        date_of_birth: "",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      { value: "", msg: "Invalid value", param: "dni", location: "body" },
      { value: "", msg: "Invalid value", param: "name", location: "body" },
      {
        value: "",
        msg: "Invalid value",
        param: "last_name",
        location: "body",
      },
      {
        value: "",
        msg: "Invalid value",
        param: "date_of_birth",
        location: "body",
      },
      {
        value: "",
        msg: "Invalid value",
        param: "date_of_birth",
        location: "body",
      },
    ]);
  });

  test("POST /api/teacher should throw an error when user id does not exists", async () => {
    const res = await request(app)
      .post("/api/teacher")
      .set("Authorization", token)
      .send({
        dni: "11111111B",
        name: "Teacher",
        last_name: "Test",
        date_of_birth: "1996-05-25",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a6",
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found for provided user id");
  });

  test("POST /api/teacher should throw an error when user already has teacher", async () => {
    const res = await request(app)
      .post("/api/teacher")
      .set("Authorization", token)
      .send({
        dni: "11111111B",
        name: "Teacher",
        last_name: "Test",
        date_of_birth: "1996-05-25",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(
      "There is already a teacher associated with provided UserId"
    );
  });

  test("PUT /api/teacher/:id should throw an error if the teacher id does not exist", async () => {
    const res = await request(app)
      .put("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b1")
      .set("Authorization", token)
      .send({
        dni: "11111111B",
        name: "Teacher",
        last_name: "Test",
        date_of_birth: "1996-05-25",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Teacher not found with provided id");
  });

  test("PUT /api/teacher/:id should throw an error if params are missing", async () => {
    const res = await request(app)
      .put("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b0")
      .set("Authorization", token)
      .send({
        dni: "",
        name: "",
        last_name: "",
        date_of_birth: "",
        UserId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      { location: "body", msg: "Invalid value", param: "dni", value: "" },
      { location: "body", msg: "Invalid value", param: "name", value: "" },
      { location: "body", msg: "Invalid value", param: "last_name", value: "" },
      {
        location: "body",
        msg: "Invalid value",
        param: "date_of_birth",
        value: "",
      },
      {
        location: "body",
        msg: "Invalid value",
        param: "date_of_birth",
        value: "",
      },
    ]);
  });

  test("DELETE /api/teacher/:id should throw an error if the teacher does not exist", async () => {
    const res = await request(app)
      .delete("/api/teacher/5e052f07-d7da-452e-b0a2-9ee607cb93b1")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Teacher not found with provided id");
  });
});

describe("Testing /api/students CRUD with wrong or missing parameters", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    token = res.headers.authorization;
  });

  test("GET /api/student:id should throw an error when student id does not exists", async () => {
    const res = await request(app)
      .get("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d231")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Student not found for provided id");
  });

  test("POST /api/student should throw an error when dni is already in use", async () => {
    const res = await request(app)
      .post("/api/student")
      .set("Authorization", token)
      .send({
        dni: "00000001A",
        name: "Student",
        last_name: "One",
        date_of_birth: "1996-05-25",
        TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(
      "Student already registered with provided dni"
    );
  });

  test("POST /api/student should throw an error if  has missing parameters", async () => {
    const res = await request(app)
      .post("/api/student")
      .set("Authorization", token)
      .send({
        dni: "",
        name: "",
        last_name: "",
        date_of_birth: "",
        TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      { location: "body", msg: "Invalid value", param: "dni", value: "" },
      { location: "body", msg: "Invalid value", param: "name", value: "" },
      { location: "body", msg: "Invalid value", param: "last_name", value: "" },
      {
        location: "body",
        msg: "Invalid value",
        param: "date_of_birth",
        value: "",
      },
      {
        location: "body",
        msg: "Invalid value",
        param: "date_of_birth",
        value: "",
      },
    ]);
  });

  test("POST /api/student should throw an error when teaccher id does not exists", async () => {
    const res = await request(app)
      .post("/api/student")
      .set("Authorization", token)
      .send({
        dni: "00000001B",
        name: "Student",
        last_name: "OneTest",
        date_of_birth: "1996-05-25",
        TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b1",
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(
      "Teacher not found with provided teacher id"
    );
  });

  test("PUT /api/student/:id should throw an error if the teacher id does not exist", async () => {
    const res = await request(app)
      .put("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d231")
      .set("Authorization", token)
      .send({
        dni: "00000001A",
        name: "Student",
        last_name: "OneUpddated",
        date_of_birth: "1996-05-25",
        TeacherId: "5e052f07-d7da-452e-b0a2-9ee607cb93b0",
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Student not found with provided id");
  });

  test("PUT /api/student/:id should throw an error if params are missing", async () => {
    const res = await request(app)
      .put("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d232")
      .set("Authorization", token)
      .send({
        dni: "",
        name: "",
        last_name: "",
        date_of_birth: "",
        TeacherId: "22fdbaac-5e36-40e1-87d0-ffb45146d7a7",
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      { location: "body", msg: "Invalid value", param: "dni", value: "" },
      { location: "body", msg: "Invalid value", param: "name", value: "" },
      { location: "body", msg: "Invalid value", param: "last_name", value: "" },
      {
        location: "body",
        msg: "Invalid value",
        param: "date_of_birth",
        value: "",
      },
      {
        location: "body",
        msg: "Invalid value",
        param: "date_of_birth",
        value: "",
      },
    ]);
  });

  test("DELETE /api/student/:id should throw an error if the teacher does not exist", async () => {
    const res = await request(app)
      .delete("/api/student/9be30696-84bf-4faa-a6b8-6dafc6a7d231")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Student not found with provided id");
  });
});

describe("Testing login", () => {
  beforeAll(async () => {
    await request(app).post("/logout").send();
  });
  test("POST /login Should throw an error if the user does not exist", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "nouser1@example.com", password: "asdf" });

    expect(res.status).toBe(404);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain(
      " <p>Error - Must log in to access this resource</p>"
    );
  });

  test("POST /login Should throw an error if the password is incorrect", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdfgh" });
    expect(res.status).toBe(403);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain(
      " <p>Error - Must log in to access this resource</p>"
    );
  });
});

describe("Testing middlewares", () => {
  test("GET /users should throw an error if the user is not admin", async () => {
    let token;
    const response = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(response.status).toBe(302);
    token = response.headers.authorization;
    const res = await request(app)
      .get("/users")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(401);
    expect(res.body.error).toEqual(
      "Unauthorized, only admins can access this page"
    );
  });

  test("GET /users should render users.html if user is admin", async () => {
    let token;
    const response = await request(app)
      .post("/login")
      .send({ username: "user3@example.com", password: "as12" });
    expect(response.status).toBe(302);
    token = response.headers.authorization;

    const res = await request(app)
      .get("/users")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("<title>Users</title>");
  });

  test("GET /users should throw if token is not valid", async () => {
    let token = "Bearer invalid-token";
    const res = await request(app)
      .get("/users")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual("Invalid Token");
  });

  test("GET /home should return an error if token is not valid", async () => {
    let token = "Bearer invalid-token";
    const res = await request(app)
      .get("/home")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual("Invalid Token");
  });

  test("GET /home should redirect to /login if user is not loged in", async () => {
    const res = await request(app).get("/home").send();
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

  test("GET /home should redirect to /users if user is admin", async () => {
    let token;
    const response = await request(app)
      .post("/login")
      .send({ username: "user3@example.com", password: "as12" });
    expect(response.status).toBe(302);
    token = response.headers.authorization;

    const res = await request(app)
      .get("/home")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/users");
  });

  test("GET /home should render associated teacher and student info if user is  not admin", async () => {
    let token;
    const response = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(response.status).toBe(302);
    token = response.headers.authorization;

    const res = await request(app)
      .get("/home")
      .set("Authorization", token)
      .send();
    expect(res.status).toBe(200);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("<p>Teacher Info</p>");
  });
});

describe("Testing login controllers", () => {
  test("GET /login", async () => {
    const res = await request(app).get("/login").send();
    expect(res.status).toBe(200);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("<h1>Login</h1>");
  });

  test("POST /token should throw if user does not exists", async () => {
    const res = await request(app)
      .post("/token")
      .send({ username: "fakeuser@example.com", password: "asdf" });
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found provided email");
  });

  test("POST /token should return a json with the token if user exists", async () => {
    const res = await request(app)
      .post("/token")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body).toMatchObject({ token: expect.any(String) });
  });

  test("POST /signup should return a json with the new user data", async () => {
    const res = await request(app).post("/signup").send({
      email: "userFake@example.com",
      password: "asdf",
      dni: "43434343D",
      name: "fake",
      last_name: "user",
      date_of_birth: "2020-01-01",
    });
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body).toMatchObject({
      statuscode: 200,
      user: {
        id: expect.any(String),
        email: expect.any(String),
        active: true,
        type: "teacher",
      },
    });
  });

  test("POST /signup should return an error if user already exists", async () => {
    const res = await request(app).post("/signup").send({
      email: "user1@example.com",
      password: "asdf",
      dni: "43434343D",
      name: "fake",
      last_name: "user",
      date_of_birth: "2020-01-01",
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toEqual(
      "User already registered with provided email"
    );
  });

  test("POST /signup should return an error if teacher dni already in use", async () => {
    const res = await request(app).post("/signup").send({
      email: "fakeuser1@example.com",
      password: "asdf",
      dni: "44444444D",
      name: "fake",
      last_name: "user",
      date_of_birth: "2020-01-01",
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toEqual(
      "Teacher already registered with provided dni, user deleted"
    );
  });

  test("POST /logout should redirect to /login ", async () => {
    const res = await request(app).post("/logout").send();
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

  test("POST /login should redirect to /home ", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "asdf" });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/home");
  });

  test("POST /login should throw if user name is not registered ", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "fakeuser10@example.com", password: "asdf" });
    expect(res.status).toBe(404);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("<title>Login-error</title>");
  });

  test("POST /logout should throw if password is wrong ", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user1@example.com", password: "1234" });
    expect(res.status).toBe(403);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("<title>Login-error</title>");
  });
});

describe("Password ecryption", () => {
  const {
    hashPassword,
    validatePassword,
  } = require("../src/authentication/pswEncryption");

  test("Should return hashed password", async () => {
    const password = "1234";
    const hashedPassword = await hashPassword(password);
    const isValidPassword = await validatePassword(password, hashedPassword);

    expect(hashedPassword).toBeTruthy();
    expect(isValidPassword).toBe(true);
  });

  test("Should return false", async () => {
    const password = "1234";
    const wrongPassword = "4321";
    const hashedPassword = await hashPassword(password);
    const isValidPassword = await validatePassword(
      wrongPassword,
      hashedPassword
    );

    expect(hashedPassword).toBeTruthy();
    expect(isValidPassword).toBe(false);
  });
});
