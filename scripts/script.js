//custom user bio module
import randomizers from './randomizers.js'
import userBio from './userBio.js'

// Namespace 
const idApp = {};

// Event Listeners Function  
idApp.eventListeners = function() {
   //Cache $('main') jQuery selector as we will repeatedly use it
   const $main = $('main');

   // Event Listener #1 (Window A) - for when the user first submits their preferred region/gender
   $('form').on('submit', function(event){
      event.preventDefault();
      // Store the user's chosen gender and region in global variable (can be re-used again in second API call)
      idApp.userGender = $('#gender option:checked').val();
      idApp.userRegion = $('#regions option:checked').val();
      // Error Handling - for if user does not choose any options 
      if (!idApp.userGender || !idApp.userRegion) {
         $('.errorContainer').html(`<p>Oops! You forgot to fill something in!</p>`);
      } else {
         // Call the API function, passing in the user's choices as arguments 
         idApp.apiCall(idApp.userGender, idApp.userRegion);
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

   // Event Listener #3A for when any radio input is selected to display a div with some more info
   $main.on('click', '.optionContainer', function () {
      $('.hiddenContents').removeClass('displayContents');
      $('.fa-plus').removeClass('active')
      $(this).find('.hiddenContents').toggleClass('displayContents');
      $(this).parent('.windowBLabel').find('.fa-plus').addClass('active')
   })

   // Event Listener #3B to hide the extra info by clicking the X button
   $main.on('click', '.fa-plus', function() {
      $(this).toggleClass('active');
      $(this).siblings('.optionContainer').find('.hiddenContents').toggleClass('displayContents')
   })
   

   // Event Listener #4 (Window B) - to clear error message
   $main.on('click','input[name="option"]', function() {
      $('.errorContainer').empty();
   })

   // Event Listener #5 (Window B) - for when user clicks the 'Show More' button to refresh results - API function is called again, and page scrolls to the top 
   $main.on('submit', '.refreshOptions', function(event) {
      event.preventDefault();
      $('.errorContainer').empty();
      idApp.apiCall(idApp.userGender, idApp.userRegion);
      $('html, body').animate({
         scrollTop: 0
         }, 800);
   });

   // Event Listener #6 (Window C) - for when the user clicks the 'Back' button to go back to Window B
   $main.on('submit', '.backToWindowB', function(event) {
      event.preventDefault();
      idApp.displayChoices(idApp.resultsList, 'windowC', 'windowB');
      window.scrollTo(0,0);
   })
}

// Empty array to store the API results in
idApp.apiResults = []

// Random User API Call Function 
idApp.apiCall = function(gender, region) {
   $.ajax({
      url: 'https://randomuser.me/api/',
      method: 'GET',
      dataType: 'json',
      data: {
         results: 10,
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

// Dice Bear Avatars API Call Function
idApp.moods = ['happy', 'sad', 'excited']
idApp.avatarCall = function(gender, name, mood) {
   $.ajax({
      url: `https://avatars.dicebear.com/api/${gender}/${name}.svg`,
      method: 'GET',
      dataType: 'html',
      data: {
         mood: [mood],
         r: 50,
         w: 100,
         h: 100,
         m: 15
      }
   }).then(function(res){
      $('.avatarContainer').html(res)
   })
}


// Function to pull out specific data for the 10 identity choices
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
   idApp.displayChoices(idApp.resultsList, 'windowA', 'windowB');
}

// Function for displaying the 10 choices on the DOM 
idApp.displayChoices = function(array, currentWindow, nextWindow) {
   idApp.windowBInstructions = `Sweet, now you've got some options to work with! <span class='important'>Choose an identity, and click <span class='button'>Next</span> to find out more about the new you! <br> Don't see anything you like? Hit <span class='button'>Refresh</span> to refresh the list. We got you.</span>` 

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
      <button type='submit' form='refreshOptions' id='top'>Refresh</button>
      <button type='submit' form='displayChoices'>Next</button>
   </div>
   <div class='errorContainer'>
   </div>
   `
   $(`.${currentWindow}`).toggleClass(`${currentWindow} ${nextWindow}`).html(idApp.windowBContent);

   $('.resultsList').empty();

   array.forEach(function(i) {
      const name = $('<h2>').text(i.name);
      const dateBirth = $('<p>').html(`<span class='dobStyle'>Date of Birth:</span> ${i.dateBirth}`);
      const textContainer = $('<div>').attr('class', 'textContainer').append(name, dateBirth)
      
      const photo = $('<img>').attr({src: `${i.photo}`, alt: `User photo: ${i.name}`});
      const imageContainer = $('<div>').attr('class', 'imageContainer').append(photo)
      
      userBio.generateBio(i.name);
      const bioHeader = $('<h3>').text('Sample Personality')
      const shortBio = $('<p>').text(userBio.bioResults[0].shortBio)
      const hiddenStuffs = $('<div>').attr('class', 'hiddenContents').append(bioHeader, shortBio)

      const closeButton = $('<i>').attr('class', 'fas fa-plus')

      const optionContainer = $('<div>').attr('class', 'optionContainer').append(imageContainer, textContainer, hiddenStuffs);
      const radioInput = $('<input>').attr({
         type: 'radio', 
         id: `${i.id}`, 
         name: 'option', 
         value: `${i.id}`})
      const radioLabel = $('<label>').attr('for', i.id).attr('class', 'windowBLabel').append(optionContainer, closeButton);
      
      $('.resultsList').append(radioInput, radioLabel);
   })
}

// Function to display the full bio of the user's chosen identity
idApp.finalDisplay = function(array) {
   //scroll to top of window during transition from windowB to windowC
   window.scrollTo(0, 0);

   const finalChoiceObject = array[0]
   const { cell, dob, email, gender, location, login, name, picture } = finalChoiceObject
   const { city, country, postcode, state, street } = location
   const fullName = `${name.title} ${name.first} ${name.last}`
   const mood = randomizers.randomIndex(idApp.moods)

   let resultsToDisplay = []
   userBio.bioResults.forEach(function(i){
      if (i.name === fullName) {
         resultsToDisplay.push(i)
      };
   })

   $('.windowB').toggleClass('windowB windowC').html(`
      <div class='border'>
         <section class='nameplate'>
            <div class='userPhoto'>
               <img src='${picture.large}' alt='user photo: ${fullName}'>
            </div>
            <div class='userName'>
               <h2>${fullName}</h2>
               <p>${gender}</p>
               <p>${dob.date.substring(0, 10)}</p>
            </div>
         </section>
         <section class="userBio">
            <input type='checkbox' id='userBio' name='dropdown' class='checkbox srOnly'>
            <label for='userBio' class='profileHeader'>- User Bio -</label>
            <div class='hiddenContents'>
               <p>${resultsToDisplay[0]['bigBio']}</p>
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
               <div class="avatarContainer">
                  ${idApp.avatarCall(`${gender}`, `${name.first}`, `${mood}`)}
               </div>
               <div class="profileInfo">
                  <p><span>Username:</span> ${login.username}</p>
                  <p><span>Password:</span> ${login.password}</p>
               </div>
            </div>
         </section>
         <form class='backToWindowB' id='backToWindowB'></form>
         <form class='' id='windowCReset'></form>
         <div class='buttonContainer'>
            <button type='submit' form='backToWindowB'>Back</button>
            <button type='submit' form='windowCReset'>Reset</button>
         </div>
      </div>
   `)

   $('.instructions').html(`
   <span>Et voilà!</span> You have selected <span>${name.first} ${name.last}</span> as your new online identity! <br>You have enough here to make a new account on the platform of your choosing. <span class='important'>Click the <span class='button'>Reset</span> at the bottom if you want to try again.</span>
   `)
}

// Init Function 
idApp.init = function(){
   idApp.eventListeners();
}

// Document Ready
$(function(){
   idApp.init();
})