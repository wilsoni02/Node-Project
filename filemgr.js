// Created By: Ian Wilson
// Date: November 7th, 2023

const fs = require("fs/promises");
const path = require("path");

// Path to the JSON file
const filePath = path.join(__dirname, 'listdata.json');

async function ReadData() {
  try {
    // Check if the file exists. If not, return an empty array
    try {
      await fs.access(filePath);
    } catch (error) {
      return [];
    }

    // Read the file
    const data = await fs.readFile(filePath, "utf8");

    // Convert the buffer to a JSON object and return it
    return JSON.parse(data);
  } catch (error) {
    // Handle any errors
    console.error("Error reading file:", error);
    throw error;
  }
}

async function WriteData(dataOut) {
  try {
    // Convert the data to a JSON string
    const data = JSON.stringify(dataOut, null, 2);

    // Write the file
    await fs.writeFile(filePath, data, "utf8");
  } catch (error) {
    // Handle any errors
    console.error("Error writing file:", error);
    throw error;
  }
}

exports.ReadData = ReadData;
exports.WriteData = WriteData;
