const baseURL = "http://localhost:3000/api/v1/"
const doneURL = "http://localhost:3000/api/v1/done"
const allButton = document.querySelector("#all-categories")
const animalsButton = document.querySelector("#animals")
const environmentButton = document.querySelector("#environment")
const familyButton = document.querySelector("#family-friends")
const charityButton = document.querySelector("#charity")
const workButton = document.querySelector("#work")
const actImageEl = document.querySelector('#act-img')
const actTextEl = document.querySelector('#act-text')
const generateButton = document.querySelector(".generate-button")
const doneButton = document.querySelector(".done-button")
const doneCountEl = document.querySelector('#done-streak')
let newGif = ""


const arrayOfCategories = [animalsButton, environmentButton, familyButton, charityButton, workButton]

let state = {
  acts: [],
  users: [],
  currentUser: {},
  selectedCategories: new Set([])
}

//----------------Event Listeners-----------------------------

allButton.addEventListener(`click`, onAllButton)
animalsButton.addEventListener(`click`, onCatButton)
environmentButton.addEventListener(`click`, onCatButton)
familyButton.addEventListener(`click`, onCatButton)
charityButton.addEventListener(`click`, onCatButton)
workButton.addEventListener(`click`, onCatButton)
generateButton.addEventListener(`click`, onGenerateButton)
doneButton.addEventListener(`click`, onDoneButton)


//----------Get data from API---------------

function fetchActsFromAPI() {
  return fetch('http://localhost:3000/api/v1/acts')
  .then(res => res.json())
  .then(res => state.acts = res)
}

function fetchUsersFromAPI() {
  return fetch('http://localhost:3000/api/v1/users')
  .then(res => res.json())
  .then(res => state.users = res)
}

function init() {
  fetchActsFromAPI()
  fetchUsersFromAPI()
}

//-----------Event Listener Functions----------

function onCatButton(event) {
  event.preventDefault()
  const catId = parseInt(event.target.dataset.id)
  if (event.target.class === "active") {
    event.target.class = ""
    state.selectedCategories.delete(catId)
  }
  else {
    event.target.class = "active"
    state.selectedCategories.add(catId)
  }
}

function onAllButton(event) {
  event.preventDefault()
  if (allButton.class === "active") {
    allButton.class = ""
    state.selectedCategories = new Set([])
    arrayOfCategories.forEach(category => category.class = "")
  }
  else {
    state.selectedCategories = new Set([1,2,3,4,5])
    allButton.class = "active"
    arrayOfCategories.forEach(category => category.class = "active")
  }
}

function onDoneButton() {
    const selectedId = event.target.dataset.id
    const targetAct = state.acts.find(act => act.id === parseInt(selectedId))
    targetAct.done_count += 1
    doneCountEl.innerText = `This act has been done ${targetAct.done_count} times.`
    updateDoneDatabase(selectedId)
}

  function updateDoneDatabase(id) {
    fetch(doneURL, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          act_id: id
      })
    })
  }

//----------Render Act data to page--------------------


function renderAct(id) {
  const targetAct = state.acts.find(act => act.id === id)
  actImageEl.src = targetAct.image_url
  actTextEl.innerText = targetAct.content
  doneButton.dataset.id = id
  doneCountEl.innerText = `This act has been done ${targetAct.done_count} times.`

}
//renders Act with a given ID


function getRandomIndex(actArray) {
  return Math.floor(Math.random() * actArray.length);
}
//returns random index within

function randomActFromSelectedCategoryIDs() {
  const actArray = state.acts.filter(act => state.selectedCategories.has(act.category_id))
  const actIndex = getRandomIndex(actArray)
  return actArray[actIndex]
}
//selects random Act that matches the filtered categories

function onGenerateButton() {

  if (state.selectedCategories.size > 0) {
    const id = randomActFromSelectedCategoryIDs().id
    renderAct(id)

  }
  else {
    actImageEl.src = ""
    actTextEl.innerText = "Please select a category."
  }
}
//final function to call when generate button clicked

//----------------Signup----------------------

// function createNewUser(name) {
//   fetch(baseURL + "users", {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         name: name
//     })
//   })
// }
//
// function onSignupFormSubmit(event) {
//   event.preventDefault()
//   const name = event.target.value
//   createNewUser(name)
// }
//
// signupForm.addEventListener(`submit`, onSignupFormSubmit)
//
//

//---------------Add new act--------------------
onNewActSubmit(event) {
  event.preventDefault()
  const content = whateverthevalueoftheactinputis //listen to this
  const user_id = whatevertheidofthecurrentuseris //listen to this
  const category_id = whateverthecategoryidis //listen to this
  searchGifs(content)
  const newAct = {content: content, user_id: user_id, category_id: category_id, image_url: newGif}
  state.acts.push(newAct)
  saveNewActToAPI(newAct) //write this function
  const id = getnewactid //write this function
  renderAct(id)

}


//---------------Giphy--------------



function searchGifs(searchTerm) {
  searchTerm = searchTerm.trim().replace(/ /g, "+");

  const key = "UJDWiFrHozRQi5duuiI3YDFSgqIcbnqC"
  request = new XMLHttpRequest;
  request.open('GET', 'http://api.giphy.com/v1/gifs/search?q=' + searchTerm + '&api_key=UJDWiFrHozRQi5duuiI3YDFSgqIcbnqC')
  request.onload = function() {
		if (request.status >= 200 && request.status < 400){

      const data = JSON.parse(request.responseText).data[0].id;
			newGif = `https://media.giphy.com/media/${data}/giphy.gif` ;

		} else {
			console.log('reached giphy, but API returned an error');
		 }
	};

	request.onerror = function() {
		console.log('connection error');
	};

	request.send();
};
//returns url of first gif from search on giphy

init()
