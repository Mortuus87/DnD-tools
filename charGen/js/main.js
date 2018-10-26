$(function () {
    $("#nav-content").load("../layout/navbar.html");
});

$.getJSON("npcTables.json", function (data) {
    randomProperties(data);
});

function random(r) {
    //random number between 0 and n-1
    //input length of array to return random index of given array
    //i.e. input of 10 = output of 0-9
    return Math.floor(Math.random() * r);
}

function randomProperties(data) {

    let randAbilityHigh = random(data.abilityHigh.length);
    let randAbilityLow = random(data.abilityLow.length);
    let alignment = random(9); // 9 is the number of alignments used
    while (randAbilityHigh == randAbilityLow) { randAbilityLow = random(data.abilityLow.length) } //Ensure that strength and weakness is not the same

    let html = "";
    html += "<strong>Apperance: </strong>" + data.apperance[random(data.apperance.length)] + "<br>";
    html += "<strong>Strong attribute: </strong>" + data.abilityHigh[randAbilityHigh] + "<br>";
    html += "<strong>Weak attribute: </strong>" + data.abilityLow[randAbilityLow] + "<br>";
    html += "<strong>Talent: </strong>" + data.talent[random(data.talent.length)] + "<br>";
    html += "<strong>Mannerism: </strong>" + data.mannerism[random(data.mannerism.length)] + "<br>";
    html += "<strong>Interaction trait: </strong>" + data.interactionTrait[random(data.interactionTrait.length)] + "<br>";
    html += determineAlignment(data, alignment) + "<br>";
    html += "<strong>Bond: </strong>" + determineBond(data) + "<br>";
    html += "<strong>Flaw or secret: </strong>" + data.secret[random(data.secret.length)] + "<br>";
    $('#output').append(html);

    function determineBond() {
        let r1 = random(data.bond.length + 1);
        let r2 = random(data.bond.length);
        let r3 = random(data.bond.length);

        while (r3 == r2) {
            r2 = random(data.bond.length - 1)
        }
        if (r1 < data.bond.length) {
            return data.bond[r2];
        } else {
            return data.bond[r2] + "<br><strong>Additional bond: </strong>" + data.bond[r3];
        }
    };
    function determineAlignment() {
        // the 9 is hardcoded based on number of possible alignments
        switch (alignment) {
            case 0:
                return "<strong>Lawful good: </strong>" + data.ideal.lawful[random(data.ideal.lawful.length)] + " and " + data.ideal.good[random(data.ideal.good.length)];
                break;
            case 1:
                return "<strong>Neutral good: </strong>" + data.ideal.neutral[random(data.ideal.neutral.length)] + " and " + data.ideal.good[random(data.ideal.good.length)];
                break;
            case 2:
                return "<strong>Chaotic good: </strong>" + data.ideal.chaotic[random(data.ideal.chaotic.length)] + " and " + data.ideal.good[random(data.ideal.good.length)];
                break;
            case 3:
                return "<strong>Lawful neutral: </strong>" + data.ideal.lawful[random(data.ideal.lawful.length)] + " and " + data.ideal.neutral[random(data.ideal.neutral.length)];
                break;
            case 4:
                return "<strong>True neutral: </strong>" + data.ideal.neutral[random(data.ideal.neutral.length)] + " and " + data.ideal.other[random(data.ideal.other.length)];
                break;
            case 5:
                return "<strong>Chaotic neutral: </strong>" + data.ideal.chaotic[random(data.ideal.chaotic.length)] + " and " + data.ideal.neutral[random(data.ideal.neutral.length)];
                break;
            case 6:
                return "<strong>Lawful evil: </strong>" + data.ideal.lawful[random(data.ideal.lawful.length)] + " and " + data.ideal.evil[random(data.ideal.evil.length)];
                break;
            case 7:
                return "<strong>Neutral evil: </strong>" + data.ideal.neutral[random(data.ideal.neutral.length)] + " and " + data.ideal.evil[random(data.ideal.evil.length)];
                break;
            case 8:
                return "<strong>Chaotic evil: </strong>" + data.ideal.chaotic[random(data.ideal.chaotic.length)] + " and " + data.ideal.evil[random(data.ideal.evil.length)];
                break;
            default: return "Error in alignment ideal picker";
                break;
        }
    };

} 