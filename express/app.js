const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "database.json");
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

function readDatabase() {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
}
function writeDatabase(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data));
}

app.get("/users", (req, res) => {

    const data = readDatabase();
    res.status(200).json(data.users);
    if(!data.users){
        res.status(500).json({ message: "Error reading users" });
    }
});

app.post("/users", (req, res) => {
    try {
        const data = readDatabase();

        const users = data.users;

        const newId =
            users.length > 0
                ? Math.max(...users.map(user => user.id)) + 1
                : 1;

        const newUser = {
            id: newId,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        users.push(newUser);

        writeDatabase(data);

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
});

app.get("/students", (req, res) => {
    const data = readDatabase();

    res.status(200).json(data.students);

    if(!data.students){
        res.status(500).json({ message: "Error fetching students" });
    }
});
app.post("/students", (req, res) => {
        const data = readDatabase();

        const students = data.students;

        const newId =
            students.length > 0
                ? Math.max(...students.map(student => student.id)) + 1
                : 1;

        const newStudent = {
            id: newId,
            name: req.body.name,
            rollnumber: req.body.rollnumber,
            email: req.body.email,
            branch: req.body.branch,
            cgpa: req.body.cgpa
        };

        students.push(newStudent);

        writeDatabase(data);

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent
        });
    if(!data.students){ 
        res.status(500).json({
            message: "Error adding student"
        });
    }
});
app.get("/students/:id", (req, res) => {
    try {
        const data = readDatabase();

        const id = parseInt(req.params.id);

        const student = data.students.find(
            student => student.id === id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching student"
        });
    }
});
app.put("/students/:id", (req, res) => {
    try {
        const data = readDatabase();

        const id = parseInt(req.params.id);

        const index = data.students.findIndex(
            student => student.id === id
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        data.students[index] = {
            ...data.students[index],
            name: req.body.name,
            rollnumber: req.body.rollnumber,
            email: req.body.email,
            branch: req.body.branch,
            cgpa: req.body.cgpa
        };

        writeDatabase(data);

        res.status(200).json({
            message: "Student updated successfully",
            student: data.students[index]
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating student"
        });
    }
});


app.delete("/students/:id", (req, res) => {
    try {
        const data = readDatabase();

        const id = parseInt(req.params.id);

        const index = data.students.findIndex(
            student => student.id === id
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        data.students.splice(index, 1);

        writeDatabase(data);

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student"
        });
    }
});

app.listen(3000, () => console.log("server running at port 3000"));


