// randomizers helper functions
import randomizers from './randomizers.js'

const userBio = {}

// User Bio information
userBio.aIntroData = {
   hobbies: ['star-gazing', 'basket weaving', 'gaming', 'knitting', 'sitting in the dark', 'doing the dishes', 'buying plants', 'watching Netflix', 'running'],
   petPeeve: ['when people leave the toilet seat up', 'stinky breath', 'that the earth will someday disappear', 'people who snore', 'garlic breath', 'the bourgeousie'],
   jobStatus: ['working a dead end job', 'looking for work', 'in school'],
   jobDreams: ['the CEO of Spotify', 'a YouTuber', 'an independent business owner', 'the very best Pokemon GO player'],
   catchPhrase: ['cowabunga', 'oh beans', 'these pretzels are making me thirsty', 'd\'oh', 'LMFAO', 'yeah, no for sure', 'eh'],
   relationshipStatus: ['single and ready to mingle!', 'in an open relationship', 'married with two kids', 'looking for love in all the wrong places', 'Live, Laugh, Loving my way through 2020']
}

// Custom User Bio Generator Function
userBio.bioResults = []
userBio.generateBio = function(name) {
   const newName = name;
   const { hobbies, petPeeve, jobStatus, jobDreams, catchPhrase, relationshipStatus } = userBio.aIntroData;
   const hobby = randomizers.randomThree(hobbies);
   const petPeeve1 = randomizers.randomIndex(petPeeve);
   const jobStatus1 = randomizers.randomIndex(jobStatus);
   const jobDreams1 = randomizers.randomIndex(jobDreams);
   const catchPhrase1 = randomizers.randomIndex(catchPhrase);
   const relationshipStatus1 = randomizers.randomIndex(relationshipStatus);

   const bigBio = `Hello! My name is ${newName}. Some of my hobbies include ${hobby[0]}, ${hobby[1]}, and ${hobby[2]}. My biggest pet peeve is ${petPeeve1}. What gives?! I am currently ${jobStatus1} but one day I hope to be ${jobDreams1}. One can dream! My favorite thing to say is ${catchPhrase1}. I'm currently ${relationshipStatus1}.`

   const smallBio = `Some of my hobbies include ${hobby[0]}, ${hobby[1]}, and ${hobby[2]}. My favorite thing to say is ${catchPhrase1}.`

   const result = {
      name: newName,
      shortBio: smallBio,
      bigBio: bigBio,
   }

   userBio.bioResults.unshift(result)
}

export default userBio;