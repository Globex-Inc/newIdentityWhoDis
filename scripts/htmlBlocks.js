const block = {}

block.windowBInstructions = `Sweet, now you've got some options to work with! <span class='important'>Choose an identity, and click <span class='button'><i class="fas fa-arrow-right" aria-hidden="true"></i><span class="srOnly">Next button</span></span> to find out more about the new you! <br> Don't see anything you like? Hit <span class='button'><i class="fas fa-sync-alt" aria-hidden="true"></i><span class="srOnly">Refresh button</span></span> to refresh the list. We got you.</span>` 

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
      <button type='submit' form='goBack' title='Back'><i class="fas fa-arrow-left" aria-hidden="true"></i><span class="srOnly">Back button</span></button>
      <button type='submit' form='refreshOptions' id='top' title='Refresh'><i class="fas fa-sync-alt" aria-hidden="true"></i><span class="srOnly">Refresh button</span></button>
      <button type='submit' form='displayChoices' title='Next'><i class="fas fa-arrow-right" aria-hidden="true"></i><span class="srOnly">Next button</span></button>
   </div>
   <div class='errorContainer'>
   </div>
   `

block.windowCInstructions = function(first, last) {
   return `<span>Et voilà!</span> You have selected <span>${first} ${last}</span> as your new online identity! <br>You have enough here to make a new account on the platform of your choosing. <span class='important'>Click the <span class='button'><i class="fas fa-redo-alt" aria-hidden="true"></i><span class="srOnly">Reset button</span></span> at the bottom if you want to try again.</span>`
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
            <label for='${sectionID}' class='profileHeader'>- ${sectionName} -</label>
            <div class='hiddenContents'>
               
            </div>
         </section>`
}

block.windowCButtons = `
         <form id='backToWindowB'>
         </form>
         <form id='windowCReset'></form>
         <div class='buttonContainer'>
            <button type='submit' form='backToWindowB' title='Back'><i class="fas fa-arrow-left" aria-hidden="true"></i><span class="srOnly">Back button</span></button>
            <button type='submit' form='windowCReset' title='Reset'><i class="fas fa-redo-alt" aria-hidden="true"></i><span class="srOnly">Reset button</span></button>
         </div>`

export default block;