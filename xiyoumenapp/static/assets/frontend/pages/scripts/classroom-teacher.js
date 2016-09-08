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
var teastatus_str;
var stustatus_str;

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
	$.post("/info/", {teastatus:0}).then(function () {
		$.getJSON("/info/", function (data) {
			classname = data.classname;
			username = data.username;	
		});		
	});

});

$.fn.bootstrapSwitch.defaults.state = true;
$(".switch").bootstrapSwitch();

//$(function () { $('.mytooltip').tooltip();});
//$(function () { $('.tooltip-camera-open').tooltip();});
//$(function () { $('.tooltip-camera-close').tooltip();});
//$(function () { $('.tooltip-volume-up').tooltip();});
//$(function () { $('.tooltip-volume-off').tooltip();});
//$(function () { $('.tooltip-link').tooltip();});
//$(function () { $('.tooltip-unlink').tooltip();});
//$(function () { $('.tooltip-teastatus').tooltip();});
//$(function () { $('.tooltip-stustatus').tooltip();});

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

window.setInterval('updatemessage()', 2000);

function postmessage() {
		chattext = $("#chat-text").val();
		console.log(chattext);
		$.post("/chatlist/", {txt:chattext});
		updatemessage();
}

$(document).ready(function () {
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
	        newstudentEl = createStuIconEl(stu_list[si])
	        $("#studentlist").append(newstudentEl);
	        /*
	        $("#btn-video-" + stu_list[si]).on("click",function () {
	        		if ($(this).hasClass('active')){
						console.log($(this).button('reset'));
												
					}else{
						console.log($(this).button('complete'));
						
					}
	        });
	        */
	        $("#btn-sound-" + stu_list[si]).on("click",function () {
	        		if ($(this).hasClass('active')){
						console.log($(this).button('reset'));
						// mute;
						if (activeConversation){
							activeConversation.on('participantConnected', function (participant) {
								log("Participant '" + participant.identity + "' muted");
			        			console.log("Participant '" + participant.identity + "' muted");
			        			participant.media.detach();
			        			participant.on('trackAdded',function (track) {
			        				if (track.kind=='video'){
										track.attach('#media-'+participant.identity);        				
			        				}	
			        			});				
							}); 	  		
		 	  			} 							
					}else{
						console.log($(this).button('complete')); 	  		
						//unmute;
			 	  		if (activeConversation){
							activeConversation.on('participantConnected', function (participant) {
								log("Participant '" + participant.identity + "' unmuted");
			        			console.log("Participant '" + participant.identity + "' unmuted");
			        			participant.media.detach();
			        			participant.media.attach('#media-'+participant.identity);
							
							});}
					}
	        });
	        
	        $("#btn-link-" + stu_list[si]).on("click",function () {
	        		if ($(this).hasClass('active')){
	        			//unlink;
						console.log($(this).button('reset'));
					 	if (activeConversation){
	 	  					activeconversation.disconnect().then(conversationStarted,function(error){
	             			log('Unable to disable conversation');
	             			console.error('Unable to disable conversation', error); 	  			
 	  					});} 							
					}else{
						//link;
						console.log($(this).button('complete'));
						var inviteTo = stu_list[si];
			 	  		var options = {audio:false};
			     		if (activeConversation) {
			         	// Add a participant          
			         	activeConversation.invite(inviteTo, options).then(conversationStarted,
			         	function (error) {
			             		log('Fail to invite');
			             		console.error('Fail to invite', error);         		
			         	});
			         } else {
			         	// Create a conversation
			         	if (previewMedia) {
			        			options.localMedia = previewMedia;
			      		}
			        		conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted,                        
			         		function (error) {
			             		log('Unable to create conversation');
			             		console.error('Unable to create conversation', error);
			         		});}	
								}
				        });
	    }
	    
	    var newteacherEl;
	    for (ti in tea_list) {
	        newteacherEl = createTeaIconEl(tea_list[ti])        
	        $("#teacherlist").append(newteacherEl);
	        $("#btn-media-" + tea_list[ti]).on("click", function () {
	        		console.log("teacher media control");
	        		if ($(this).hasClass('active')){
						console.log($(this).button('reset'));
						if (previewMedia){
				     		previewMedia.detach();   		
				   		previewMedia.stop();
				   		previewMedia = null;
				   		$('div#media-area').empty();
				   		$('div#media-area').append("<h4 id='memo-text'>Ready to Take Class</h4>");
						}						
					}else{
						console.log($(this).button('complete'));
						if (!previewMedia){
				 			previewMedia = new Twilio.Conversations.LocalMedia();	
				  			myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
					  			$('div#media-area').empty();
					  			$('div#media-area').append(createMediaEl('local-media'));
					  			$('div#media-area').append(createMediaEl('remote-media'));
					  			previewMedia.addStream(mediaStream);
								$('div#local-media').append(previewMedia.attach());
							}
				  		,function (error) {
				         	console.error('Unable to access local media', error);
				            log('Unable to access Camera and Microphone'); 			
				  		});} else {
				 			$('div#media-area').empty();
				  			$('div#media-area').append(createMediaEl('local-media'));
				  			$('div#media-area').append(createMediaEl('remote-media'));
				  			previewMedia.addStream(mediaStream);
							$('div#local-media').append(previewMedia.attach());
						}  						
					}
	        });
	    }
	    
	    teastatus_dict = data.teastatuslist;
		 stustatus_dict = data.stustatuslist;    
		 var num_alltea = tea_list.length;
	    var num_allstu = stu_list.length;
	    var num_readytea = teastatus_dict["1"].length;
	    var num_readystu = stustatus_dict["1"].length;
	    var num_onlinetea = teastatus_dict["2"].length;
	    var num_onlinestu = stustatus_dict["2"].length;
	    $("span#num_teainfo").text(num_readytea + " / " + num_onlinetea + " / " + num_alltea);
	    $("span#num_stuinfo").text(num_readystu + " / " +num_onlinestu + " / " + num_allstu);
	 
	   // $(function () { $('#collapseOne').collapse('show')});
	   // $(function () { $('#collapseTwo').collapse('')});
	   // $(function () { $('#collapseThree').collapse('toggle')});
	 
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
	        $.post("/info/", {teastatus:0});
    	 });
	});
});

