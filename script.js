// Namespace 
const idApp = {};

// Event Listeners Function  
idApp.eventListeners = function() {
   //Cache $('main') jQuery selector as we will repeatedly use it
   $main = $('main');

   // Event Listener #1 (Window A) - for when the user first submits their preferred region/gender
   $('form').on('submit', function(event){
      event.preventDefault();
      // Cache the user's chosen gender and region (can be re-used again in second API call)
      $userGender = $('#gender option:checked').val()
      $userRegion = $('#regions option:checked').val()
      // Error Handling - for if user does not choose any options 
      if (!$userGender || !$userRegion) {
         $('.errorContainer').html(`<p>Oops! You forgot to fill something in!</p>`);
      } else {
         // Call the API function, passing in the user's choices as arguments 
         idApp.apiCall($userGender, $userRegion);
      }
   })

   // Event Listener #2 (Window A) - to clear error message
   $('select').on('change', function() {
      $('.errorContainer').empty();
   })

   // Event Listener #3 (Window B) - for when the user submits their chosen identity
   $main.on('submit', '.displayChoices', function(event) {
      event.preventDefault();
      // Store the user's final selection in a variable 
      const userFinalSelection = $('input[name="option"]:checked').val();
      //Error Handling - for if user clicks 'Next' without choosing an option
      if (!userFinalSelection) {
         $('.errorContainer').html(`<p>Please choose an identity!</>`);
      } else {
         // Filter through the idApp.apiResults array to find a match for the user's final selection; store in new array finalResult 
         const finalResult = idApp.apiResults.filter(function(selectedChoice) {
            return selectedChoice.login.salt === userFinalSelection;
         })
         // Call the idApp.finalDisplay function, passing in finalResult array as an argument 
         idApp.finalDisplay(finalResult);
      }
   })

   // Event Listener #4 (Window B) - to clear error message
   $main.on('click','input[name="option"]', function() {
      $('.errorContainer').empty();
   })

   // Event Listener #5 (Window B) - for when user clicks the 'Show More' button to refresh results - API function is called again, and page scrolls to the top 
   $main.on('submit', '.refreshOptions', function(event) {
      event.preventDefault();
      idApp.apiCall($userGender, $userRegion);
      $('html, body').animate({
         scrollTop: 0
         }, 800);
   });

   // Event Listener #6 (Window C) - for when the user clicks the 'Back' button to go back to Window B
   $main.on('submit', '.backToWindowB', function(event) {
      event.preventDefault();
      idApp.backToWindowB(idApp.resultsList);
      window.scrollTo(0,0);
   })
}

// Empty array to store the API results in
idApp.apiResults = []

// API Call Function 
idApp.apiCall = function(gender, region) {
   $.ajax({
      url: 'https://randomuser.me/api/',
      method: 'GET',
      dataType: 'json',
      data: {
         results: 15,
         gender: gender,
         nat: region,
      }
   }).then(function(res){
      // Loop through res.results array, and push each object into idApp.apiResults array
      res.results.forEach(function(i) {
         idApp.apiResults.push(i);
      })
      // Call the idApp.listOfNames function, and pass in results from the API call 
      idApp.listOfNames(res.results);
   })
}

// Function to pull out specific data for the 15 identity choices
idApp.listOfNames = function(results){
   // Store results in new global array called idApp.resultsList
   idApp.resultsList = results.map(function(i) {
      const identity = {
         name: `${i.name.title} ${i.name.first} ${i.name.last}`,
         dateBirth: i.dob.date.substring(0, 10),
         photo: i.picture.large,
         id: i.login.salt
      };
      return identity
   })
   // Call the idApp.displayChoices function, passing in idApp.resultsList array as an argument 
   idApp.displayChoices(idApp.resultsList);
}

