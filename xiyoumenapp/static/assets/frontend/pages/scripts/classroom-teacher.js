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
var camera_status = 0;

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

$.fn.bootstrapSwitch.defaults.state = true;
$("input#camera-preview").bootstrapSwitch();
$("input#remote-volume-all").bootstrapSwitch();
$("input#remote-conn-all").bootstrapSwitch();


$.getJSON('/info/',function(data){
	classname = data.classname;
	username = data.username;
	stu_list = data.student;	
	
    console.log(classname);
	$("title").text(classname);
	$("#classname").text(classname);
	$("#username").text(username);

    var newstudentEl;
    for (si in stu_list) {
        newStudentEl = "<div class='col-md-6 margin-bottom-10'><div class='service-box-v1'><div id='media_" + stu_list[si] + "' class='remote-media'><i class='fa fa-user color-grey'></i></div><h4 id='name_" + stu_list[si] +"' class='color-grey'>" + stu_list[si] + "</h4></div></div>";
        $("#studentlist").append(newStudentEl);
    }
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
    log("Connected to Twilio. Listening for incoming Invites as '" + conversationsClient.identity + "'");

    conversationsClient.on('invite', function (invite) {
        log('Incoming invite from: ' + invite.from);
        invite.accept().then(conversationStarted);
    });

    // Bind button to create conversation
    document.getElementById('button-invite').onclick = function () {
        // var inviteTo = document.getElementById('invite-to').value;
        //inviteTo = stu_list;
        if (activeConversation) {
            // Add a participant          
            activeConversation.invite(inviteTo);
            } else {
            // Create a conversation
            var options = {};
            if (previewMedia) {
                options.localMedia = previewMedia;
            }
	
            conversationsClient.inviteToConversation(inviteTo, options).then(
            conversationStarted,                        
            function (error) {
                log('Unable to create conversation');
                console.error('Unable to create conversation', error);
            });
        }
    };
}

// Conversation is live
function conversationStarted(conversation) {
    log('In an active Conversation');
    activeConversation = conversation;
    // Draw local video, if not already previewing
    if (!previewMedia) {
        conversation.localMedia.attach('#local-media');
    }

    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
        log("Participant '" + participant.identity + "' connected");
        participant.media.attach('#remote-media');
    });

    // When a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
        log("Participant '" + participant.identity + "' disconnected");
    });

    // When the conversation ends, stop capturing local video
    conversation.on('disconnected', function (conversation) {
        log("Connected to Twilio. Listening for incoming Invites as '" + conversationsClient.identity + "'");
        conversation.localMedia.stop();
        conversation.disconnect();
        activeConversation = null;
    });
}


//  Local video preview
$('input#camera-preview').on('switchChange.bootstrapSwitch', function(e, state) {
		
  	if (!state){
  		if (!previewMedia){
 		previewMedia = new Twilio.Conversations.LocalMedia();	
  		myLocalMedia = Twilio.Conversations.getUserMedia().then(function (mediaStream) {
  			previewMedia.addStream(mediaStream);
			var localMediaEl = previewMedia.attach();
			$('div#local-media').append(localMediaEl);}
  		,function (error) {
         	console.error('Unable to access local media', error);
            log('Unable to access Camera and Microphone'); 			
  		});  
   	} else {
			var localMediaEl = previewMedia.attach();
			$('div#local-media').append(localMediaEl);
		}  	
   } else {
   	if (previewMedia){
     		previewMedia.detach();   		
   		previewMedia.removeStream;
		}
 	}       

});


/*

//  Local video preview
$('input#camera-preview').on('switchChange.bootstrapSwitch', function(e, state) {
  console.log(this); // DOM element
  console.log(event); // jQuery event
  console.log(state); // true | false
  
  	if (!previewMedia){
  		previewMedia = new Twilio.Conversations.LocalMedia();
  		if (state==false){        
        Twilio.Conversations.getUserMedia().then(
          function (mediaStream) {
            previewMedia.addStream(mediaStream);
				// previewMedia.attach('div#local-media');            
            var localMediaEl = previewMedia.attach();
            $('div#local-media').append(localMediaEl)
          },
          function (error) {
            console.error('Unable to access local media', error);
            log('Unable to access Camera and Microphone');
 				});}
 		else {
 			Twilio.Conversations.getUserMedia().then(
          function (mediaStream) {
            previewMedia.detach();
          });
 		}       
    }
    	  

});
*/
// Activity log
function log(message) {
    document.getElementById('log-content').innerHTML = message;
}
