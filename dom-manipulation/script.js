// An array to store quotes and their categories
const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of difficulty lies opportunity.", category: "Opportunity" }, { text: "In the end, we only regret the chances we didn't take.", category: "Regret" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Believe" }
];


// function to saveQuote to Local storage

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// where to display quote
const displayQuote = document.getElementById('quoteDisplay')

// function to show random quote
const showRandomQuote = ()=> {
  // first get a random index
  const randomIndex =Math.floor(Math.random() * quotes.length);
  // get a random quote
  const randomQuote = quotes[randomIndex];

  displayQuote.innerHTML = `<p>"${randomQuote.text}" </p> <p><em>- ${randomQuote.category}</em></p>`



    // Save the last viewed quote to Session Storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  

    // When the page loads, display the last viewed quote or a random one

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


// Export quotes to a JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json'; // Name of the downloaded file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Event listener for the "Export Quotes" button
document.getElementById('exportJsonButton').addEventListener('click', exportToJson);


// Import quotes from a JSON file
function importFromJsonFile(event) {
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

const createAddQuoteForm =()=>{
     const formContainer = document.createElement('div');
  // Create the input fields and button dynamically
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

  // Append the elements to the form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Append the form container to the body or any specific container
  document.body.appendChild(formContainer);
}


const addQuote = () => {
  // get the value for text from the input field
  const newQuoteText = document.getElementById('newQuoteText').value;

  // get the value for category from the input field
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

// check if the two input fields are filled
if (newQuoteText && newQuoteCategory) {
  
  // add new quote to the array
  quotes.push({ text:newQuoteText , category: newQuoteCategory })

  saveQuotesToLocalStorage();  // Save the updated quotes array to Local Storage

   // success message
   alert('New quote added successfully')


// clear input field
  document.getElementById('newQuoteText').value =''
  document.getElementById('newQuoteCategory').value=''
  
 
} else{
  alert('Please fill in both the quote and the category.')
}
}
// The button that shows quote when clicked
let showBtn = document.getElementById('newQuote')
showBtn.addEventListener('click', showRandomQuote)


// Call the function to create the Add Quote form after the page loads and  On page load, display a random quote if there's a last viewed quote in session storage

document.addEventListener('DOMContentLoaded', ()=> {
  createAddQuoteForm();
   showRandomQuote()
});
