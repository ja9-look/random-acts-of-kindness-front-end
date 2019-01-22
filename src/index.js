const baseURL = "http://localhost:3000/api/v1/"
const actImageEl = document.querySelector('#act-img')
const actTextEl = document.querySelector('#act-text')
const actDoneCountEl = document.querySelector(".done-count-container")
//const userDoneCountEl
const generateButton = document.querySelector(".generate-button")
const doneButton = document.querySelector(".done-button")
const categorySelectorEl =

let state = {
  acts: [],
  users: []
}

let selectedCategories = []

//----------Get data from API

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

//----------Render Act data to page

function renderAct(id) {
  const targetAct = state.acts.find(act => act.id === id)
  actImageEl.src = targetAct.image_url
  actTextEl.innerText = targetAct.content
}

function getRandomIndex(actArray) {
  return Math.floor(Math.random() * actArray.length);
}

function randomActFromSelectedCategoryIDs() {
  const actArray = state.acts.filter(act => selectedCategories.includes(act.category_id))
  const actIndex = getRandomIndex(actArray)
  return actArray[parseInt(actIndex)]
}

function onEventButton() {
  id = 
}



//------------Event Listeners

generateButton.addEventListener(`click`, generateRan)

init()
