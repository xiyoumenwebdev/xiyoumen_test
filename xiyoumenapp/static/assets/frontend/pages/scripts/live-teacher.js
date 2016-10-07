// BEGIN LIVE CODE

// predefine the variables.

var conversationsClient;
var activeConversation;
var conversation;
var previewMedia;
var myLocalMedia;

var identity;
var token;

var e_tealink = jQuery.Event("changed.tealinkstatus");
var e_teavideo = jQuery.Event("changed.teavideostatus");
var e_teasound = jQuery.Event("changed.teasoundstatus");
var e_asslink = jQuery.Event("changed.asslinkstatus");
var e_assvideo = jQuery.Event("changed.assvideostatus");
var e_asssound = jQuery.Event("changed.asssoundstatus");
var e_stulink = jQuery.Event("changed.stulinkstatus");
var e_stuvideo = jQuery.Event("changed.stuvideostatus");
var e_stusound = jQuery.Event("changed.stusoundstatus");

var stulink_source = new EventSource("/stream?channel=changed.stulink");
var asslink_source = new EventSource("/stream?channel=changed.asslink");

var classstr;

$.getJSON("/info/", function (data) {
    "use strict";
    classstr = data.classstr;
}).then(function(){
    "use strict";
    var myeventtypestu = "newstulinkstatus"+classstr;
    var myeventtypeass = "newasslinkstatus"+classstr;

    console.log(myeventtypestu);
    console.log(myeventtypeass);
    stulink_source.addEventListener(myeventtypestu,function(event){
        // "use strict";
        var data = JSON.parse(event.data);
        stulinkstatus_dict = data.stulinkstatus;
        $("#studentlist").trigger(e_stulink);
        console.log(stulinkstatus_dict);
    }, false);

    asslink_source.addEventListener(myeventtypeass,function(event){
        // "use strict";
        var data = JSON.parse(event.data);
        asslinkstatus_dict = data.asslinkstatus;
        $("#assistantlist").trigger(e_asslink);
        console.log(asslinkstatus_dict);
    }, false);

});



// Activity log
function log(message) {
    "use strict";
    document.getElementById('log-content').innerHTML = message;
}

// Update link status to status_val;
function updateLinkStatus(roleid, username, status_val){
	"use strict";
    if (roleid==='tea') {
    	$.post("/info/", {tealinkstatus:status_val});
    	for (var ti in tealinkstatus_dict) {
    		if (tealinkstatus_dict.hasOwnProperty(ti)) {
    			var idxt = tealinkstatus_dict[ti].indexOf(username);
    			if (idxt>=0) {tealinkstatus_dict[ti].splice(idxt,1);break;}
    		}
    	}
    	tealinkstatus_dict[status_val].splice(1, 0, username);
	}
    if (roleid==='ass') {
    	$.post("/info/", {asslinkstatus:status_val});
    	for (var ai in asslinkstatus_dict) {
    		if (asslinkstatus_dict.hasOwnProperty(ai)) {
    			var idxa = asslinkstatus_dict[ai].indexOf(username);
    			if (idxa>=0) {asslinkstatus_dict[ai].splice(idxa,1);break;}
    		}
    	}
    	asslinkstatus_dict[status_val].splice(1, 0, username);
	}
    if (roleid==='stu') {
    	$.post("/info/", {stulinkstatus:status_val});
    	for (var si in stulinkstatus_dict) {
    		if (stulinkstatus_dict.hasOwnProperty(si)) {
    			var idxs = stulinkstatus_dict[si].indexOf(username);
    			if (idxs>=0) {stulinkstatus_dict[si].splice(idxs,1);break;}
    		}
    	}
    	stulinkstatus_dict[status_val].splice(1, 0, username);
	}
}

