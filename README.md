# Read Me Instructions
A README.md file. This file should include:
A brief description of your project.
Instructions on how to run the application (if anything beyond opening index.html in a browser is needed).
A reflection on your development process, challenges faced, and how you overcame them.
Any known issues or features not implemented.

# Answers to Readme
## 1. Instructions and description
- type in a title and journal entry, and then press post
- to edit a post, press edit -> change your content -> press save.  Press cancel to reset the post to normal view.

## 2. Reflection
- the first part of development was having a basic design (keeping it basic as possible to focus primarily on dom manipulation as wanted by the assignment) in mind with how each part would function.  My idea was to have a post area below the form, where pressing edit would change the buttons and swap the title and content areas into text fields for editting.
- Journal entries are saved to a master list, and an ID counter is counted with and assigned to each post (0, 1, 2...).  Each blog post and journal object is assigned a unique number id to reference for alteration of said post.
- On each refresh, update view iterates over the journal list and creates a separate post for each.
- The biggest challenge was figuring out how I wanted to format everything to be more readable and more performant.  What I came up during my research was using template and copying the information out of that into new posts.  I found this more efficient/simple than building each html object in javascript, and I've read this is more performant too.

### Template problems faced
- The biggest headache I had with trying to pull information out was that trying to clone or pull children out of a template would return errors or null.  After doing some console logs, I realized that template was not returning children, but document fragments, which I found the solution to be along the lines of template.contents.cloneNode(true).  After figuring this out, I could easily use query selectors to go through the element created using template cloning to fill out what I needed for each blog post.

## reflection continued
- The next difficulty i had was swapping the buttons.  I tried various methods before settling to assigning each set of buttons to a separate template, deepcloning their templates and applying them as needed.  The edit/delete buttons are implemented on updateview function when each blog post is created from the array list holding the journal posts.  When edit is pressed, those buttons are replaced with save and cancel buttons.  Originally, the cancel and save button just ran the function to refresh view, but I've changed them now to dynamically change the journal post you're editting without refreshing or touching any other content on the page.
- I had issues with, after saving posts, things would return null.  I ended up having to move clonenodes and variable calls inside of functions within the event listener, rather than calling at the top of the event listener, to fix this issue.
- as with the SBA4 redo, I'm not sure how to organize my code at this time.  I've pushed event listeners to their own sections, and a small helper function section for 2 of my helper functions as a start.  I'll figure out organization better with each SBA/project we do, I've not touched coding in a while since i last worked with self-learning python and self-learning C# for unity.

## Known issues or features not implemented
- I'm aware of sizing issues with certain actions, the post button not well styled and moves around a little.  This is due to less focus on looks and more on functionality.  I find I enjoy working with logic more than looks and functional looks.
  - I fixed the resizing issues, this is no longer an issue 
- I would like to change it so that hitting edit on one post cancels editting on another post, but for what I know right now that seems like a lot of work.
- I could do more logic to run replacewiths again to swap back to normal look on posts instead of just running updateView() when cancel is used, but it seems unnecessary for this.  just keep it simple.
    - I did this, keeping it here as with other one for personal notes and clarity.
