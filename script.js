/* ---------------- ROLE SELECTION ---------------- */

function goLogin(role) {
    localStorage.setItem("role", role);
    window.location = "login.html";
}

/* ---------------- LOGOUT ---------------- */

function logout() {
    localStorage.removeItem("loggedRole");
    localStorage.removeItem("loggedUser");
    window.location = "index.html";
}

/* ---------------- BACK BUTTON ---------------- */

function goBack() {
    window.location = "index.html";
}
/* ---------------- CURRENT PAGE ---------------- */

let currentPage = window.location.pathname;

/* ---------------- LOGIN PAGE TITLE + REGISTER VISIBILITY ---------------- */

let role = localStorage.getItem("role");

if (document.getElementById("roleTitle")) {
    document.getElementById("roleTitle").innerText =
        (role ? role.toUpperCase() : "USER") + " LOGIN";

    // Show register option only for patient
    let regBtn = document.querySelector(".register-btn");
    if (regBtn) {
        if (role === "patient") {
            regBtn.style.display = "inline-block";
        } else {
            regBtn.style.display = "none";
        }
    }
}

/* ---------------- SHOW / HIDE REGISTER FORM ---------------- */

function showRegister() {
    let reg = document.getElementById("registerSection");
    if (!reg) return;

    if (reg.style.display === "none" || reg.style.display === "") {
        reg.style.display = "block";
    } else {
        reg.style.display = "none";
    }
}

/* ---------------- PAGE ACCESS CONTROL ---------------- */

if (currentPage.includes("patient") &&
    localStorage.getItem("loggedRole") !== "patient") {
    window.location = "index.html";
}

if (currentPage.includes("receptionist") &&
    localStorage.getItem("loggedRole") !== "receptionist") {
    window.location = "index.html";
}

/* ---------------- PATIENT REGISTER ---------------- */

function registerPatient() {

    let username = document.getElementById("regUser").value;
    let password = document.getElementById("regPass").value;

    let patients =
        JSON.parse(localStorage.getItem("patients")) || {};

    if (!username || !password) {
        showMessage("Please enter username and password");
        return;
    }

    if (patients[username]) {
        document.getElementById("error").innerText =
            "User already exists!";
        return;
    }

    patients[username] = password;

    localStorage.setItem("patients",
        JSON.stringify(patients));

    document.getElementById("error").style.color = "green";
    document.getElementById("error").innerText =
        "Registered Successfully!";
}

/* ---------------- LOGIN ---------------- */

function login() {

    let username =
        document.getElementById("loginUser").value;

    let password =
        document.getElementById("loginPass").value;

    /* PATIENT LOGIN */

    if (role === "patient") {

        let patients =
            JSON.parse(localStorage.getItem("patients")) || {};

        if (!patients[username] ||
            patients[username] !== password) {

            document.getElementById("error").innerText =
                "Invalid Credentials";
            return;
        }

        localStorage.setItem("loggedRole", "patient");
        localStorage.setItem("loggedUser", username);

        window.location = "patient.html";
    }

    /* RECEPTIONIST LOGIN */

    if (role === "receptionist") {

        if (username === "reception" &&
            password === "1234") {

            localStorage.setItem("loggedRole", "receptionist");
            window.location = "receptionist.html";
        } else {
            document.getElementById("error").innerText =
                "Invalid Credentials";
        }
    }
}

/* ---------------- ADD APPOINTMENT ---------------- */

function addAppointment() {

    let name =
        document.getElementById("pname").value;

    let date =
        document.getElementById("date").value;

    let time =
        document.getElementById("time").value;

    let user =
        localStorage.getItem("loggedUser");

    if (!name || !date || !time) {
        alert("Please fill all fields");
        return;
    }

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        patient: user,
        name: name,
        date: date,
        time: time,
        status: "Pending",
        note: "",
        statusUpdatedAt: null
    });

    localStorage.setItem("appointments",
        JSON.stringify(appointments));

    showMessage("Appointment Submitted!");
    loadPatientAppointments();
}

/* ---------------- LOAD PATIENT APPOINTMENTS ---------------- */

function loadPatientAppointments() {

    if (!document.getElementById("list")) return;

    let user =
        localStorage.getItem("loggedUser");

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    let list =
        document.getElementById("list");

    list.innerHTML = "";

    appointments.forEach(function(a) {

        if (a.patient === user) {

            let text =
                (a.name || "No Name") + " | " +
                a.date + " | " +
                a.time + " | " +
                a.status;

            if (a.status === "Rejected") {
                text += " | Reason: " + (a.note || "No reason");
            }

            if (a.status === "Expired") {
                text += " | Appointment Expired";
            }

            list.innerHTML += "<p>" + text + "</p>";
        }
    });
}

if (currentPage.includes("patient")) {
    loadPatientAppointments();
}

