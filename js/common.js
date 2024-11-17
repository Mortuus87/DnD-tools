// Found on Stack Overflow
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  };
  return array;
};

/**
 * will probably nt be accurate on unusually high numbers, 
 * like 101st, but it should work fine for spell level and HD use cases. 
 * @param {*} number 
 * @returns string
 */
function plural(number) {
  switch (number) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return number + "th";
  };
};

/**
 * Random number between 0 and n-1 input length of array 
 * to return random index of given array 
 * i.e. input of 10 = output of 0-9
 * @param {*} r 
 * @returns 
 */
function random(r) {
    return Math.floor(Math.random() * r);
};