function createTeaIconEl(user_info){
	var iconContainer = '<div class="col-md-6 margin-bottom-10"> </div>';
	var serviceBoxV1 = 	'<div class="service-box-tea"> </div>';
	var localMedia = '<div id="" class="local-media"> <i class="fa fa-user color-grey"></i></div>';
	var userH = '<h4 id="" class="color-grey"></h4>';
	var buttonTeaPreview = '<button id="" type="button" class="btn btn-primary btn-block btn-xs" data-toggle="button" data-complete-text=""> </button>';
	var iconTeaPreview = '<i class="fa fa-eye color-grey"></i><span> / </span><i class="fa fa-microphone color-grey"></i><span>  PREVIEW</span>';
	var iconTeaClose = '<i class="fa fa-eye-slash color-grey"></i><span> / </span><i class="fa fa-microphone-slash color-grey"></i><span>  CLOSE</span>';
	
	var iconContainerEl = $(iconContainer);
	var serviceBoxV1El = $(serviceBoxV1);
	var localMediaEl = $(localMedia);
	var userHEl = $(userH);
	var buttonTeaPreviewEl = $(buttonTeaPreview);
	
	localMediaEl.attr("id", "media-" + user_info);
	userHEl.append(user_info);	
	buttonTeaPreviewEl.attr("id","btn-media-" + user_info);
	buttonTeaPreviewEl.attr("data-complete-text", iconTeaClose);
	buttonTeaPreviewEl.append(iconTeaPreview);
	
	serviceBoxV1El.append(localMediaEl);
	serviceBoxV1El.append(userHEl);	
	iconContainerEl.append(serviceBoxV1El);	
	iconContainerEl.append(buttonTeaPreviewEl);
	//return "<div class='col-md-6 margin-bottom-10'><div id='service-box-" + user_info + "' class='service-box-v1'><div id='media_" + user_info + "' class='remote-media'> <i class='fa fa-user color-grey'></i></div><h4 id='name_" + user_info +"' class='color-grey'>" + user_info + "</h4></div> <button id='media_preview' type='button' class='btn btn-primary btn-block btn-xs' data-toggle='button'><i class='fa fa-eye color-grey'></i><span> / </span><i class='fa fa-microphone color-grey'></i><span>  PREVIEW</span></button></div>";
	return iconContainerEl
}


