$(function () {
    console.log("I ran!")
    $("#nav-content").load("../layout/navbar.html");
});

var baseArray = [$('#str-base'), $('#dex-base'), $('#con-base'), $('#int-base'), $('#wis-base'), $('#cha-base')];

// Action listeners for input elements and buttons
$('.ability-base, .ability-misc').on('input', abilityCalculate);

$("#point-amount-select").on('change', function () {
    $('#ability-points-available').val(this.value);
    // reset();
    // generate();
});

$('#generate-ability-array').on('click', generate);
$('#reset-7').on('click', function () { reset(7) });
$('#dice-generate').on('click', diceGenerate);


//Action for any edit to ability points
function abilityCalculate() {
    //Makes an array of the cost for each ability
    let cost = [];
    let costTotal = 0;
    //Goes through all abilities to calculate score and modifier
    for (let i = 0; i < baseArray.length; i++) {

        //Prevent NaN error if input is blank - replace NaN with 0
        if (isNaN(parseInt($(".ability-base")[i].value))) { $(".ability-base")[i].value = 7 }

        //Calculate score and modifier
        $(".ability-mod")[i].value = (Math.floor((parseInt($(".ability-base")[i].value - 10) * .5)));

        //Get cost of each value from 7-18
        switch (parseInt($('.ability-base')[i].value)) {
            case 7: cost[i] = -4
                break;
            case 8: cost[i] = -2
                break;
            case 9: cost[i] = -1
                break;
            case 10: cost[i] = 0
                break;
            case 11: cost[i] = 1
                break;
            case 12: cost[i] = 2
                break;
            case 13: cost[i] = 3
                break;
            case 14: cost[i] = 5
                break;
            case 15: cost[i] = 7
                break;
            case 16: cost[i] = 10
                break;
            case 17: cost[i] = 13
                break;
            case 18: cost[i] = 17
                break;
            default: console.log("Something went wrong. Base ability score not between 7 and 18!")
                break;
        }

        //Updates the cost input field with the individual cost for that ability
        $(".ability-cost")[i].value = cost[i];

        //Adds up the total cost for later use
        costTotal += cost[i]
    }

    //Indicate overspending with red text color
    $('#ability-points-used').val(costTotal);
    if (costTotal > $('#ability-points-available').val() || isNaN($('#ability-points-used').val())) {
        $('#ability-points-used').css('color', 'red');
    } else {
        $('#ability-points-used').css('color', '')
    }
    //TODO - Clean up any trailing text in input fields. set val(this.val())?

};

function generate() {
    reset(7);
    let used = $('#ability-points-used');
    let max = $('#ability-points-available');

    //Picks a random ability.
    while (parseInt(used.val()) < parseInt(max.val())) {
        var winner = Math.floor(Math.random() * baseArray.length);
        //If it is a valid pick, it is increased by one
        if (parseInt(baseArray[winner].val()) <= 17) {
            baseArray[winner].val(parseInt(baseArray[winner].val()) + 1);
            abilityCalculate();
        };
        //If the chosen increase brings the total cost above the allowed value, subrtract 1 from a random base ability
        while (parseInt(used.val()) > parseInt(max.val())) {
            winner = Math.floor(Math.random() * baseArray.length);
            baseArray[winner].val(parseInt(baseArray[winner].val()) - 1);
            abilityCalculate();
        };
    };

    //if any attribute is below 7 after generation, try again!
    for (let i = 0; i < baseArray.length; i++) {
        if (parseInt(baseArray[i].val()) < 7) {
            console.log('Error: An attribute was below 7, running generator again');
            generate();
        };
    };
};

function reset(val) {
    //set all base inputs to 10, and recalculate score, mods, and cost
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
    }

    return array;
}
