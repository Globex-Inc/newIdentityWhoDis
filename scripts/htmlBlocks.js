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

block.windowCInstructions = `<span>Et voilà!</span> You have selected <span>${name.first} ${name.last}</span> as your new online identity! <br>You have enough here to make a new account on the platform of your choosing. <span class='important'>Click the <span class='button'><i class="fas fa-redo-alt" aria-hidden="true"></i><span class="srOnly">Reset button</span></span> at the bottom if you want to try again.</span>`

export default block;