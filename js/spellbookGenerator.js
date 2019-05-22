// Global variables
const allSpells = []; // Holds the full list of all spells.
let validSpells; // Holds valid spells for a given class. Generated with the button.
let spellsKnown = []; // Number of each spell level the chosen class has.
let spellbook;

// run on load of script
init();

function init() {
  $.getJSON("../json/PathfinderSpells.json", function (data) {
    $.each(data.pfSpells, (key, val) => allSpells[key] = val);
    // generateSpells();
  })
  $("#generate-spells").click(generateSpells);
  $("#expanded-spell-adding").change(printSpells);
  $("#simple-presentation").change(printSpells);
}

// Think about the filter for spell schools, and read specialist rules.

function generateSpells() {
  let type = $("#class-type").val();
  let level = $("#class-level").val();
  generateSpellSlots(type, level);
  validSpells = getValidSpells(type);
  spellbook = fillSpellbook(spellbook);
  printSpells();
}

function empty1x10Array() {
  return [
    [], // 0nd level spells
    [], // 1st level spells
    [], // ...
    [],
    [],
    [],
    [],
    [],
    [], // ...
    [] // 9th level spells
  ]
};

function generateSpellSlots(type, level) {
  // reset spellbook
  spellsKnown = [0]
  switch (type) {
    case "sorcerer/wizard":
      classSpellSlots(9, .5)
      break;
    case "magus":
      classSpellSlots(6, 1 / 3)
      break;
    case "bard":
      classSpellSlots(6, 1 / 3)
      break;
    case "cleric/oracle":
      classSpellSlots(9, .5)
    default:
      break;
  }

  function classSpellSlots(highestSpellLevel, progressionSpeed) {
    //messy, but gets 3 + modifier selected in the dropdown
    spellsKnown[1] = 3 + parseInt($(`#${$("#ability-mod").val()}`).val());
    for (let i = 2; i <= level; i++) {
      // for each level, the highest possible spell level is determined:
      let currentHighestSpellLevel = Math.ceil((i) * progressionSpeed);
      (currentHighestSpellLevel > highestSpellLevel) ? currentHighestSpellLevel = highestSpellLevel: null;
      !spellsKnown[currentHighestSpellLevel] ? spellsKnown[currentHighestSpellLevel] = 0 : null;
      spellsKnown[currentHighestSpellLevel] += 2;
    }
  }
}

function getValidSpells(type) {
  validSpells = empty1x10Array();
  let regExpType = new RegExp(`\\b${type.replace(`\/`, `\/`)}\\s(\\d)`, `i`);
  for (const spell of allSpells) {
    if (regExpType.test(spell.spell_level)) {
      validSpells[spell.spell_level.match(regExpType)[1]].push(spell);
    }
  }
  return validSpells;
}

function fillSpellbook(spellbook) {
  spellbook = empty1x10Array();
  for (let i = 0; i < spellsKnown.length; i++) {
    for (let j = 0; j < spellsKnown[i]; j++) {
      addSpell(spellbook, i);
    }
  }
  return spellbook;
}

function addSpell(spellbook, i) {
  if (validSpells[i].length) {
    let r = Math.floor((Math.random() * validSpells[i].length));
    spellbook[i].push(validSpells[i][r]);
    validSpells[i].splice(r, 1);
  } else {
    console.log("no valid spells to add!")
  }
}

function replaceSpell(spellbook, i, j) {
  validSpells[i].push(spellbook[i][j])
  let r = Math.floor((Math.random() * validSpells[i].length));
  spellbook[i][j] = validSpells[i][r];
  validSpells[i].splice(r, 1);
}

function removeSpell(spellbook, i, j) {
  validSpells[i].push(spellbook[i][j])
  spellbook[i].splice(j, 1);
}

function getBookSize() {
  let bookLength = validSpells[0].length + spellbook[0].length;
  for (let i = 0; i < spellbook.length; i++) {
    for (let j = 0; j < spellbook[i].length; j++) {
      bookLength += i;
    }
  }
  return bookLength;
}

