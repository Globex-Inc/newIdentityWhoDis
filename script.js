// Namespace 
const idApp = {};

// Event Listeners Function  
idApp.eventListeners = function() {
   // Event Listener #1 - for when the user first submits their preferred region/gender
   $('form').on('submit', function(event){
      event.preventDefault();
      // Store the user's chosen gender and region in variables
      const userGender = $('#gender option:checked').val()
      const userRegion = $('#regions option:checked').val()
      // Call the API function, passing in the user's choices as arguments 
      idApp.apiCall(userGender, userRegion);
   })

   // Event Listener #2 - for when the user submits their final choice of identity
   $('main').on('submit', '.displayChoices', function(event) {
      event.preventDefault();
      // Store the user's final selection in a variable 
      const userFinalSelection = $('input[name="option"]:checked').val();
      // Filter through the idApp.apiResults array to find a match for the user's final selection; store in new array finalResult 
      const finalResult = idApp.apiResults.filter(function(selectedChoice) {
         return selectedChoice.login.salt === userFinalSelection;
      })
      // Call the idApp.finalDisplay function, passing in finalResult array as an argument 
      idApp.finalDisplay(finalResult);
   })

   // Event Listener #3 - for when user hits the "Show Me More" button
   $('main').on('submit', '.refreshOptions', function(event) {
      event.preventDefault();
      $('.resultsList').html('');
      idApp.apiCall();
   });
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

// Function to pull out data (name, DOB, photo, ID) for the 15 identity choices
idApp.listOfNames = function(results){
   // Store results in new array called resultsList
   const resultsList = results.map(function(i) {
      const identity = {
         name: `${i.name.title} ${i.name.first} ${i.name.last}`,
         dateBirth: i.dob.date.substring(0, 10),
         photo: i.picture.large,
         id: i.login.salt
      };
      return identity
   })
   // Call the idApp.displayChoices function, passing in resultsList array as an argument 
   idApp.displayChoices(resultsList);
}

// Function for displaying the 15 choices on the DOM 
idApp.displayChoices = function(array) {
   $('.windowA').toggleClass('windowA windowB').html(`
   <form action="" class="displayChoices" id="displayChoices">
      <fieldset class="resultsList">
      </fieldset>
   </form>
   <form action="" class="refreshOptions" id="refreshOptions">
   </form>
   <div class="buttonContainer">
      <button type="submit" form="displayChoices">Submit</button>
      <button type="submit" form="refreshOptions">Show Me More</button>
   </div>
   `)
   $('.instructions').toggleClass('.instructions .windowB').html(`
   New identity, new you! Select your choice and click 'Submit' to find out more about the new you! Click 'Show Me More' for more options!
   `)

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

      $('.resultsList').append(radioInput, radioLabel)
   })
}

// Function to display the full bio of the user's chosen identity (name/gender/location/email/username/password/DOB/phone number/photo)
idApp.finalDisplay = function(array) {
   const finalChoiceObject = array[0]
   const { cell, dob, email, gender, location, login, name, picture } = finalChoiceObject
   const { city, country, postcode, state, street } = location

   $('.windowB').toggleClass('windowB windowC').html(`
      <form>
         <section class="nameplate">
            <div class="userPhoto">
               <img src="${picture.large}" alt="user photo: ${name.first} ${name.last}">
            </div>
            <div class="userName">
               <h2>${name.title} ${name.first} ${name.last}</h2>
               <p>${gender}</p>
               <p>${dob.date.substring(0, 10)}</p>
            </div>
         </section>
         <section class="contactInfo">
            <h3>- Contact Info -</h3>
            <address>
               <p>Address:</p>
               <p>${street.number} ${street.name}</p>
               <p>${city}, ${state}</p>
               <p>${country} ${postcode}</p>
            </address>
            <p><span>Phone:</span> ${cell}</p>
            <p><span>Email:</span> ${email}</p>
         </section>
         <section class="socialMedia">
            <h3>- New Social Media -</h3>
            <p><span>Username:</span> ${login.username}</p>
            <p><span>Password:</span> ${login.password}</p>
         </section>
         <button type="submit">Reset</button>
      </form>
   `)

   $('.instructions').html(`
   <span>Et Voila!</span> You have selected <span>${name.first} ${name.last}</span> as your new online identity! <br>You have enough here to make a new account on the platform of your choosing. <span class="important">Click the <span class="button">reset button</span> at the bottom if you want to try again.</span>
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