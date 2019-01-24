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
const newActForm = document.querySelector('#new-act-form')
const newActInput = document.querySelector('#new-act-input')
const newActCat = document.querySelector('#new-act-cat')
const signupForm = document.querySelector('#signup-form')
const signupInput = document.querySelector('#signup-input')
const welcomeMessage = document.querySelector('.welcome-message')
const newActCollapsibleButton = document.querySelector('.collapsible')
const newActCollapsibleForm = document.querySelector('.new-act-collapsible')

const arrayOfCategories = [animalsButton, environmentButton, familyButton, charityButton, workButton]

let state = {
  acts: [],
  users: [],
  currentUser: 2,
  selectedCategories: new Set([]),
  newGif: ""
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
newActForm.addEventListener(`submit`, onNewActSubmit)
signupForm.addEventListener(`submit`, onSignupFormSubmit)
newActCollapsibleButton.addEventListener(`click`, onCollapseButton)

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
  doneButton.style = "dislay: block;"
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
    debugger
    const id = randomActFromSelectedCategoryIDs().id
    renderAct(id)

  }
  else {
    actImageEl.src = ""
    actTextEl.innerText = "Please select a category."
    doneCountEl.innerText = ``
  }
}
//final function to call when generate button clicked

//----------------Signup----------------------

function createNewUser(name) {
  fetch(baseURL + "users", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: nxame
    })
  })
}

function onSignupFormSubmit(event) {
  event.preventDefault()
  if (signupInput.value.length > 0) {
  const name = signupInput.value
  createNewUser(name)
  .then(() => fetchUsersFromAPI())
  .then(() => welcomeUser(name))
  .then(() => state.currentUser = state.users.find(user => user.name === name))
  }
}

function welcomeUser(name) {
  welcomeMessage.innerText = `Welcome to Helpcues, ${name}!`
}

//---------------Add new act--------------------

function onNewActSubmit(event) {
  event.preventDefault()
  if (newActInput.value.length > 0 && newActCat.value.length > 0) {
      const content = newActInput.value

      const userID = state.currentUser
      const catID = parseInt(newActCat.value)
      let newAct;
      searchGifs(content).then(() => {
        return newAct = {content: content, user_id: userID, category_id: catID, image_url: state.newGif}
        }).then((res) => saveNewActToAPI(res))
          .then(() => fetchActsFromAPI())
          .then(() => renderAct(state.acts.find(act => act.content === content).id))
    newActForm.reset()
  }
  }

function saveNewActToAPI(newAct) {

  return fetch(`http://localhost:3000/api/v1/acts/`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAct)
  })
}


//---------------Giphy--------------


function searchGifs(searchTerm) {
  searchTerm = searchTerm.trim().replace(/ /g, "+");
  const key = "UJDWiFrHozRQi5duuiI3YDFSgqIcbnqC"

  return fetch('http://api.giphy.com/v1/gifs/search?q=' + searchTerm + '&api_key=UJDWiFrHozRQi5duuiI3YDFSgqIcbnqC')
    .then(request => request.json())
    .then(res => res.data[0].id)
    .then(res => state.newGif = `https://media.giphy.com/media/${res}/giphy.gif`)
};
//returns promise of url of first gif from search on giphy


//-------- collapsible form to create new act ---------------------

function onCollapseButton() {
  if (newActCollapsibleForm.style.display === "block") {
      newActCollapsibleForm.style.display = "none";
  } else {
      newActCollapsibleForm.style.display = "block";
    }
  };


init()
