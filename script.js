const journalTitle = document.getElementById("title");
const journalTitleError = document.getElementById("title-error");
const journalText = document.getElementById("text");
const journalTextError = document.getElementById("text-error");
const form = document.getElementById("new-post-form");
const journalContainer = document.getElementById("journal-container");
const journalEntryTemplate = document.getElementById("journal-entry");
const editDelTemplate = document.getElementById("edit-del-buttons");
const saveCancelTemplate = document.getElementById("save-cancel-buttons");

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

//simple validity checker that focuses the object if not valid
function validityCheck(object) {
  if (!object.validity.valid) {
    alert(`${object.name} must be a valid entry`);
    object.focus();
    return false;
  }
  return true;
}

//helper function for creating journal title element
function createJournalTitle(title) {
  let newTitle = document.createElement("h2");
  newTitle.className = "journal-title";
  newTitle.textContent = title;
  return newTitle;
}

//helper function for creating blog text element
function createJournalText(text) {
  let newText = document.createElement("p");
  newText.className = "journal-text";
  newText.innerText = text;
  return newText;
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
  //variable declarations, grabs journal, entry text, entry title, button div, journal ID, and journal's index in the array
  let currentJournalEntry = event.target.closest("li");

  let journalEntryButtons = currentJournalEntry.querySelector(".button-div");

  let currentJournalEntryId = currentJournalEntry.dataset.id;
  let journalIndex = journalList.findIndex(
    (entry) => entry.id == currentJournalEntryId
  );

  //edit button
  if (event.target.classList.contains("edit-button")) {
    let currentJournalEntryText =
      currentJournalEntry.querySelector(".journal-text");

    let currentJournalEntryTitle =
      currentJournalEntry.querySelector(".journal-title");
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
    journalEntryButtons.appendChild(saveCancelTemplate.content.cloneNode(true));
  }

  //save button
  if (event.target.classList.contains("save-button")) {
    let currentJournalEntryText =
      currentJournalEntry.querySelector(".journal-text");

    let currentJournalEntryTitle =
      currentJournalEntry.querySelector(".journal-title");
    if (
      validityCheck(currentJournalEntryTitle) &&
      validityCheck(currentJournalEntryText)
    ) {
      //updates journal list
      journalList[journalIndex].title = currentJournalEntryTitle.value;
      journalList[journalIndex].text = currentJournalEntryText.value;
      saveData();

      //replaces title and entry with new values
      currentJournalEntryTitle.replaceWith(
        createJournalTitle(currentJournalEntryTitle.value)
      );
      currentJournalEntryText.replaceWith(
        createJournalText(currentJournalEntryText.value)
      );

      journalEntryButtons.innerHTML = "";
      journalEntryButtons.appendChild(editDelTemplate.content.cloneNode(true));
    }
  }

  //cancel button
  if (event.target.classList.contains("cancel-button")) {
    let currentJournalEntryText =
      currentJournalEntry.querySelector(".journal-text");

    let currentJournalEntryTitle =
      currentJournalEntry.querySelector(".journal-title");

    currentJournalEntryTitle.replaceWith(
      createJournalTitle(journalList[journalIndex].title)
    );
    currentJournalEntryText.replaceWith(
      createJournalText(journalList[journalIndex].text)
    );

    journalEntryButtons.innerHTML = "";
    journalEntryButtons.appendChild(editDelTemplate.content.cloneNode(true));
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