function createStuIconEl(user_info){
	var iconContainer = '<div class="col-md-6 margin-bottom-10"> </div>';
	var serviceBoxV1 = 	'<div class="service-box-stu"> </div>';
	var remoteMedia = '<div id="" class="remote-media"> <i class="fa fa-user color-grey"></i></div>';
	var userH = '<h4 id="" class="color-grey"></h4>';
	
	var buttonStuGroup = '<div class= "btn-group-vertical btn-block btn-group-xs"> </div>';
	var buttonStuVideo = '<button id="" type="button" class="btn btn-primary" data-toggle="button" data-complete-text=""></button>';
	var buttonStuSound = '<button id="" type="button" class="btn btn-success"  data-toggle="button" data-complete-text=""></button>';
	var buttonStuLink = '<button id="" type="button" class="btn btn-info" data-toggle="button" data-complete-text=""></button>';
	var iconStuVideo = '<i class="fa fa-eye color-grey"></i><span></span>'
	var iconStuVideoOff = '<i class="fa fa-eye-slash color-grey"></i><span></span>'	
	var iconStuSound = '<i class="fa fa-volume-up color-grey"></i><span></span>'
	var iconStuSoundOff = '<i class="fa fa-volume-off color-grey"></i><span></span>'
	var iconStuLink = '<i class="fa fa-link color-grey"></i><span></span>'
	var iconStuLinkOff = '<i class="fa fa-unlink color-grey"></i><span></span>'
	
	
	var iconContainerEl = $(iconContainer);
	var serviceBoxV1El = $(serviceBoxV1);
	var remoteMediaEl = $(remoteMedia);
	var userHEl = $(userH);
	var buttonStuGroupEl = $(buttonStuGroup);
	var buttonStuVideoEl = $(buttonStuVideo);
	var buttonStuSoundEl = $(buttonStuSound);
	var buttonStuLinkEl = $(buttonStuLink);	
	
	remoteMediaEl.attr("id", "media-" + user_info);
	userHEl.append(user_info);	
	serviceBoxV1El.append(remoteMediaEl);
	serviceBoxV1El.append(userHEl);
		
	//buttonStuVideoEl.attr("id","btn-video-" + user_info);
	buttonStuSoundEl.attr("id","btn-sound-" + user_info);
	buttonStuLinkEl.attr("id", "btn-link-" + user_info);
	
	//buttonStuVideoEl.attr("data-complete-text", iconStuVideoOff);
	buttonStuSoundEl.attr("data-complete-text", iconStuSoundOff);
	buttonStuLinkEl.attr("data-complete-text", iconStuLinkOff);
	
	//buttonStuVideoEl.append(iconStuVideo);
	buttonStuSoundEl.append(iconStuSound);
	buttonStuLinkEl.append(iconStuLink);
	
	//buttonStuGroupEl.append(buttonStuVideoEl);
	buttonStuGroupEl.append(buttonStuSoundEl);
	buttonStuGroupEl.append(buttonStuLinkEl);
	
		
	iconContainerEl.append(serviceBoxV1El);	
	iconContainerEl.append(buttonStuGroupEl);
	return iconContainerEl
	//return "<div class='col-md-6 margin-bottom-10'><div id='service-box-" + user_info + "' class='service-box-v1 col-md-10 col-md-offset-1'><div id='media_" + user_info + "' class='remote-media'><i class='fa fa-user color-grey'></i> </div><h4 id='name_" + user_info +"' class='color-grey'>" + user_info + "</h4></div> <div class= 'btn-group-vertical btn-block btn-xs'><button id='camera_" +user_info + "' type='button' class='btn btn-primary'><i class='fa fa-eye color-grey'></i></button> <button id='sound_" +user_info + "' type='button' class='btn btn-success'><i class='fa fa-volume-up color-grey'></i></button><button id='link_" +user_info + "' type='button' class='btn btn-info'><i class='fa fa-chain color-grey'></i></button></div></div>";
	//return "<div class='col-md-6 margin-bottom-10'><div id='service-box-" + user_info + "' class='service-box-stu'><div id='media_" + user_info + "' class='remote-media'></div><h4 id='name_" + user_info +"' class='color-white'>" + user_info + "</h4> <div class= 'btn-group-vertical btn-block btn-group-xs' data-toggle='buttons-checkbox'><button id='camera_" +user_info + "' type='button' class='btn btn-primary' data-toggle='toggle'><i class='fa fa-eye color-grey'></i><span></span></button> <button id='sound_" +user_info + "' type='button' class='btn btn-success'  data-toggle='toggle'><i class='fa fa-volume-up color-grey'></i><span></span></button><button id='link_" +user_info + "' type='button' class='btn btn-info' data-toggle='toggle'><i class='fa fa-chain color-grey'></i><span></span></button></div></div></div>";
}

