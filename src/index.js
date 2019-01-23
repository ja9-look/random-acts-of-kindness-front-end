const baseURL = "http://localhost:3000/api/v1/"
const actImageEl = document.querySelector('#act-img')
const actTextEl = document.querySelector('#act-text')
const actDoneCountEl = document.querySelector(".done-count-container")
//const userDoneCountEl
const generateButton = document.querySelector(".generate-button")
const doneButton = document.querySelector(".done-button")
const allButton = document.querySelector("#all-categories")
const animalsButton = document.querySelector("#animals")
const environmentButton = document.querySelector("#environment")
const familyButton = document.querySelector("#family-friends")
const charityButton = document.querySelector("#charity")
const workButton = document.querySelector("#work")

const arrayOfCategories = [animalsButton, environmentButton, familyButton, charityButton, workButton]

allButton.addEventListener(`click`, onAllButton)
animalsButton.addEventListener(`click`, onCatButton)
environmentButton.addEventListener(`click`, onCatButton)
familyButton.addEventListener(`click`, onCatButton)
charityButton.addEventListener(`click`, onCatButton)
workButton.addEventListener(`click`, onCatButton)


let state = {
  acts: [],
  users: [],
  selectedCategories: new Set([])
}

//----------Get data from API---------------

function fetchActsFromAPI() {
    //RETURNS A PROMISE
  return fetch('http://localhost:3000/api/v1/acts')
  .then(res => res.json())
  .then(res => state.acts = res)
}

function fetchUsersFromAPI() {
    //RETURNS A PROMISE
  return fetch('http://localhost:3000/api/v1/users')
  .then(res => res.json())
  .then(res => state.users = res)
}

function init() {
  //RETURNS A PROMISE
  fetchActsFromAPI()
  fetchUsersFromAPI()
}

//-----------Event Listener Functions----------

function onCatButton(event) {
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

//----------Render Act data to page--------------------

function renderAct(id) {
  const targetAct = state.acts.find(act => act.id === id)
  actImageEl.src = targetAct.image_url
  actTextEl.innerText = targetAct.content
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



//------------Event Listeners--------------------------
function onDoneButton() {
  //post request to API
}

generateButton.addEventListener(`click`, onGenerateButton)
doneButton.addEventListener(`click`, onDoneButton)


init()
