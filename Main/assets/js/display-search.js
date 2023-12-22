var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');

function getParams() {
  // I have set the url paramters in script.js, this line is basically just extracting those parameters again
  // This seperates the two paramters in the array at the '&' (the & is used to link together parameters)
  var searchParamsArr = document.location.search.split('&');

  // Now that i have the array (it only has two spots because we only sent accross two query paramters)
    // We have to remove the the value of the query paramters. this is done by splitting each element of the array at the '=' then .pop() removes everything after
  var query = searchParamsArr[0].split('=').pop();
  var format = searchParamsArr[1].split('=').pop();

  // This sends the two query parameters to the 'searchApi()' function
  searchApi(query, format);
}

// Used to display the search results
// resultObj comes form searchAPI()
function printResults(resultObj) {
  //logs the json
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  // adds the different classes to the newly created div (these come from bootstrap)
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  // Creates another div element
  var resultBody = document.createElement('div');
  //adds a class to it
  resultBody.classList.add('card-body');

  // appends resultCards to the resultBody
    //This is essentially nesting the resultBody inside of resultCard
    //the html: <div class="card bg-light text-dark -mb-3 p-3">
    //            <div class="card-body">
  resultCard.append(resultBody);

  // Creates an h3 element
  var titleEl = document.createElement('h3');
  // Looks at the object then find's the title and sets that to be the text content
  titleEl.textContent = resultObj.title;

  // creates a <p> elemnt for the body content
  var bodyContentEl = document.createElement('p');
  // inserts the HTML into the document rather than replacing it
  bodyContentEl.innerHTML =
                          // looks at the object.date (open the consol and it makes more sense)
    '<strong>Date:</strong> ' + resultObj.date + '<br/>';

    //if there is a .subject than it'll be added to the HTML too
  if (resultObj.subject) {
    //add's to the html the subject list. 
    bodyContentEl.innerHTML +=
                    // if there are multiple subjects, joins all of them into one html insertion
      '<strong>Subjects:</strong> ' + resultObj.subject.join(', ') + '<br/>';
  } 
    //If there are not subjects then have the html tell the user there are no subjects
    else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }
  //this basically works the same way as the subject but looking for the description
  if (resultObj.description) {
    bodyContentEl.innerHTML +=
                                          // only looks at the first spot in the description array. Look at the consol, it'll make more sense.
      '<strong>Description:</strong> ' + resultObj.description[0];
  } 
    // If there is no description
    else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  No description for this entry.';
  }
  // these next couple lines of code will be creating a clickable button that sends the user to the LoC webiste
  // creats the anchor tag
  var linkButtonEl = document.createElement('a');
  // sets the text of that anchor tag to be 'Read More'
  linkButtonEl.textContent = 'Read More';
  // sets the href to be the object url (once again, look at in the consol to make more sense)
  linkButtonEl.setAttribute('href', resultObj.url);
  // adds classes to the button to make it pretty (uses bootstrap classes)
  linkButtonEl.classList.add('btn', 'btn-dark');

  // now we can append the title we created, the body content that includes the: date, subject, and description, and the anchor button
        //this is appended to the result body (remember it's inside of result card. look at line 35-38)
  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  // now we can append the Card that has all the info we just added to it
  resultContentEl.append(resultCard);
}
//remember, this function(the one above) is used inside of the for loop in searchApi()



// This function sets up our API url with our query parameters and fetches the api
function searchApi(query, format) {

  // Gets the url of the library of congress api (I was confused why it wasn't listed as https://api.loc.gov but I realized that was just the url structure for github's api)
  var locQueryUrl = 'https://www.loc.gov/search/?fo=json';
  // if there is a format selected, then that'll be put into the API url. If no format was chosen, this if statment is ignored
  if (format) {
    //the locQueryUrl is updated with the format the user selected (maps, audio, photos, etc)
    locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
  }
  // the locQuery is not updated with what the user entered/their search string
  locQueryUrl = locQueryUrl + '&q=' + query;

  // Now we have a complete API url that has our query parameters put into it.

  // Let's fetch that API Url!
  fetch(locQueryUrl)
    .then(function (response) {

      // If there is no response from the server, throw is essentially there to tell the user there was an error
      if (!response.ok) {
        // From what I understand, throw is essentially a custom error message
        throw response.json();
      }
      // got a response? then pass that data as a .json()
      return response.json();
    })
    // I'm pretrue sure locRes stands for Location Response
    .then(function (locRes) {
      // This is setting the header text to what the user searched for to tell the user what they searched for
          //this is the line html it's impacting: <h2>Showing results for <span id="result-text"></span></h2>
      resultTextEl.textContent = locRes.search.query;

      // Just logs the returned result of the fetch
      console.log(locRes);
      // Checks if there are no results from search, (basically is there is no .length())
      if (!locRes.results.length) {
        // logs nothing is found
        console.log('No results found!');
        // sets the text in where the search results would have gone, that nothing was found
            //this html:   <div id="result-content"></div>
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        // This else statement is for if there were results 
      } else {
        // I have run the program with this commented out and on. I'm not sure what it does
        resultContentEl.textContent = '';
        // runs through all the results the api sent back and sets up printResults() for each one
        for (var i = 0; i < locRes.results.length; i++) {
          // sends the retrieved json/data of each returned result to printResults()
          printResults(locRes.results[i]);
        }
      }
    })
    // goes over catch & throw: https://www.w3schools.com/js/js_errors.asp
    // if there is an error, then the consol will show the error
    .catch(function (error) {
      console.error(error);
    });
}


// another search form
function handleSearchFormSubmit(event) {
  // if this wasn't here, the form would automatically refresh and we'd lose our data
  event.preventDefault();

  // gets the string value from the search bar
  var searchInputVal = document.querySelector('#search-input').value;

  // gets the value from the drop down
  var formatInputVal = document.querySelector('#format-input').value;

  // if nothing is entered in the search bar, send out an error
  if (!searchInputVal) {
    console.error('You need a search input value!');
    //the return here is done to stop the execution of the program
    return;
  }
  //sends the values from the search bar and format type to the searchApi(). 
  searchApi(searchInputVal, formatInputVal);
}
//executes handleSearchFormSubmit() when you click submit on the form
searchFormEl.addEventListener('submit', handleSearchFormSubmit);

//starts this function from the get-go. Like, the user puts in info on the home screen, then the application is swapped to this javascript/html
getParams();