$()



function buttontoggle() {
	
	if ($(this).hasClass('active')){
		console.log("toggle 0");
		//console.log($(this).button('toggle'))
		console.log($(this).button('reset'));
		
	}else{
		console.log("toggle 1");
		//console.log($(this).button('toggle'))
		console.log($(this).button('complete'));
		
	}
	console.log($(this).text);
};	
		

function updateClassInfo() {
	$.getJSON('/info/',function(data){	
		teastatus_dict = data.teastatuslist;
		stustatus_dict = data.stustatuslist;    
		var num_alltea = tea_list.length;
    	var num_allstu = stu_list.length;
    	var num_readytea = teastatus_dict["1"].length;
    	var num_readystu = stustatus_dict["1"].length;
   	var num_onlinetea = teastatus_dict["2"].length;
    	var num_onlinestu = stustatus_dict["2"].length;
    	var newteastatus_str = num_readytea + " / " + num_onlinetea + " / " + num_alltea;
    	var newstustatus_str = num_readystu + " / " +num_onlinestu + " / " + num_allstu;
    	if (teastatus_str!=newteastatus_str || stustatus_str!=newstustatus_str ){  
    		teastatus_str = newteastatus_str;
    		stustatus_str = newstustatus_str;  		
    		$("span#num_teainfo").text(teastatus_str);
    		$("span#num_stuinfo").text(stustatus_str);
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
	   }  	
	});
}

window.setInterval('updateClassInfo()', 3000);


function setTeaConnectedEl(userinfo) {
	console.log("#service-box-" + userinfo);
	//$("#service-box-" + userinfo).css("background", "#d9edf7");
	$("#service-box-" + userinfo).css("background", "green");
	$("#service-box-" + userinfo +" i").css("color", "#fff");
	$("#service-box-" + userinfo +" p").css("color", "#fff");
	$("#service-box-" + userinfo + " h4").css("color", "#fff");
}

function setStuConnectedEl(userinfo) {
	console.log("#service-box-" + userinfo);
	//$("#service-box-" + userinfo).css("background", "##dff0d8");
	$("#service-box-" + userinfo).css("background", "green");
	$("#service-box-" + userinfo +" i").css("color", "#fff");
	$("#service-box-" + userinfo +" p").css("color", "#fff");
	$("#service-box-" + userinfo + " h4").css("color", "#fff");
	//$("#btn-video-" + userinfo).show();
	$("#btn-sound-" + userinfo).show();
	$("#btn-link-" + userinfo).show();
	//$("#btn-video-" + userinfo).addClass("active");
	$("#btn-sound-" + userinfo).removeClass("active");
	$("#btn-link-" + userinfo).addClass("active");
}

