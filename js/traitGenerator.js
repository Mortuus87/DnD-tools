let traits;
const abilities = ["str", "dex", "con", "int", "wis", "cha"];

class GeneratedTraits {
  constructor(apperance, abilityHigh, abilityLow, talent, mannerism, interactionTrait, ideal, bond, secret) {
    this.apperance = apperance;
    this.abilityHigh = abilityHigh;
    this.abilityLow = abilityLow;
    this.talent = talent;
    this.mannerism = mannerism;
    this.interactionTrait = interactionTrait;
    this.ideal = ideal;
    this.bond = bond;
    this.secret = secret;
  }
}
let generatedTraits = new GeneratedTraits();

init();

function init() {
  $.getJSON("json/npcTables.json", data => {
    traits = data;
    generateTraits();
  });

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

  let highAbility;
  let lowAbility;
  do {
    highAbility = getHighIndex();
    lowAbility = getLowIndex();
  } while (highAbility == lowAbility);
  let alignment = random(9); // 9 is the number of alignments used

  let html = `
  <strong>Strong attribute: </strong>${traits.abilityHigh[highAbility]}<br>
  <strong>Weak attribute: </strong>${traits.abilityLow[lowAbility]}<br>
  <strong>Apperance: </strong>${traits.apperance[random(traits.apperance.length)]}<br>
  <strong>Talent: </strong>${traits.talent[random(traits.talent.length)]}<br>
  <strong>Mannerism: </strong>${traits.mannerism[random(traits.mannerism.length)]}<br>
  <strong>Interaction trait: </strong>${traits.interactionTrait[random(traits.interactionTrait.length)]}<br>
  ${determineAlignment(traits, alignment)}<br>
  <strong>Bond: </strong>${determineBond(traits)}<br>
  <strong>Flaw or secret: </strong>${traits.secret[random(traits.secret.length)]}<br>`;
  $('#traits .output').html(html);

  function determineBond() {
    let r1 = random(traits.bond.length + 1);
    let r2 = random(traits.bond.length);
    let r3 = random(traits.bond.length);
    while (r3 == r2) {
      r2 = random(traits.bond.length - 1)
    };
    return (r1 < traits.bond.length) ? traits.bond[r2] : `${traits.bond[r2]}<br><strong>Additional bond: </strong>${traits.bond[r3]}`;
  };

  function determineAlignment() {
    // the 9 is hardcoded based on number of possible alignments
    switch (alignment) {
      case 0:
        return `<strong>Lawful good: </strong>${traits.ideal.lawful[random(traits.ideal.lawful.length)]} and ${traits.ideal.good[random(traits.ideal.good.length)]}`;
      case 1:
        return `<strong>Neutral good: </strong>${traits.ideal.neutral[random(traits.ideal.neutral.length)]} and ${traits.ideal.good[random(traits.ideal.good.length)]}`;
      case 2:
        return `<strong>Chaotic good: </strong>${traits.ideal.chaotic[random(traits.ideal.chaotic.length)]} and ${traits.ideal.good[random(traits.ideal.good.length)]}`;
      case 3:
        return `<strong>Lawful neutral: </strong>${traits.ideal.lawful[random(traits.ideal.lawful.length)]} and ${traits.ideal.neutral[random(traits.ideal.neutral.length)]}`;
      case 4:
        return `<strong>True neutral: </strong>${traits.ideal.neutral[random(traits.ideal.neutral.length)]} and ${traits.ideal.other[random(traits.ideal.other.length)]}`;
      case 5:
        return `<strong>Chaotic neutral: </strong>${traits.ideal.chaotic[random(traits.ideal.chaotic.length)]} and ${traits.ideal.neutral[random(traits.ideal.neutral.length)]}`;
      case 6:
        return `<strong>Lawful evil: </strong>${traits.ideal.lawful[random(traits.ideal.lawful.length)]} and ${traits.ideal.evil[random(traits.ideal.evil.length)]}`;
      case 7:
        return `<strong>Neutral evil: </strong>${traits.ideal.neutral[random(traits.ideal.neutral.length)]} and ${traits.ideal.evil[random(traits.ideal.evil.length)]}`;
      case 8:
        return `<strong>Chaotic evil: </strong>${traits.ideal.chaotic[random(traits.ideal.chaotic.length)]} and ${traits.ideal.evil[random(traits.ideal.evil.length)]}`;
      default:
        return `Error in alignment ideal picker`;
    }
  };
}