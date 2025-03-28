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

    // Save new password if provided
    if (boiler.newPassword) {
        localStorage.setItem("boilerPassword", boiler.newPassword);
        alert("New password saved!");
    }

    localStorage.setItem("boilerInfo", JSON.stringify(boiler));
    alert("Boiler info saved.");
});

// Load boiler info when Boiler Info page is shown
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
});