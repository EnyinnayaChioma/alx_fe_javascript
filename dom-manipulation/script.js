// An array to store quotes and their categories
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of difficulty lies opportunity.", category: "Opportunity" }
];




// where to display quote
const displayQuote = document.getElementById('quoteDisplay')
// The button that shows quote when clicked
let showBtn = document.getElementById('newQuote')

const showRandomQuote = ()=> {
  // to get a random quote
   
  // first get a random index
  const randomIndex =Math.floor(Math.random() * quotes.length);
  // get a random quote
  const randomQuote = quotes[randomIndex]

  // console.log(randomQuote)

  displayQuote.innerHTML = `<p>"${randomQuote.text}" </p> <p><em>- ${randomQuote.category}</em></p>`

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

  const form = document.getElementById('form')
  // Append the form container to the body or any specific container
  form.appendChild(formContainer);
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

  document.getElementById('newQuoteText').value =''
  document.getElementById('newQuoteCategory').value=''
  
  // success message
  alert('New quote added successfully')
} else{
  alert('Please fill in both the quote and the category.')
}
}

showBtn.addEventListener('click', showRandomQuote)

showRandomQuote()


