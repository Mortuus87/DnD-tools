
//Initiated in event listener, but may be referenced by other functions. Internalize them in mop-up if possible.

const allSpells = [];


//import the json-file, and copies it into allSpells[]
$.getJSON("spellbookGenerator/json/PathfinderSpells.json", function (data) {
    $.each(data.pfSpells, function (key, val) {
        allSpells[key] = val;
    });
});

//ActionListeners:
$("#generate-spells").click(function () {
    let type = $("#class-type").val();
    let level = $("#class-level").val();
    getValidSpells(type, level);
    spellSlots(type, level);
    // generateSpells();
});

function plural(number) {
    switch (number) {
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        default: return number + "th";
    }
}


function getValidSpells(type, level) {
    type = "\\b" + type.replace(`\/`, `\/`) + "\\s\\d";
    let regExpType = new RegExp(type, `i`);
    const validSpells = [];

    for (const spell of allSpells) {
        if (regExpType.test(spell.spell_level)) {
            validSpells.push(spell);
        }
    }

    console.log(validSpells)
}


function spellSlots(type, level) {
    switch (type) {
        case "sorcerer/wizard":
            let spellsKnown = [0];
            console.log("spells known", spellsKnown)
            spellsKnown[1] = 3 + parseInt($("#ability-mod").val());
            for (let i = 2; i <= level; i++) {
                if (isNaN(spellsKnown[Math.ceil(i / 2)]) && spellsKnown.length <= 9) {
                    spellsKnown[Math.ceil(i / 2)] = 0
                }
                if (i < 19) {
                    spellsKnown[Math.ceil(i / 2)] += 2
                } else {
                    spellsKnown[9] += 2
                }
            }
            return console.log(spellsKnown);
            break;

        default:
            break;
    }
}

// Sort spells by spell level



// Determine number of spells to be picked

// Pick spells 

// Button to lock a spell for the next generator run?


// DEPRECATED - BEING REPLACED
//Main function called when the button is pressed
function generateSpells() {
    $("#print").empty();
    //Start by resetting variables
    let allCurrentSpells = [];
    let sortedSizes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sortedCurrentSpells = [[], [], [], [], [], [], [], [], [], []];


    //Starts going through all spells
    for (let spell of allSpells) {

        //Sorts out spells that match the given caster type
        //Now has hold of single spell
        if (spell.spell_level.includes(type)) {
            allCurrentSpells.push(spell);

            //Finds spell level of the current spell, and stores it in l
            let l = spell.spell_level.indexOf(type) + type.length + 1;
            l = spell.spell_level.charAt(l);
            l = parseInt(l);
            sortedCurrentSpells[l][sortedSizes[l]] = spell;
            sortedSizes[l]++;
        }
    }
    //Done with individual spells


    // starting spells known by wizards 3+int mod 1st level spells
    let spellsKnown = [0, 3 + parseInt($("#ability-mod").val())];

    // different starting amount of spells if other class is selected. Magus, Alchemist etc.

    //determines how many spells known a wizard gets through leveling
    for (let i = 2; i <= level; i++) {
        if (isNaN(spellsKnown[Math.ceil(i / 2)]) && spellsKnown.length <= 9) {
            spellsKnown[Math.ceil(i / 2)] = 0
        }
        if (i < 19) {
            spellsKnown[Math.ceil(i / 2)] += 2
        } else {
            spellsKnown[9] += 2
        }
    }
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