// Update video status to status_val;
function updateVideoStatus(roleid, username, status_val){
	"use strict";
    if (roleid==='tea') {
    	$.post("/info/", {teavideostatus:status_val});
    	for (var ti in teavideostatus_dict) {
    		if (teavideostatus_dict.hasOwnProperty(ti)) {
    			var idxt = teavideostatus_dict[ti].indexOf(username);
    			if (idxt>=0) {teavideostatus_dict[ti].splice(idxt,1);break;}
    		}
    	}
    	teavideostatus_dict[status_val].splice(1, 0, username);
	}
    if (roleid==='ass') {
    	$.post("/info/", {assvideostatus:status_val});
    	for (var ai in assvideostatus_dict) {
    		if (assvideostatus_dict.hasOwnProperty(ai)) {
    			var idxa = assvideostatus_dict[ai].indexOf(username);
    			if (idxa>=0) {assvideostatus_dict[ai].splice(idxa,1);break;}
    		}
    	}
    	assvideostatus_dict[status_val].splice(1, 0, username);
	}
    if (roleid==='stu') {
    	$.post("/info/", {stuvideostatus:status_val});
    	for (var si in stuvideostatus_dict) {
    		if (stuvideostatus_dict.hasOwnProperty(si)) {
    			var idxs = stuvideostatus_dict[si].indexOf(username);
    			if (idxs>=0) {stuvideostatus_dict[si].splice(idxs,1);break;}
    		}
    	}
    	stuvideostatus_dict[status_val].splice(1, 0, username);
	}
}

// Update sound status to status_val;
function updateSoundStatus(roleid, username, status_val){
	"use strict";
    if (roleid==='tea') {
    	$.post("/info/", {teasoundstatus:status_val});
    	for (var ti in teasoundstatus_dict) {
    		if (teasoundstatus_dict.hasOwnProperty(ti)) {
    			var idxt = teasoundstatus_dict[ti].indexOf(username);
    			if (idxt>=0) {teasoundstatus_dict[ti].splice(idxt,1);break;}
    		}
    	}
    	teasoundstatus_dict[status_val].splice(1, 0, username);
	}
    if (roleid==='ass') {
    	$.post("/info/", {asssoundstatus:status_val});
    	for (var ai in asssoundstatus_dict) {
    		if (asssoundstatus_dict.hasOwnProperty(ai)) {
    			var idxa = asssoundstatus_dict[ai].indexOf(username);
    			if (idxa>=0) {asssoundstatus_dict[ai].splice(idxa,1);break;}
    		}
    	}
    	asssoundstatus_dict[status_val].splice(1, 0, username);
	}
    if (roleid==='stu') {
    	$.post("/info/", {stusoundstatus:status_val});
    	for (var si in stusoundstatus_dict) {
    		if (stusoundstatus_dict.hasOwnProperty(si)) {
    			var idxs = stusoundstatus_dict[si].indexOf(username);
    			if (idxs>=0) {stusoundstatus_dict[si].splice(idxs,1);break;}
    		}
    	}
    	stusoundstatus_dict[status_val].splice(1, 0, username);
	}
}




