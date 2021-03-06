// BEGIN LIVE CODE

// predefine the variables.
var activeRoom;
var myLocalMedia;
var myClient;
var tea_list;
var roomName;

var identity;
var token;
var roleid = 'stu';

var status_source = new EventSource("/stream?channel=changed.status");

var classstr;

// Initial live conversation.
$(document).ready(function () {
    "use strict";
    $.when(
        $.getJSON('/token/', function(data) {
            identity = data.identity;
            token = data.token;
            roomName = classid;
            console.log("Ready to get token " + token);
        }),
        $.getJSON("/info/", function (data) {
            console.log("Ready to get info");
            classstr = data.classstr;
            username = data.username;
            tea_list = data.teacher;
        })
    ).then(function(){
        var newlinkstatus = "0";
        updateLinkStatus(roleid, username, newlinkstatus);

        // $("button#btn-begin-class").attr("disabled"," ");
        $("button#btn-begin-class").click(function(){
            var newLinkStatus;
            if ($(this).hasClass("active")){
                $(this).button('reset');
                $(this).removeClass("active");
                console.log("click Class off");
                myDisconneted(activeRoom);
                // newLinkStatus = "0";
                // updateLinkStatus("stu", username, newLinkStatus);
            }else{
                $(this).button('loading');
                console.log("click Class on");
                myConnected(token, roomName);
                // newLinkStatus = "2";
                // updateLinkStatus("stu", username, newLinkStatus);
            }

        });

        var myeventtype = "newtealinkstatus"+classstr;
        console.log(myeventtype);
        status_source.addEventListener(myeventtype,function(event){
            // "use strict";
            var data = JSON.parse(event.data);
            tealinkstatus_dict = data.tealinkstatus;
            console.log(tealinkstatus_dict);
        }, false);
    });

    $("div#livelist").click(function(event){
        event.stopPropagation();
        event.preventDefault();
        showMediaPannel(event);
    });

});


function myConnected(token, roomName){
    "use strict";
    console.log("Start to connect to room");
    console.log(token);
    myClient = new Twilio.Video.Client(token);
    myClient.connect({ to: roomName}).then(roomJoined,
        function(error) {
            console.log('Could not connect to Twilio: ' + error.message);
            var newlinkstatus = "0";
            updateLinkStatus(roleid, username, newlinkstatus);
            $("button#btn-begin-class").button('reset');
            $("button#btn-begin-class").removeClass('active');
    });
}

function myDisconneted(activeRoom){
    "use strict";
    if (activeRoom) {
        console.log(activeRoom.localParticipant);
        activeRoom.disconnect();
        activeRoom.localParticipant.media.detach();
        $('div#media-' + activeRoom.localParticipant.identity + ' >i').removeClass("hidden");
        // activeRoom.localParticipant.media.stop();
        activeRoom = null;
    }else{
        console.log("activeRoom is null");
    }
    var newlinkstatus = "0";
    updateLinkStatus(roleid, username, newlinkstatus);
    $("button#btn-begin-class").button('reset');
    $("button#btn-begin-class").removeClass('active');

}

function roomJoined(room) {
    "use strict";
    activeRoom = room;

    console.log("Joined as '" + identity + "'");

    var newlinkstatus = "2";
    updateLinkStatus(roleid, username, newlinkstatus);
    $("button#btn-begin-class").button('complete');
    $("button#btn-begin-class").addClass('active');

    if (!myLocalMedia) {
        myLocalMedia = showLocalMedia();
    }

    $('div#media-' + activeRoom.localParticipant.identity).click(function(){
        console.log(activeRoom.localParticipant.media);
        // $("div#media-dialog").empty();
        // $("div#media-dialog").removeClass("hidden");
        // activeRoom.localParticipant.media.unmute();
        activeRoom.localParticipant.media.attach("div#media-dialog");
        $("div#media-dialog").dialog("open");
    });

    // room.participants.forEach(function(participant) {
    //     console.log("participant is " + participant.media);
    //     if (participant.identity!=="???"){
    //         console.log("Already in Room: '" + participant.identity + "'");
    //         participantMedia(participant);
    //     }
    // });
    room.participants.forEach(function(participant) {
        console.log(participant);
        for (var ti in tea_list) {
            if (tea_list.hasOwnProperty(ti)){
                console.log(tea_list[ti]);
                console.log(participant.identity);
                if (participant.identity === tea_list[ti]){
                    console.log("Already in Room: '" + participant.identity + "'");
                    participantMedia(participant);
                }
            }
        }
    });


    // When a participant joins, draw their video on screen
    room.on('participantConnected', function (participant) {
        console.log("Joining: '" + participant.identity + "'");
        roomParConnected(participant);
    });

    // When a participant disconnects, note in log
    room.on('participantDisconnected', function (participant) {
        console.log("Participant '" + participant.identity + "' left the room");
        roomParDisconnected(participant);
    });

    // When the conversation ends, stop capturing local video
    room.on('disconnected', function () {
        console.log('Left');
        myDisconneted(room);
    });
}


function participantMedia(participant){
    "use strict";
    $('div#media-' + participant.identity + ' >i').addClass("hidden");
    participant.media.attach('div#media-' + participant.identity);
    // participant.media.mute();
    $('div#media-' + participant.identity).click(function(){
        console.log(participant.media);
        // $("div#media-dialog").empty();
        // $("div#media-dialog").removeClass("hidden");
        // participant.media.unmute();
        participant.media.attach("div#media-dialog");
        $("div#media-dialog").dialog("open");
    });

}

function roomParConnected(participant){
    "use strict";
    if (participant.identity!=="???") {
        participantMedia(participant);

        participant.on('disconnected', function (participant) {
            roomParDisconnected(participant);
        });
    }
}

function roomParDisconnected(participant){
    "use strict";
    var newlinkstatus = "0";
    updateLinkStatus(roleid, username, newlinkstatus);
    // $("button#btn-begin-class").button('reset');
    // $("button#btn-begin-class").removeClass('active');
    $('div#media-' + participant.identity + ' >i').removeClass("hidden");
    participant.media.detach();
    // participant.media.stop();
    participant = null;
}

function closeLocalMedia(){
    "use strict";
    console.log("Stop Local Media");
    room = activeRoom;
    room.localParticipant.media.detach();
    // room.localParticipant.media.stop();
    // if (myLocalMedia) {
    //     myLocalMedia.detach();
    //     myLocalMedia.stop();
    // }
}

function showLocalMedia(){
    "use strict";
    console.log("Start to preview Local Media");
    var room = activeRoom;
    if (room) {
        $("div#media-" + username + " >i").addClass("hidden");
        // room.localParticipant.media.unmute();
        room.localParticipant.media.attach("div#media-"+username);
    }

}






// END LIVE CODE


// $.getJSON("/info/", function (data) {
//     "use strict";
//     classstr = data.classstr;
// }).then(function(){
//     "use strict";
//     var myeventtype = "newtealinkstatus"+classstr;
//     console.log(myeventtype);
//     tealink_source.addEventListener(myeventtype,function(event){
//         "use strict";
//         var data = JSON.parse(event.data);
//         tealinkstatus_dict = data.tealinkstatus;
//         console.log(tealinkstatus_dict);
//     }, false);
// });