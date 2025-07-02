const journalTitle = document.getElementById("title");
const journalTitleError = document.getElementById("title-error");
const journalText = document.getElementById("text");
const journalTextError = document.getElementById("text-error");
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

//updates journal section based on journal list
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

//simple validity checker that focuses the first invalid object
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

  let currentJournalEntryTitle =
    currentJournalEntry.querySelector(".journal-title");

  let journalEntryButtons = currentJournalEntry.querySelector(".button-div");

  let currentJournalEntryId = currentJournalEntry.dataset.id;
  let journalIndex = journalList.findIndex(
    (entry) => entry.id == currentJournalEntryId
  );

  //save and cancel buttons node
  let editContentButtons = editContentDiv.content.cloneNode(true);

  //edit button
  if (event.target.classList.contains("edit-button")) {
    //transform the journal title into a text input
    let journalTitleInput = document.createElement("input");
    journalTitleInput.className = "journal-title";
    journalTitleInput.type = "text";
    journalTitleInput.minLength = 8;
    journalTitleInput.maxLength = 25;
    journalTitleInput.required = true;
    journalTitleInput.value = currentJournalEntryTitle.innerText;
    currentJournalEntryTitle.replaceWith(journalTitleInput);

    //blur event for title input for validation
    journalTitleInput.addEventListener("blur", (event) => {
      let titleErrorSpan = currentJournalEntry.querySelector(
        ".journal-title-error"
      );
      if (journalTitleInput.validity.valueMissing) {
        journalTitleInput.setCustomValidity("Title cannot be blank");
      } else journalTitleInput.setCustomValidity("");
      titleErrorSpan.textContent = journalTitleInput.validationMessage;
    });

    //transforms the journal post into a text area
    let journalTextArea = document.createElement("textarea");
    journalTextArea.className = "journal-text";
    journalTextArea.minLength = 50;
    journalTextArea.maxLength = 1000;
    journalTextArea.required = true;
    journalTextArea.value = currentJournalEntryText.innerText;
    currentJournalEntryText.replaceWith(journalTextArea);

    //blur event for journal entry input for validation
    journalTextArea.addEventListener("blur", (event) => {
      let journalErrorSpan = currentJournalEntry.querySelector(
        ".journal-text-error"
      );
      if (journalTextArea.validity.valueMissing) {
        journalTextArea.setCustomValidity("Text cannot be blank");
      } else {
        journalTextArea.setCustomValidity("");
      }
      journalErrorSpan.textContent = journalTextArea.validationMessage;
    });

    //transform buttons to save and cancel
    journalEntryButtons.innerHTML = "";
    journalEntryButtons.appendChild(editContentButtons);
  }

  //save button
  if (event.target.classList.contains("save-button")) {
    if (
      validityCheck(currentJournalEntryTitle) &&
      validityCheck(currentJournalEntryText)
    ) {
      journalList[journalIndex].title = currentJournalEntryTitle.value;
      journalList[journalIndex].text = currentJournalEntryText.value;
      saveData();
      updateView();
    }
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

//blur events to check for proper inputs for the form
journalTitle.addEventListener("blur", (event) => {
  if (journalTitle.validity.valueMissing) {
    journalTitle.setCustomValidity("Title cannot be blank");
  } else journalTitle.setCustomValidity("");
  journalTitleError.textContent = journalTitle.validationMessage;
});

journalText.addEventListener("blur", (event) => {
  if (journalText.validity.valueMissing) {
    journalText.setCustomValidity("Entry cannot be blank");
  } else journalText.setCustomValidity("");
  journalTextError.textContent = journalText.validationMessage;
});