function setDisconnectedEl(userinfo) {
	$("#service-box-" + userinfo).css("background", "");
	$("#service-box-" + userinfo +" i").css("color", "");
	$("#service-box-" + userinfo +" p").css("color", "");
	$("#service-box-" + userinfo + " h4").css("color", "");
	console.log("button hided"+ " #btn-sound-" + userinfo);
	//$("#btn-video-" + userinfo).hide();
	$("#btn-sound-" + userinfo).hide();
	$("#btn-link-" + userinfo).hide();
}

function setReadyEl(userinfo) {
	$("#service-box-" + userinfo).css("background", "#d73d04");
	$("#service-box-" + userinfo +" i").css("color", "#fff");
	$("#service-box-" + userinfo +" p").css("color", "#fff");
	$("#service-box-" + userinfo + " h4").css("color", "#fff");
	//$("#btn-video-" + userinfo).show();
	$("#btn-sound-" + userinfo).show();
	$("#btn-link-" + userinfo).show();
	//$("#btn-video-" + userinfo).removeClass("active");
	$("#btn-sound-" + userinfo).removeClass("active");
	$("#btn-link-" + userinfo).removeClass("active");
}



// Successfully connected!
function clientConnected() {
    log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
	 console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
	 $.post("/info/", {teastatus:1});
}

// Bind switch to create conversation
 $('input#remote-conn-all').on('switchChange.bootstrapSwitch', function(e, state) {
 	  if (!state) {
 	  		inviteTo = stustatus_dict['1'];
 	  		var options = {};
     		if (activeConversation) {
         	// Add a participant          
         	activeConversation.invite(inviteTo, options).then(conversationStarted,
         	function (error) {
             		log('Fail to invite');
             		console.error('Fail to invite', error);         		
         	});
         } else {
         	// Create a conversation
         	if (previewMedia) {
        			options.localMedia = previewMedia;
      		}
        		conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted,                        
         		function (error) {
             		log('Unable to create conversation');
             		console.error('Unable to create conversation', error);
         		});}	 	  
 	  }else {
 	  		if (activeConversation){
 	  			activeconversation.disconnect().then(conversationStarted,function(error){
             		log('Unable to disable conversation');
             		console.error('Unable to disable conversation', error); 	  			
 	  			});} 	  	
 	  }
 });
 
 	//Bind switch to sound control
 $('input#remote-volume-all').on('switchChange.bootstrapSwitch', function(e, state) {
 	  if (state) {	 
 	  		//previewMedia.unmute()
 	  		if (activeConversation){
				activeConversation.on('participantConnected', function (participant) {
					log("Participant '" + participant.identity + "' unmuted");
        			console.log("Participant '" + participant.identity + "' unmuted");
        			participant.media.detach();
        			participant.media.attach('#media-'+participant.identity);
				
				}); 	  		
 	  		}
 	  }else {
 			//previeMedia.mute()
 	  		if (activeConversation){
				activeConversation.on('participantConnected', function (participant) {
					log("Participant '" + participant.identity + "' muted");
        			console.log("Participant '" + participant.identity + "' muted");
        			participant.media.detach();
        			participant.on('trackAdded',function (track) {
        				if (track.kind=='video'){
							track.attach('#media-'+participant.identity);        				
        				}	
        			});
				
				}); 	  		
 	  		} 			
 	  }
 
 });    

