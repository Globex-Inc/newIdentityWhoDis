const idApp = {};

// Select preferred region and gender(M, F, doesn't matter) from dropdown
//    - dropdown will have some examples of countries(i.e.great britain, finland, etc.), which we will need to translate to the country code from the API(ex.label = "Canada" value = "CA" in HTML)
idApp.eventListeners = function() {
   $('form').on('submit', function(event){
      event.preventDefault();
      // User submits their country / gender, and we make an API call based on their selection 
      const userGender = $('#gender option:checked').val()
      const userRegion = $('#regions option:checked').val()
      idApp.apiCall(userGender, userRegion);
   })

   // The user will select their preferred identity
   // event listener for when user submits their final choice
   $('.landingPage').on('submit', '.displayChoices', function(event) {
      event.preventDefault();
      const userFinalSelection = $('input[name="option"]:checked').val();
      const finalResult = idApp.apiResults.filter(function(selectedChoice) {
         return selectedChoice.login.salt === userFinalSelection;
      })
      
      idApp.finalDisplay(finalResult);
   })
}

// API returns 15 identities, and we store it 
idApp.apiResults = []
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
      res.results.forEach(function(i) {
         idApp.apiResults.push(i);
      })
      idApp.listOfNames(res.results);
   })
}
console.log(idApp.apiResults)

// We are going to run a .map() to pull out name / DOB / index number of each result, store it in an object and return to new array 
idApp.listOfNames = function(results){
   const resultsList = results.map(function(i) {
      const identity = {
         name: `${i.name.title} ${i.name.first} ${i.name.last}`,
         dateBirth: i.dob.date.substring(0, 10),
         photo: i.picture.large,
         id: i.login.salt
      };
      return identity
   })
   idApp.displayChoices(resultsList);
}

// Display(.html the result list) that list to the user 
idApp.displayChoices = function(array) {
   $('.landingPage').html(`
   <form for="" class="displayChoices">
   <fieldset class="resultsList">
   </fieldset>
   <button type="submit">Submit</button>
   </form>

   `)
   // console.log(array)
   array.forEach(function(i) {
      const name = $('<h2>').text(i.name);
      const dateBirth = $('<p>').text(i.dateBirth);
      const photo = $('<img>').attr({src: `${i.photo}`, alt: `User photo: ${i.name}`});
      const labelInfoContainer = $('<div>').append(name, dateBirth, photo)

      const radioInput = $('<input>').attr({
      type: 'radio', 
      id: `${i.id}`, 
      name: 'option', 
      value: `${i.id}`})

      const radioLabel = $('<label>').attr('for', i.id).append(labelInfoContainer)

      $('.resultsList').append(radioInput, radioLabel)
   })
}

// Based on their selection, we will display the full identity profile to the user
// We will reference the selected index number, but this time we will be pulling more information to make the full identity profile
// - First / Last Name, gender, location, email address, username, password, DOB, phone numbers, photo 
idApp.finalDisplay = function(array) {
   const finalChoiceObject = array[0]
   const { cell, dob, email, gender, location, login, name, picture } = finalChoiceObject
   const { city, country, postcode, state, street } = location

   $('.landingPage').html(`
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
            <p>${street.number} ${street.name}</p>
            <p>${city}, ${state}</p>
            <p>${country} ${postcode}</p>
         </address>
         <p>${cell}</p>
         <p>${email}</p>
      </section>
      <section class="socialMedia">
         <h3>- New Social Media -</h3>
         <p>${login.username}</p>
         <p>${login.password}</p>
      </section>
      <form>
         <button type="submit">Reset</button>
      </form>
   `)
}









idApp.init = function(){
   idApp.eventListeners();
}

$(function(){
   idApp.init();
})