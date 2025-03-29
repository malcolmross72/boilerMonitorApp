$(document).ready(function () {
    console.log("Boiler Monitor App is loaded.");

  // Login button
  $("#pagePassword a:contains('Login')").click(function () {
    const enteredPass = $("#txtPassword").val();
    let storedPass = localStorage.getItem("boilerPassword");

    if (!storedPass) {
        storedPass = defaultPassword;
        localStorage.setItem("boilerPassword", defaultPassword);
    }

    if (enteredPass === storedPass) {
        $.mobile.changePage("#pageMenu");
    } else {
        alert("Incorrect password.");
    }
});

  // Save boiler info
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

// Load boiler info
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

// Save entry
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

// Draw graph on page show
$("#pageGraph").on("pageshow", function () {
    drawGraph();
    resizeGraph();
});
});

// Draw line chart with RGraph
function drawGraph() {
const canvas = document.getElementById("graphCanvas");
const context = canvas.getContext("2d");
context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, canvas.width, canvas.height);

let data = JSON.parse(localStorage.getItem("boilerData")) || [];

let dates = data.map((entry) => entry.date);
let temps = data.map((entry) => entry.temp);
let pressures = data.map((entry) => entry.pressure);

if (temps.length === 0) return;

// Draw temperature line
const tempGraph = new RGraph.Line({
    id: 'graphCanvas',
    data: [temps],
    options: {
        xaxisLabels: dates,
        yaxisTitle: 'Temperature (°C)',
        title: 'Boiler Temperature Over Time',
        backgroundGridVlines: false,
        backgroundGridBorder: false,
        colors: ['red']
    }
}).draw();

// Draw pressure line overlay
const pressureGraph = new RGraph.Line({
    id: 'graphCanvas',
    data: [pressures],
    options: {
        xaxisLabels: dates,
        yaxisTitle: 'Pressure (psi)',
        title: '',
        colors: ['blue'],
        linewidth: 2,
        noaxes: true,
        backgroundGrid: false
    }
});

pressureGraph.draw();
}

// Resize graph on smaller screens
function resizeGraph() {
if ($(window).width() < 700) {
    $("#graphCanvas").css({ "width": $(window).width() - 50 });
}
}