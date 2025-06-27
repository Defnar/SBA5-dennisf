const journalTitle = document.getElementById("title");
const journalEntry = document.getElementById("entry");
const form = document.getElementById("new-post-form");


//checks if journal list exists, returns empty array if no object
let journalList = JSON.parse(localStorage.getItem("journalList")) || [];

//simple number-based id system for removal of items.  

let idCounter = localStorage.getItem("idCounter") || 0;

//checks validity for title and entry, in one simple function
function validityCheck(object) {
  if (!object.validity.valid) {
    alert(`${object.name} cannot be blank`);
    object.focus();
    return false;
  }
  return true;
}


//event listener for form, checks validity of items and submits
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validityCheck(journalTitle) || !validityCheck(journalEntry)) {
    return;
  }

  let currentTime = new Date();

//constructs a new journal object and pushes it to journal list 
  let newEntry = {
    title: journalTitle.value,
    time: currentTime.toLocaleDateString(),
    entry: journalEntry.value,
    id: idCounter
  };

  idCounter++;
  journalList.push(newEntry);
  console.log(journalList);
});
