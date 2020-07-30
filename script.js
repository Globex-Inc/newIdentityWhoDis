// PSEUDOCODE




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
      idApp.listOfNames()
   })

   // The user will select their preferred identity
   // event listener for when user submits their final choice
   $('.landingPage').on('submit', '.displayChoices', function(event) {
      event.preventDefault();
      const finalSelection = $('input[name="option"]').val();
      
      console.log(finalSelection);
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
      // console.log(res);
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
      const identity = {};
      identity.name = `${i.name.title} ${i.name.first} ${i.name.last}`
      identity.dateBirth = i.dob.date.substring(0, 10);
      identity.photo = i.picture.large;
      identity.id = i.login.salt;
      return identity
   })
   // console.log('result list', resultsList)
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

      const radioInput = $(`<input type=radio id="${i.id}" name="option" value="${i.name}">`).appendTo('.resultsList');
      const radioLabel = $('<label>').attr('for', i.id).html(`<div><img src="${i.photo}" alt="Photo for ${i.name}"><p>${i.name}</p><p>${i.dateBirth}</p></div>`).appendTo('.resultsList');
      
      // const radioInput = $('<input>').attr('type', 'radio').attr('name', 'displayChoice').attr('value',i.name);
      // const radioLabel = $('<label>').attr('for', i.name).val(i.name, i.dateBirth, i.photo);
      // $('.landingPage').append(`
      //       ${radioLabel}
      //       ${radioInput}
      // `);
      // console.log(i.name, i.dateBirth, i.photo)
   })
}

// Based on their selection, we will display the full identity profile to the user
// We will reference the selected index number, but this time we will be pulling more information to make the full identity profile
// - First / Last Name, gender, location, email address, username, password, DOB, phone numbers, photo 
idApp.finalDisplay = function() {
   $('.landingPage').html(`
      <section class="nameplate">
         <div class="userPhoto">
            <img src="" alt="">
         </div>
         <div class="userName">
            <h2>Ms. Mindy Marshall</h2>
            <p>Gender</p>
            <p>Dec 16, 1992</p>
         </div>
      </section>
      <section class="contactInfo">
         <h3>- Contact Info -</h3>
         <address>
            <p>Address 1</p>
            <p>Address 2</p>
            <p>Address 3</p>
         </address>
         <p>123-456-7890</p>
         <p>123@gmail.com</p>
      </section>
      <section class="socialMedia">
         <h3>- New Social Media -</h3>
         <p>Username</p>
         <p>Password</p>
      </section>
   `)
}









idApp.init = function(){
   idApp.eventListeners();
}

$(function(){
   idApp.init();
})