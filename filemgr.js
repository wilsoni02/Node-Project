// Created By: Ian Wilson
// Date: November 7th, 2023

const fs = require("fs/promises");
const path = require("path");

// Path to the JSON file
const filePath = path.join(__dirname, 'listdata.json');

async function ReadData() {
  let data = '';
  try {
    await fs.access(filePath);
    data = await fs.readFile(filePath, "utf8");
    // Check if the data is empty or only contains whitespace
    if (!data.trim()) {
      console.error("File is empty, returning empty array.");
      return [];
    }
  } catch (error) {
    console.error("File not found or other error, returning empty array:", error);
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON from file:", error);
    // It might be useful to log the actual content that failed to parse
    console.error("Invalid JSON content:", data);
    throw error;
  }
}



async function WriteData(dataOut) {
  const tempFilePath = filePath + '.tmp';
  try {
    const data = JSON.stringify(dataOut, null, 2);
    await fs.writeFile(tempFilePath, data, "utf8");
    await fs.rename(tempFilePath, filePath);
    return true;
  } catch (error) {
    console.error("Error writing file:", error);
    return { error: true, message: error.message };
  }
}


exports.ReadData = ReadData;
exports.WriteData = WriteData;
