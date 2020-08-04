const randomizers = {}

// Helper function: random item from an array
randomizers.randomIndex = function (array) {
   const index = Math.floor(Math.random() * array.length);
   return array[index]
}

// Helper function: random array of three items (no repeats)
randomizers.randomThree = function (array) {
   let one = randomizers.randomIndex(array);
   let two = randomizers.randomIndex(array);
   let three = randomizers.randomIndex(array);

   if (one == two || one == three) { one = randomizers.randomIndex(array) }
   if (two == one || two == three) { two = randomizers.randomIndex(array) }
   if (three == two || three == one) { three = randomizers.randomIndex(array) }

   const newArray = []
   newArray.push(one, two, three)
   return newArray
}

export default randomizers