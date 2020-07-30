// PSEUDOCODE



// Based on their selection, we will display the full identity profile to the user
// We will reference the selected index number, but this time we will be pulling more information to make the full identity profile
// - First / Last Name, gender, location, email address, username, password, DOB, phone numbers, photo 

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

   // event listener for when user submits their final choice
   $('.landingPage').on('submit', '.displayChoices', function(event) {
      event.preventDefault();
      console.log('clicked!');
   })
}

// API returns 15 identities, and we store it 
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
      console.log(res);
      idApp.listOfNames(res.results);
   })
}

// We are going to run a .map() to pull out name / DOB / index number of each result, store it in an object and return to new array 
idApp.listOfNames = function(results){
   const resultsList = results.map(function(i) {
      const identity = {};
      identity.name = `${i.name.title} ${i.name.first} ${i.name.last}`
      identity.dateBirth = i.dob.date.substring(0, 10);
      identity.photo = i.picture.large;
      identity.id = i.login.salt;
      return identity
   })
   console.log('result list', resultsList)
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

      // $('.landingPage').append(name, dateBirth, photo);

      const radioInput = $(`<input type=radio id="${i.id}" name="option">`).appendTo('.resultsList');
      const radioLabel = $('<label>').attr('for', i.id).html(`<div><img src="${i.photo}" alt="Photo for ${i.name}"><p>${i.name}</p><p>${i.dateBirth}</p></div>`).appendTo('.resultsList');
      
      // const radioInput = $('<input>').attr('type', 'radio').attr('name', 'displayChoice').attr('value',i.name);
      // const radioLabel = $('<label>').attr('for', i.name).val(i.name, i.dateBirth, i.photo);
      // $('.landingPage').append(`
      //       ${radioLabel}
      //       ${radioInput}
      // `);
      console.log(i.name, i.dateBirth, i.photo)
   })
}

// The user will select their preferred identity









idApp.init = function(){
   idApp.eventListeners();
}

$(function(){
   idApp.init();
})