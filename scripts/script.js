// randomizer helper functions module
import randomizers from './randomizers.js'
//custom user bio module
import userBio from './userBio.js'
//blocks of HTML to be displayed on the page
import block from './htmlBlocks.js'
// helper function for placeholder images
import helpers from './helpers.js'

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
   $main.on('submit', '#backToWindowB', function(event) {
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
idApp.moods = ['happy', 'sad', 'surprised']
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
   }).always(function(){
      $('.avatarContainer').html(helpers.placeholderImg(idApp.userGender))
   })
   .then(function(res){
      $('.avatarContainer').html(res)
   }).fail(function(){
      $('.avatarContainer').html(helpers.placeholderImg(idApp.userGender))
   })
}


// Function to pull out specific data for the 10 identity choices
idApp.listOfNames = function(results){
   // Store results in new global array called idApp.resultsList
   idApp.resultsList = results.map(function(identityObject) {
      const identity = {
         name: `${identityObject.name.title} ${identityObject.name.first} ${identityObject.name.last}`,
         dateBirth: identityObject.dob.date.substring(0, 10),
         photo: identityObject.picture.large,
         id: identityObject.login.salt
      };
      return identity
   })
   // Call the idApp.displayChoices function, passing in idApp.resultsList array as an argument 
   idApp.displayChoices(idApp.resultsList, 'windowA', 'windowB');
}

// Function for displaying the 10 choices on the DOM 
idApp.displayChoices = function(array, currentWindow, nextWindow) {
   //instructions for Window B are in htmlBlocks.js module
   $('.instructions').html(block.windowBInstructions);

   //html block of the window B structure is in htmlBlocks.js
   $(`.${currentWindow}`).toggleClass(`${currentWindow} ${nextWindow}`).html(block.windowBStructure);

   $('.resultsList').empty();

   array.forEach(function(identityObject) {
      const name = $('<h2>').text(identityObject.name);
      const dateBirth = $('<p>').html(`<span class='dobStyle'>Date of Birth:</span> ${identityObject.dateBirth}`);
      const textContainer = $('<div>').attr('class', 'textContainer').append(name, dateBirth)
      
      const photo = $('<img>').attr({
         src: `${identityObject.photo}`, 
         alt: `User photo: ${identityObject.name}`});
      const imageContainer = $('<div>').attr('class', 'imageContainer').append(photo)
      
      userBio.generateBio(identityObject.name);
      const bioHeader = $('<h3>').text('Sample Personality')
      const shortBio = $('<p>').text(userBio.bioResults[0].shortBio)
      const hiddenStuffs = $('<div>').attr('class', 'hiddenContents').append(bioHeader, shortBio)

      const closeButton = $('<i>').attr('class', 'fas fa-plus')

      const optionContainer = $('<div>').attr('class', 'optionContainer').append(imageContainer, textContainer, hiddenStuffs);
      const radioInput = $('<input>').attr({
         type: 'radio', 
         id: `${identityObject.id}`, 
         name: 'option', 
         value: `${identityObject.id}`})
      const radioLabel = $('<label>').attr('for', identityObject.id).attr('class', 'windowBLabel').append(optionContainer, closeButton);
      
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

   // API call for random avatar, called early to improve performance
   const profileAvatar = $('<div>').addClass('avatarContainer').html(`${idApp.avatarCall(`${gender}`, `${name.first}`, `${mood}`)}`);

   //instructions for Window C is in htmlBlocks.js
   $('.instructions').html(block.windowCInstructions(name.first, name.last))
   
   const profileContainer = $('<div>').addClass('border')
   $('.windowB').toggleClass('windowB windowC').html(profileContainer);

   // Window C Nameplate
   $('.border').append(block.windowCNameplate('nameplate', 'userPhoto', 'userName'))

   const profilePic = $('<img>').attr({
      src: `${picture.large}`,
      alt: `User photo: ${fullName}`
   });
   $('.userPhoto').append(profilePic);

   const profileName = $('<h2>').text(`${fullName}`);
   const profileGender = $('<p>').text(`${gender}`);
   const profileBirth = $('<p>').text(`${dob.date.substring(0, 10)}`)
   $('.userName').append(profileName, profileGender, profileBirth)
   // ================================


   //Window C Section: User Bio
   $('.border').append(block.windowCSection('userBio', 'userBio1', 'User Bio'));

   const profileBio = $('<p>').text(`${resultsToDisplay[0]['bigBio']}`);
   $('.userBio .hiddenContents').append(profileBio);
   // ================================


   //Window C Section: Contact Info
   $('.border').append(block.windowCSection('contactInfo', 'contactInfo1', 'Contact Information'));

   const addressHeader = $('<p>').text('Address:')
   const profileStreet = $('<p>').text(`${street.number} ${street.name}`);
   const profileCity = $('<p>').text(`${city}, ${state}`);
   const profileCountry = $('<p>').text(`${country} ${postcode}`);
   const profileAddress = $('<address>').append(addressHeader, profileStreet, profileCity, profileCountry)

   const profilePhone = $('<p>').html(`<span>Phone:</span> ${cell}`);
   const profileEmail = $('<p>').html(`<span>Email:</span> ${email}`);

   $('.contactInfo .hiddenContents').append(profileAddress, profilePhone, profileEmail)
   // =================================


   //Window C Section: New Social Media
   $('.border').append(block.windowCSection('socialMedia', 'newSocials', 'New Social Media'))
   
   const profileUsername = $('<p>').html(`<span>Username:</span> ${login.username}`);
   const profilePassword = $('<p>').html(`<span>Password:</span> ${login.password}`);
   const profileAccount = $('<div>').addClass('profileInfo').append(profileUsername, profilePassword)

   $('.socialMedia .hiddenContents').append(profileAvatar, profileAccount)
   // ==================================


   //Window C Section: Button Nav
   $('.border').append(block.windowCButtons)
   // ==================================
}

// Init Function 
idApp.init = function(){
   idApp.eventListeners();
}

// Document Ready
$(function(){
   idApp.init();
})