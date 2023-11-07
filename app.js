// Created By: Ian Wilson
// Date: November 7th, 2023

// Get 3rd Party modules
const express = require("express");
const cors = require("cors");
const fm = require("./filemgr");
const { v4: uuidv4 } = require('uuid');


// Create the express http server
const app = express();

// Apply CORS middleware to enable cross-origin requests
app.use(cors());

// Apply middleware for parsing JSON bodies
app.use(express.json());

// Define HTTP routes listening for requests

// Get list data
app.get("/api", async (req, res) => {
  try {
    const data = await fm.ReadData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error reading data" });
  }
});

// Add new item
app.post("/api", async (req, res) => {
  try {
    const newItem = req.body.item;
    const data = await fm.ReadData();
    data.push(newItem);
    await fm.WriteData(data);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error writing data" });
  }
});


// Delete an item
app.delete("/api/:item", async (req, res) => {
  try {
    const itemContent = req.params.item;
    const data = await fm.ReadData();

    // Find the item by its content and remove it from the list
    const itemIndex = data.indexOf(itemContent);
    if (itemIndex !== -1) {
      data.splice(itemIndex, 1);
      await fm.WriteData(data);
      res.status(200).json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});



// Static files middleware should be last before the error routes
app.use(express.static("./Client"));

// Page not found route for non-existing routes
app.all("*", (req, res) => {
  res.status(404).send("<h1>Page Not Found...</h1>");
});

// Start the server on the given port
const appName = "Simple List";
const port = 3000;
app.listen(port, () => {
  console.log(`App ${appName} is running on port ${port}`);
});
