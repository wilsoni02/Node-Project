// Created By: Ian Wilson
// Date: November 7th, 2023

const http = new coreHTTP();

// Block Variables
let theList = [];

// Setup selectors
const result = document.querySelector(".result");
const input = document.querySelector("#listitem");
const addButton = document.querySelector(".add-btn");

// Listener for adding items
addButton.addEventListener("click", httpPost);

// Function to display the list of items
function ShowList() {
  let output = "<ul>";
  theList.forEach((item, index) => {
    output += `<li>${item} <button type="button" class="edit-btn" data-index="${index}">Edit</button><button type="button" class="delete-btn" data-index="${index}">Delete</button></li>`;
  });
  output += "</ul>";
  result.innerHTML = output;

  // Attach click event listeners to the edit and delete buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', handleEdit);
  });
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', httpDelete);
  });
}

// Function to fetch the list from the server
async function GetList() {
  try {
    const data = await http.get('/api');
    theList = data;
    ShowList();
  } catch (error) {
    console.error('Error fetching list:', error);
    result.innerHTML = `<p>Error loading list. Please check your network connection and try again later.</p>`;
  }
}

// Function to send a new item to the server
async function WriteList(newItem) {
  // Validate the new item
  if (!newItem) {
    alert('Please enter a valid item.');
    return;
  }
  try {
      const response = await http.post('/api', { item: newItem });
      if (!response.ok) {
        const errorDetail = await response.json(); // Retrieve detailed error message if available
        throw new Error(`Server responded with an error: ${response.status} - ${errorDetail.message}`);
      }
    await GetList();
  } catch (error) {
    console.error('Error posting new item:', error);
    alert(`Error posting new item: ${error.message}`);
  }
}

// Function to handle the Add button click
async function httpPost(event) {
  // If event is provided, and it's a submit event, prevent the default form submission
  if (event && event.type === "submit") {
    event.preventDefault();
  }

  const newItem = input.value.trim();
  if (newItem) {
    await WriteList(newItem);
    input.value = ''; // Clear the input field
  }
}

// Listener for Enter/Return key in the input field
input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    httpPost(); // Call the httpPost function when Enter is pressed
  }
});

// Function to handle the Delete button click
async function httpDelete(event) {
  event.preventDefault();

  // Get the index of the item to delete
  const index = event.target.dataset.index;
  const itemContent = theList[index];

  try {
    const response = await http.delete(`/api/${encodeURIComponent(itemContent)}`);
    if (!response.ok) {
      throw new Error('Server responded with an error: ' + response.status);
    }
    await GetList();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item. Please check your network connection and try again.');
  }
}

// Function to handle the Edit button click
async function handleEdit(event) {
  event.preventDefault();

  // Get the index of the item to edit
  const index = event.target.dataset.index;
  const oldItem = theList[index]; // Ensure oldItem is correctly retrieved

  // Prompt user for new item content
  const newItem = prompt("Edit item:", oldItem);
  if (newItem && newItem !== oldItem) {
    try {
      // Update the item in the list
      theList[index] = newItem;
      await http.patch(`/api/${encodeURIComponent(oldItem)}`, { item: newItem });
      ShowList();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    }
  }
}

// Function to show a loading message
function showLoading() {
  result.innerHTML = "Loading...";
}

// Initial function to load the list and set up the UI
async function main() {
  addButton.disabled = true;
  showLoading();
  await GetList();
  addButton.disabled = false;
}

document.getElementById('listForm').addEventListener('submit', httpPost);

// Load the list once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main);
