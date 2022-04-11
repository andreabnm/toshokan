const axios = require('axios').default;
axios.defaults.baseURL = process.env.openLibraryBaseUrl;
const { forEach } = require('lodash');
var _ = require('lodash');

const workElementsClass = ['list-group-item', 'list-group-item-action'];
const workTitleClass = 'workTitle';
const workAuthorsClass = 'workAuthors';
let searchButton = document.getElementById("searchButton");
let searchText = document.getElementById("searchText");
let resultList = document.getElementById("searchResults");
let workDetails = document.getElementById("workDetails");
let workDetailsTitle = document.getElementById("workDetailsTitle");
let workDetailsContent = document.getElementById("workDetailsContent");
let detailsCloseButton = document.getElementById("detailsCloseButton");
let currentSearchResults = [];




function getWorks(searchWord) {
  // api call searching for works pertinent with the word inserted
  startWaitState();
  const path = `/subjects/${searchWord}.json`;
  resultList.innerHTML = '';

  axios.get(path)
  .then(response => _.get(response.data, 'works'))
  .then(function (works) {
    if (works.length != 0) {
      viewWorks(works);
      setupLookup();
    } else {
      resultList.appendChild(createListItemElement('No results found.', '', ''));
    }
  })
  .catch(function () {
    resultList.appendChild(createListItemElement('There was an error with the request, please try again later.', '', ''));
  })
  .finally(function () {
    endWaitState();
  });
};

function viewWorks(works) {
  // display the results
  currentSearchResults = works;
  resultList.innerHTML = '';
  currentSearchResults.forEach(work => viewWork(work));
}

function viewWork(work) {
    // set up the view for the single work

    let authors = work.authors.map(author => author.name).slice(0, 4); // I will keep 5 authors at a maximum
    resultList.appendChild(createListItemElement(work.title, authors, work.key));
}

function createListItemElement(title, authors, key) {
  // create List element corresponding to a work
  let listItemElement = document.createElement('div');
  listItemElement.classList.add(...workElementsClass);
  listItemElement.setAttribute("key", key);
  let titleElement = document.createElement('div');
  titleElement.classList.add(workTitleClass);
  titleElement.innerText = title;
  let authorsElement = document.createElement('div');
  authorsElement.classList.add(workAuthorsClass);
  authorsElement.innerText = authors;
  listItemElement.appendChild(titleElement);
  listItemElement.appendChild(authorsElement);

  return listItemElement;
}

function setupLookup()
{
  // each work found will be set up with an on click event that will allow 
  // to make a second API call for details of the work 

  let results = document.querySelectorAll(`.${workElementsClass[0]}`);

  results.forEach(result => {
    result.addEventListener('click', async () => {
      
      let key = result.getAttribute("key");
      let title, description = '';

      axios.get(key + ".json")
      .then(response => _.get(response.data, 'description'))
      .then(function (descriptionResponse) {
        title = result.firstChild.innerText;

        // The description field in the response is not actually
        // always present or in the same format
        if (!descriptionResponse) { 
          // if the response for "description" is null
          description = 'No description available';
        } else {
          if ((typeof descriptionResponse) == "string") {
            // if it is a string
            description = descriptionResponse;
          } else {
            // if it is an object, it is the value property
            description = descriptionResponse.value;
          }
        }
      })
      .catch(function() {
        title = 'Error';
        description = 'An error has occured with the request, please try again later.';        
      })
      .finally(function() {
        displayDetails(title, description);
      })
  });
});
}

function displayDetails(title, description) {
  workDetailsTitle.innerText = title;
  workDetailsContent.innerText = description;
  workDetails.style.display = "initial";
}

function search() {
  // start call of the api with the word inserted
  const searchWord = searchText.value.trim();
  getWorks(searchWord);
}

function startWaitState() {
  // manage the UI during search to avoid simultaneous calls
  document.body.style.cursor = 'wait';
  searchButton.style.cursor = 'wait';
  searchText.style.cursor = 'wait';
  searchButton.disabled = true;
  searchText.disabled = true;
}

function endWaitState() {
  // restore the state of the UI after end of the call
  document.body.style.cursor = 'default';
  searchButton.style.cursor = 'default';
  searchText.style.cursor = 'default'; 
  searchButton.disabled = false;
  searchText.disabled = false;
}

searchButton.addEventListener('click', search);

detailsCloseButton.addEventListener('click', function () {
  workDetails.style.display = "none";
})


 

