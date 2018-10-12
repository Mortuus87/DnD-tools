
// Global variables

const allSpells = []; // Holds the full list of all spells.
let validSpells = []; // Holds valdid spells for a given class. Generated with the button.
let spellsKnown = []; // Number of each spell level the chosen class has.


//import the json-file, and copies it into allSpells[]
$.getJSON("spellbookGenerator/json/PathfinderSpells.json", function (data) {
    $.each(data.pfSpells, function (key, val) {
        allSpells[key] = val;
    });
});

//ActionListeners:
$("#generate-spells").click(function (e) {
    e.preventDefault();
    $("#print").empty();
    let type = $("#class-type").val();
    let level = $("#class-level").val();
    console.log("type:", type);
    console.log("level:", level);
    validSpells = getValidSpells(type, level);
    spellSlots(type, level, validSpells);
});

function getValidSpells(type, level) {
    //type = "\\b" + type.replace(`\/`, `\/`) + "\\s(\\d)";
    type = `\\b${type.replace(`\/`, `\/`)}\\s(\\d);`
    let regExpType = new RegExp(type, `i`);
    for (const spell of allSpells) {
        if (regExpType.test(spell.spell_level)) {
            // extracts the spell level for the given type, and push to array
            validSpells[spell.spell_level.match(type)[1]].push(spell);
        }
    }
}

// ---------------------
// Calculate Spell Slots

function spellSlots(type, level) {
    let highestSpellLevel;
    let progressionSpeed;
    spellsKnown = [0]
    switch (type) {

        case "sorcerer/wizard":
            highestSpellLevel = 9;
            progressionSpeed = .5;
            spellsKnown[1] = 3 + parseInt($("#ability-mod").val());
            for (let i = 2; i <= level; i++) {

                // Calculates maximum potential spell level
                let maxSpellLevel = Math.ceil(i * progressionSpeed);
                //"initializes" any empty spell levels with 0 after to enable +=2
                spellsKnown.length <= maxSpellLevel ? spellsKnown[maxSpellLevel] = 0 : null;
                // As long as iteration is under 19, 
                (i < 19) ? spellsKnown[maxSpellLevel] += 2 : spellsKnown[9] += 2
            }
            break

        case "magus":
            highestSpellLevel = 6;
            progressionSpeed = (1 / 3)
            spellsKnown[1] = 3 + parseInt($("#ability-mod").val());
            for (let i = 2; i <= level; i++) {
                let maxSpellLevel = Math.ceil(i * progressionSpeed);
                spellsKnown.length <= maxSpellLevel ? spellsKnown[maxSpellLevel] = 0 : null;
                i < 19 ? spellsKnown[maxSpellLevel] += 2 : spellsKnown[highestSpellLevel] += 2
            }
            break
        default:
            break;
    }
    console.log(spellsKnown);
}

function plural(number) {
    switch (number) {
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        default: return number + "th";
    }
}


// Determine number of spells to be picked

// Pick spells 

// Button to lock a spell for the next generator run?

// Spellbook quirk! - augmentation to certain spell schools etc.

// alignment and specialities


// DEPRECATED - BEING REPLACED
//Main function called when the button is pressed
function generateSpells() {

    //Start by resetting variables
    let allCurrentSpells = [];
    let sortedSizes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sortedCurrentSpells = [[], [], [], [], [], [], [], [], [], []];

    // different starting amount of spells if other class is selected. Magus, Alchemist etc.


    let currentSpellbook = [[], [], [], [], [], [], [], [], [], []];

    // i = spell level
    for (let i = 1; i < spellsKnown.length; i++) {
        console.log("spell level: " + i);
        // j = spell#
        for (let j = 0; j < spellsKnown[i]; j++) {
            let r = Math.floor((Math.random() * sortedCurrentSpells[i].length));
            currentSpellbook[i][j] = sortedCurrentSpells[i][r];
            sortedCurrentSpells[i].splice(r, 1);
        }
    }
    console.log(sortedCurrentSpells);

    // i = every spell level 
    for (let i = 1; i < spellsKnown.length; i++) {
        let html = "<p>";
        html += "<strong>" + plural(i) + " level spells</strong><br>";
        for (let j = 0; j < currentSpellbook[i].length; j++) {
            //console.log("i: "+i+", j: "+j);
            html += currentSpellbook[i][j].name + "<br>";
        }
        html += "</p>";
        $("#print").append(html);
    }


    // - for loop is only requiered to loop a number of times eqyal to max spell level
    // - two random spells needs to be extracted from sortedCurrentSpells[][]. first dim is iterator, second is random based on length of the given level

}

            //Constructs text in the DOM

            // 2D-array with spells known by a class (dropdown), with bonus from increased ability score

            // function to create "spellbook" based on given amount.
            // create seperate array based on spell_level (e.g. wizard/sorcerer), and pick out random ones
            // check rules for prohibited schools, and remove them from candidates before the picking process
