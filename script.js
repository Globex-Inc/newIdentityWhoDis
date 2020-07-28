// PSEUDOCODE



// User submits their country / gender, and we make an API call based on their selection 

// API returns 15 identities, and we store it 

// We are going to run a.forEach() loop through the stored API data and pull out name / DOB / index number of each result

// Display(append the result list) that list to the user 

// The user will select their preferred identity

// Based on their selection, we will display the full identity profile to the user
// We will reference the selected index number, but this time we will be pulling more information to make the full identity profile
// - First / Last Name, gender, location, email address, username, password, DOB, phone numbers, photo 

const idApp = {};

// Select preferred region and gender(M, F, doesn't matter) from dropdown
//    - dropdown will have some examples of countries(i.e.great britain, finland, etc.), which we will need to translate to the country code from the API(ex.label = "Canada" value = "CA" in HTML)
idApp.eventListeners = function() {
   $('form').on('submit', function(event){
      event.preventDefault();
      const userGender = $('#gender option:checked').val()
      const userRegion = $('#regions option:checked').val()
      idApp.apiCall(userGender, userRegion);
   })
}

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

idApp.listOfNames = function(results){
   const resultsList = [];
   results.forEach(function(i) {
      const identity = {};
      identity.name = `${i.name.title} ${i.name.first} ${i.name.last}`
      identity.dateBirth = i.dob.date.substring(0, 10);
      identity.photo = i.picture.large;
      console.log(identity);
      resultsList.push(identity);
   })
   console.log(resultsList);
}









idApp.init = function(){
   idApp.eventListeners();
}

$(function(){
   idApp.init();
})