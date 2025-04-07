// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

// Create app instance
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB config
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "boilerMonitorApp";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, HTML, etc.)
app.use(express.static(path.join(__dirname)));

// POST route for syncing records
app.post("/syncRecords", async (req, res) => {
    const { email, password, newRecords } = req.body;

    if (!email || !password || !Array.isArray(newRecords) || newRecords.length === 0) {
        return res.status(400).send("Missing or invalid email, password, or records.");
    }

    let client;
    try {
        client = await MongoClient.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = client.db(DB_NAME);
        const collection = db.collection("boilerData");

        // Clear previous records for this boiler ID
        await collection.deleteMany({ boilerId: email });

        // Prepare and insert new records
        const recordsToInsert = newRecords.map((record) => ({
            boilerId: email,
            ...record,
        }));

        await collection.insertMany(recordsToInsert);
        res.status(200).send("Records synced successfully.");
    } catch (err) {
        console.error("Error syncing records:", err);
        res.status(500).send("Server error: Failed to sync records.");
    } finally {
        if (client) await client.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`BoilerMonitorApp server running at http://localhost:${PORT}`);
});