$(document).ready(function () {
    console.log("Boiler Monitor App Loaded");

    // Create New ID
    $("#btnCreateID").click(function () {
        const email = $("#uniqueID").val();
        const password = $("#passcode").val();

        if (!email || !password) {
            alert("Please enter both Boiler ID and Passcode.");
            return;
        }

        const boilerInfo = {
            id: email,
            newPassword: password
        };

        localStorage.setItem("boilerInfo", JSON.stringify(boilerInfo));
        localStorage.setItem("boilerPassword", password);
        alert("New ID created and saved.");
        $.mobile.changePage("#pageMenu");
    });

    // Login
    $("#btnLogin").click(function () {
        const enteredPass = $("#passcode").val();
        const storedPass = localStorage.getItem("boilerPassword");

        if (enteredPass === storedPass) {
            $.mobile.changePage("#pageMenu");
        } else {
            alert("Incorrect password.");
        }
    });

    // Save Boiler Info
    $("#pageInfo input[type='submit']").click(function () {
        const boiler = {
            id: $("#boilerId").val(),
            purchaseDate: $("#purchaseDate").val(),
            maxPressure: $("#maxPressure").val(),
            maxTemp: $("#maxTemp").val(),
            newPassword: $("#newPassword").val()
        };

        if (boiler.newPassword) {
            localStorage.setItem("boilerPassword", boiler.newPassword);
            alert("New password saved!");
        }

        localStorage.setItem("boilerInfo", JSON.stringify(boiler));
        alert("Boiler info saved.");
    });

    // Load Boiler Info
    $("#pageInfo").on("pageshow", function () {
        try {
            const boiler = JSON.parse(localStorage.getItem("boilerInfo"));
            if (boiler) {
                $("#boilerId").val(boiler.id);
                $("#purchaseDate").val(boiler.purchaseDate);
                $("#maxPressure").val(boiler.maxPressure);
                $("#maxTemp").val(boiler.maxTemp);
            }
        } catch (e) {
            console.log("Error loading boiler info:", e);
        }
    });

    // Save Data Entry
    $("#pageEntry input[type='submit']").click(function () {
        const entry = {
            date: $("#entrydate").val(),
            temp: parseFloat($("#entryTemp").val()),
            pressure: parseFloat($("#entryPressure").val())
        };

        let data = JSON.parse(localStorage.getItem("boilerData")) || [];
        data.push(entry);
        localStorage.setItem("boilerData", JSON.stringify(data));
        alert("Entry saved.");
    });

    // Draw Graph
    $("#pageGraph").on("pageshow", function () {
        drawGraph();
        resizeGraph();
    });

    // Sync to backend server
    const SERVER_URL = "http://127.0.0.1:3000";

    $("#btnSync").click(function () {
        const records = JSON.parse(localStorage.getItem("boilerData")) || [];
        const boiler = JSON.parse(localStorage.getItem("boilerInfo"));
        const password = localStorage.getItem("boilerPassword");

        if (!boiler || records.length === 0 || !password) {
            alert("No data or boiler info to sync.");
            return;
        }

        const requestBody = {
            email: boiler.id,
            password: password,
            newRecords: records
        };

        $.ajax({
            url: SERVER_URL + "/syncRecords",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                alert("Records synced with server.");
            },
            error: function (xhr) {
                alert("Sync failed: " + xhr.responseText);
            }
        });
    });
});

// RGraph rendering
function drawGraph() {
    const canvas = document.getElementById("graphCanvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = JSON.parse(localStorage.getItem("boilerData")) || [];

    const dates = data.map(entry => entry.date);
    const temps = data.map(entry => entry.temp);
    const pressures = data.map(entry => entry.pressure);

    if (temps.length === 0) return;

    new RGraph.Line({
        id: 'graphCanvas',
        data: [temps],
        options: {
            xaxisLabels: dates,
            yaxisTitle: 'Temperature (°C)',
            title: 'Boiler Temperature Over Time',
            colors: ['#ff0000'],
            backgroundGridVlines: false,
            backgroundGridBorder: false
        }
    }).draw();

    new RGraph.Line({
        id: 'graphCanvas',
        data: [pressures],
        options: {
            colors: ['#00aaff'],
            linewidth: 2,
            noaxes: true,
            backgroundGrid: false
        }
    }).draw();
}

function resizeGraph() {
    if ($(window).width() < 700) {
        $("#graphCanvas").css({ width: $(window).width() - 50 });
    }
}