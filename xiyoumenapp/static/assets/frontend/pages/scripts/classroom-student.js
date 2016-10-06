//BEGIN PAGE VIEW CODE

var classid;
var userid;
var classstr;
var classname;
var username;
var roleid = 'stu';
var rolecolor_tea = "#8A6D3B";
var rolecolor_ass = "#31708F";
var rolecolor_stu = "#3E773F";


// Check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    alert('WebRTC is not available in your browser.');
}

function timeit(){
	"use strict";
	var classdatetime = new Date();
	$("#classdate").text(classdatetime.toLocaleDateString());
	$("#classtime").text(classdatetime.toLocaleTimeString());
}
window.setInterval(function(){"use strict";timeit();}, 1000);

function setVideoAreaEL(s){
	"use strict";
	if (s) {
	    $("div#button-area").css({"height":"10%", "padding-top":"20px"});
	    $("div#local-media").removeClass('hidden');
	    $("div#remote-media").removeClass('hidden');
	}else{
		$("div#button-area").css({"height":"100%","padding-top":"30%"});
		$("div#local-media").addClass("hidden");
		$("div#remote-media").addClass("hidden");
	}
}

$(document).ready(function () {
	"use strict";
	setVideoAreaEL(0);
	$.post("/info/", {stulinkstatus:'0'}).then(function () {
		$.getJSON('/info/',function(data){
			classid = data.classid;
			userid = data.userid;
			classstr = data.classstr;
			classname = data.classname;
			username = data.username;
			// tealinkstatus_dict = data.tealinkstatuslist;
		    console.log(classname);
			$("title").text(classname);
			$("span#classname").text(classname);
			$("span#username").text(username);
		});

	});
});


// $(function(){
// 	"use strict";
//     $('.general-item-list').slimScroll({
// 	    width: '100%',
// 	    height: '430px',
// 	    size: '5px',
// 	    position: 'right',
// 	    color: '#cececc',
// 	    opacity: 0.3,
// 	    alwaysVisible: false,
// 	    distance: '0px',
// 	    start: 'top',
// 	    railVisible: false,
// 	    //railColor: '#222',
// 	    //railOpacity: 0.3,
// 	    wheelStep: 10,
// 	    allowPageScroll: false,
// 	    disableFadeOut: false
//     });
// });




/*function updateTeaEl() {
	"use strict";
	//$('div#media-area').empty();
	//var btnMediaAreaEl = '<button id="btn-student-ready" type="button" class="btn btn-info" data-loading-text="Waiting for teacher" > <span>Ready To Begin Class</span></button>';
  	//$('div#media-area').append(btnMediaAreaEl)
  	$('div#video-area').hide();
  	$('button#button-area').show();
}*/


// $("button#btn-student-ready").on("click",function () {
// 	"use strict";
// 	$.post("/info/", {stustatus:1});
// 	$(this).button("loading");
// });


// // Successfully connected!
// function clientConnected() {
// 	"use strict";
//     log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
// 	 console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
//     conversationsClient.on('invite', function (invite) {
//         log('Incoming invite from: ' + invite.from);
//         console.log('Incoming invite from: ' + invite.from);
//         invite.accept().then(conversationStarted);
//     });
// }


// // Conversation is live
// function conversationStarted(conversation) {
// 	"use strict";
//     log('In an active Conversation');
//     console.log('In an active Conversation');
//     activeConversation = conversation;

//     //var mediaarea = '<div class="row"><div id="local-media" class="col-md-6 padding-top-10 margin-bottom-10"></div><div id="remote-media" class="col-md-6 padding-top-10 margin-bottom-10"></div></div>';    
// 	 //var videoarea = '<div id=""></div>';    
// 	 //MediaAreaEl = $(mediaarea);   
// 	 //VideoAreaEl = $(videoarea);
	 
//     //$('div#media-area').empty();
//     //$('div#media-area').append(MediaAreaEl);
// 	 $('div#local-media').show();
// 	 $('div#button-area').hide();    
//     /*   	
// 	    $("div#local-media").slimScroll({
// 		    width: '100%',
// 		    height: '334px',
// 		    size: '5px',
// 		    position: 'right',
// 		    color: '#cececc',
// 		    opacity: 0.3,
// 		    alwaysVisible: false,
// 		    distance: '0px',
// 		    start: 'top',
// 		    railVisible: false,
// 		    //railColor: '#222',
// 		    //railOpacity: 0.3,
// 		    wheelStep: 5,
// 		    allowPageScroll: false,
// 		    disableFadeOut: false        
// 	    });   
	    
