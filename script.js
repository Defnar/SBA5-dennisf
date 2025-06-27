const journalTitle = document.getElementById("title");
const journalText = document.getElementById("text");
const form = document.getElementById("new-post-form");
const journalContainer = document.getElementById("journal-container")

//checks if journal list exists, returns empty array if no object
let journalList = JSON.parse(localStorage.getItem("journalList")) || [];

//simple number-based id system for removal of items.

let idCounter = localStorage.getItem("idCounter") || 0;

//updates journal section based on joural list
function updateView() {
  const fragment = new DocumentFragment();

  for (let entry of journalList) {
    const newEntry = document.createElement("li");
    newEntry.dataset.id = entry.id;
    newEntry.className = "journal-entry";

    //journal title
    const entryTitle = document.createElement("h2");
    entryTitle.className = "journal-title";
    entryTitle.textContent = entry.title;

    //journal date
    const entryDate = document.createElement("time");
    entryDate.datetime = entry.date;
    entryDate.textContent = entry.date;

    //journal text
    const entryText = document.createElement("p");
    entryText.className = "journal-text";
    entryText.textContent = entry.text;

    //button div
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "journal-button-div";

    //edit button
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edit";

    //delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    //button div appends
    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);

    //entry appends
    newEntry.appendChild(entryTitle);
    newEntry.appendChild(entryDate);
    newEntry.appendChild(entryText);
    newEntry.appendChild(buttonDiv);
    fragment.appendChild(newEntry);
  }
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
  console.log(journalList);
  updateView();
});
