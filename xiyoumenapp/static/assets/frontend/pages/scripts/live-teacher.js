// BEGIN LIVE CODE

// predefine the variables.

var activeRoom;
var myLocalMedia;
var myClient;
var roomName;

var identity;
var token;
var roleid = 'tea';

var status_source = new EventSource("/stream?channel=changed.status");



// Initial live conversation.
$(document).ready(function () {
    "use strict";
    $.getJSON("/info/", function (data) {
        console.log("Ready to get info");
        classstr = data.classstr;
        username = data.username;
    }).then(function(){

        var newlinkstatus = "0";
        updateLinkStatus(roleid, username, newlinkstatus);

        var myeventlinktea = "newtealinkstatus"+classstr;
        var myeventlinkstu = "newstulinkstatus"+classstr;

        status_source.addEventListener(myeventlinktea,function(event){
            // "use strict";
            var data = JSON.parse(event.data);
            tealinkstatus_dict = data.tealinkstatus;
            SetStatusBadgeEl("span#num_teainfo", tealinkstatus_dict);

            console.log(tealinkstatus_dict);
        }, false);


        status_source.addEventListener(myeventlinkstu,function(event){
            // "use strict";
            var data = JSON.parse(event.data);
            stulinkstatus_dict = data.stulinkstatus;
            SetStatusBadgeEl("span#num_stuinfo", stulinkstatus_dict);

            console.log(stulinkstatus_dict);
        }, false);

    });

    $.getJSON('/token/', function(data) {
        identity = data.identity;
        token = data.token;
        roomName = classid;
        console.log("Ready to get token " + token);
    }).then(function(){
        $("button#btn-begin-class").click(function(){
            var newLinkStatus;
            if ($(this).hasClass("active")){
                $(this).button('reset');
                $(this).removeClass("active");
                console.log("click Class off");
                myDisconneted(activeRoom);
                // newLinkStatus = "0";
                // updateLinkStatus("tea", username, newLinkStatus);
            }else{
                $(this).button('loading');
                console.log("click Class on");
                // newLinkStatus = "2";
                // updateLinkStatus("tea", username, newLinkStatus);
                myConnected(token, roomName);
            }

        });

    });

});


// Activity log
// function log(message) {
//     "use strict";
//     $("span#log-content").text = message;
// }


