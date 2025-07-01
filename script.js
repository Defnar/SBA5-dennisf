const journalTitle = document.getElementById("title");
const journalText = document.getElementById("text");
const form = document.getElementById("new-post-form");
const journalContainer = document.getElementById("journal-container");
const journalEntryTemplate = document.getElementById("journal-entry");

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
  console.log(journalList);
}

//updates journal section based on joural list
function updateView() {
  let fragment = new DocumentFragment();

  for (let entry of journalList) {
    //creates a clone of html template for blog layout
    const newEntry = journalEntryTemplate.content.cloneNode(true);

    //sets dataset item for card id
    newEntry.querySelector(".journal-entry").dataset.id = entry.id;

    //creates the visible text elements
    newEntry.querySelector(".journal-title").textContent = entry.title;
    newEntry.querySelector(".journal-date").dateTime = entry.date;
    newEntry.querySelector(".journal-date").textContent = entry.date;
    newEntry.querySelector(".journal-text").innerText = entry.text;

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
});

journalContainer.addEventListener("click", (event) => {
  //edit button
  if (event.target.classList.contains("edit-button")) {
    //target current node
    currentJournalEntry = event.target.closest("li");
    currentJournalEntryText =
      currentJournalEntry.querySelector(".journal-text");

    let journalTextArea = document.createElement("textarea");
    journalTextArea.className = "journal-text";
    journalTextArea.textContent = currentJournalEntryText.textContent;

    currentJournalEntryText.replaceWith(journalTextArea);
  }
});
