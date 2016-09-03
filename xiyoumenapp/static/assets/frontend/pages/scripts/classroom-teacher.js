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
var teastatus_dict;
var stustatus_dict;




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
	$.post("/info/", {teastatus:0, stustatus:0});
});

$.fn.bootstrapSwitch.defaults.state = true;
$(".switch").bootstrapSwitch();

//$(function () { $('.mytooltip').tooltip();});
$(function () { $('.tooltip-camera-open').tooltip();});
$(function () { $('.tooltip-camera-close').tooltip();});
$(function () { $('.tooltip-volume-up').tooltip();});
$(function () { $('.tooltip-volume-off').tooltip();});
$(function () { $('.tooltip-link').tooltip();});
$(function () { $('.tooltip-unlink').tooltip();});


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


$(function(){
    $('.userlist').slimScroll({
		width: '100%',    	
    	height: '380px',
    	size: '5px',
    	position: 'right',
    	color: '#cececc',
    	alwaysVisible: false,
    	distance: '0px',
    	start: 'top',    	  
    	railVisible: false,
	   //railColor: '#232323',
	   //railOpacity: 0.1,
    	wheelStep: 5,
	   allowPageScroll: false,
	   disableFadeOut: false
    });
});


$(function(){
    $('div#remote-media').slimScroll({
	    width: '100%',
	    height: '100px',
	    size: '5px',
	    position: 'right',
	    color: '#cececc',
	    opacity: 0.1,
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
		//console.log(data.classname);
		//console.log(data.chatcontent);
		listmessage = data.chatcontent;
		num_chatitem = listmessage.length;
		listoldmessage = $("#chat-message-list").children();
		num_chatolditem = listoldmessage.length;
		//console.log(num_chatitem);
		//console.log(num_chatolditem);
		var classdatetime = new Date();
		
		for (item in listmessage){
			//console.log(item);
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
/*
function realmonth(m){
	m=m+1
	if(m<=9){
		return "0"+m.toString();	
	}else{
		return m.toString();
	}	
}
*/
window.setInterval('updatemessage()', 2000);

function postmessage() {
		chattext = $("#chat-text").val();
		console.log(chattext);
		$.post("/chatlist/", {txt:chattext});
		updatemessage();
}

$.getJSON('/info/',function(data){
	classname = data.classname;
	username = data.username;
	stu_list = data.student;
	tea_list = data.teacher;	
	teastatus_dict = data.teastatuslist;
	stustatus_dict = data.stustatuslist;
	
   console.log(classname);
	$("title").text(classname);
	$("span#classname").text(classname);
	$("span#username").text(username);
	//$("#chat-ask").attr({title:username});

    var newstudentEl;
    for (si in stu_list) {
        //newstudentEl = "<div class='col-md-6 margin-bottom-10'><div class='service-box-v1'><div id='media_" + stu_list[si] + "' class='remote-media'><i class='glyphicon glyphicon-user color-grey'></i></div><h4 id='name_" + stu_list[si] +"' class='color-grey'>" + stu_list[si] + "</h4></div></div>";
        newstudentEl = createStuIconEl(stu_list[si])
        $("#studentlist").append(newstudentEl);
    }
    
    var newteacherEl;
    for (ti in tea_list) {
        //newteacherEl = "<div class='col-md-6 margin-bottom-10'><div class='service-box-v1'><div id='media_" + tea_list[ti] + "' class='remote-media'><i class='glyphicon glyphicon-user color-grey'></i></div><h4 id='name_" + tea_list[ti] +"' class='color-grey'>" + tea_list[ti] + "</h4></div></div>";
		  newteacherEl = createTeaIconEl(tea_list[ti])        
        $("#teacherlist").append(newteacherEl);
    }
    
    var num_alltea = tea_list.length;
    var num_allstu = stu_list.length;
    var num_onlinetea = teastatus_dict["2"].length;
    var num_onlinestu = stustatus_dict["2"].length;
    
    $("span#num_teainfo").text(num_onlinetea + " / " + num_alltea);
    $("span#num_stuinfo").text(num_onlinestu + " / " + num_allstu);
    
 
   // $(function () { $('#collapseOne').collapse('show')});
   // $(function () { $('#collapseTwo').collapse('')});
   // $(function () { $('#collapseThree').collapse('toggle')});
 
	});

function updateClassInfo() {
	$.getJSON('/info/',function(data){	
		teastatus_dict = data.teastatuslist;
		stustatus_dict = data.stustatuslist;    
		var num_alltea = tea_list.length;
    	var num_allstu = stu_list.length;
   	var num_onlinetea = teastatus_dict["2"].length;
    	var num_onlinestu = stustatus_dict["2"].length;
    	$("span#num_teainfo").text(num_onlinetea + " / " + num_alltea);
    	$("span#num_stuinfo").text(num_onlinestu + " / " + num_allstu);
    	for (l0i in teastatus_dict['0']) {
    		setDisconnectedEl(teastatus_dict['0'][l0i]);
    	}
    	for (l1i in teastatus_dict['1']) {
    		setReadyEl(teastatus_dict['1'][l1i]);
    	}
     	for (l2i in teastatus_dict['2']) {
    		setTeaConnectedEl(teastatus_dict['2'][l2i]);
    	}  
    	for (l0i in stustatus_dict['0']) {
    		setDisconnectedEl(stustatus_dict['0'][l0i]);
    	}
    	for (l1i in stustatus_dict['1']) {
    		setReadyEl(stustatus_dict['1'][l1i]);
    	}
     	for (l2i in stustatus_dict['2']) {
    		setStuConnectedEl(stustatus_dict['2'][l2i]);
    	}  	
	});
}

window.setInterval('updateClassInfo()', 3000);


function createTeaIconEl(user_info){
	return "<div class='col-md-6 margin-bottom-10'><div id='service-box-" + user_info + "' class='service-box-v1'><div id='media_" + user_info + "' class='remote-media'><i class='fa fa-user color-grey'></i></div><h5 id='name_" + user_info +"' class='color-grey'>" + user_info + "</h5></div></div>";
}

function createStuIconEl(user_info){
	return "<div class='col-md-6 margin-bottom-10'><div id='service-box-" + user_info + "' class='service-box-v1'><div id='media_" + user_info + "' class='remote-media'><i class='fa fa-user color-grey'></i></div><h5 id='name_" + user_info +"' class='color-grey'>" + user_info + "</h5></div></div>";
}

function setTeaConnectedEl(userinfo) {
	console.log("#service-box-" + userinfo);
	//$("#service-box-" + userinfo).css("background", "#d9edf7");
	$("#service-box-" + userinfo).css("background", "green");
	$("#service-box-" + userinfo +" i").css("color", "#fff");
	$("#service-box-" + userinfo +" p").css("color", "#fff");
	$("#service-box-" + userinfo + " h5").css("color", "#fff");
}

function setStuConnectedEl(userinfo) {
	console.log("#service-box-" + userinfo);
	//$("#service-box-" + userinfo).css("background", "##dff0d8");
	$("#service-box-" + userinfo).css("background", "green");
	$("#service-box-" + userinfo +" i").css("color", "#fff");
	$("#service-box-" + userinfo +" p").css("color", "#fff");
	$("#service-box-" + userinfo + " h5").css("color", "#fff");
}

function setDisconnectedEl(userinfo) {
	$("#service-box-" + userinfo).css("background", "");
	$("#service-box-" + userinfo +" i").css("color", "");
	$("#service-box-" + userinfo +" p").css("color", "");
	$("#service-box-" + userinfo + " h5").css("color", "");
}

function setReadyEl(userinfo) {
	$("#service-box-" + userinfo).css("background", "#d73d04");
	$("#service-box-" + userinfo +" i").css("color", "#fff");
	$("#service-box-" + userinfo +" p").css("color", "#fff");
	$("#service-box-" + userinfo + " h5").css("color", "#fff");
}


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


//  Local video preview
$('input#camera-preview').on('switchChange.bootstrapSwitch', function(e, state) {	
  	if (!state){
  		if (!previewMedia){
 		previewMedia = new Twilio.Conversations.LocalMedia();	
  		myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
  			$('div#media-area').empty();
  			$('div#media-area').append(createMediaEl('local-media'));
  			$('div#media-area').append(createMediaEl('remote-media'));
  			previewMedia.addStream(mediaStream);
			$('div#local-media').append(previewMedia.attach());
			$.post("/info/", {teastatus:2});
			}
  		,function (error) {
         	console.error('Unable to access local media', error);
            log('Unable to access Camera and Microphone'); 			
  		});  
   	} else {
 			$('div#media-area').empty();
  			$('div#media-area').append(createMediaEl('local-media'));
  			$('div#media-area').append(createMediaEl('remote-media'));
  			previewMedia.addStream(mediaStream);
			$('div#local-media').append(previewMedia.attach());
			$.post("/info/", {teastatus:2});
		}  	
   } else {
   	if (previewMedia){
     		previewMedia.detach();   		
   		previewMedia.stop();
   		previewMedia = null;
   		//conversation.localMedia.stop();
        	//conversation.disconnect();
        	//activeConversation = null;
   		$('div#media-area').empty();
   		$('div#media-area').append("<h4 id='memo-text'>VIDEO AREA</h4>")
   		$.post("/info/", {teastatus:0});
		}
 	}       

});

function createMediaEl(id_name){
	return "<div id='" + id_name + "'class='margin-bottom-10'></div>"
}


// Successfully connected!
function clientConnected() {
    log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
	 console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
    conversationsClient.on('invite', function (invite) {
        log('Incoming invite from: ' + invite.from);
        console.log('Incoming invite from: ' + invite.from);
        invite.accept().then(conversationStarted);
    });

	// Bind switch to create conversation
	 $('input#remote-conn-all').on('switchChange.bootstrapSwitch', function(e, state) {
	 	  if (state) {
	 	  		inviteTo = stu_list;
        		if (activeConversation) {
            	// Add a participant          
            	activeConversation.invite(inviteTo);
            } else {
            	// Create a conversation
            	var options = {};
            	if (previewMedia) {
                	options.localMedia = previewMedia;
            	}
           		conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted,                        
            		function (error) {
                		log('Unable to create conversation');
                		console.error('Unable to create conversation', error);
            		});}	 	  
	 	  }else {
	 	  	
	 	  }
	 });
	 	  
	//Bind switch to sound control
	 $('input#remote-volume-all').on('switchChange.bootstrapSwitch', function(e, state) {
	 	  if (state) {	 
	 	  		//previewMedia.unmute()
	 	  }else {
	 			//previeMedia.mute()
	 	  }
	 
	 });
}

    

// Conversation is live
function conversationStarted(conversation) {
    log('In an active Conversation');
    console.log('In an active Conversation');
    activeConversation = conversation;
    // Draw local video, if not already previewing
    if (!previewMedia) {
        conversation.localMedia.attach('#local-media');
    }

    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        console.log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#media_'+participant.identity);
        setConnectedEl(participant.identity);
    });
    
    conversation.on('participantFailed', function(participant) {
    	  log('Participant failed to connect: ' + participant.identity);
		  console.log('Participant failed to connect: ' + participant.identity);
		  setDisconnectedEl(participant.identity);
	 });

    // When a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
        log("Participant '" + participant.identity + "' disconnected");
        console.log("Participant '" + participant.identity + "' disconnected");
        setDisconnectedEl(participant.identity);
    });

    // When the conversation ends, stop capturing local video
    conversation.on('disconnected', function (conversation) {
        log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
        for (ti in tea_list) {
        		setDisconnectedEl(tea_list[ti]);
        }
        for (si in stu_list) {
        		setDisconnectedEl(stu_list[si]);
        }
        
    });
}


// Activity log
function log(message) {
    document.getElementById('log-content').innerHTML = message;
}
