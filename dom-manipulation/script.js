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


showBtn.addEventListener('click', showRandomQuote)

showRandomQuote()