// Function for displaying the 15 choices on the DOM 
idApp.displayChoices = function(array) {
   idApp.windowBInstructions = `Sweet, now you've got some options to work with! <span class='important'>Choose an identity, and click <span class='button'>Next</span> to find out more about the new you! <br> Don't see anything you like? Click <span class='button'>Show Me More</span> to refresh the list. We got you.</span>`

   $('.instructions').html(idApp.windowBInstructions);

   idApp.windowBContent = `
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
      <button type='submit' form='refreshOptions' id='top'>Show Me More</button>
      <button type='submit' form='displayChoices'>Next</button>
   </div>
   <div class='errorContainer'>
   </div>
   `
   $('.windowA').toggleClass('windowA windowB').html(idApp.windowBContent);

   $('.resultsList').empty();

   array.forEach(function(i) {
      const name = $('<h2>').text(i.name);
      const dateBirth = $('<p>').html(`<span class='dobStyle'>Date of Birth:</span> ${i.dateBirth}`);
      const photo = $('<img>').attr({src: `${i.photo}`, alt: `User photo: ${i.name}`});
      const textContainer = $('<div>').attr('class', 'textContainer').append(name, dateBirth)
      const imageContainer = $('<div>').attr('class', 'imageContainer').append(photo)
      const optionContainer = $('<div>').attr('class', 'optionContainer').append(imageContainer, textContainer);
      const radioInput = $('<input>').attr({
      type: 'radio', 
      id: `${i.id}`, 
      name: 'option', 
      value: `${i.id}`})
      const radioLabel = $('<label>').attr('for', i.id).append(optionContainer);

      $('.resultsList').append(radioInput, radioLabel);
   })
}

// Function for when user clicks the "Back" button on Window C to go back to Window B (displays choices again)
idApp.backToWindowB = function(array) {
   $('.instructions').html(idApp.windowBInstructions)
   $('.windowC').toggleClass('windowC windowB').html(idApp.windowBContent);
   $('.resultsList').empty();

   array.forEach(function(i) {
      $('.resultsList').append(`
      <input type="radio" id="${i.id}" name="option" value="${i.id}">
      <label for="${i.id}" class="optionLabel">
         <div class="optionContainer">
            <div class="imageContainer">
               <img src="${i.photo}" alt="User photo: ${i.name}">
            </div>
            <div class="textContainer">
               <h2>${i.name}</h2>
               <p><span class="dobStyle">Date of Birth:</span> ${i.dateBirth}</p>
            </div>
         </div>
      </label>
      `)
   })
}

// Function to display the full bio of the user's chosen identity
idApp.finalDisplay = function(array) {
   const finalChoiceObject = array[0]
   const { cell, dob, email, gender, location, login, name, picture } = finalChoiceObject
   const { city, country, postcode, state, street } = location

   $('.windowB').toggleClass('windowB windowC').html(`
      <div class='border'>
         <section class='nameplate'>
            <div class='userPhoto'>
               <img src='${picture.large}' alt='user photo: ${name.first} ${name.last}'>
            </div>
            <div class='userName'>
               <h2>${name.title} ${name.first} ${name.last}</h2>
               <p>${gender}</p>
               <p>${dob.date.substring(0, 10)}</p>
            </div>
         </section>
         <section class='contactInfo'>
            <input type='checkbox' id='contactInfo' name='dropdown' class='checkbox srOnly'>
            <label for='contactInfo' class='profileHeader'>- Contact Information -</label>
            <div class='hiddenContents'>
               <address>
                  <p>Address:</p>
                  <p>${street.number} ${street.name}</p>
                  <p>${city}, ${state}</p>
                  <p>${country} ${postcode}</p>
               </address>
               <p><span>Phone:</span> ${cell}</p>
               <p><span>Email:</span> ${email}</p>
            </div>
         </section>
         <section class='socialMedia'>
            <input type='checkbox' id='newSocials' name='dropdown' class='checkbox srOnly'>
            <label for='newSocials' class='profileHeader'>- New Social Media -</label>
            <div class='hiddenContents'>
               <p><span>Username:</span> ${login.username}</p>
               <p><span>Password:</span> ${login.password}</p>
            </div>
         </section>
         <form class='backToWindowB'>
            <button type='submit'>Back</button>
         </form>
         <form>
            <button type='submit'>Reset</button>
         </form>
      </div>
   `)

   $('.instructions').html(`
   <span>Et voilà!</span> You have selected <span>${name.first} ${name.last}</span> as your new online identity! <br>You have enough here to make a new account on the platform of your choosing. <span class='important'>Click the <span class='button'>reset button</span> at the bottom if you want to try again.</span>
   `)

   //scroll to top of window during transition from windowB to windowC
   window.scrollTo(0,0);
}

// Init Function 
idApp.init = function(){
   idApp.eventListeners();
}

// Document Ready
$(function(){
   idApp.init();
})