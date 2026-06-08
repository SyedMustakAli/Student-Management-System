// ==========================================
// 1. AUTHENTICATION (LOGIN & REGISTRATION)
// ==========================================

function register(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;

    if (confirmPassword !== password) {
        alert("confirm password incorrect");
        return;
    }

    const user = {
        name: username,
        email: email,
        password: password
    };

    localStorage.setItem(username, JSON.stringify(user));
    window.location.href = "login.html";
}

function login(event) {
    event.preventDefault(); 
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const userdetails = JSON.parse(localStorage.getItem(username));

    if (userdetails && userdetails.name === username && userdetails.password === password) {
        // SAVES THE SESSION TRACKER: Remembers who is currently logged in
        localStorage.setItem("loggedInUser", username);
        window.location.href = "dashboard.html";
    } else {
        window.alert("invalid credentials");
    }
}

// Helper function to dynamically find the current user's unique storage key
function getUserStudentsKey() {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return null;
    }
    // Generates a unique isolated key like "alex_studentsList"
    return currentUser + "_studentsList";
}


// ==========================================
// 2. STUDENT MANAGEMENT (ADD, VIEW, DELETE)
// ==========================================

function addstudent(event) {
    event.preventDefault();
    
    const storageKey = getUserStudentsKey();
    if (!storageKey) return;

    // FIXED: Form input elements now capture the clean dataset without ID
    const name = document.getElementById("name").value;
    const rollnumber = document.getElementById("rollnumber").value;
    const email = document.getElementById("email").value;
    const branch = document.getElementById("branch").value;
    const cgpa = document.getElementById("cgpa").value;

    // FIXED: ID has been completely purged from the core object model map
    const student = {
        name: name,
        rollnumber: rollnumber,
        email: email,
        branch: branch,
        cgpa: cgpa
    };

    // Fetches ONLY the array belonging to this logged-in account
    let studentsList = JSON.parse(localStorage.getItem(storageKey)) || [];

    const isDuplicate = studentsList.some(s => s.rollnumber === rollnumber);
    if (isDuplicate) {
        alert("A student with this Roll Number already exists in your records!");
        return;
    }

    studentsList.push(student);
    localStorage.setItem(storageKey, JSON.stringify(studentsList));

    window.location.href = "viewStudent.html";
}

// DISPLAY VIEW STUDENTS LOOP
const tbody = document.getElementById("viewstudents");

if (tbody) {
    const storageKey = getUserStudentsKey();
    
    if (storageKey) {
        const studentsList = JSON.parse(localStorage.getItem(storageKey)) || [];
        tbody.innerHTML = ""; 

        if (studentsList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No students found in your account.</td></tr>`;
        } else {
            studentsList.forEach(student => {
                const row = document.createElement("tr");
                // FIXED: Removed the ID column field element cell entirely
                row.innerHTML = `
                    <td>${student.rollnumber}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.branch}</td>
                    <td>${student.cgpa}</td>
                    <td>
                        <a href="#" onclick="routeToEdit('${student.rollnumber}')" style="color: blue; margin-right: 10px;">Edit</a>
                        <a href="#" onclick="deletestudent('${student.rollnumber}')" style="color: red;">Delete</a>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}

function deletestudent(rollnumber) {
    const storageKey = getUserStudentsKey();
    if (!storageKey) return;

    if (confirm("Are you sure you want to delete this student?")) {
        let studentsList = JSON.parse(localStorage.getItem(storageKey)) || [];
        studentsList = studentsList.filter(student => student.rollnumber !== rollnumber);
        
        localStorage.setItem(storageKey, JSON.stringify(studentsList));
        window.location.reload(); 
    }
}


// ==========================================
// 3. CLEAN EDIT & UPDATE ACTIONS
// ==========================================

function routeToEdit(rollnumber) {
    localStorage.setItem("currentEditRoll", rollnumber);
    window.location.href = "editStudent.html";
}

const editForm = document.querySelector("form[onsubmit='updateStudent(event)']");

if (editForm) {
    const targetRoll = localStorage.getItem("currentEditRoll");
    const storageKey = getUserStudentsKey();

    if (targetRoll && storageKey) {
        const studentsList = JSON.parse(localStorage.getItem(storageKey)) || [];
        const student = studentsList.find(s => s.rollnumber === targetRoll);

        if (student) {
            document.getElementById("name").value = student.name;
            document.getElementById("rollnumber").value = student.rollnumber;
            document.getElementById("email").value = student.email || ""; 
            document.getElementById("branch").value = student.branch;
            document.getElementById("cgpa").value = student.cgpa;
        } else {
            alert("Student data file mismatch.");
            window.location.href = "viewStudent.html";
        }
    } else if (!targetRoll) {
        window.location.href = "viewStudent.html";
    }
}

function updateStudent(event) {
    event.preventDefault();

    const storageKey = getUserStudentsKey();
    if (!storageKey) return;

    const targetRoll = document.getElementById("rollnumber").value;
    let studentsList = JSON.parse(localStorage.getItem(storageKey)) || [];
    const studentIndex = studentsList.findIndex(s => s.rollnumber === targetRoll);

    if (studentIndex !== -1) {
        // FIXED: The record modification map contains zero references to an ID property
        studentsList[studentIndex] = {
            name: document.getElementById("name").value,
            rollnumber: targetRoll,
            email: document.getElementById("email").value,
            branch: document.getElementById("branch").value,
            cgpa: document.getElementById("cgpa").value
        };

        localStorage.setItem(storageKey, JSON.stringify(studentsList));
        localStorage.removeItem("currentEditRoll");
        
        alert("Student data updated successfully!");
        window.location.href = "viewStudent.html";
    } else {
        alert("Operational error: Record missing from dataset.");
    }
}


// ==========================================
// 4. LOGOUT HANDLING LOGIC
// ==========================================
function handleLogout() {
    // 1. Remove the active user tracking token
    localStorage.removeItem("loggedInUser");

    // 2. Optional: Remove any leftover edit pointers to keep storage clean
    localStorage.removeItem("currentEditRoll");
    
    // The user's specific student data (e.g. "username_studentsList") 
    // remains completely safe and untouched in localStorage.
}
