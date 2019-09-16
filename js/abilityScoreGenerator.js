/**
 * Enable ability scores above 18 for spellbook generation purposes
 */


var baseArray = [$('#str-base'), $('#dex-base'), $('#con-base'), $('#int-base'), $('#wis-base'), $('#cha-base')];

init();

function init() {
  // Action listeners for input elements and buttons
  $('.ability-base, .ability-bonus').on('input', abilityCalculate);
  $("#point-amount-select").on('change', setAvailablePoints);
  $('#generate-ability-array').on('click', () => { 
    generate();
    generateTraits();
    });
  $('#reset-7').on('click', () => reset(7));
  $('#dice-generate').on('click', diceGenerate);
  generate();
}

function setAvailablePoints() {
  $('#ability-points-available').val( this.value );
}

//Action for any edit to ability points
function abilityCalculate() {
  //Makes an array of the cost for each ability
  let cost = [];
  let costTotal = 0;

  // Goes through all abilities to calculate score and modifier
  for (let i = 0; i < baseArray.length; i++) {

    // Prevent NaN error if input is blank - replace NaN with 0
    if (isNaN(parseInt($(".ability-base")[i].value))) {
      $(".ability-base")[i].value = 7
    }

    // Calculate score and modifier
    let base = parseInt($(".ability-base")[i].value)
    let bonus = parseInt($(".ability-bonus")[i].value)
    let score = base + bonus
    $(".ability-mod")[i].value = (Math.floor((score - 10) * .5));
    $(".ability-score")[i].value = score;

    function getCost(cost) {
      switch (cost) {
        case 7:
          return -4;
        case 8:
          return -2;
        case 9:
          return -1;
        case 10:
          return 0;
        case 11:
          return 1;
        case 12:
          return 2;
        case 13:
          return 3;
        case 14:
          return 5;
        case 15:
          return 7;
        case 16:
          return 10;
        case 17:
          return 13;
        case 18:
          return 17;
        default:
          console.log("Something went wrong. Base ability score not between 7 and 18!")
          break;
      }
    }
    cost[i] = getCost(parseInt($('.ability-base')[i].value));

    // Updates the cost input field with the individual cost for that ability
    $(".ability-cost")[i].value = cost[i];

    // Adds up the total cost for later use
    costTotal += cost[i]
  }

  // Indicate overspending with red text color
  $('#ability-points-used').val(costTotal);
  if (costTotal > $('#ability-points-available').val() || isNaN($('#ability-points-used').val())) {
    $('#ability-points-used').css('color', 'red');
  } else {
    $('#ability-points-used').css('color', '')
  }
};

function generate() {
  reset(7);
  let used = $('#ability-points-used');
  let max = $('#ability-points-available');

  // Picks a random ability.
  while (parseInt(used.val()) < parseInt(max.val())) {
    var winner = Math.floor(Math.random() * baseArray.length);
    // If it is a valid pick, it is increased by one
    if (parseInt(baseArray[winner].val()) <= 17) {
      baseArray[winner].val(parseInt(baseArray[winner].val()) + 1);
      abilityCalculate();
    };
    // If the chosen increase brings the total cost above the allowed value, subrtract 1 from a random base ability
    while (parseInt(used.val()) > parseInt(max.val())) {
      winner = Math.floor(Math.random() * baseArray.length);
      baseArray[winner].val(parseInt(baseArray[winner].val()) - 1);
      abilityCalculate();
    };
  };

  // if any attribute is below 7 after generation, try again!
  for (let i = 0; i < baseArray.length; i++) {
    if (parseInt(baseArray[i].val()) < 7) {
      console.log('Error: An attribute was below 7, running generator again');
      generate();
    };
  };
};

function reset(val) {
  //set all base inputs to "val", and recalculate score, mods, and cost
  for (let i = 0; i < baseArray.length; i++) {
    baseArray[i].val(val);
    abilityCalculate();
  }
};

function diceGenerate() {
  var roll = [];
  for (let i = 0; i < baseArray.length; i++) {
    roll[i] = rollAndDrop();
  }

  // Extracted as a method in case of toggling it as an option becomes necessary
  replaceLowest();

  shuffle(roll);

  for (let i = 0; i < baseArray.length; i++) {
    baseArray[i].val(roll[i]);
  }
  abilityCalculate();

  function replaceLowest() {
    roll.sort(sortDesc);
    roll.pop();
    roll.push(18);
  }
};

function rollAndDrop() {
  var roll = [0];
  while (eval(roll.join('+')) < 7) {
    for (let i = 0; i < 4; i++) {
      roll[i] = Math.floor(Math.random() * 6) + 1;
    }
    roll.sort(sortDesc);
    roll.pop();
  }
  return eval(roll.join('+'));
}

function sortDesc(a, b) {
  return b - a;
}