// BEGIN LIVE CODE

// predefine the variables.
var conversationsClient;
var activeConversation;
// var conversation;
var previewMedia;
// var myLocalMedia;
var tealinkstatus_dict;
var identity;
var token;

var tealink_source = new EventSource("/stream?channel=changed.tealink");

var classstr;

$.getJSON("/info/", function (data) {
    "use strict";
    classstr = data.classstr;
}).then(function(){
    "use strict";
    var myeventtype = "newtealinkstatus"+classstr;
    console.log(myeventtype);
    tealink_source.addEventListener(myeventtype,function(event){
        "use strict";
        var data = JSON.parse(event.data);
        tealinkstatus_dict = data.tealinkstatus;
        console.log(tealinkstatus_dict);
    }, false);
});


// Set Enable Status of Button;
function setButtonEnabledEl() {
    "use strict";
    $("button#btn-begin-class").removeAttr("disabled");
}

// Set Enable Status of Button;
function setButtonDisabledEl() {
    "use strict";
    $("button#btn-begin-class").attr("disabled", "disabled");
}


// Activity log
function log(message) {
    "use strict";
    document.getElementById('log-content').innerHTML = message;
}

// Successfully connected!
function clientConnected() {
	"use strict";
    log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
    console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");

    setButtonEnabledEl();
}

// Initial live conversation.
$(document).ready(function () {
    "use strict";

    $.getJSON('/token/', function(data) {
	    identity = data.identity;
	    token = data.token;
        var accessManager = new Twilio.AccessManager(token=data.token);
        // Check the browser console to see your generated identity.
        // Send an invite to yourself if you want!
        console.log(token);
        // Create a Conversations Client and connect to Twilio
        conversationsClient = new Twilio.Conversations.Client(accessManager);
        conversationsClient.listen().then(clientConnected, function (error) {
	        log('Could not connect to Twilio: ' + error.message);
            console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
            var newlinkstatus = "0";
            $.post("/info/", {stulinkstatus:newlinkstatus});
            setButtonDisabledEl();
        });
    });

});



// Conversation is live
function conversationStarted(conversation) {
	"use strict";
    log('In an active Conversation');
    console.log('In an active Conversation');

    activeConversation = conversation;

    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        console.log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#remote_media'+participant.identity);
        var newlinkstatus = "2";
        $.post("/info/", {stulinkstatus:newlinkstatus});
        setButtonEnabledEl();
        $("button#btn-begin-class").button('complete');
    });

    conversation.on('participantFailed', function(participant) {
        log('Participant failed to connect: ' + participant.identity);
        console.log('Participant failed to connect: ' + participant.identity);
        var newlinkstatus = "0";
        $.post("/info/", {stulinkstatus:newlinkstatus});
        setButtonDisabledEl();
        $("button#btn-begin-class").button('reset');
     });

    // When a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
        log("Participant '" + participant.identity + "' disconnected");
        console.log("Participant '" + participant.identity + "' disconnected");
        var newlinkstatus = "1";
        $.post("/info/", {stulinkstatus:newlinkstatus});
        setButtonEnabledEl();
	    $("button#btn-begin-class").button('reset');
    });

    // When the conversation ends, stop capturing local video
    conversation.on('disconnected', function (conversation) {
        log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;

        var newlinkstatus = "0";
        $.post("/info/", {stulinkstatus:newlinkstatus});
        setButtonDisabledEl();
        setVideoAreaEL(0);
    });
}


// Begin to take class with button "btn-begin-class" click
$("button#btn-begin-class").click(function(){
	"use strict";
	if ($(this).hasClass("active")){

	    if (activeConversation){
	        activeConversation.disconnect().then(conversationStarted,function(error){
	            log('Unable to disable conversation');
	            console.error('Unable to disable conversation', error);
	            $("button#btn-begin-class").button('complete');
	        });}

    }else{
    	$(this).button('loading');

        var newlinkstatus = "1";
        $.post("/info/", {stulinkstatus:newlinkstatus});
	    setVideoAreaEL(1);

        previewMedia = new Twilio.Conversations.LocalMedia();
        Twilio.Conversations.getUserMedia().then(function (mediaStream) {
                previewMedia.addStream(mediaStream);
                $("div#local-media").append(previewMedia.attach());
            },function (error) {
                console.error('Unable to access local media', error);
                log('Unable to access Camera and Microphone');
        });

        conversationsClient.on('invite', function (invite) {
            log('Incoming invite from: ' + invite.from);
            console.log('Incoming invite from: ' + invite.from);
            invite.accept().then(conversationStarted);
        });
    }

});



// END LIVE CODE