function myConnected(token, roomName){
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
    if (activeRoom) {
        console.log(activeRoom.localParticipant);
        activeRoom.disconnect();
        activeRoom.localParticipant.media.detach();
        $('div#media-' + activeRoom.localParticipant.identity + ' >i').removeClass("hidden");
        // activeRoom.localParticipant.media.stop();
        activeRoom = null;
        // activeRoom.localParticipant.media.detach();
        // // activeRoom.localParticipant.media.stop();
        // activeRoom = null;
    }else{
        console.log("activeRoom is null");
        var newlinkstatus = "0";
        updateLinkStatus(roleid, username, newlinkstatus);
        $("button#btn-begin-class").button('reset');
        $("button#btn-begin-class").removeClass('active');
    }
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
        $("div#media-dialog").empty();
        $("div#media-dialog").removeClass("hidden");
        activeRoom.localParticipant.media.unmute();
        activeRoom.localParticipant.media.attach("div#media-dialog");
        $("div#media-dialog").show();
    });

    room.participants.forEach(function(participant) {
        console.log("participant is " + participant);
        if (participant.identity!=="???"){
            console.log("Already in Room: '" + participant.identity + "'");
            participantMedia(participant);
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
    console.log(participant.media);
    $('div#media-' + participant.identity + ' >i').addClass("hidden");
    participant.media.attach('div#media-' + participant.identity);
    participant.media.mute();
    $('div#media-' + participant.identity).click(function(){
        $("div#media-dialog").empty();
        $("div#media-dialog").removeClass("hidden");
        participant.media.unmute();
        participant.media.attach("div#media-dialog");
        $("div#media-dialog").show();
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
    updateLinkStatus('stu', participant.identity, newlinkstatus);
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
        // room.localParticipant.media.attach('#local-media');
        // myLocalMedia = room.localParticipant.media;
        // myLocalMedia.attach('div#local-media');
        $("div#media-" + username + " >i").addClass("hidden");
        room.localParticipant.media.unmute();
        room.localParticipant.media.attach("div#media-"+username);
        // myLocalMedia.attach("div#media-"+username);
    }
    // else{
    //     myLocalMedia = new Twilio.Video.LocalMedia();
    //     Twilio.Video.getUserMedia().then(
    //         function (mediaStream) {
    //           myLocalMedia.addStream(mediaStream);
    //           $("div#media-" + username + " >i").addClass("hidden");
    //           myLocalMedia.attach("div#media-"+username);
    //           myLocalMedia.attach("div#local-media");
    //         },
    //         function (error) {
    //           console.error('Unable to access local media', error);
    //           log('Unable to access Camera and Microphone');
    //         });
    // }
}










// END LIVE CODE









// // Set Icon Ready status of teacher or student
// function setIconReadyEl(userinfo) {
//     "use strict";
//     ($("#media-" + userinfo).parent()).css("background", "#d73d04");
//     $("#media-" + userinfo + " i").css("color", "#fff");
//     $("#media-" + userinfo + " p").css("color", "#fff");
//     ($("#media-" + userinfo).next()).css("color", "#fff");
// }


// // Set Icon Connected Status of Teacher.
// function setIconConnectedEl(userinfo, roleid) {
//     "use strict";
//     var rolecolor;
//     if (roleid === "tea") {rolecolor = rolecolor_tea;}
//     if (roleid === "ass") {rolecolor = rolecolor_ass;}
//     if (roleid === "stu") {rolecolor = rolecolor_stu;}
//     ($("#media-" + userinfo).parent()).css("background", rolecolor);
//     $("#media-" + userinfo + " i").css("color", "#fff");
//     $("#media-" + userinfo + " p").css("color", "#fff");
//     ($("#media-" + userinfo).next()).css("color", "#fff");
// }

// // Set Icon Disconnected status of teacher
// function setIconDisconnectedEl(userinfo, roleid) {
//     "use strict";
//     var rolecolor;
//     if (roleid === "tea") {rolecolor = rolecolor_tea;}
//     if (roleid === "ass") {rolecolor = rolecolor_ass;}
//     if (roleid === "stu") {rolecolor = rolecolor_stu;}
//     ($("#media-" + userinfo).parent()).css("background", "#fff");
//     $("#media-" + userinfo + " i").css("color", rolecolor);
//     $("#media-" + userinfo + " p").css("color", rolecolor);
//     ($("#media-" + userinfo).next()).css("color", rolecolor);
// }



// // Set button disabled status of student
// function setButtonDisabledEl(id_name, btntype) {
//     "use strict";
//     var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
//     $(id_btn).attr("disabled", "disabled");
//     $(id_btn).addClass("btn-default");
//     $(id_btn).removeClass("btn-primary");
//     $(id_btn).removeClass("btn-success");
//     $(id_btn).removeClass("btn-info");
// }

// // Set button disabled status of student
// function setButtonEnabledEl(id_name, btntype) {
//     "use strict";
//     // var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
//     var id_btn = "#btn-"+btntype+"-"+id_name;
//     $(id_btn).removeAttr("disabled");
//     $(id_btn).removeClass("btn-default");
//     if (btntype === "link") {
//         $(id_btn).addClass("btn-primary");
//     }
//     if (btntype === "video") {
//         $(id_btn).addClass("btn-success");
//     }
//     if (btntype === "sound") {
//         $(id_btn).addClass("btn-info");
//     }
// }

// // Set button active status of student
// function setButtonOffEl(id_name, btntype) {
//     "use strict";
//     // var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
//     var id_btn = "#btn-"+btntype+"-"+id_name;
//     $(id_btn).removeClass("active");
//     console.log($(id_btn).hasClass("active"));
// }

// // Set button ready status of student
// function setButtonOnEl(id_name, btntype) {
//     "use strict";
//     // var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
//     var id_btn = "#btn-"+btntype+"-"+id_name;
//     $(id_btn).addClass("active");
//     console.log($(id_btn).hasClass("active"));
// }



        // status_source.addEventListener(myeventvideostu,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     stuvideostatus_dict = data.stuvideostatus;
        //     var stuvideostatus_list0 = stuvideostatus_dict[0];
        //     for (var ti in stuvideostatus_list0) {
        //         if (stuvideostatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-video-" + stuvideostatus_list0[ti]).button('reset');
        //             $("button#btn-video-" + stuvideostatus_list0[ti]).removeClass('active');
        //         }
        //     }

        //     var stuvideostatus_list2 = stuvideostatus_dict[2];
        //     for (var ti in stuvideostatus_list2) {
        //         if (stuvideostatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-video-" + stuvideostatus_list2[ti]).button('complete');
        //             $("button#btn-video-" + stuvideostatus_list2[ti]).addClass('active');
        //         }
        //     }
        //     console.log(stuvideostatus_dict);
        // }, false);

        // status_source.addEventListener(myeventsoundstu,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     stusoundstatus_dict = data.stusoundstatus;
        //     // $("#studentlist").trigger(e_stusound);
        //     var stusoundstatus_list0 = stusoundstatus_dict[0];
        //     for (var ti in stusoundstatus_list0) {
        //         if (stusoundstatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-sound-" + stusoundstatus_list0[ti]).button('reset');
        //             $("button#btn-sound-" + stusoundstatus_list0[ti]).removeClass('active');
        //         }
        //     }

        //     var stusoundstatus_list2 = stusoundstatus_dict[2];
        //     for (var ti in stusoundstatus_list2) {
        //         if (stusoundstatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-sound-" + stusoundstatus_list2[ti]).button('complete');
        //             $("button#btn-sound-" + stusoundstatus_list2[ti]).addClass('active');
        //         }
        //     }
        //     console.log(stusoundstatus_dict);
        // }, false);


        // status_source.addEventListener(myeventlinkass,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     asslinkstatus_dict = data.asslinkstatus;
        //     // $("#assistantlist").trigger(e_asslink);
        //     var asslinkstatus_list0 = asslinkstatus_dict[0];
        //     for (var ti in asslinkstatus_list0) {
        //         if (asslinkstatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-link-" + asslinkstatus_list0[ti]).button('reset');
        //             $("button#btn-link-" + asslinkstatus_list0[ti]).removeClass('active');
        //         }
        //     }

        //     var asslinkstatus_list2 = asslinkstatus_dict[2];
        //     for (var ti in asslinkstatus_list2) {
        //         if (asslinkstatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-link-" + asslinkstatus_list2[ti]).button('complete');
        //             $("button#btn-link-" + asslinkstatus_list2[ti]).addClass('active');
        //         }
        //     }
        //     console.log(asslinkstatus_dict);
        // }, false);

        // status_source.addEventListener(myeventvideoass,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     assvideostatus_dict = data.assvideostatus;
        //     // $("#assistantlist").trigger(e_assvideo);
        //     var assvideostatus_list0 = assvideostatus_dict[0];
        //     for (var ti in assvideostatus_list0) {
        //         if (assvideostatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-video-" + assvideostatus_list0[ti]).button('reset');
        //             $("button#btn-video-" + assvideostatus_list0[ti]).removeClass('active');
        //         }
        //     }

        //     var assvideostatus_list2 = assvideostatus_dict[2];
        //     for (var ti in assvideostatus_list2) {
        //         if (assvideostatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-video-" + assvideostatus_list2[ti]).button('complete');
        //             $("button#btn-video-" + assvideostatus_list2[ti]).addClass('active');
        //         }
        //     }
        //     console.log(assvideostatus_dict);
        // }, false);

        // status_source.addEventListener(myeventsoundass,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     asssoundstatus_dict = data.asssoundstatus;
        //     // $("#assistantlist").trigger(e_asssound);
        //     var asssoundstatus_list0 = asssoundstatus_dict[0];
        //     for (var ti in asssoundstatus_list0) {
        //         if (asssoundstatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-sound-" + asssoundstatus_list0[ti]).button('reset');
        //             $("button#btn-sound-" + asssoundstatus_list0[ti]).removeClass('active');
        //         }
        //     }

        //     var asssoundstatus_list2 = asssoundstatus_dict[2];
        //     for (var ti in asssoundstatus_list2) {
        //         if (asssoundstatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-sound-" + asssoundstatus_list2[ti]).button('complete');
        //             $("button#btn-sound-" + asssoundstatus_list2[ti]).addClass('active');
        //         }
        //     }
        //     console.log(asssoundstatus_dict);
        // }, false);


        // status_source.addEventListener(myeventvideotea,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     teavideostatus_dict = data.teavideostatus;
        //     var teavideostatus_list0 = teavideostatus_dict[0];
        //     for (var ti in teavideostatus_list0) {
        //         if (teavideostatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-video-" + teavideostatus_list0[ti]).button('reset');
        //             $("button#btn-video-" + teavideostatus_list0[ti]).removeClass("active");
        //             closeLocalMedia();
        //         }
        //     }
        //     var teavideostatus_list2 = teavideostatus_dict[2];
        //     for (var ti in teavideostatus_list2) {
        //         if (teavideostatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-video-" + teavideostatus_list2[ti]).button('complete');
        //             $("button#btn-video-" + teavideostatus_list2[ti]).addClass("active");
        //             showLocalMedia();
        //         }
        //     }
        //     console.log(teavideostatus_dict);
        // }, false);

        // status_source.addEventListener(myeventsoundtea,function(event){
        //     // "use strict";
        //     var data = JSON.parse(event.data);
        //     teasoundstatus_dict = data.teasoundstatus;

        //     var teasoundstatus_list0 = teasoundstatus_dict[0];
        //     for (var ti in teasoundstatus_list0) {
        //         if (teasoundstatus_list0.hasOwnProperty(ti)){
        //             $("button#btn-sound-" + teasoundstatus_list0[ti]).button('reset');
        //             $("button#btn-sound-" + teasoundstatus_list0[ti]).removeClass('active');
        //         }
        //     }

        //     var teasoundstatus_list2 = teasoundstatus_dict[2];
        //     for (var ti in teasoundstatus_list2) {
        //         if (teasoundstatus_list2.hasOwnProperty(ti)){
        //             $("button#btn-sound-" + teasoundstatus_list2[ti]).button('complete');
        //             $("button#btn-sound-" + teasoundstatus_list2[ti]).addClass('active');
        //         }
        //     }
        //     console.log(teasoundstatus_dict);
        // }, false);



// Change Icon display according to linkstatus;
// function changeLinkStatusIcon(roleid){
//     "use strict";
//     var linkstatus_dict;
//     // console.log(tealinkstatus_dict);
//     if (roleid==='tea') {linkstatus_dict=tealinkstatus_dict;}
//     if (roleid==='ass') {linkstatus_dict=asslinkstatus_dict;}
//     if (roleid==='stu') {linkstatus_dict=stulinkstatus_dict;}
//     // console.log("span#num_"+roleid+"info");
//     SetStatusBadgeEl("span#num_"+roleid+"info", linkstatus_dict);

//     // status "0" means disconnected
//     for (var l0i in linkstatus_dict['0']) {
//         if (linkstatus_dict['0'].hasOwnProperty(l0i)){
//             if (linkstatus_dict['0'][l0i]===username) {
//                 setIconDisconnectedEl(linkstatus_dict['0'][l0i], roleid);
//                 setButtonDisabledEl("", "link");
//                 setButtonDisabledEl("", "video");
//                 setButtonDisabledEl("", "sound");
//                 setButtonEnabledEl(linkstatus_dict['0'][l0i], "link");
//                 $("#btn-link-"+username).button('reset');
//             }else{
//                 setIconDisconnectedEl(linkstatus_dict['0'][l0i], roleid);
//                 setButtonEnabledEl(linkstatus_dict['0'][l0i], "link");
//                 setButtonDisabledEl(linkstatus_dict['0'][l0i], "video");
//                 setButtonDisabledEl(linkstatus_dict['0'][l0i], "sound");
//             }
//         }
//     }

//     // status "1" means ready
//     for (var l1i in linkstatus_dict['1']) {
//         if (linkstatus_dict['1'].hasOwnProperty(l1i)){
//             setIconReadyEl(linkstatus_dict['1'][l1i]);
//             setButtonOffEl(linkstatus_dict['1'][l1i], "link");
//             setButtonEnabledEl(linkstatus_dict['1'][l1i], "link");
//             setButtonDisabledEl(linkstatus_dict['1'][l1i], "video");
//             setButtonDisabledEl(linkstatus_dict['1'][l1i], "sound");
//             $("#btn-link-"+username).button('reset');
//         }
//     }

//     // status "2" means connected
//     for (var l2i in linkstatus_dict['2']) {
//         if (linkstatus_dict['2'].hasOwnProperty(l2i)){
//             setIconConnectedEl(linkstatus_dict['2'][l2i], roleid);
//             setButtonOnEl(linkstatus_dict['2'][l2i], "link");
//             setButtonEnabledEl(linkstatus_dict['2'][l2i], "link");
//             setButtonEnabledEl(linkstatus_dict['2'][l2i], "video");
//             setButtonEnabledEl(linkstatus_dict['2'][l2i], "sound");
//             $("#btn-link-"+username).button('complete');
//         }
//     }

// }


// // Change Icon display according to video status;
// function changeVideoStatusButton(roleid){
//     "use strict";
//     var videostatus_dict;
//     // console.log(tealinkstatus_dict);
//     if (roleid==='tea') {videostatus_dict=teavideostatus_dict;}
//     if (roleid==='ass') {videostatus_dict=assvideostatus_dict;}
//     if (roleid==='stu') {videostatus_dict=stuvideostatus_dict;}

//     // status "0" means disconnected
//     for (var l0i in videostatus_dict['0']) {
//         if (videostatus_dict['0'].hasOwnProperty(l0i)){
//             setButtonDisabledEl(videostatus_dict['0'][l0i], "video");
//         }
//     }

//     // status "1" means ready
//     for (var l1i in videostatus_dict['1']) {
//         if (videostatus_dict['1'].hasOwnProperty(l1i)){
//             setButtonEnabledEl(videostatus_dict['1'][l1i], "video");
//             setButtonOffEl(videostatus_dict['1'][l1i], "video");
//         }
//     }

//     // status "2" means connected
//     for (var l2i in videostatus_dict['2']) {
//         if (videostatus_dict['2'].hasOwnProperty(l2i)){
//             setButtonEnabledEl(videostatus_dict['2'][l2i], "video");
//             setButtonOnEl(videostatus_dict['2'][l2i], "video");
//         }
//     }

// }


// // Change Icon display according to sound status;
// function changeSoundStatusButton(roleid){
//     "use strict";
//     var soundstatus_dict;
//     // console.log(tealinkstatus_dict);
//     if (roleid==='tea') {soundstatus_dict=teasoundstatus_dict;}
//     if (roleid==='ass') {soundstatus_dict=asssoundstatus_dict;}
//     if (roleid==='stu') {soundstatus_dict=stusoundstatus_dict;}

//     // status "0" means disconnected
//     for (var l0i in soundstatus_dict['0']) {
//         if (soundstatus_dict['0'].hasOwnProperty(l0i)){
//             setButtonDisabledEl(soundstatus_dict['0'][l0i], "sound");
//         }
//     }

//     // status "1" means ready
//     for (var l1i in soundstatus_dict['1']) {
//         if (soundstatus_dict['1'].hasOwnProperty(l1i)){
//             setButtonEnabledEl(soundstatus_dict['1'][l1i], "sound");
//             setButtonOffEl(soundstatus_dict['1'][l1i], "sound");
//         }
//     }

//     // status "2" means connected
//     for (var l2i in soundstatus_dict['2']) {
//         if (soundstatus_dict['2'].hasOwnProperty(l2i)){
//             setButtonEnabledEl(soundstatus_dict['2'][l2i], "sound");
//             setButtonOnEl(soundstatus_dict['2'][l2i], "sound");
//         }
//     }

// }





























// // Begin to take class with button "btn-begin-class" click
// $("button#btn-begin-class").click(function(){
//     "use strict";
//     if ($(this).hasClass("active")){

//         if (activeRoom){
//             myDisconneted(activeRoom);
//             setBeginClassButtonOnEl();
//         }

//     }else{
//         $(this).button('loading');

//         setBeginClassButtonOffEl();

//         if (activeRoom){
//             previewLocalMedia();
//             $("button#btn-begin-class").button('complete');
//         }else{
//             myConnected(token, roomName);
//             $("button#btn-begin-class").button('complete');
//         }

//     }

// });


// var tea_source;
// var stu_source;
// var ass_source;

// var tea_source = new EventSource("/stream?channel=changed.teastatus");
// var stu_source = new EventSource("/stream?channel=changed.stustatus");
// var ass_source = new EventSource("/stream?channel=changed.assstatus");
//
//
// var e_tealink = jQuery.Event("changed.tealinkstatus");
// var e_teavideo = jQuery.Event("changed.teavideostatus");
// var e_teasound = jQuery.Event("changed.teasoundstatus");

// var e_asslink = jQuery.Event("changed.asslinkstatus");
// var e_assvideo = jQuery.Event("changed.assvideostatus");
// var e_asssound = jQuery.Event("changed.asssoundstatus");

// var e_stulink = jQuery.Event("changed.stulinkstatus");
// var e_stuvideo = jQuery.Event("changed.stuvideostatus");
// var e_stusound = jQuery.Event("changed.stusoundstatus");

    //     // listenning on changed.tealinkstatus event for teacher.
    // $("#teacherlist").on("changed.tealinkstatus", function(){
    //     console.log("change link status");
    //     changeLinkStatusIcon("tea");
    // });

    // // listenning on changed.teavideostatus event for teacher.
    // $("#teacherlist").on("changed.teavideostatus", function(){
    //     changeVideoStatusButton("tea");
    // });

    // // listenning on changed.teasoundstatus event for teacher.
    // $("#teacherlist").on("changed.teasoundstatus", function(){
    //     changeSoundStatusButton("tea");
    // });


    // // listenning on changed.asslinkstatus event for assistant.
    // $("#assistantlist").on("changed.asslinkstatus", function(){
    //     changeLinkStatusIcon("ass");
    // });

    // // listenning on changed.assvideostatus event for assistant.
    // $("#assistantlist").on("changed.assvideostatus", function(){
    //     changeVideoStatusButton("ass");
    // });

    // // listenning on changed.asssoundstatus event for assistant.
    // $("#assistantlist").on("changed.asssoundstatus", function(){
    //     changeSoundStatusButton("ass");
    // });


    // // listenning on changed.stulinkstatus event for student.
    // $("#studentlist").on("changed.stulinkstatus", function(){
    //     changeLinkStatusIcon("stu");
    // });

    // // listenning on changed.stuvideostatus event for student.
    // $("#studentlist").on("changed.stuvideostatus", function(){
    //     changeVideoStatusButton("stu");
    // });

    // // listenning on changed.stusoundstatus event for student.
    // $("#studentlist").on("changed.stusoundstatus", function(){
    //     changeSoundStatusButton("stu");
    // });











// window.onload = function(){
//     "use strict";


// };


// function roomJoined(room) {
//     "use strict";
//     activeRoom = room;

//     log("Joined as '" + identity + "'");
//     console.log("Joined as '" + identity + "'");
//     var newlinkstatus = "2";
//     updateLinkStatus(roleid, username, newlinkstatus);
//     console.log(roleid);
//     console.log(username);

//       // Draw local video, if not already previewing
//     if (!myLocalMedia) {
//         previewMedia();
//     }

//     room.participants.forEach(function(participant) {
//         console.log(participant.identity);
//         if (participant.identity!=="???") {
//             log("Already in Room: '" + participant.identity + "'");
//             $('div#media-' + participant.identity + ' >i').addClass("hidden");
//             participant.media.attach('div#media-' + participant.identity);
//             $('div#media-' + participant.identity).click(function(){
//                 $('div#remote-media').empty();
//                 participant.media.attach('div#remote-media');
//             });
//             var newlinkstatus = "2";
//             var roleid = 'stu';
//             var username = participant.identity;
//             updateLinkStatus(roleid, username, newlinkstatus);
//         }
//     });

//     // When a participant joins, draw their video on screen
//     room.on('participantConnected', function (participant) {
//         roomParConnected(participant);
//         // log("Joining: '" + participant.identity + "'");
//         // $('div#media-' + participant.identity + ' >i').addClass("hidden");
//         // participant.media.attach('div#media-' + participant.identity);
//         // $('div#media-' + participant.identity).click(function(){
//         //     $('div#remote-media').empty();
//         //     participant.media.attach('div#remote-media');
//         // });
//         // var newlinkstatus = "2";
//         // var roleid = 'stu';
//         // var username = participant.identity;
//         // updateLinkStatus(roleid, username, newlinkstatus);

//         // participant.on('disconnected', function (participant) {
//         //     log("Participant '" + participant.identity + "' left the room");
//         //     var newlinkstatus = "0";
//         //     var roleid = 'stu';
//         //     var username = participant.identity;
//         //     updateLinkStatus(roleid, username, newlinkstatus);
//         // });
//     });

//     // When a participant disconnects, note in log
//     room.on('participantDisconnected', function (participant) {
//         roomParDisconnected(participant);
//         // log("Participant '" + participant.identity + "' left the room");
//         // var newlinkstatus = "0";
//         // var roleid = 'stu';
//         // var username = participant.identity;
//         // updateLinkStatus(roleid, username, newlinkstatus);
//     });

//     // When the conversation ends, stop capturing local video
//     room.on('disconnected', function () {
//         myDisconneted(room);
//         // log('Left');
//         // room.localParticipant.media.detach();
//         // activeRoom = null;
//         // var newlinkstatus = "0";
//         // updateLinkStatus(roleid, username, newlinkstatus);
//     });





//     // Click teacher list link button #btn-link-**** to link or unlink.
//     $("#btn-link-"+username).on('click', function(){
//         if ($(this).hasClass("active")){
//             $(this).button('reset');
//             myDisconneted(room);
//             // if (conversationsClient) {
//             //  conversationsClient = null;
//             //  log('log out');
//       //           console.log('log out');
//             //     var newlinkstatus = "1";
//             //     updateLinkStatus(roleid, username, newlinkstatus);
//             //     $("#teacherlist").trigger(e_tealink);
//             // }
//         }else{
//             $(this).button('complete');
//             myConnected(token, roomName);
//           //   var accessManager = new Twilio.AccessManager(token);
//           //   // Check the browser console to see your generated identity.
//           //   // Send an invite to yourself if you want!
//           //   console.log(token);
//           //   // Create a Conversations Client and connect to Twilio
//           //   conversationsClient = new Twilio.Conversations.Client(accessManager);
//           //   conversationsClient.listen().then(clientConnected, function (error) {
//              //    log('Could not connect to Twilio: ' + error.message);
//           //       console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
//                 // var newlinkstatus = "2";
//                 // updateLinkStatus(roleid, username, newlinkstatus);
//                 // $("#teacherlist").trigger(e_tealink);
//           //   });
//         }

//     });

//     // Click teacher list video button #btn-video-**** to preview or close camera.
//     $("button#btn-video-"+username).on('click', function(){
//         if ($(this).hasClass("active")){
//             $(this).button('reset');
//             if (myLocalMedia){
//                 stopMedia();
//             }
//         }else{
//             $(this).button('complete');
//             if (!myLocalMedia){
//                 previewMedia();
//                 // mylocalMedia = new Twilio.Video.LocalMedia();
//                 // Twilio.Video.getUserMedia().then(
//                 //     function (mediaStream) {
//                 //       myLocalMedia.addStream(mediaStream);
//                 //       myLocalMedia.attach("div#media-"+username);
//                 //       myLocalMedia.attach("div#local-media");
//                 //     },
//                 //     function (error) {
//                 //       console.error('Unable to access local media', error);
//                 //       log('Unable to access Camera and Microphone');
//                 //     });
//             }

//         }
//     });

// }

// // Begin to take class with button "btn-begin-class" click
// $("button#btn-begin-class").click(function(){
//     "use strict";
//     if ($(this).hasClass("active")){

//         if (activeRoom){
//             myDisconneted(activeRoom);
//             // log('Left');
//             // activeRoom.localParticipant.media.detach();
//             // activeRoom = null;
//             // $("button#btn-begin-class").button('complete');
//         }

//     }else{
//         $(this).button('loading');

//         $("div#button-area").css({"height":"10%","padding-top":"0px"});
//         $("div#local-media").removeClass('hidden');
//         $("div#remote-media").removeClass('hidden');
//         $("div#local-media").css({"border-top":"1px solid #cececc"});

//         if (activeRoom){
//             previewMedia();
//             // if (myLocalMedia) {
//             //     room.localParticipant.media.attach('#local-media');
//             //     console.log(username);
//             //     $("div#media-"+username).empty();
//             //     room.localParticipant.media.attach('div#media-'+username);
//             // }else{
//             //     mylocalMedia = new Twilio.Video.LocalMedia();
//             //     Twilio.Video.getUserMedia().then(
//             //         function (mediaStream) {
//             //           myLocalMedia.addStream(mediaStream);
//             //           myLocalMedia.attach("div#local-media");
//             //           $("div#media-"+username).empty();
//             //           myLocalMedia.attach("div#media-"+username);
//             //         },
//             //         function (error) {
//             //           console.error('Unable to access local media', error);
//             //           log('Unable to access Camera and Microphone');
//             //           $("button#btn-begin-class").button('reset');
//             //         });

//             // }
//             $("button#btn-begin-class").button('complete');
//         }else{
//             myConnected(token, roomName);
//             // myClient = new Twilio.Video.Client(token);
//             // myClient.connect({ to: roomName}).then(roomJoined,
//             //     function(error) {
//             //         log('Could not connect to Twilio: ' + error.message);
//             //         console.log(roleid);
//             //         console.log(username);
//             //         var newlinkstatus = "0";
//             //         updateLinkStatus(roleid, username, newlinkstatus);
//             //         $("button#btn-begin-class").button('reset');
//             // });
//             $("button#btn-begin-class").button('complete');
//         }

//     }

// });




    //   // Draw local video, if not already previewing
    // if (!myLocalMedia) {
    //     previewMedia();
    //     // room.localParticipant.media.attach('#local-media');
    //     // $("div#media-"+username).empty();
    //     // room.localParticipant.media.attach("div#media-"+username);
    // }



// // Update sound status to status_val;
// function updateSoundStatus(roleid, username, status_val){
//     "use strict";
//     if (roleid==='tea') {
//         $.post("/info/", {teasoundstatus:status_val});
//     }
//     if (roleid==='ass') {
//         $.post("/info/", {asssoundstatus:status_val});
//     }
//     if (roleid==='stu') {
//         $.post("/info/", {stusoundstatus:status_val});
//         // for (var si in stusoundstatus_dict) {
//         //  if (stusoundstatus_dict.hasOwnProperty(si)) {
//         //      var idxs = stusoundstatus_dict[si].indexOf(username);
//         //      if (idxs>=0) {stusoundstatus_dict[si].splice(idxs,1);break;}
//         //  }
//         // }
//         // stusoundstatus_dict[status_val].splice(1, 0, username);
//     }
// }




// $.getJSON("/info/", function (data) {
//     "use strict";
//     classstr = data.classstr;
//     username = data.username;
// }).then(function(){
//     "use strict";
//     var myeventlinktea = "newtealinkstatus"+classstr;
//     var myeventvideotea = "newteavideostatus"+classstr;
//     var myeventsoundtea = "newteasoundstatus"+classstr;

//     var myeventlinkass = "newasslinkstatus"+classstr;
//     var myeventvideoass = "newassvideostatus"+classstr;
//     var myeventsoundass = "newasssoundstatus"+classstr;

//     var myeventlinkstu = "newstulinkstatus"+classstr;
//     var myeventvideostu = "newstuvideostatus"+classstr;
//     var myeventsoundstu = "newstusoundstatus"+classstr;

//     console.log(myeventlinktea);
//     console.log(myeventlinkstu);
//     console.log(myeventlinkass);


//     tea_source = new EventSource("/stream?channel=changed.teastatus");
//     stu_source = new EventSource("/stream?channel=changed.stustatus");
//     ass_source = new EventSource("/stream?channel=changed.assstatus");

//     tea_source.addEventListener(myeventlinktea,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         tealinkstatus_dict = data.tealinkstatus;
//         $("#teacherlist").trigger(e_tealink);
//         console.log(tealinkstatus_dict);
//     }, false);

//     stu_source.addEventListener(myeventlinkstu,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         stulinkstatus_dict = data.stulinkstatus;
//         $("#studentlist").trigger(e_stulink);
//         console.log(stulinkstatus_dict);
//     }, false);

//     ass_source.addEventListener(myeventlinkass,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         asslinkstatus_dict = data.asslinkstatus;
//         $("#assistantlist").trigger(e_asslink);
//         console.log(asslinkstatus_dict);
//     }, false);


//     tea_source.addEventListener(myeventvideotea,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         teavideostatus_dict = data.teavideostatus;
//         $("#teacherlist").trigger(e_teavideo);
//         console.log(teavideostatus_dict);
//     }, false);

//     stu_source.addEventListener(myeventvideostu,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         stuvideostatus_dict = data.stuvideostatus;
//         $("#studentlist").trigger(e_stuvideo);
//         console.log(stuvideostatus_dict);
//     }, false);

//     ass_source.addEventListener(myeventvideoass,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         assvideostatus_dict = data.assvideostatus;
//         $("#assistantlist").trigger(e_assvideo);
//         console.log(assvideostatus_dict);
//     }, false);


//     tea_source.addEventListener(myeventsoundtea,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         teasoundstatus_dict = data.teasoundstatus;
//         $("#teacherlist").trigger(e_teasound);
//         console.log(teasoundstatus_dict);
//     }, false);

//     stu_source.addEventListener(myeventsoundstu,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         stusoundstatus_dict = data.stusoundstatus;
//         $("#studentlist").trigger(e_stusound);
//         console.log(stusoundstatus_dict);
//     }, false);

//     ass_source.addEventListener(myeventsoundass,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         asssoundstatus_dict = data.asssoundstatus;
//         $("#assistantlist").trigger(e_asssound);
//         console.log(asssoundstatus_dict);
//     }, false);

// });










// Successfully connected!







// // Conversation is live
// function conversationStarted(conversation) {
// 	"use strict";
//     log('In an active Conversation');
//     console.log('In an active Conversation');


//     activeConversation = conversation;
//     // Draw local video, if not already previewing
//     // $("div#button-area").addClass(hidden);
//     // $("div#local-media").removeClass(hidden);
//     // $("div#remote-media").removeClass(hidden);

//     if (!previewMedia) {
//         $("div#local-media").empty();
//         conversation.localMedia.attach("div#local-media");
//         $("div#media-"+username).empty();
//         conversation.localMedia.attach("div#media-"+username);
//         // $("div#local-media").append(conversation.localMedia.attach('#local-media'));
//     }else {
//         previewMedia.detach();
//         previewMedia.stop();
//         previewMedia = null;
//         $("div#local-media").empty();
//         conversation.localMedia.attach("div#local-media");
//         $("div#media-"+username).empty();
//         conversation.localMedia.attach("div#media-"+username);
// 	    // $("div#local-media").append(conversation.localMedia.attach('#local-media'));
//     }

//     // When a participant joins, draw their video on screen
//     conversation.on('participantConnected', function (participant) {
//         log("Participant '" + participant.identity + "' connected");
//         console.log("Participant '" + participant.identity + "' connected");
//         $('div#media-'+participant.identity).empty();
//         participant.media.mute();
//         participant.media.attach('div#media-'+participant.identity);
//         // $('div#media-'+participant.identity +" audio").addClass("hidden");
//         // var remotemediaEL = participant.media.attach();
//         // $("div#media-"+participant.identity).append(remotemediaEL);
//         $('div#media-'+participant.identity).click(function(){
//             $("div#remote-media").empty();
//             participant.media.unmute();
//             $("div#remote-media").append($("div#media-"+participant.identity + " video"));
//             $("div#remote-media").append($("div#media-"+participant.identity + " audio"));
//         });

//         setConnectedEl(participant.identity);
//         // $.post("/info/", {tealinkstatus:2});
//         $("button#btn-begin-class").button('complete');
//     });

//     conversation.on('participantFailed', function(participant) {
//         log('Participant failed to connect: ' + participant.identity);
//         console.log('Participant failed to connect: ' + participant.identity);
//         setDisconnectedEl(participant.identity);
//         $("button#btn-begin-class").button('reset');
//      });

//     // When a participant disconnects, note in log
//     conversation.on('participantDisconnected', function (participant) {
//         log("Participant '" + participant.identity + "' disconnected");
//         console.log("Participant '" + participant.identity + "' disconnected");
//         setDisconnectedEl(participant.identity);
// 	    $("button#btn-begin-class").button('reset');

//     });

//     // When the conversation ends, stop capturing local video
//     conversation.on('disconnected', function (conversation) {
//         log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
//         console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
//         conversation.localMedia.stop();
//         conversation.disconnect();
//         activeConversation = null;
//         // $.post("/info/", {tealinkstatus:1});
//         for (var ti in tea_list) {
//         	if (tea_list.hasOwnProperty(ti)){
//                 setDisconnectedEl(tea_list[ti]);
//             }
//         }
//         for (var si in stu_list) {
//         	if (stu_list.hasOwnProperty(si)){
//                 setDisconnectedEl(stu_list[si]);
//             }
//         }

//     });
// }
























// // listenning on changed.videostatus event
// $("#studentlist").on("changed.videostatus", function(event, videostatus){
//     "use strict";
//     var status_dict = videostatus;

//     // status "0" means disabled
//     for (var v0i in status_dict['0']) {
//         if (status_dict['0'].hasOwnProperty(v0i)){
//             setButtonDisabledEl(status_dict['0'][v0i]);
//         }
//     }

//     // status "1" means Off
//     for (var v1i in status_dict['1']) {
//         if (status_dict['1'].hasOwnProperty(v1i)){
//             setButtonOffEl(status_dict['1'][v1i], "video");
//         }
//     }

//     // status "2" means On
//     for (var v2i in status_dict['2']) {
//         if (status_dict['2'].hasOwnProperty(v2i)){
//             setButtonOnEl(status_dict['2'][v2i], "video");
//         }
//     }
// });

// // Bind switch to create conversation
//  $('input#remote-conn-all').on('switchChange.bootstrapSwitch', function(e, state) {
//       if (!state) {
//             inviteTo = stustatus_dict['1'];
//             var options = {};
//             if (activeConversation) {
//             // Add a participant
//             activeConversation.invite(inviteTo, options).then(conversationStarted,
//             function (error) {
//                     log('Fail to invite');
//                     console.error('Fail to invite', error);
//             });
//          } else {
//             // Create a conversation
//             options = {};
//             /*if (previewMedia) {
//                     options.localMedia = previewMedia;
//             }else {
//                 previewMedia =
//                 options.localMedia = previewMedia;
//             }*/
//                 conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted,
//                 function (error) {
//                     log('Unable to create conversation');
//                     console.error('Unable to create conversation', error);
//                 });}
//       }else {
//             if (activeConversation){
//                 activeconversation.disconnect().then(conversationStarted,function(error){
//                     log('Unable to disable conversation');
//                     console.error('Unable to disable conversation', error);
//                 });}
//       }
//  });

//     //Bind switch to sound control
//  $('input#remote-volume-all').on('switchChange.bootstrapSwitch', function(e, state) {
//       if (state) {
//             //previewMedia.unmute()
//             if (activeConversation){
//                 activeConversation.on('participantConnected', function (participant) {
//                     log("Participant '" + participant.identity + "' unmuted");
//                     console.log("Participant '" + participant.identity + "' unmuted");
//                     participant.media.detach();
//                     participant.media.attach('#media-'+participant.identity);
//                 });
//             }
//       }else {
//             //previeMedia.mute()
//             if (activeConversation){
//                 activeConversation.on('participantConnected', function (participant) {
//                     log("Participant '" + participant.identity + "' muted");
//                     console.log("Participant '" + participant.identity + "' muted");
//                     participant.media.detach();
//                     participant.on('trackAdded',function (track) {
//                         if (track.kind=='video'){
//                             track.attach('#media-'+participant.identity);
//                         }
//                     });
//                 });
//             }
//       }
//  });






// //  Local video preview
// $('input#camera-preview').on('switchChange.bootstrapSwitch', function(e, state) {
//     if (!state){
//         if (!previewMedia){
//             previewMedia = new Twilio.Conversations.LocalMedia();
//             myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
//                 $('div#media-area').empty();
//                 $('div#media-area').append(createMediaEl('local-media'));
//                 $('div#media-area').append(createMediaEl('remote-media'));
//                 previewMedia.addStream(mediaStream);
//                 $('div#local-media').append(previewMedia.attach());
//                 //$.post("/info/", {teastatus:2});
//             }
//         ,function (error) {
//             console.error('Unable to access local media', error);
//             log('Unable to access Camera and Microphone');
//         });} else {
//             $('div#media-area').empty();
//             $('div#media-area').append(createMediaEl('local-media'));
//             $('div#media-area').append(createMediaEl('remote-media'));
//             previewMedia.addStream(mediaStream);
//             $('div#local-media').append(previewMedia.attach());
//             //$.post("/info/", {teastatus:2});
//         }
//    } else {
//         if (previewMedia){
//             previewMedia.detach();
//             previewMedia.stop();
//             previewMedia = null;
//             $('div#media-area').empty();
//             $('div#media-area').append("<h4 id='memo-text'>Ready to Take Class</h4>");
//             //$.post("/info/", {teastatus:1});
//         }
//     }

// });



// $("#btn-sound-" + stu_list[si]).on("click",function () {
//                         if ($(this).hasClass('active')){
//                             console.log($(this).button('reset'));
//                             // mute;
//                             if (activeConversation){
//                                     activeConversation.on('participantConnected', function (participant) {
//                                         log("Participant '" + participant.identity + "' muted");
//                                         console.log("Participant '" + participant.identity + "' muted");
//                                         participant.media.detach();
//                                         participant.on('trackAdded',function (track) {
//                                             if (track.kind=='video'){
//                                                 track.attach('#media-'+participant.identity);
//                                             }
//                                         });
//                                     });
//                                 }
//                             }else{
//                                 console.log($(this).button('complete'));
//                                 //unmute;
//                                 if (activeConversation){
//                                     activeConversation.on('participantConnected', function (participant) {
//                                         log("Participant '" + participant.identity + "' unmuted");
//                                         console.log("Participant '" + participant.identity + "' unmuted");
//                                         participant.media.detach();
//                                         participant.media.attach('#media-'+participant.identity);
//                                     });}
//                             }
//                      });

//                       $("#btn-link-" + stu_list[si]).on("click",function () {
//                             if ($(this).hasClass('active')){
//                                 //unlink;
//                                 console.log($(this).button('reset'));
//                                 if (activeConversation){
//                                     activeconversation.disconnect().then(conversationStarted,function(error){
//                                     log('Unable to disable conversation');
//                                     console.error('Unable to disable conversation', error);
//                                 });}
//                             }else{
//                                 //link;
//                                 console.log($(this).button('complete'));
//                                 var inviteTo = stu_list[si];
//                                 var options = {audio:false};
//                                 if (activeConversation) {
//                                 // Add a participant
//                                 activeConversation.invite(inviteTo, options).then(conversationStarted,
//                                 function (error) {
//                                         log('Fail to invite');
//                                         console.error('Fail to invite', error);
//                                 });
//                              } else {
//                                 // Create a conversation
//                                 if (previewMedia) {
//                                         options.localMedia = previewMedia;
//                                 }
//                                     conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted,
//                                     function (error) {
//                                         log('Unable to create conversation');
//                                         console.error('Unable to create conversation', error);
//                                     });}
//                                 }
//                           });


//                     $("#btn-media-" + tea_list[ti]).on("click", function () {
//                             console.log("teacher media control");
//                             if ($(this).hasClass('active')){
//                                 console.log($(this).button('reset'));
//                                 if (previewMedia){
//                                     previewMedia.detach();
//                                 previewMedia.stop();
//                                 previewMedia = null;
//                                 $('div#media-area').empty();
//                                 $('div#media-area').append("<h4 id='memo-text'>Ready to Take Class</h4>");
//                                 }
//                             }else{
//                                 console.log($(this).button('complete'));
//                                 if (!previewMedia){
//                                     previewMedia = new Twilio.Conversations.LocalMedia();
//                                     myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
//                                         $('div#media-area').empty();
//                                         $('div#media-area').append(createMediaEl('local-media'));
//                                         $('div#media-area').append(createMediaEl('remote-media'));
//                                         previewMedia.addStream(mediaStream);
//                                         $('div#local-media').append(previewMedia.attach());
//                                     }
//                                 ,function (error) {
//                                     console.error('Unable to access local media', error);
//                                     log('Unable to access Camera and Microphone');
//                                 });} else {
//                                     $('div#media-area').empty();
//                                     $('div#media-area').append(createMediaEl('local-media'));
//                                     $('div#media-area').append(createMediaEl('remote-media'));
//                                     previewMedia.addStream(mediaStream);
//                                     $('div#local-media').append(previewMedia.attach());
//                                 }
//                             }
//                     });