// Conversation is live
function conversationStarted(conversation) {
    log('In an active Conversation');
    console.log('In an active Conversation');
    activeConversation = conversation;
    // Draw local video, if not already previewing
    if (!previewMedia) {
        conversation.localMedia.attach('#local-media');
    }else {
    	  previewMedia.detach();   		
   	  previewMedia.stop();
   	  previewMedia = null;
    	  $('div#media-area').empty();
	  	  $('div#media-area').append(createMediaEl('local-media'));
	  	  $('div#media-area').append(createMediaEl('remote-media'));
    	  conversation.localMedia.attach('#local-media');
    }

    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        console.log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#media_'+participant.identity);
        setConnectedEl(participant.identity);
        $.post("/info/", {teastatus:2});
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
        $.post("/info/", {teastatus:1});
        for (ti in tea_list) {
        		setDisconnectedEl(tea_list[ti]);
        }
        for (si in stu_list) {
        		setDisconnectedEl(stu_list[si]);
        }
        
    });
}

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
				//$.post("/info/", {teastatus:2});
			}
  		,function (error) {
         	console.error('Unable to access local media', error);
            log('Unable to access Camera and Microphone'); 			
  		});} else {
 			$('div#media-area').empty();
  			$('div#media-area').append(createMediaEl('local-media'));
  			$('div#media-area').append(createMediaEl('remote-media'));
  			previewMedia.addStream(mediaStream);
			$('div#local-media').append(previewMedia.attach());
			//$.post("/info/", {teastatus:2});
		}  	
   } else {
   	if (previewMedia){
     		previewMedia.detach();   		
   		previewMedia.stop();
   		previewMedia = null;
   		$('div#media-area').empty();
   		$('div#media-area').append("<h4 id='memo-text'>Ready to Take Class</h4>")
   		//$.post("/info/", {teastatus:1});
		}
 	}       

});

function createMediaEl(id_name){
	return "<div id='" + id_name + "'class='margin-bottom-10'></div>"
}

// Activity log
function log(message) {
    document.getElementById('log-content').innerHTML = message;
}

window.onload = function() {
	var myCanvas = document.getElementById("myCanvas");
	var ctx = myCanvas.getContext("2d");
    
    // Fill Window Width and Height
    myCanvas.width = window.innerWidth;
	myCanvas.height = window.innerHeight;
	
	// Set Background Color
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
	
    // Mouse Event Handlers
	if(myCanvas){
		var isDown = false;
		var canvasX, canvasY;
		ctx.lineWidth = 5;
		
		$(myCanvas)
		.mousedown(function(e){
			isDown = true;
			ctx.beginPath();
			canvasX = e.pageX - myCanvas.offsetLeft;
			canvasY = e.pageY - myCanvas.offsetTop;
			ctx.moveTo(canvasX, canvasY);
		})
		.mousemove(function(e){
			if(isDown !== false) {
				canvasX = e.pageX - myCanvas.offsetLeft;
				canvasY = e.pageY - myCanvas.offsetTop;
				ctx.lineTo(canvasX, canvasY);
				ctx.strokeStyle = "#000";
				ctx.stroke();
			}
		})
		.mouseup(function(e){
			isDown = false;
			ctx.closePath();
		});
	}
	
	// Touch Events Handlers
	draw = {
		started: false,
		start: function(evt) {

			ctx.beginPath();
			ctx.moveTo(
				evt.touches[0].pageX,
				evt.touches[0].pageY
			);

			this.started = true;

		},
		move: function(evt) {

			if (this.started) {
				ctx.lineTo(
					evt.touches[0].pageX,
					evt.touches[0].pageY
				);

				ctx.strokeStyle = "#000";
				ctx.lineWidth = 5;
				ctx.stroke();
			}

		},
		end: function(evt) {
			this.started = false;
		}
	};
	
	// Touch Events
	myCanvas.addEventListener('touchstart', draw.start, false);
	myCanvas.addEventListener('touchend', draw.end, false);
	myCanvas.addEventListener('touchmove', draw.move, false);
	
	// Disable Page Move
	document.body.addEventListener('touchmove',function(evt){
		evt.preventDefault();
	},false);
};