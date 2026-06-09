

function register(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;
    const uname=/[a-zA-Z0-9]{6}/
    if(!uname.test(username))
    {
        alert("invalid usernmae, it should have only alphabets and numbers with min 6 characters");
        return;
    }


    let emailreg=/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
     if(!emailreg.test(email))
    {
        alert("invalid email the email pattern is /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/");
        return;
    }

    let passreg=/^[a-zA-Z0-9@]{6,}$/
    if(!passreg.test(password))
    {
        alert("invlid password, the password should be min 6 character it can have alphabets ,numbers,@ symbol ");
        return;
    }

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
     const uname=/[a-zA-Z0-9]{6}/
    if(!uname.test(username))
    {
        alert("invalid usernmae, it should have only alphabets and numbers with min 6 characters");
        return;
    }
    let passreg=/^[a-zA-Z0-9@]{6,}$/
    if(!passreg.test(password))
    {
        alert("invlid password, the password should be min 6 character it can have alphabets ,numbers,@ symbol ");
        return;
    }
    if (userdetails && userdetails.name === username && userdetails.password === password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "dashboard.html";
    } else {
        window.alert("invalid credentials");

    }
    
}


function getUserStudentsKey() {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return null;
    }
    return currentUser + "_studentsList";
}



function addstudent(event) {
    event.preventDefault();
    
    const storageKey = getUserStudentsKey();
    if (!storageKey) return;

    const name = document.getElementById("name").value;
    const rollnumber = document.getElementById("rollnumber").value;
    const email = document.getElementById("email").value;
    const branch = document.getElementById("branch").value;
    const cgpa = document.getElementById("cgpa").value;

    const student = {
        name: name,
        rollnumber: rollnumber,
        email: email,
        branch: branch,
        cgpa: cgpa
    };

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


function handleLogout() {
    localStorage.removeItem("loggedInUser");

    localStorage.removeItem("currentEditRoll");
    

}