// Successfully connected!
function clientConnected() {
	"use strict";
    log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
    console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
    var newlinkstatus = "2";
    updateLinkStatus(roleid, username, newlinkstatus);
    $("#teacherlist").trigger(e_tealink);
    $("#btn-begin-class").removeAttr("disabled");

    // Click teacher list link button #btn-link-**** to link or unlink.
	$("#btn-link-"+username).on('click', function(){
		if ($(this).hasClass("active")){
			// $(this).button('reset');

			if (conversationsClient) {
				conversationsClient = null;
				log('log out');
	            console.log('log out');
			    var newlinkstatus = "1";
			    updateLinkStatus(roleid, username, newlinkstatus);
			    $("#teacherlist").trigger(e_tealink);
			}
	    }else{
	    	// $(this).button('complete');

	        var accessManager = new Twilio.AccessManager(token);
	        // Check the browser console to see your generated identity.
	        // Send an invite to yourself if you want!
	        console.log(token);
	        // Create a Conversations Client and connect to Twilio
	        conversationsClient = new Twilio.Conversations.Client(accessManager);
	        conversationsClient.listen().then(clientConnected, function (error) {
		        log('Could not connect to Twilio: ' + error.message);
	            console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
			    var newlinkstatus = "2";
			    updateLinkStatus(roleid, username, newlinkstatus);
			    $("#teacherlist").trigger(e_tealink);
	        });
	    }

	});

    // Click teacher list video button #btn-video-**** to preview or close camera.
	$("button#btn-video-"+username).on('click', function(){
		if ($(this).hasClass("active")){
		    $(this).button('reset');
		    $("div#media-"+username + ">i").removeClass("hidden");
			if (previewMedia){
	            previewMedia.detach();
	            previewMedia.stop();
	            previewMedia = null;
	        }
		}else{
		    $(this).button('complete');
		    $("div#media-"+username + ">i").addClass("hidden");
			if (!previewMedia){
		        previewMedia = new Twilio.Conversations.LocalMedia();
		        myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
			        	previewMedia.addStream(mediaStream);
			        	$("div#media-"+username).append(previewMedia.attach());
			        },function (error) {
			            console.error('Unable to access local media', error);
			            log('Unable to access Camera and Microphone');
			        });
		    } else {
		        previewMedia.addStream(mediaStream);
		        $("div#media-"+username).append(previewMedia.attach());
		    }
		}
	});

 //    // Click teacher list sound button #btn-sound-**** to volume-up or volume-mute.
	// $("button#btn-sound-"+username).on('click', function(){
	// 	if ($(this).hasClass("active")){
	// 	    $(this).button('reset');
	// 	    $("div#media-"+username + ">i").removeClass("hidden");
	// 		if (previewMedia){
	//             previewMedia.detach();
	//             previewMedia.stop();
	//             previewMedia = null;
	//         }
	// 	}else{
	// 	    $(this).button('complete');
	// 	    $("div#media-"+username + ">i").addClass("hidden");
	// 		if (!previewMedia){
	// 	        previewMedia = new Twilio.Conversations.LocalMedia();
	// 	        myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
	// 		        	previewMedia.addStream(mediaStream);
	// 		        	$("div#media-"+username).append(previewMedia.attach());
	// 		        },function (error) {
	// 		            console.error('Unable to access local media', error);
	// 		            log('Unable to access Camera and Microphone');
	// 		        });
	// 	    } else {
	// 	        previewMedia.addStream(mediaStream);
	// 	        $("div#media-"+username).append(previewMedia.attach());
	// 	    }
	// 	}
	// });

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
		    var newlinkstatus = "1";
		    updateLinkStatus(roleid, username, newlinkstatus);
		    $("#teacherlist").trigger(e_tealink);
		    // $("span#num_"+roleid+"info").trigger(e_tealink);
        });
    });

});






// Conversation is live
function conversationStarted(conversation) {
	"use strict";
    log('In an active Conversation');
    console.log('In an active Conversation');


    activeConversation = conversation;
    // Draw local video, if not already previewing
    // $("div#button-area").addClass(hidden);
    // $("div#local-media").removeClass(hidden);
    // $("div#remote-media").removeClass(hidden);

    if (!previewMedia) {
        $("div#local-media").append(conversation.localMedia.attach());
        $("div#media-"+username).append(conversation.localMedia.attach());
        // $("div#local-media").append(conversation.localMedia.attach('#local-media'));
    }else {
	    previewMedia.detach();
	    previewMedia.stop();
	    previewMedia = null;
        $("div#local-media").append(conversation.localMedia.attach());
        $("div#media-"+username).append(conversation.localMedia.attach());
	    // $("div#local-media").append(conversation.localMedia.attach('#local-media'));
    }

    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        console.log("Participant '" + participant.identity + "' connected");
        var remotemediaEL = participant.media.attach();
        // var remotemediaEL = participant.media.attach('#media_'+participant.identity);
        $("div#media-"+participant.identity).append(remotemediaEL);

        setConnectedEl(participant.identity);
        $.post("/info/", {tealinkstatus:2});
        $("button#btn-begin-class").button('complete');
    });

    conversation.on('participantFailed', function(participant) {
        log('Participant failed to connect: ' + participant.identity);
        console.log('Participant failed to connect: ' + participant.identity);
        setDisconnectedEl(participant.identity);
        $("button#btn-begin-class").button('reset');
     });

    // When a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
        log("Participant '" + participant.identity + "' disconnected");
        console.log("Participant '" + participant.identity + "' disconnected");
        setDisconnectedEl(participant.identity);
	    $("button#btn-begin-class").button('reset');

    });

    // When the conversation ends, stop capturing local video
    conversation.on('disconnected', function (conversation) {
        log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        console.log("Listening for incoming Invites as '" + conversationsClient.identity + "'");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
        $.post("/info/", {tealinkstatus:1});
        for (var ti in tea_list) {
        	if (tea_list.hasOwnProperty(ti)){
                setDisconnectedEl(tea_list[ti]);
            }
        }
        for (var si in stu_list) {
        	if (stu_list.hasOwnProperty(si)){
                setDisconnectedEl(stu_list[si]);
            }
        }

    });
}




