var conversationsClient;
var activeConversation;
var conversation;
var previewMedia;
var myLocalMedia;
var identity;
var token;
var classname;
var username;
var stu_list;
var tea_list;


// Check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    alert('WebRTC is not available in your browser.');
}

function timeit(){
	var classdatetime = new Date();
	$("#classdate").text(classdatetime.toLocaleDateString());
	$("#classtime").text(classdatetime.toLocaleTimeString());
}
window.setInterval('timeit()', 1000);

$(document).ready(function () {
	$.post("/info/", {stustatus:0});
	$("button#btn-student-ready").button("reset");
});


$(function(){
    $('.general-item-list').slimScroll({
	    width: '100%',
	    height: '334px',
	    size: '5px',
	    position: 'right',
	    color: '#cececc',
	    opacity: 0.3,
	    alwaysVisible: false,
	    distance: '0px',
	    start: 'top',
	    railVisible: false,
	    //railColor: '#222',
	    //railOpacity: 0.3,
	    wheelStep: 5,
	    allowPageScroll: false,
	    disableFadeOut: false        
    });
});

$(function () 
      { $("input#chat-ask").popover();
      });


function insertmessage(chatname, chattime, chatmessage, chatrole){
	var roleicon;
	if (chatrole=="teacher"){
		roleicon = 'style="text-shadow: black 5px;color:#d9edf7"';	
	}else {
		roleicon = 'style="text-shadow: black 5px;color:#dff0d8"';	
	}
	var inserthtml = '<div class="item"><div class="item-head"><div class="item-details" ><i class="glyphicon glyphicon-user" ' + roleicon + '> </i><a href="" class="item-name primary-link"> ' + chatname + '</a><span class="item-label"> ' + chattime + '</span></div></div><div class="item-body">'+ chatmessage +'</div></div>';
	console.log(inserthtml);	
	$("#chat-message-list").prepend(inserthtml)
}

function updatemessage(){
	$.getJSON("/chatlist/", function (data) {
		console.log(data.classname);
		console.log(data.chatcontent);
		listmessage = data.chatcontent;
		num_chatitem = listmessage.length;
		listoldmessage = $("#chat-message-list").children();
		num_chatolditem = listoldmessage.length;
		//console.log(num_chatitem);
		//console.log(num_chatolditem);
		
		for (item in listmessage){
			console.log(item);
			if (num_chatolditem <= item){
			chat_item = listmessage[item];
			chatname = chat_item.username;
			chattime = chat_item.createtime;
			chatmessage = chat_item.question;
			chatrole = chat_item.rolename;
			insertmessage(chatname, chattime, chatmessage, chatrole);
			}
		}		
	});
}

window.setInterval('updatemessage()', 2000);

function postmessage() {
		chattext = $("#chat-text").val();
		console.log(chattext);
		$.post("/chatlist/", {txt:chattext});
		updatemessage();
}

function updateTeaEl() {
	$('div#media-area').empty();
	var btnMediaAreaEl = '<button id="btn-student-ready" type="button" class="btn btn-info" data-loading-text="Waiting for teacher" > <span>Ready To Begin Class</span></button>';
  	$('div#media-area').append(btnMediaAreaEl)
}

$("button#btn-student-ready").on("click",function () {
	$.post("/info/", {stustatus:1});
	$(this).button("loading");
});


$.getJSON('/token/', function(data) {
    identity = data.identity;
    token = data.token;
    var accessManager = new Twilio.AccessManager(token=data.token);

    // Check the browser console to see your generated identity. 
    // Send an invite to yourself if you want! 
    
	 console.log(token);
    // Create a Conversations Client and connect to Twilio
    conversationsClient = new Twilio.Conversations.Client(accessManager);  
    console.log(conversationsClient.identity);
    conversationsClient.listen().then(clientConnected, function (error) {
        log('Could not connect to Twilio: ' + error.message);
    });
});


// Successfully connected!
function clientConnected() {
    log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
	 console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
    conversationsClient.on('invite', function (invite) {
        log('Incoming invite from: ' + invite.from);
        console.log('Incoming invite from: ' + invite.from);
        invite.accept().then(conversationStarted);
    });
 	  
}
  

// Conversation is live
function conversationStarted(conversation) {
    log('In an active Conversation');
    console.log('In an active Conversation');
    activeConversation = conversation;
    var mediaarea = '<div class="row"><div id="local-media" class="col-md-6 margin-bottom-10"></div><div id="remote-media" class="col-md-6 margin-bottom-10"></div></div>';    
    // Draw local video, if not already previewing
    if (!previewMedia) {
    	  $('div#media-area').empty();
    	  $('div#media-area').append(mediaarea);
        conversation.localMedia.attach('#local-media');
    }
    
    //$("div#local-media").on()
    $("div#local-media").slimScroll({
	    width: '100%',
	    height: '334px',
	    size: '5px',
	    position: 'right',
	    color: '#cececc',
	    opacity: 0.3,
	    alwaysVisible: false,
	    distance: '0px',
	    start: 'top',
	    railVisible: false,
	    //railColor: '#222',
	    //railOpacity: 0.3,
	    wheelStep: 5,
	    allowPageScroll: false,
	    disableFadeOut: false        
    });
    
    $("div#remote-media").slimScroll({
	    width: '100%',
	    height: '334px',
	    size: '5px',
	    position: 'right',
	    color: '#cececc',
	    opacity: 0.3,
	    alwaysVisible: false,
	    distance: '0px',
	    start: 'top',
	    railVisible: false,
	    //railColor: '#222',
	    //railOpacity: 0.3,
	    wheelStep: 5,
	    allowPageScroll: false,
	    disableFadeOut: false        
    });
    
    
    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        console.log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#media_'+participant.identity);
    });
    
    conversation.on('participantFailed', function(participant) {
    	  log('Participant failed to connect: ' + participant.identity);
		  console.log('Participant failed to connect: ' + participant.identity);
		  updateTeaEl();
	 });

    // When a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
        log("Participant '" + participant.identity + "' disconnected");
        console.log("Participant '" + participant.identity + "' disconnected");
        updateTeaEl();
    });

    // When the conversation ends, stop capturing local video
    conversation.on('disconnected', function (conversation) {
        log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
        
    });
}


// Activity log
function log(message) {
    document.getElementById('log-content').innerHTML = message;
}
