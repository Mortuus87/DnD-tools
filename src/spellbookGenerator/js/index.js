
// Global variables

const allSpells = []; // Holds the full list of all spells.
let validSpells; // Holds valdid spells for a given class. Generated with the button.
let spellsKnown = []; // Number of each spell level the chosen class has.
let spellbook;

//import the json-file, and copies it into allSpells[]
$.getJSON("spellbookGenerator/json/PathfinderSpells.json", function (data) {
    $.each(data.pfSpells, function (key, val) {
        allSpells[key] = val;
    });
});


//ActionListeners:
$("#generate-spells").click(function (e) {
    e.preventDefault();

    let type = $("#class-type").val();
    let level = $("#class-level").val();
    generateSpellSlots(type, level);

    // following could be an onChange-event on drop down menu
    validSpells = getValidSpells(type);
    console.log("valid spells", validSpells)
    // end

    spellbook = fillSpellbook();
    console.log("spellbook", spellbook)
    printSpells();
});

function empty1x10Array() {
    return [[], [], [], [], [], [], [], [], [], []]
};

function getValidSpells(type) {
    validSpells = empty1x10Array();
    let regExpType = new RegExp(`\\b${type.replace(`\/`, `\/`)}\\s(\\d)`, `i`);
    for (const spell of allSpells) {
        if (regExpType.test(spell.spell_level)) {
            validSpells[spell.spell_level.match(regExpType)[1]].push(spell);
        }
    }
    console.log("returning", validSpells)
    return validSpells;
}

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
        case "cleric/oracle":
            classSpellSlots(9, .5)
        default:
            break;
    }

    function classSpellSlots(highestSpellLevel, progressionSpeed) {
        spellsKnown[1] = 3 + parseInt($("#ability-mod").val());
        for (let i = 2; i <= level; i++) {
            let currentHighestSpellLevel = Math.ceil((i) * progressionSpeed);

            // use validSpells.length to fill with zeros?
            (currentHighestSpellLevel > highestSpellLevel) ? currentHighestSpellLevel = highestSpellLevel : null;
            isNaN(spellsKnown[currentHighestSpellLevel]) ? spellsKnown[currentHighestSpellLevel] = 0 : null;
            // end of proposed change    

            spellsKnown[currentHighestSpellLevel] += 2;
        }
    }

}

function fillSpellbook() {
    spellbook = empty1x10Array();
    for (let i = 0; i < spellsKnown.length; i++) {
        // 0 in 0th slot = all cantrips?
        for (let j = 0; j < spellsKnown[i]; j++) {
            let r = Math.floor((Math.random() * validSpells[i].length));
            spellbook[i].push(validSpells[i][r])
            validSpells[i].splice(r, 1)
        }
    }
    return spellbook;
}

function plural(number) {
    switch (number) {
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        default: return number + "th";
    }
}

function printSpells() {
    $("#output").empty();
    for (let i = 0; i < spellbook.length; i++) {
        if (spellbook[i].length != 0) {
            let html = `
            <p>
            <strong>${plural(i)}level spells</strong><br>
            `
            for (const spell of spellbook[i]) {
                html += `${spell.name}<br>`
            }
            html += `</p>`;
            $("#output").append(html);
        }
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

    // different starting amount of spells if other class is selected. Magus, Alchemist etc.


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
