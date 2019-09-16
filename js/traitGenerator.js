let traits;
const abilities = ["str", "dex", "con", "int", "wis", "cha"];
let traitRefs;

init();

function init() {
  $.getJSON("json/npcTables.json", data => {
    traits = data;
    generateTraits();
  });

  /* $.ajax({
  url: "json/npcTables.json",
  dataType: 'json',
  success: function (data) {
      traits = data;
      generateTraits();
  }
  }); */

  $('#generate-traits').on('click', () => generateTraits());
}



function getHighIndex() {
  let highest = [];
  let highestVal = 0;
  for (let i = 0; i < abilities.length; i++) {
    let current = parseInt($(`#${abilities[i]}-score`)[0].value);
    if (current == highestVal) {
      highest.push(abilities[i])
    } else if (current > highestVal) {
      highestVal = current;
      highest = [];
      highest.push(abilities[i]);
    }
  }
  highest = shuffle(highest)[0];
  return getIndex(shuffle(highest));
}

function getLowIndex() {
  let lowest = [];
  let lowestVal = 99;
  for (let i = 0; i < abilities.length; i++) {
    let current = parseInt($(`#${abilities[i]}-score`)[0].value);
    if (current == lowestVal) {
      lowest.push(abilities[i])
    } else if (current < lowestVal) {
      lowestVal = current;
      lowest = [];
      lowest.push(abilities[i]);
    }
  }
  lowest = shuffle(lowest)[0];
  return getIndex(shuffle(lowest));
}

function getIndex(attribute) {
  switch (attribute) {
    case "str":
      return 0;
    case "dex":
      return 1;
    case "con":
      return 2;
    case "int":
      return 3;
    case "wis":
      return 4;
    case "cha":
      return 5;
    default:
      break;
  }
}

function generateTraits() {
  /**
   * Generate traits in a way that can be accessed and saved, not just directly to the document
   * Seperate drawing from generating, and call them when needed.
   */

  let alignment = random(9); // 9 is the number of alignments used
  let highAbility;
  let lowAbility;
  do {
    highAbility = getHighIndex();
    lowAbility = getLowIndex();
  } while (highAbility == lowAbility);

  traitRefs = {
    "strongAttribute": highAbility,
    "weakAttribute": lowAbility,
    "apperance": random(traits.apperance.length),
    "talent": random(traits.talent.length),
    "mannerism": random(traits.mannerism.length),
    "interactionTrait": random(traits.interactionTrait.length),
    "alignment": [random(9), determineIdeal(alignment)],
    "bond": determineBond(traits),
    "secret": random(traits.secret.length)

  }

  let html = `
  <strong>Strong attribute: </strong>${traits.abilityHigh[traitRefs.strongAttribute]}<br>
  <strong>Weak attribute: </strong>${traits.abilityLow[traitRefs.weakAttribute]}<br>
  <strong>Apperance: </strong>${traits.apperance[traitRefs.apperance]}<br>
  <strong>Talent: </strong>${traits.talent[traitRefs.talent]}<br>
  <strong>Mannerism: </strong>${traits.mannerism[traitRefs.mannerism]}<br>
  <strong>Interaction trait: </strong>${traits.interactionTrait[traitRefs.interactionTrait]}<br>
  ${printIdeal(traitRefs.alignment[0], traitRefs.alignment[1][0], traitRefs.alignment[1][1])}<br>
  <strong>Bond: </strong>${traits.bond[traitRefs.bond.bonds[0]]}<br>
  ${traitRefs.bond.extra ? "<strong>Extra bond: </strong>" + traits.bond[traitRefs.bond.bonds[1]]+"<br>" : ''}
  <strong>Flaw or secret: </strong>${traits.secret[traitRefs.secret]}<br>`;
  $('#traits .output').html(html);

  function determineBond(traits) {
    let r1 = random(traits.bond.length * 1.2)
    r1 > (traits.bond.length) ? r1 = true : r1 = false;
    let r2 = random(traits.bond.length); // first bond
    let r3 = random(traits.bond.length); // additional bond
    while (r3 == r2) {
      r2 = random(traits.bond.length)
    };
    return {
      "extra": r1,
      "bonds": [r2, r3]
    };
  }

  function printIdeal(alignment, firstIdeal, secondIdeal) {
    switch (alignment) {
      case 0:
        return `<strong>Lawful good: </strong>${traits.ideal.lawful[firstIdeal]} and ${traits.ideal.good[secondIdeal]}`;
      case 1:
        return `<strong>Neutral good: </strong>${traits.ideal.neutral[firstIdeal]} and ${traits.ideal.good[secondIdeal]}`;
      case 2:
        return `<strong>Chaotic good: </strong>${traits.ideal.chaotic[firstIdeal]} and ${traits.ideal.good[secondIdeal]}`;
      case 3:
        return `<strong>Lawful neutral: </strong>${traits.ideal.lawful[firstIdeal]} and ${traits.ideal.neutral[secondIdeal]}`;
      case 4:
        return `<strong>True neutral: </strong>${traits.ideal.neutral[firstIdeal]} and ${traits.ideal.other[secondIdeal]}`;
      case 5:
        return `<strong>Chaotic neutral: </strong>${traits.ideal.chaotic[firstIdeal]} and ${traits.ideal.neutral[secondIdeal]}`;
      case 6:
        return `<strong>Lawful evil: </strong>${traits.ideal.lawful[firstIdeal]} and ${traits.ideal.evil[secondIdeal]}`;
      case 7:
        return `<strong>Neutral evil: </strong>${traits.ideal.neutral[firstIdeal]} and ${traits.ideal.evil[secondIdeal]}`;
      case 8:
        return `<strong>Chaotic evil: </strong>${traits.ideal.chaotic[firstIdeal]} and ${traits.ideal.evil[secondIdeal]}`;
      default:
        return `Error in alignment ideal printer. Alignment out of bounds`;
    }
  }

  function determineIdeal(alignment) {
    // the 9 is hardcoded based on number of possible alignments
    switch (alignment) {
      case 0:
        return [random(traits.ideal.lawful.length), random(traits.ideal.good.length)];
      case 1:
        return [random(traits.ideal.neutral.length), random(traits.ideal.good.length)];
      case 2:
        return [random(traits.ideal.chaotic.length), random(traits.ideal.good.length)];
      case 3:
        return [random(traits.ideal.lawful.length), random(traits.ideal.neutral.length)];
      case 4:
        return [random(traits.ideal.neutral.length), random(traits.ideal.other.length)];
      case 5:
        return [random(traits.ideal.chaotic.length), random(traits.ideal.neutral.length)];
      case 6:
        return [random(traits.ideal.lawful.length), random(traits.ideal.evil.length)];
      case 7:
        return [random(traits.ideal.neutral.length), random(traits.ideal.evil.length)];
      case 8:
        return [random(traits.ideal.chaotic.length), random(traits.ideal.evil.length)];
      default:
        return `Error in alignment ideal picker. Alignment out of bounds`;
    }
  };
}