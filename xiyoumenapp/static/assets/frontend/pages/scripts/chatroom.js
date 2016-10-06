// BEGIN CHATROOM CODE

var chatname;
var chatrole;
// var e = jQuery.Event("changed.chatmessage");
var chat_source = new EventSource("/stream?channel=changed.chatroom");


//  Show slimScroll bar at chatroom
$(function(){
    "use strict";
    $('.general-item-list').slimScroll({
        width: '100%',
        height: '380px',
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


// Insert message of chat contents.
function insertmessage(chatname, chattime, chatmessage, chatrole){
    "use strict";
    var roleicon;
    if (chatrole==="teacher"){
        //roleicon = 'style="text-shadow: black 5px;color:#d9edf7"';
        roleicon = 'style="text-shadow: black 5px;color:'+rolecolor_tea+'"';
    }
    if (chatrole==="assistant"){
        //roleicon = 'style="text-shadow: black 5px;color:#d9edf7"';
        roleicon = 'style="text-shadow: black 5px;color:'+rolecolor_ass+'"';
    }
    if (chatrole==="student") {
        //roleicon = 'style="text-shadow: black 5px;color:#dff0d8"';
        roleicon = 'style="text-shadow: black 5px;color:'+rolecolor_stu+'"';
    }
    var inserthtml = '<div class="item"><div class="item-head"><div class="item-details" ><i class="fa fa-user" ' + roleicon + '> </i> <a href="" class="item-name primary-link"> ' + chatname + '</a><span class="item-label"> ' + chattime + '</span></div></div><div class="item-body">'+ chatmessage +'</div></div>';
    //console.log(inserthtml);
    $("div#chat-message-list").prepend(inserthtml);
}


// Send message of chat content.
$("button#chat-submit").click(function(){
    "use strict";
    var chattext = $("input#chat-text").val();
    //console.log(chattext);
    $.post("/chatlist/", {txt:chattext});
    $("input#chat-text").val("");
    // $("div#chat-message-list").trigger(e, [chattext]);
});


// Inintial all chatmessage from endpoint /chatlist/
$(document).ready(function() {
    "use strict";
    $.getJSON("/chatlist/", function (data) {
        var listmessage = data.chatcontent;
        var listoldmessage = $("#chat-message-list").children();
        var num_chatolditem = listoldmessage.length;
        for (var item in listmessage) {
            if ( listmessage.hasOwnProperty(item)){
                //console.log(item);
                if (num_chatolditem <= item){
                    var chat_item = listmessage[item];
                    chatname = chat_item.username;
                    var chattime = chat_item.createtime;
                    var chatmessage = chat_item.question;
                    chatrole = chat_item.rolename;
                    insertmessage(chatname, chattime, chatmessage, chatrole);
                }
            }
        }
    });
});



chat_source.addEventListener("newchatmessage",function(event){
    "use strict";
    var data = JSON.parse(event.data);
    var newmessge_dict = data.message;
    console.log(newmessge_dict);
    chatname = newmessge_dict.username;
    var chattime = newmessge_dict.createtime;
    var chatmessage = newmessge_dict.question;
    chatrole = newmessge_dict.rolename;
    insertmessage(chatname, chattime, chatmessage, chatrole);
}, false);


// listenning to the event "change.chatmessage", and update the new message
// $("div#chat-message-list").on("changed.chatmessage",function(event, chattext){
//     "use strict";
//     console.log(chattext);
//     var messagedatetime = new Date();
//     var chattime = messagedatetime.toLocaleDateString();
//     var chatmessage = chattext;
//     insertmessage(chatname, chattime, chatmessage, chatrole);
// });


// // Send message of chat content.
// function postmessage() {
//     "use strict";
//     var chattext = $("#chat-text").val();
//     console.log(chattext);
//     $.post("/chatlist/", {txt:chattext});
//     updatemessage();
// }
// 

// // Update new chat message as interval 2 seconds;
// window.setInterval(function() {
//     "use strict";
//     $.getJSON("/chatlist/", function (data) {
//         var listmessage = data.chatcontent;
//         var listoldmessage = $("#chat-message-list").children();
//         var num_chatolditem = listoldmessage.length;
//         for (var item in listmessage) {
//             if ( listmessage.hasOwnProperty(item)){
//                 //console.log(item);
//                 if (num_chatolditem <= item){
//                     var chat_item = listmessage[item];
//                     chatname = chat_item.username;
//                     var chattime = chat_item.createtime;
//                     var chatmessage = chat_item.question;
//                     chatrole = chat_item.rolename;
//                     insertmessage(chatname, chattime, chatmessage, chatrole);
//                 }
//             }
//         }
//     });
// }, 2000);


//Update message of  chat contents.
// function updatemessage(){
//     "use strict";
//     $.getJSON("/chatlist/", function (data) {
//         // console.log(data.classname);
//         // console.log(data.chatcontent);
//         var listmessage = data.chatcontent;
//         //var num_chatitem = listmessage.length;
//         var listoldmessage = $("#chat-message-list").children();
//         var num_chatolditem = listoldmessage.length;
//         // console.log(num_chatitem);
//         // console.log(num_chatolditem);
//         for (var item in listmessage) {
//             if ( listmessage.hasOwnProperty(item)){
//                 console.log(item);
//                 if (num_chatolditem <= item){
//                     var chat_item = listmessage[item];
//                     var chatname = chat_item.username;
//                     var chattime = chat_item.createtime;
//                     var chatmessage = chat_item.question;
//                     var chatrole = chat_item.rolename;
//                     insertmessage(chatname, chattime, chatmessage, chatrole);
//                 }
//             }
//         }
//     });
// }

// window.setInterval('updatemessage()', 2000);

// Show or popover chat input of chatroom
// $(function ()
//       {
//         "use strict";
//         $("input#chat-ask").popover();
//       });

// END CHATROOM CODE