function printSpells() {
  const output = $("#spells .output")
  output.empty();

  // Simple presentation
  if ($('#simple-presentation')[0].checked) {
    for (let i = 0; i < spellbook.length; i++) {
      if (spellbook[i].length != 0) {
        output.append(plural(i) + '<br>');
        for (const spell of spellbook[i]) {
          output.append(spell.name + '<br>');
        }
        output.append('<br>');
      }
    }
  } else {
    // Advanced presentation
    for (let i = 0; i < spellbook.length; i++) {
      if (spellbook[i].length != 0 || $("#expanded-spell-adding")[0].checked) {
        output.append(
          `<p>
        ${printSpellLevelHeader(i)}
        ${printAllSpellsOfLevel(i)}
        ${addSpellButton(i)}
        </p>`);

        for (let j = 0; j < spellbook[i].length; j++) {
          $(`#redraw-${i}-${j}`).click(function (e) {
            e.preventDefault();
            replaceSpell(spellbook, $(this).attr("data-level"), $(this).attr("data-index"))
            printSpells();
          });
          $(`#discard-${i}-${j}`).click(function (e) {
            e.preventDefault();
            removeSpell(spellbook, $(this).attr("data-level"), $(this).attr("data-index"));
            printSpells();
          });
        }
      }

      //Event listeners
      $(`.add-spell-${i}`).click(function (e) {
        e.preventDefault();
        addSpell(spellbook, i);
        printSpells();
      });
      $(`#reroll-${i}`).click(function (e) {
        e.preventDefault();
        let spellsToRemove = spellbook[i].length;
        for (let j = 0; j < spellsToRemove; j++) {
          removeSpell(spellbook, i, 0);
          addSpell(spellbook, i);
        }
        printSpells();
      });
      $(`.fill-${i}`).click(function (e) {
        e.preventDefault();

        while (validSpells[i].length > 0) {
          addSpell(spellbook, i);
        }
        printSpells();
      });
      $(`.empty-${i}`).click(function (e) {
        e.preventDefault();

        while (spellbook[i].length > 0) {
          removeSpell(spellbook, i, 0);
        }
        printSpells();
      });
    }
  }
  // Loop-independent printing called at the end of printSpells()
  // printSpellbookDescription(spellbook);
}

function printSpellbookDescription() {
  let description = [];
  let size = getBookSize();
  let highestSpellLevel = 0;
  for (let i = 0; i < spellbook.length; i++) {
    if (spellsKnown[i]) {
      highestSpellLevel++;
    }
  }

  $.getJSON("spellbookDescription.json", function (data) {
    $.each(data, function (key, val) {
      description[key] = val;
    });
  });

  // switch for cases based on book size ranges

  html = `
  <div class="card border-light mb-1">
    <div class="card-body d-inline-flex p-1 bg-white">
      <div class="no-flex-shrink m-auto">
        <p class="m-0">
          The spells take up ${size} pages.<br>
          
        </p>
      </div>
    </div>
  </div>
  `;
  $("#spellbook-information").empty();
  $("#spellbook-information").append(html);
}

function addSpellButton(i) {
  let html = `
    <div class="card border-light mb-1">
      <div class="card-body d-inline-flex p-1 bg-white">
        <div class="no-flex-shrink m-auto">
          <button class="unstyled-button add-spell-${i}"> <i class="fas fa-plus-circle"></i> Add </button>
        </div>
      </div>
    </div>
    `;
  return html;
}

function printSpellLevelHeader(i) {
  let html = `
  <div class="d-inline-flex align-items-center justify-content-between full-width mt-3">
    <div>
      <h5 class="m-0">
        <b>${plural(i)} level</b>
      </h5>
    </div>
    <div class="no-flex-shrink">
    ${ (i==0) ? '<button class="unstyled-button ml-auto fill-'+i+'"> <i class="fas fa-plus-circle"></i> Add All</button>'
    +'<button class="unstyled-button ml-auto empty-'+i+'"> <i class="fas fa-minus-circle"></i> Remove All</button>' :""}
      <button id="reroll-${i}"class="unstyled-button ml-auto"> <i class="fas fa-redo-alt"></i> Reroll All</button>
    </div>
  </div>`;
  return html;
}

function printAllSpellsOfLevel(i) {
  let html = '';
  for (let j = 0; j < spellbook[i].length; j++) {
    [spell] = [spellbook[i][j]];
    html += `
    <div class="card mb-1">
      <div class="card-header d-inline-flex p-1 justify-content-between align-items-center">
        <div class="spell-name"><h5 class="m-0">${spell.name}</h5><span><h6>${spell.school}</h6></span></div>
        <div class="no-flex-shrink">
          <button class="unstyled-button" data-toggle="collapse" data-target="#spell-${i}-${j}"><i class="fas fa-info-circle"></i><br>Info</button>
          <button class="unstyled-button" id="redraw-${i}-${j}" data-level="${i}" data-index="${j}"><i class="fas fa-redo-alt"></i><br>Redraw</button>
          <button class="unstyled-button" id="discard-${i}-${j}" data-level="${i}" data-index="${j}"><i class="fas fa-times-circle"></i><br>Discard</button>
        </div>
      </div>
      <div id="spell-${i}-${j}" class="collapse">
        <div class="card-body p-1">
          <div class="spell-description">
            <b>School: </b> 
            ${spell.school}
            <br>
            <b>Level: </b> 
            ${spell.spell_level}
            <br>
            <b>Casting Time: </b> 
            ${spell.casting_time}
            <br>
            <b>Components:</b> 
            ${spell.components}
            <br>
            <b>Range: </b> 
            ${spell.range}
            <br>
            <b>Targets: </b> 
            ${spell.targets}
            <br>
            <b>Duration: </b> 
            ${spell.duration}
            <br>
            <b>Saveing Throw: </b> 
            ${spell.saving_throw}
            <br>
            <b>Description:</b> 
            ${spell.description}
          </div>
        </div>
      </div>
    </div>
    `;
  }
  return html;
}

// Button to lock a spell for the next generator run?

// Spellbook quirk! - augmentation to certain spell schools etc.

// alignment and specialities

// check rules for prohibited schools, and remove them from candidates before the picking process