const baseURL = "http://localhost:3000/api/v1/"
const actImageEl = document.querySelector('#act-img')
const actTextEl = document.querySelector('#act-text')
const doneCountEl = document.querySelector('#done-streak')
const generateButton = document.querySelector(".generate-button")
const doneButton = document.querySelector(".done-button")
const allButton = document.querySelector("#all-categories")
const animalsButton = document.querySelector("#animals")
const environmentButton = document.querySelector("#environment")
const familyButton = document.querySelector("#family-friends")
const charityButton = document.querySelector("#charity")
const workButton = document.querySelector("#work")

const arrayOfCategories = [animalsButton, environmentButton, familyButton, charityButton, workButton]

let state = {
  acts: [],
  users: [],
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

function onDoneButton(id) {
    const targetAct = state.acts.find(act => act.id === id)
    targetAct.done_count ++
    renderDoneCount(id)
    updateDoneDatabase(id)
}

function updateDoneDatabase(id) {
  fetch(doneURL, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        image_id: imageId
    })
  }).then(resp => resp.json())
}

//----------Render Act data to page--------------------

function renderAct(id) {
  const targetAct = state.acts.find(act => act.id === id)
  actImageEl.src = targetAct.image_url
  actTextEl.innerText = targetAct.content
  renderDoneCount(id)
  doneButton.addEventListener('click', e => onDoneButton(id))
}
//renders Act with a given ID
function renderDoneCount(id) {
  const targetAct = state.acts.find(act => act.id === id)
  doneCountEl.innerText = `This act has been done ${targetAct.done_count} times!`
}

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

init()