// 		 $("div#remote-media").slimScroll({
// 		    width: '100%',
// 		    height: '334px',
// 		    size: '5px',
// 		    position: 'right',
// 		    color: '#cececc',
// 		    opacity: 0.3,
// 		    alwaysVisible: false,
// 		    distance: '0px',
// 		    start: 'top',
// 		    railVisible: false,
// 		    //railColor: '#222',
// 		    //railOpacity: 0.3,
// 		    wheelStep: 5,
// 		    allowPageScroll: false,
// 		    disableFadeOut: false        
// 	    });
//     */

// 	    // Draw local video, if not already previewing
// 	    if (!previewMedia) {
// 	        conversation.localMedia.attach('div#local-media');
// 	    }
    
    
//     // When a participant joins, draw their video on screen
//     conversation.on('participantConnected', function (participant) {
//         log("Participant '" + participant.identity + "' connected");
//         console.log("Participant '" + participant.identity + "' connected");
//         console.log(participant);
//         participant.media.attach('div#remote-media');
//         $.post("/info/", {stustatus:2});
//     });
    
//     conversation.on('participantFailed', function(participant) {
//     	  log('Participant failed to connect: ' + participant.identity);
// 		  console.log('Participant failed to connect: ' + participant.identity);
// 		  $.post("/info/", {stustatus:0});
// 		  updateTeaEl();
// 		  /*
// 		  updateTeaEl().then(function () {
// 			  $("button#btn-student-ready").on("click",function () {
// 					$.post("/info/", {stustatus:1});
// 					$(this).button("loading");
// 			  });		  	
// 		  });
// 		  */
// 	 });

//     // When a participant disconnects, note in log
//     conversation.on('participantDisconnected', function (participant) {
//         log("Participant '" + participant.identity + "' disconnected");
//         console.log("Participant '" + participant.identity + "' disconnected");
//         $.post("/info/", {stustatus:0});
//         updateTeaEl();
//         /*
// 		  updateTeaEl().then(function () {
// 			  $("button#btn-student-ready").on("click",function () {
// 					$.post("/info/", {stustatus:1});
// 					$(this).button("loading");
// 			  });		  	
// 		  });
// 		  */
//     });

//     // When the conversation ends, stop capturing local video
//     conversation.on('disconnected', function (conversation) {
//         log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
//         console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
//         conversation.localMedia.stop();
//         conversation.disconnect();
//         activeConversation = null;
//         $.post("/info/", {stustatus:0});
        
//     });

// }


// // Activity log
// function log(message) {
// 	"use strict";
//     document.getElementById('log-content').innerHTML = message;
// }

// $(function ()
//       { $("input#chat-ask").popover();
//       });


// function insertmessage(chatname, chattime, chatmessage, chatrole){
// 	var roleicon;
// 	if (chatrole=="teacher"){
// 		//roleicon = 'style="text-shadow: black 5px;color:#d9edf7"';
// 		roleicon = 'style="text-shadow: black 5px;color:0ec9b6"';	
// 	}else {
// 		//roleicon = 'style="text-shadow: black 5px;color:#dff0d8"';
// 		roleicon = 'style="text-shadow: black 5px;color:#bdccb7"';	
// 	}
// 	var inserthtml = '<div class="item"><div class="item-head"><div class="item-details" ><i class="glyphicon glyphicon-user" ' + roleicon + '> </i><a href="" class="item-name primary-link"> ' + chatname + '</a><span class="item-label"> ' + chattime + '</span></div></div><div class="item-body">'+ chatmessage +'</div></div>';
// 	console.log(inserthtml);	
// 	$("#chat-message-list").prepend(inserthtml)
// }

// function updatemessage(){
// 	$.getJSON("/chatlist/", function (data) {
// 		//console.log(data.classname);
// 		//console.log(data.chatcontent);
// 		listmessage = data.chatcontent;
// 		num_chatitem = listmessage.length;
// 		listoldmessage = $("#chat-message-list").children();
// 		num_chatolditem = listoldmessage.length;
// 		//console.log(num_chatitem);
// 		//console.log(num_chatolditem);
		
// 		for (item in listmessage){
// 			//console.log(item);
// 			if (num_chatolditem <= item){
// 				chat_item = listmessage[item];
// 				chatname = chat_item.username;
// 				chattime = chat_item.createtime;
// 				chatmessage = chat_item.question;
// 				chatrole = chat_item.rolename;
// 				insertmessage(chatname, chattime, chatmessage, chatrole);
// 			}
// 		}		
// 	});
// }

// window.setInterval('updatemessage()', 2000);

// function postmessage() {
// 		chattext = $("#chat-text").val();
// 		console.log(chattext);
// 		$.post("/chatlist/", {txt:chattext});
// 		updatemessage();
// }


//PAGE VIEW CODE END