// Created By: Ian Wilson
// Date: November 7th, 2023

// Get 3rd Party modules
const express = require("express");
const cors = require("cors");
const fm = require("./filemgr");

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
  console.log('POST /api called with body:', req.body); // Log the request body for debugging
  try {
    const newItem = req.body.item;
    if (!newItem) {
      console.log('Invalid item received:', newItem); // Log invalid item issues
      return res.status(400).json({ message: "Invalid item" });
    }

    console.log('Reading data from file...');
    const data = await fm.ReadData();
    console.log('Read data:', data);

    console.log('Adding new item to data:', newItem);
    data.push(newItem);
    console.log('Writing updated data to file...');
    await fm.WriteData(data);
    console.log('Write complete.');

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error in POST /api:', error.stack); // Log the full error stack
    res.status(500).json({ message: "Error writing data", error: error.message });
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

// Update an existing item
app.patch("/api/:item", async (req, res) => {
  try {
    const oldItem = decodeURIComponent(req.params.item);
    const newItem = req.body.item;
    console.log(`Updating item: ${oldItem} to ${newItem}`);

    const data = await fm.ReadData();
    const itemIndex = data.indexOf(oldItem);

    if (itemIndex !== -1) {
      data[itemIndex] = newItem;
      await fm.WriteData(data);
      res.status(200).json(newItem);
    } else {
      console.log("Item not found for update");
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: "Error updating item" });
  }
});



// Static files middleware should be last before the error routes
app.use(express.static("./Client"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

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
