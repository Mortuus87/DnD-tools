$(function () {
    console.log("I ran!")
    $("#nav-content").load("../layout/navbar.html");
});

$.getJSON("settlement.json", function (data) {
    randomProperties(data);
});

function random(r) {
    //random number between 0 and n-1
    //input length of array to return random index of given array
    //i.e. input of 10 = output of 0-9
    return Math.floor(Math.random() * r);
}

//Function that returns two properties from a property, and checks that they are different

function randomProperties(data) {

    let html = "";

    html += "<div class='card'>" + "<div class='card-body'>";
    html += "<strong>Cultural climate: </strong>" + data.culturalStatus[random(data.culturalStatus.length)] + "<br>";
    html += "<strong>Ruler status: </strong>" + data.rulerStatus[random(data.rulerStatus.length)] + "<br>";
    html += "<strong>Notable trait: </strong>" + data.notableTrait[random(data.notableTrait.length)] + "<br>";
    html += "<strong>Known for: </strong>" + data.knownFor[random(data.knownFor.length)] + "<br>";
    if (random(3) > 1) {
        html += "<strong>Recent calamity: </strong>" + data.calamity[random(data.calamity.length)] + "<br>";
    } else {
        html += "<strong>Recent good fortune: </strong>" + data.boon[random(data.boon.length)] + "<br>";
    }
    html += "</div>";
    html += "</div>";

    $('#output').append(html);
}