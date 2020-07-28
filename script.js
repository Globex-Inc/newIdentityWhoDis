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
      console.log('click!')

      const userGender = $('#gender option:checked').val()
      const userRegion = $('#regions option:checked').val()
      console.log(userGender, userRegion)
   })
}









idApp.init = function(){
   idApp.eventListeners();
}

$(function(){
   idApp.init();
})