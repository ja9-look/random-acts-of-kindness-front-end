const baseURL = "http://localhost:3000/api/v1/"
const actImageEl = document.querySelector('#act-img')
const actTextEl = document.querySelector('#act-text')
const actDoneCountEl = document.querySelector(".done-count-container")
//const userDoneCountEl
const generateButton = document.querySelector(".generate-button")
const doneButton = document.querySelector(".done-button")

let state = {
  acts: [],
  users: []
}

//----------Get data from API

function fetchActsFromAPI() {
  return fetch('http://localhost:3000/api/v1/acts')
  .then(res => res.json())
  .then(res => state.acts = res)
}

function fetchUsersFromAPI() {
  return fetch('http://localhost:3000/api/v1/users')
  .then(res => res.json())
  .then
  (res => state.users = res)
}

function renderAct(id) {
  const targetAct = state.acts.find(act => act.id === id)
  actImageEl.src = targetAct.image_url
  actTextEl.innerText = targetAct.content
}

function getRandomIndex(actArray) {
  return Math.floor(Math.random() * actArray.length);
}

function randomActFromSelectedCategoryIDs(categoryIDs) {
  const actArray = state.acts.filter(act => categoryIDs.includes(act.category_id))
  const actIndex = getRandomIndex(actArray)
  return actArray[parseInt(actIndex)]
}

fetchActsFromAPI()
fetchUsersFromAPI()
renderAct(1)

//function increaseDoneCount(id)
