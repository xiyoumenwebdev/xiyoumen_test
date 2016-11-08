// BEGIN CHATROOM CODE

var chatname;
var chatrole;
var chatlocalnum;
//var classidstr;


var chat_source = new EventSource("/stream?channel=changed.chatroom");

// Insert message of chat contents.
function insertmessage(chatname, chattime, chatmessage, chatrole){
    "use strict";
    var roleicon;
    var itembackgroundcolor;
    var chatheight;
    if (chatrole==="teacher"){
        //roleicon = 'style="text-shadow: black 5px;color:#d9edf7"';
        roleicon = 'style="text-shadow: black 5px;color:'+rolecolor_tea+'"';
        itembackgroundcolor = '#FCEC97';
    }
    if (chatrole==="student") {
        //roleicon = 'style="text-shadow: black 5px;color:#dff0d8"';
        roleicon = 'style="text-shadow: black 5px;color:'+rolecolor_stu+'"';
        itembackgroundcolor = '#94D6F7';
    }
    var inserthtml = '<div class="item" style="background-color:'+itembackgroundcolor+'"><div class="item-head"><div class="item-details" ><i class="fa fa-user" ' + roleicon + '> </i> <a href="" class="item-name primary-link"> ' + chatname + '</a><span class="item-label" style="color:#666666"> ' + chattime + '</span></div></div><div class="item-body" style="color:#666666">'+ chatmessage +'</div></div>';
    // $(inserthtml).css("background-color",itembackgroundcolor);#FFFFFF
    // console.log(inserthtml);
    // $("div#chat-message-list").prepend(inserthtml);
    $("div#chat-message-list").append(inserthtml);
    // console.log($("div#chat-message-list").scrollTop());
    // console.log($("div#chat-message-list .item:first").position().top);
    // console.log($("div#chat-message-list .item:last").position().top);
    chatheight = $("div#chat-message-list .item:last").position().top - $("div#chat-message-list .item:first").position().top;
    // console.log(chatheight);
    $("div#chat-message-list").scrollTop(chatheight);
    // console.log($("div#chat-message-list").scrollHeight);
}

var classstr;




// Inintial all chatmessage from endpoint /chatlist/
$(document).ready(function() {
    "use strict";
    $.getJSON("/chatlist/", function (data) {
        var listmessage = data.chatcontent;
        console.log(listmessage);
        for (var item in listmessage) {
            if ( listmessage.hasOwnProperty(item)){
                //console.log(item);
                var chat_item = listmessage[item];
                chatname = chat_item.username;
                chatrole = chat_item.rolename;
                var chattime = chat_item.createtime;
                var chatmessage = chat_item.question;
                insertmessage(chatname, chattime, chatmessage, chatrole);
            }
        }
    });

    $.getJSON("/info/", function (data) {
        // "use strict";
        classstr = data.classstr;
        username = data.username;
    }).then(function(){
        // "use strict";
        var myeventtype = "newchatmessage"+classstr;
        console.log(myeventtype);

        chat_source.addEventListener(myeventtype,function(event){
            var data = JSON.parse(event.data);
            var newmessge_dict = data.message;
            console.log(newmessge_dict);
            chatname = newmessge_dict.username;
            var chattime = newmessge_dict.createtime;
            var chatmessage = newmessge_dict.question;
            chatrole = newmessge_dict.rolename;
            var chatnum = newmessge_dict.chatnum;
            if (chatname!==username) {
                insertmessage(chatname, chattime, chatmessage, chatrole);
            }
        }, false);
    });

});


//  Show slimScroll bar at chatroom
$(function(){
    "use strict";
    $('.general-item-list').slimScroll({
        width: '100%',
        height: '230px',
        size: '5px',
        position: 'right',
        color: '#cececc',
        opacity: 0.3,
        alwaysVisible: false,
        distance: '0px',
        start: 'bottom',
        railVisible: false,
        //railColor: '#222',
        //railOpacity: 0.3,
        wheelStep: 5,
        allowPageScroll: false,
        disableFadeOut: false
    });
});




// Send message of chat content.
$("button#chat-submit").click(function(){
    "use strict";
    var chattext = $("input#chat-text").val();
    //console.log(chattext);
    // $.post("/chatlist/", {txt:chattext});
    $.post("/chatlist/", {txt:chattext}, function(data, status){
        // console.log(data);
        // console.log(status);
        if (status=="success") {
            var chatname = data.username;
            var chattime = data.createtime;
            var chatmessage = data.question;
            var chatrole = data.rolename;
            chatlocalnum = data.chatnum;
            insertmessage(chatname, chattime, chatmessage, chatrole);
        }
    });
    $("input#chat-text").val("");
});

// Send message of chat content.
$("input#chat-text").keydown(function(event){
    "use strict";
    // console.log(event.which);
    if (event.which == 13) {
        var chattext = $("input#chat-text").val();
        //console.log(chattext);
        // $.post("/chatlist/", {txt:chattext});
        $.post("/chatlist/", {txt:chattext}, function(data, status){
        // console.log(data);
        // console.log(status);
        if (status==="success") {
            var chatname = data.username;
            var chattime = data.createtime;
            var chatmessage = data.question;
            var chatrole = data.rolename;
            chatlocalnum = data.chatnum;
            insertmessage(chatname, chattime, chatmessage, chatrole);
        }
    });
        $("input#chat-text").val("");
    }
});








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