/* ---------------- CLEAR MY APPOINTMENTS ---------------- */

function clearMyAppointments() {

    if (!confirm("Are you sure you want to clear all your appointments?")) {
        return;
    }

    let user = localStorage.getItem("loggedUser");

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    appointments = appointments.filter(function(a) {
        return a.patient !== user;
    });

    localStorage.setItem("appointments",
        JSON.stringify(appointments));

    loadPatientAppointments();

    showMessage("All Your Appointments Cleared Successfully!");
}
/* ---------------- RECEPTIONIST PANEL ---------------- */

function loadReceptionAppointments() {

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

let pending = document.getElementById("pendingAppointments");
let approved = document.getElementById("approvedAppointments");
let rejected = document.getElementById("rejectedAppointments");

if(!pending || !approved || !rejected){
    return;
}

/* Clear old data */

pending.innerHTML = "";
approved.innerHTML = "";
rejected.innerHTML = "";


/* Loop appointments */

appointments.forEach(function(app,index){

/* ---------------- PENDING ---------------- */

if(app.status === "Pending"){

pending.innerHTML += `
<div class="appointment-item">
<p>
<b>${app.name}</b> | ${app.date} | ${app.time}
</p>

<button onclick="approveAppointment(${index})">
Approve
</button>

<button onclick="rejectAppointment(${index})">
Reject
</button>

</div>
`;

}


/* ---------------- APPROVED ---------------- */

if(app.status === "Approved"){

approved.innerHTML += `
<div class="appointment-item">
<p>
<b>${app.name}</b> | ${app.date} | ${app.time}
</p>
</div>
`;

}


/* ---------------- REJECTED ---------------- */

if(app.status === "Rejected"){

rejected.innerHTML += `
<div class="appointment-item">
<p>
<b>${app.name}</b> | ${app.date} | ${app.time}
</p>
<p><b>Reason:</b> ${app.note || "No reason provided"}</p>
</div>
`;

}

});

}


/* ---------------- APPROVE APPOINTMENT ---------------- */

function approveAppointment(index) {

let appointments =
JSON.parse(localStorage.getItem("appointments")) || [];

appointments[index].status = "Approved";
appointments[index].statusUpdatedAt = new Date().toISOString();

localStorage.setItem(
"appointments",
JSON.stringify(appointments)
);

showMessage("Appointment Approved!");

loadReceptionAppointments();

}


/* ---------------- REJECT APPOINTMENT ---------------- */

function rejectAppointment(index) {

let reason = prompt("Enter rejection reason:");

if(!reason) return;

let appointments =
JSON.parse(localStorage.getItem("appointments")) || [];

appointments[index].status = "Rejected";
appointments[index].note = reason;
appointments[index].statusUpdatedAt = new Date().toISOString();

localStorage.setItem(
"appointments",
JSON.stringify(appointments)
);

showMessage("Appointment Rejected!");

loadReceptionAppointments();

}


/* ---------------- PAGE LOAD ---------------- */

if (currentPage.includes("receptionist")) {
window.onload = loadReceptionAppointments;
}
/* ---------------- SMART AUTO CHECK (EXPIRE + AUTO DELETE) ---------------- */

function startSmartAutoCheck() {

    setInterval(function () {

        let appointments =
            JSON.parse(localStorage.getItem("appointments")) || [];

        let now = new Date();
        let updated = false;

        appointments = appointments.filter(function (a) {

            let appointmentDateTime =
                new Date(a.date + "T" + a.time);

            if (appointmentDateTime < now &&
                a.status === "Pending") {

                a.status = "Expired";
                a.statusUpdatedAt = new Date().toISOString();
                showMessage("Appointment Expired!");
                updated = true;
            }

            if (a.statusUpdatedAt) {

                let statusTime =
                    new Date(a.statusUpdatedAt);

                let hoursPassed =
                    (now - statusTime) / (1000 * 60 * 60);

                if (hoursPassed >= 48) {

                    showMessage("Old Appointment Auto Deleted");
                    updated = true;
                    return false;
                }
            }

            return true;
        });

        if (updated) {

            localStorage.setItem("appointments",
                JSON.stringify(appointments));

            if (currentPage.includes("patient")) {
                loadPatientAppointments();
            }

            if (currentPage.includes("receptionist")) {
                loadReceptionAppointments();
            }
        }

    }, 5000);
}

startSmartAutoCheck();

/* ---------------- TOAST MESSAGE ---------------- */

function showMessage(text) {

    let msg = document.createElement("div");
    msg.innerText = text;

    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.background = "#28a745";
    msg.style.color = "white";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "5px";
    msg.style.zIndex = "1000";

    document.body.appendChild(msg);

    setTimeout(function () {
        msg.remove();
    }, 3000);
}