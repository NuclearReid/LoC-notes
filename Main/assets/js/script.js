// The element for the entire search form
var searchFormEl = document.querySelector('#search-form');

// A basic Form Submit function
function handleSearchFormSubmit(event) {
  event.preventDefault();

  // Gets the string value from the search bar the user entered
  var searchInputVal = document.querySelector('#search-input').value;

  // Gets the value from the drop down list
  var formatInputVal = document.querySelector('#format-input').value;

  // If they enter nothing, sends an error message
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  //this is creating the Query String that will be put at the end of the search html file.
  // this string will also be broken down again in the code for the query components so it can be search for from
  // the api url
  var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  //changes the window location to the queryString (the other html file with the query paramaters put in it)
  location.assign(queryString);
}

// When they click submit on the search form the function happens
searchFormEl.addEventListener('submit', handleSearchFormSubmit);


