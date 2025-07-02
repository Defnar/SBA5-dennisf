const journalTitle = document.getElementById("title");
const journalTitleError = document.getElementById("title-error");
const journalText = document.getElementById("text");
const journalTextError = document.getElementById("text-error")
const form = document.getElementById("new-post-form");
const journalContainer = document.getElementById("journal-container");
const journalEntryTemplate = document.getElementById("journal-entry");
const editDelTemplate = document.getElementById("edit-del-buttons");
const editContentDiv = document.getElementById("button-edit-div");

//checks if journal list exists, returns empty array if no object
let journalList = JSON.parse(localStorage.getItem("journalList")) || [];
console.log(journalList);

//simple number-based id system for removal of items.
let idCounter = localStorage.getItem("idCounter") || 0;

//initial updateview call to populate blog list
updateView();

//saves data to journal list and id counter
function saveData() {
  localStorage.setItem("journalList", JSON.stringify(journalList));
  localStorage.setItem("idCounter", idCounter);
}

//updates journal section based on joural list
function updateView() {
  let fragment = new DocumentFragment();

  for (let entry of journalList) {
    //creates a clone of html template for blog layout
    const newEntry = journalEntryTemplate.content.cloneNode(true);

    //edit and delete button node
    let editDelButtons = editDelTemplate.content.cloneNode(true);

    //sets dataset item for card id
    newEntry.querySelector(".journal-entry").dataset.id = entry.id;

    //creates the visible text elements
    newEntry.querySelector(".journal-title").textContent = entry.title;
    newEntry.querySelector(".journal-date").dateTime = entry.date;
    newEntry.querySelector(".journal-date").textContent = entry.date;
    newEntry.querySelector(".journal-text").innerText = entry.text;
    newEntry.querySelector(".button-div").appendChild(editDelButtons);

    fragment.appendChild(newEntry);
  }

  journalContainer.innerHTML = "";

  journalContainer.appendChild(fragment);
}

//checks validity for title and entry, in one simple function
function validityCheck(object) {
  if (!object.validity.valid) {
    alert(`${object.name} must be a valid entry`);
    object.focus();
    return false;
  }
  return true;
}

//EVENT LISTENERS//
//event listener for form, checks validity of items and submits
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validityCheck(journalTitle) || !validityCheck(journalText)) {
    return;
  }

  //constructs a new journal object and pushes it to journal list
  let newEntry = {
    title: journalTitle.value,
    date: new Date().toLocaleDateString(),
    text: journalText.value,
    id: idCounter,
  };

  idCounter++;
  journalList.push(newEntry);
  saveData();
  updateView();
  form.reset();
});


//listens for button clicks on journals
journalContainer.addEventListener("click", (event) => {
  let currentJournalEntry = event.target.closest("li");
  let currentJournalEntryText =
    currentJournalEntry.querySelector(".journal-text");

  let journalEntryButtons = currentJournalEntry.querySelector(".button-div");

  let currentJournalEntryId = currentJournalEntry.dataset.id;
  let journalIndex = journalList.findIndex(
    (entry) => entry.id == currentJournalEntryId
  );

  //save and cancel buttons node
  let editContentButtons = editContentDiv.content.cloneNode(true);

  //edit button
  if (event.target.classList.contains("edit-button")) {
    //transforms the journal post into a text area
    let journalTextArea = document.createElement("textarea");
    journalTextArea.className = "journal-text";
    journalTextArea.textContent = currentJournalEntryText.innerText;
    currentJournalEntryText.replaceWith(journalTextArea);

    //transform buttons to save and cancel
    journalEntryButtons.innerHTML = "";
    journalEntryButtons.appendChild(editContentButtons);
  }

  //save button
  if (event.target.classList.contains("save-button")) {
    journalList[journalIndex].text = currentJournalEntryText.value;
    saveData();
    updateView();
  }

  //cancel button
  if (event.target.classList.contains("cancel-button")) {
    updateView();
  }

  //delete button
  if (event.target.classList.contains("delete-button")) {
    journalList = journalList.filter(
      (entry) => entry.id != currentJournalEntryId
    );
    saveData();
    updateView();
  }
});

//blur events to check for proper inputs
journalTitle.addEventListener("blur", (event)=> {
  if (journalTitle.validity.valueMissing) {
    journalTitle.validationMessage = "Title cannot be blank";
  }
  else journalTitle.validationMessage = "";
  journalTitleError.textContent = journalTitle.validationMessage;
})

journalText.addEventListener("blur", (event) =>{
  if (journalText.validity.valueMissing) {
    journalText.validationMessage = "Entry cannot be blank";
  }
  else journalText.validationMessage = "";
  journalTextError.textContent = journalText.validationMessage;
})