// listenning on changed.tealinkstatus event for teacher.
$("#teacherlist").on("changed.tealinkstatus", function(event){
    "use strict";
	changeLinkStatusIcon("tea");
});

// listenning on changed.teavideostatus event for teacher.
$("#teacherlist").on("changed.teavideostatus", function(event){
    "use strict";
	changeVideoStatusButton("tea");
});

// listenning on changed.teasoundstatus event for teacher.
$("#teacherlist").on("changed.teasoundstatus", function(event){
    "use strict";
	changeSoundStatusButton("tea");
});


// listenning on changed.asslinkstatus event for assistant.
$("#assistantlist").on("changed.asslinkstatus", function(event){
    "use strict";
	changeLinkStatusIcon("ass");
});

// listenning on changed.assvideostatus event for assistant.
$("#assistantlist").on("changed.assvideostatus", function(event){
    "use strict";
	changeVideoStatusButton("ass");
});

// listenning on changed.asssoundstatus event for assistant.
$("#assistantlist").on("changed.asssoundstatus", function(event){
    "use strict";
	changeSoundStatusButton("ass");
});


// listenning on changed.stulinkstatus event for student.
$("#studentlist").on("changed.stulinkstatus", function(event){
    "use strict";
	changeLinkStatusIcon("stu");
});

// listenning on changed.stuvideostatus event for student.
$("#studentlist").on("changed.stuvideostatus", function(event){
    "use strict";
	changeVideoStatusButton("stu");
});

// listenning on changed.stusoundstatus event for student.
$("#studentlist").on("changed.stusoundstatus", function(event){
    "use strict";
	changeSoundStatusButton("stu");
});



// Begin to take class with button "btn-begin-class" click
$("button#btn-begin-class").click(function(){
	"use strict";
	if ($(this).hasClass("active")){

	    if (activeConversation){
	        activeconversation.disconnect().then(conversationStarted,function(error){
	            log('Unable to disable conversation');
	            console.error('Unable to disable conversation', error);
	            $("button#btn-begin-class").button('complete');
	        });}

    }else{
    	$(this).button('loading');

	    $("div#button-area").css({"height":"10%","padding-top":"0px"});
	    $("div#local-media").removeClass('hidden');
	    $("div#remote-media").removeClass('hidden');
	    $("div#local-media").css({"border-top":"1px solid #cececc"});
		var inviteTo = stulinkstatus_dict['1'];
        var options = {};
        if (activeConversation) {
	        // Add a participant
	        // $(this).button('complete');
	        activeConversation.invite(inviteTo, options).then(conversationStarted,
	            function (error) {
	                    log('Fail to invite');
	                    console.error('Fail to invite', error);
	                    $("button#btn-begin-class").button('reset');
	            });
    	}else {
            // Create a conversation
            // options = {};
            /*if (previewMedia) {
                    options.localMedia = previewMedia;
            }else {
		        previewMedia = new Twilio.Conversations.LocalMedia();
                options.localMedia = previewMedia;
            }*/
            // $(this).button('complete');
            conversationsClient.inviteToConversation(inviteTo, options).then(conversationStarted,
                function (error) {
                    log('Unable to create conversation');
                    console.error('Unable to create conversation', error);
                    $("button#btn-begin-class").button('reset');
                });
        }
    }

});















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



// END LIVE CODE