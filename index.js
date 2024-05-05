const http = require("http");
const fs = require("fs");
http.createServer((req, res) => {
  const { url, method } = req;
  res.setHeader("Content-Type", "application/json");
  let departments = JSON.parse(fs.readFileSync("files/departmentFile.json"));
  let courses = JSON.parse(fs.readFileSync("files/coursesFile.json"));
  let students = JSON.parse(fs.readFileSync("files/studentFile.json"));

  let latsDepartment = (departments.length>0)?departments[departments.length - 1].id:0;
  let latscourses =
    courses.length > 0 ? courses[courses.length - 1].courseId : 0;
  let latStudents =
    students.length > 0 ? students[students.length - 1].studentId : 0;
  function endAndStatesCode(code, message) {
    res.statusCode = code;
    res.end(JSON.stringify(message));
  }
    //departmentfile
    //get all departments
  if (url == "/departments" && method == "GET") {
    endAndStatesCode(200, departments);
  }
  //add department
  else if (url == "/addDepartments" && method == "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = JSON.parse(chunk);
      console.log(data);
    });
    req.on("end", () => {
      const x = { id: latsDepartment + 1, name: data.name };
      departments.push(x);
      fs.writeFileSync(
        "files/departmentFile.json",
        JSON.stringify(departments)
      );
      endAndStatesCode(201, { message: "added department" });
    });
  }
  //get specific department by id
  else if (url.startsWith("/departments/") && method == "GET") {
    const id = Number(url.split("/")[2]);
    const idxId = departments.findIndex((ele) => ele.id == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found department" });
    }
    endAndStatesCode(200, departments[idxId]);
  }
  //update department
  else if (url.startsWith("/departments/") && method == "PUT") {
    const id = Number(url.split("/")[2]);
    const idxId = departments.findIndex((ele) => ele.id == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found department" });
    }
    let data;
    req.on("data", (chunk) => {
      data = JSON.parse(chunk);
    });
    req.on("end", () => {
      departments[idxId].name = data.name;
      fs.writeFileSync(
        "./files/departmentFile.json",
        JSON.stringify(departments)
      );
      endAndStatesCode(200, { message: "updated succeeded" });
    });
  }
  //Delete department
  else if (url.startsWith("/departments/") && method == "DELETE") {
    const id = Number(url.split("/")[2]);
    const idxId = departments.findIndex((ele) => ele.id == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found department" });
    }
    departments.splice(idxId, 1);
    fs.writeFileSync(
      "./files/departmentFile.json",
      JSON.stringify(departments)
    );
    courses = courses.filter((c) => c.departmentId != id);
    fs.writeFileSync(
      "./files/coursesFile.json",
      JSON.stringify(courses)
    );
    students = students.filter((c) => c.departmentId != id);
    fs.writeFileSync("./files/studentFile.json", JSON.stringify(students));

    endAndStatesCode(201, { message: "deleted succeeded" });
  }
  //get all courses
  else if (url == "/courses" && method == "GET") {
    endAndStatesCode(200, courses);
  }
  //add courses
  else if (url == "/addCourse" && method == "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = JSON.parse(chunk);
      console.log(data);
    });
    req.on("end", () => {
      const x = {
        courseId: latscourses + 1,
        name: data.name,
        content: data.content,
        departmentId: data.departmentId,
      };
      courses.push(x);
      fs.writeFileSync("files/coursesFile.json", JSON.stringify(courses));
      endAndStatesCode(201, { message: "added course" });
    });
  }
  //get specific course by id
  else if (url.startsWith("/course/") && method == "GET") {
    const id = Number(url.split("/")[2]);
    const idxId = courses.findIndex((ele) => ele.courseId == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found course" });
    }
    endAndStatesCode(200, courses[idxId]);
  }
  //update course
  else if (url.startsWith("/course/") && method == "PUT") {
    const id = Number(url.split("/")[2]);
    const idxId = courses.findIndex((ele) => ele.courseId == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found course" });
    }
    let data;
    req.on("data", (chunk) => {
      data = JSON.parse(chunk);
    });
    req.on("end", () => {
      courses[idxId].name = data.name;
      courses[idxId].content = data.content;
      courses[idxId].departmentId = data.departmentId;
      fs.writeFileSync("./files/coursesFile.json", JSON.stringify(courses));
      endAndStatesCode(200, { message: "updated succeeded" });
    });
  }
  //Delete course
  else if (url.startsWith("/course/") && method == "DELETE") {
    const id = Number(url.split("/")[2]);
    const idxId = courses.findIndex((ele) => ele.courseId == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found course" });
    }
    courses.splice(idxId, 1);
    fs.writeFileSync("./files/coursesFile.json", JSON.stringify(courses));
    endAndStatesCode(201, { message: "deleted succeeded" });
  }
  //get all students
  else if (url == "/students" && method == "GET") {
    endAndStatesCode(200, students);
  }
  //add student
  else if (url == "/addStudent" && method == "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = JSON.parse(chunk);
      console.log(data);
    });
    req.on("end", () => {
      const x = {
        studentId: latStudents + 1,
        name: data.name,
        email: data.email,
        password: data.password,
        departmentId: data.departmentId,
      };
      students.push(x);
      fs.writeFileSync("files/studentFile.json", JSON.stringify(students));
      endAndStatesCode(201, { message: "added student" });
    });
  }
  //get specific student by id
  else if (url.startsWith("/student/") && method == "GET") {
    const id = Number(url.split("/")[2]);
    const idxId = students.findIndex((ele) => ele.studentId == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found student" });
    }
    endAndStatesCode(200, students[idxId]);
  }
  //update student
  else if (url.startsWith("/student/") && method == "PUT") {
    const id = Number(url.split("/")[2]);
    const idxId = students.findIndex((ele) => ele.studentId == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found student" });
    }
    let data;
    req.on("data", (chunk) => {
      data = JSON.parse(chunk);
    });
    req.on("end", () => {
      students[idxId].name = data.name;
      students[idxId].email = data.email;
      students[idxId].password = data.password;
      students[idxId].departmentId = data.departmentId;
      fs.writeFileSync("./files/studentFile.json", JSON.stringify(students));
      endAndStatesCode(200, { message: "updated succeeded" });
    });
  }
  //Delete student
  else if (url.startsWith("/student/") && method == "DELETE") {
    const id = Number(url.split("/")[2]);
    const idxId = students.findIndex((ele) => ele.studentId == id);
    if (idxId == -1) {
      return endAndStatesCode(404, { message: "not found student" });
    }
    students.splice(idxId, 1);
    fs.writeFileSync("./files/studentFile.json", JSON.stringify(students));
    endAndStatesCode(201, { message: "deleted succeeded" });
  }
  //get all students with their department and courses realated
  else if (url == "/allStudentsWithDepartment&Courses" && method == "GET") {
    let arr = students.map((student) => {
      let obj = student
      const departmentId=student.departmentId
      delete obj.departmentId
      let filterDepartment = departments.filter((ele) => ele.id == departmentId)
      obj.department = filterDepartment[0]
      let filterCourses = courses
        .filter((ele) => ele.departmentId == departmentId)
        .map((ele) => ({ courseId: ele.courseId, name: ele.name }));
      obj.courses = filterCourses
      return obj
    })
    endAndStatesCode(200,arr)
   }
  else {
    endAndStatesCode(404, { message: "not found" });
  }
}).listen(3000, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log("server is running...");
})