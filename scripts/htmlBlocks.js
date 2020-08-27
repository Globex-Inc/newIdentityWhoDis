const block = {}

block.windowBInstructions = `Sweet, now you've got some options to work with! <span class='important'>Choose an identity, and click <span class='button'>Next</span> to find out more about the new you! <br> Don't see anything you like? Hit <span class='button'>Refresh</span> to refresh the list. We got you.</span>` 

block.windowBStructure = `
   <form action='' class='displayChoices' id='displayChoices'>
      <fieldset class='resultsList'>
      </fieldset>
   </form>
   <form action='' class='refreshOptions' id='refreshOptions'>
   </form>
   <form action='' class='goBack' id='goBack'>
   </form>
   <div class='buttonContainer'>
      <button type='submit' form='goBack'>Back</button>
      <button type='submit' form='refreshOptions' id='top'>Refresh</button>
      <button type='submit' form='displayChoices'>Next</button>
   </div>
   <div class='errorContainer'>
   </div>
   `

block.windowCInstructions = function(first, last) {
   return `<span>Et voilà!</span> You have selected <span>${first} ${last}</span> as your new online identity! <br>You have enough here to make a new account on the platform of your choosing. <span class='important'>Click the <span class='button'>Reset</span> at the bottom if you want to try again.</span>`
}

block.windowCNameplate = function(nameplate, userPhoto, userName) {
   return `<section class='${nameplate}'>
            <div class='${userPhoto}'>
            </div>
            <div class='${userName}'>
            </div>
         </section>`
}

block.windowCSection = function(sectionClass, sectionID, sectionName) {
   return `<section class="${sectionClass}">
            <input type='checkbox' id='${sectionID}' name='dropdown' class='checkbox srOnly'>
            <label for='${sectionID}' class='profileHeader' aria-label='Click here to show more information for ${sectionName}'>- ${sectionName} -</label>
            <div class='hiddenContents'>
               
            </div>
         </section>`
}

block.windowCButtons = `
         <form id='backToWindowB'>
         </form>
         <form id='windowCReset'>
         </form>
         <div class='buttonContainer'>
            <button type='submit' form='backToWindowB'>Back</button>
            <button type='submit' form='windowCReset'>Reset</button>
         </div>`

export default block;