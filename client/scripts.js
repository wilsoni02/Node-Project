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
    output += `<li>${item} <button type="button" class="delete-btn" data-index="${index}">Delete</button></li>`;
  });
  output += "</ul>";
  result.innerHTML = output;

  // Attach click event listeners to the delete buttons
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
    result.innerHTML = `<p>Error loading list. Please try again later.</p>`;
  }
}

// Function to send a new item to the server
async function WriteList(newItem) {
  try {
    const response = await http.post('/api', { item: newItem });
    // Ensure that the Fetch API response object has an 'ok' status
    if (!response.ok) {
      throw new Error('The operation did not succeed.');
    }
    // If the server is expected to return the added item, check for its presence
    const responseData = await response.json();
    if (!responseData || responseData !== newItem) {
      throw new Error('Item was not added as expected.');
    }
    await GetList();
  } catch (error) {
    console.error('Error posting new item:', error);
    alert('Error posting new item. Please try again.');
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

// Listener for Enter key in the input field
input.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    httpPost(); // Call the httpPost function when Enter is pressed
  }
});

// Function to handle the Delete button click
async function httpDelete(event) {
  event.preventDefault();

  // Get the item's content to identify it for deletion
  const itemContent = encodeURIComponent(event.target.closest('li').textContent.replace(' Delete', ''));

  try {
    const response = await http.delete(`/api/${itemContent}`);

    if (!response.ok) {
      throw new Error('Failed to delete the item');
    }
    await GetList();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item. Please try again.');
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
