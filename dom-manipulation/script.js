// An array to store quotes and their categories
const quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Opportunity" }, 
  { text: "In the end, we only regret the chances we didn't take.", category: "Regret" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Believe" }
];

// Mock server URL (replace with actual endpoint if needed)
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Function to save quotes to local storage
function saveQuotesToLocalStorage() {
localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Where to display the quote
const displayQuote = document.getElementById('quoteDisplay');

// Display the last viewed quote if it exists, else show a random quote
function displayLastViewedQuote() {
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');

if (lastViewedQuote) {
  const parsedQuote = JSON.parse(lastViewedQuote);
  document.getElementById('quoteDisplay').innerHTML = `
    <p><strong>${parsedQuote.text}</strong></p>
    <p><em>Category: ${parsedQuote.category}</em></p>
  `;
} else {
  showRandomQuote();  // Show a random quote if no last viewed quote exists
}
}

// Function to show random quote
const showRandomQuote = () => {
const randomIndex = Math.floor(Math.random() * quotes.length);
const randomQuote = quotes[randomIndex];

displayQuote.innerHTML = `<p>"${randomQuote.text}" </p> <p><em>- ${randomQuote.category}</em></p>`;
sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote)); // Save last viewed quote to session storage
}

// Export quotes to a JSON file
const exportToJson = () => {
const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);

const link = document.createElement('a');
link.href = url;
link.download = 'quotes.json';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};

// Event listener for the "Export Quotes" button
document.getElementById('exportJsonButton').addEventListener('click', exportToJson);

// Import quotes from a JSON file
const importFromJsonFile = (event) => {
const fileReader = new FileReader();

fileReader.onload = function(event) {
  try {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes); // Add imported quotes to the array
    saveQuotesToLocalStorage(); // Save the updated quotes array to localStorage
    alert('Quotes imported successfully!');
  } catch (error) {
    alert('Invalid JSON file. Please make sure the file contains valid quote data.');
  }
};

fileReader.readAsText(event.target.files[0]);
}

// Create the "Add Quote" form dynamically
const createAddQuoteForm = () => {
const formContainer = document.createElement('div');
const quoteInput = document.createElement('input');
quoteInput.id = 'newQuoteText';
quoteInput.type = 'text';
quoteInput.placeholder = 'Enter a new quote';

const categoryInput = document.createElement('input');
categoryInput.id = 'newQuoteCategory';
categoryInput.type = 'text';
categoryInput.placeholder = 'Enter quote category';

const addButton = document.createElement('button');
addButton.textContent = 'Add Quote';
addButton.onclick = addQuote;  // Bind the addQuote function to the button click

formContainer.appendChild(quoteInput);
formContainer.appendChild(categoryInput);
formContainer.appendChild(addButton);

document.body.appendChild(formContainer);
};

// Function to add a new quote
const addQuote = () => {
const newQuoteText = document.getElementById('newQuoteText').value;
const newQuoteCategory = document.getElementById('newQuoteCategory').value;

if (newQuoteText && newQuoteCategory) {
  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  saveQuotesToLocalStorage();  // Save the updated quotes array to Local Storage
  updateCategoryFilter(); // Update the dropdown categories

  alert('New quote added successfully');
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
} else {
  alert('Please fill in both the quote and the category.');
}
};

// Create and populate the category filter dropdown dynamically
const populateCategories = () => {
const categories = Array.from(new Set(quotes.map(quote => quote.category))); // Get unique categories
const categoryFilter = document.getElementById('categoryFilter');

categoryFilter.innerHTML = '<option value="all">All Categories</option>';

categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  categoryFilter.appendChild(option);
});

const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
categoryFilter.value = lastSelectedCategory;

filterQuotes();
};

// Filter quotes based on the selected category
const filterQuotes = () => {
const selectedCategory = document.getElementById('categoryFilter').value;
const filteredQuotes = selectedCategory === 'all' 
  ? quotes 
  : quotes.filter(quote => quote.category === selectedCategory);

displayQuotes(filteredQuotes);

localStorage.setItem('lastSelectedCategory', selectedCategory);
};

// Function to display quotes
const displayQuotes = (filteredQuotes) => {
const displayArea = document.getElementById('quoteDisplay');
displayArea.innerHTML = '';

if (filteredQuotes.length === 0) {
  displayArea.innerHTML = '<p>No quotes available for this category.</p>';
  return;
}

filteredQuotes.forEach(quote => {
  displayArea.innerHTML += `
    <p><strong>${quote.text}</strong></p>
    <p><em>Category: ${quote.category}</em></p>
  `;
});
};

// The button that shows a new quote when clicked
let showBtn = document.getElementById('newQuote');
showBtn.addEventListener('click', showRandomQuote);

// Sync quotes with the server (mock API interaction)
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';  // Mock API endpoint

// Function to fetch quotes from the mock API (server)
const fetchQuotesFromServer = async () => {
try {
  const response = await fetch(serverUrl);
  const data = await response.json();
  return data.map(post => ({
    text: post.title,
    category: "General"  // Default category (change as necessary)
  }));
} catch (error) {
  console.error('Error fetching from server:', error);
  return [];
}
};

// Sync with server and resolve conflicts
const syncWithServer = async () => {
const serverQuotes = await fetchQuotesFromServer();

if (serverQuotes.length === 0) {
  return;
}

const updatedQuotes = [];
serverQuotes.forEach(serverQuote => {
  const existingQuote = quotes.find(quote => quote.text === serverQuote.text);
  
  if (!existingQuote) {
    updatedQuotes.push(serverQuote);
  } else if (existingQuote.category !== serverQuote.category) {
    existingQuote.category = serverQuote.category;
    updatedQuotes.push(existingQuote);
    showConflictResolutionNotification();
  }
});

quotes.push(...updatedQuotes);
saveQuotesToLocalStorage();

if (updatedQuotes.length > 0) {
  alert('New quotes from the server have been added or updated.');
}
};

// Notify the user about conflict resolution
const showConflictResolutionNotification = () => {
const notification = document.createElement('div');
notification.textContent = 'A conflict was resolved, and the data has been updated.';
notification.style.backgroundColor = 'yellow';
notification.style.padding = '10px';
notification.style.border = '1px solid #ccc';
notification.style.margin = '10px 0';
document.body.appendChild(notification);

setTimeout(() => {
  notification.remove();
}, 5000);
};

// Periodically sync with the server every 10 minutes (600000ms)
setInterval(syncWithServer, 600000);

// On page load, display random quote and populate categories
document.addEventListener('DOMContentLoaded', () => {
createAddQuoteForm();
showRandomQuote();
populateCategories();
displayLastViewedQuote();
syncWithServer();  // Sync data on page load
});
