// Room Assignment

function roomassignlistHtml(){
    var result = ''
    var rooms = $.rooms;
    if (rooms){
        for (room in rooms){
            result += '<p>' + rooms[room].roomname + '</p>';
        }
    }
    return result;
}


$(document).on('pageinit', '#mapping', function () {
    // Daten abholen
    console.log("on pageinit mapping");
    $.rooms = [{
        roomname : "Wohnzimmer",
        id:"12345"},
        {
            roomname : "Küche",
            id : "2345"
        }
    ];

});
$(document).on('pagebeforeshow', '#mapping', function () {
    // Click-Events für buttons
    $("#btn-new-room").click(function () {
        // neuen Raum anlegen
        return false;
    });

    $("#btn-save-assignment").click(function () {
        // Save assignment
        $(document).trigger("testevent");
        return false;
    });


    console.log("on pagebeforeshow mapping");
    $('#mappingcontent').empty().append(roomassignlistHtml());
});

$(document).on("testevent", function () {
    alert("Testevent wurde ausgelöst.");
    return false;
})


