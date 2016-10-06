// BEGIN PAGE VIEWS CODES
var classid;
var userid;
var classname;
var username;
var stu_list;
var ass_list;
var tea_list;
var tealinkstatus_dict;
var asslinkstatus_dict;
var stulinkstatus_dict;
var teavideostatus_dict;
var assvideostatus_dict;
var stuvideostatus_dict;
var teasoundstatus_dict;
var asssoundstatus_dict;
var stusoundstatus_dict;
var roleid = 'tea';

var rolecolor_tea = "#8A6D3B";
var rolecolor_ass = "#31708F";
var rolecolor_stu = "#3E773F";


// Check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    alert('WebRTC is not available in your browser.');
}

// Show  local time  on topside
function timeit() {
    "use strict";
    var classdatetime = new Date();
    $("#classdate").text(classdatetime.toLocaleDateString());
    $("#classtime").text(classdatetime.toLocaleTimeString());
}
window.setInterval(function(){"use strict";timeit();}, 1000);

// Show  slimScroll bar  at teacherlist and studentlist on right side.
$(function() {
    "use strict";
    $('.userlist').slimScroll({
        width: '100%',
        height: '430px',
        size: '5px',
        position: 'right',
        color: '#cececc',
        opacity: 0.3,
        alwaysVisible: false,
        distance: '0px',
        start: 'top',
        railVisible: false,
        //railColor: '#232323',
        //railOpacity: 0.1,
        wheelStep: 10,
        allowPageScroll: false,
        disableFadeOut: false
    });
});


// Show slimScroll bar at div#remote-media on right side.
$(function() {
    "use strict";
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


// Show Student icon in Student list.
function createIconEl(user_info, roleid) {
    "use strict";
    var iconContainer = '<div class="col-md-6 margin-bottom-10"> </div>';
    var serviceBoxV1 = '<div> </div>';
    var iconMedia = '<div id="" class="icon-media"> <i class="fa fa-user fa-2x color-grey"></i></div>';
    var userH = '<h4 id="" class="color-grey"></h4>';

    var buttonStuGroup = '<div class= "btn-group-vertical btn-block btn-group-xs"> </div>';
    var buttonStuLink = '<button id="" type="button" class="btn btn-primary" data-toggle="button" data-complete-text=""></button>';
    var buttonStuVideo = '<button id="" type="button" class="btn btn-success" data-toggle="button" data-complete-text=""></button>';
    var buttonStuSound = '<button id="" type="button" class="btn btn-info"  data-toggle="button" data-complete-text=""></button>';
    var iconStuVideoOn = '<i class="fa fa-eye color-grey"></i><span></span>';
    var iconStuVideoOff = '<i class="fa fa-eye-slash color-grey"></i><span></span>';
    var iconStuSoundOn = '<i class="fa fa-microphone color-grey"></i><span></span>';
    var iconStuSoundOff = '<i class="fa fa-microphone-slash color-grey"></i><span></span>';
    var iconStuLinkOn = '<i class="fa fa-link color-grey"></i><span></span>';
    var iconStuLinkOff = '<i class="fa fa-unlink color-grey"></i><span></span>';

    var iconContainerEl = $(iconContainer);
    var serviceBoxV1El = $(serviceBoxV1);
    var iconMediaEl = $(iconMedia);
    var userHEl = $(userH);
    var buttonStuGroupEl = $(buttonStuGroup);
    var buttonStuLinkEl = $(buttonStuLink);
    var buttonStuVideoEl = $(buttonStuVideo);
    var buttonStuSoundEl = $(buttonStuSound);

    serviceBoxV1El.addClass("service-box-" + roleid);

    iconMediaEl.attr("id", "media-" + user_info);
    userHEl.append(user_info);

    serviceBoxV1El.append(iconMediaEl);
    serviceBoxV1El.append(userHEl);

    buttonStuLinkEl.attr("id", "btn-link-" + user_info);
    buttonStuLinkEl.attr("data-complete-text", iconStuLinkOn);
    buttonStuLinkEl.append(iconStuLinkOff);

    buttonStuVideoEl.attr("id", "btn-video-" + user_info);
    buttonStuVideoEl.attr("data-complete-text", iconStuVideoOn);
    buttonStuVideoEl.append(iconStuVideoOff);

    buttonStuSoundEl.attr("id", "btn-sound-" + user_info);
    buttonStuSoundEl.attr("data-complete-text", iconStuSoundOn);
    buttonStuSoundEl.append(iconStuSoundOff);

    buttonStuGroupEl.append(buttonStuLinkEl);
    buttonStuGroupEl.append(buttonStuVideoEl);
    buttonStuGroupEl.append(buttonStuSoundEl);

    iconContainerEl.append(serviceBoxV1El);
    iconContainerEl.append(buttonStuGroupEl);
    return iconContainerEl;
}


// Set Icon Ready status of teacher or student
function setIconReadyEl(userinfo) {
    "use strict";
    ($("#media-" + userinfo).parent()).css("background", "#d73d04");
    $("#media-" + userinfo + " i").css("color", "#fff");
    $("#media-" + userinfo + " p").css("color", "#fff");
    ($("#media-" + userinfo).next()).css("color", "#fff");
}


// Set Icon Connected Status of Teacher.
function setIconConnectedEl(userinfo, roleid) {
    "use strict";
    var rolecolor;
    if (roleid === "tea") {rolecolor = rolecolor_tea;}
    if (roleid === "ass") {rolecolor = rolecolor_ass;}
    if (roleid === "stu") {rolecolor = rolecolor_stu;}
    ($("#media-" + userinfo).parent()).css("background", rolecolor);
    $("#media-" + userinfo + " i").css("color", "#fff");
    $("#media-" + userinfo + " p").css("color", "#fff");
    ($("#media-" + userinfo).next()).css("color", "#fff");
}

// Set Icon Disconnected status of teacher
function setIconDisconnectedEl(userinfo, roleid) {
    "use strict";
    var rolecolor;
    if (roleid === "tea") {rolecolor = rolecolor_tea;}
    if (roleid === "ass") {rolecolor = rolecolor_ass;}
    if (roleid === "stu") {rolecolor = rolecolor_stu;}
    ($("#media-" + userinfo).parent()).css("background", "#fff");
    $("#media-" + userinfo + " i").css("color", rolecolor);
    $("#media-" + userinfo + " p").css("color", rolecolor);
    ($("#media-" + userinfo).next()).css("color", rolecolor);
}



// Set button disabled status of student
function setButtonDisabledEl(id_name, btntype) {
    "use strict";
    var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
    $(id_btn).attr("disabled", "disabled");
    $(id_btn).addClass("btn-default");
    $(id_btn).removeClass("btn-primary");
    $(id_btn).removeClass("btn-success");
    $(id_btn).removeClass("btn-info");
}

// Set button disabled status of student
function setButtonEnabledEl(id_name, btntype) {
    "use strict";
    // var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
    var id_btn = "#btn-"+btntype+"-"+id_name;
    $(id_btn).removeAttr("disabled");
    $(id_btn).removeClass("btn-default");
    if (btntype === "link") {
        $(id_btn).addClass("btn-primary");
    }
    if (btntype === "video") {
        $(id_btn).addClass("btn-success");
    }
    if (btntype === "sound") {
        $(id_btn).addClass("btn-info");
    }
}

// Set button active status of student
function setButtonOffEl(id_name, btntype) {
    "use strict";
    // var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
    var id_btn = "#btn-"+btntype+"-"+id_name;
    $(id_btn).removeClass("active");
    console.log($(id_btn).hasClass("active"));
}

// Set button ready status of student
function setButtonOnEl(id_name, btntype) {
    "use strict";
    // var id_btn = "button[id^='btn-"+btntype+"-"+id_name+"']";
    var id_btn = "#btn-"+btntype+"-"+id_name;
    $(id_btn).addClass("active");
    console.log($(id_btn).hasClass("active"));
}



// Set Badge Icon num according to linkstatus;
function SetStatusBadgeEl(id_badge, linkstatus_dict) {
    "use strict";
    var num_all = 0;
    for (var item in linkstatus_dict) {
        if (linkstatus_dict.hasOwnProperty(item)){
            num_all = num_all + linkstatus_dict[item].length;
        }
    }
    var num_ready = linkstatus_dict["1"].length;
    var num_online = linkstatus_dict["2"].length;
    $(id_badge).text(num_ready + " / " + num_online + " / " + num_all);
}



// Change Icon display according to linkstatus;
function changeLinkStatusIcon(roleid){
    "use strict";
    var linkstatus_dict;
    // console.log(tealinkstatus_dict);
    if (roleid==='tea') {linkstatus_dict=tealinkstatus_dict;}
    if (roleid==='ass') {linkstatus_dict=asslinkstatus_dict;}
    if (roleid==='stu') {linkstatus_dict=stulinkstatus_dict;}
    // console.log("span#num_"+roleid+"info");
    SetStatusBadgeEl("span#num_"+roleid+"info", linkstatus_dict);

    // status "0" means disconnected
    for (var l0i in linkstatus_dict['0']) {
        if (linkstatus_dict['0'].hasOwnProperty(l0i)){
            if (linkstatus_dict['0'][l0i]===username) {
                setIconDisconnectedEl(linkstatus_dict['0'][l0i], roleid);
                setButtonDisabledEl("", "link");
                setButtonDisabledEl("", "video");
                setButtonDisabledEl("", "sound");
                setButtonEnabledEl(linkstatus_dict['0'][l0i], "link");
                $("#btn-link-"+username).button('reset');
            }else{
                setIconDisconnectedEl(linkstatus_dict['0'][l0i], roleid);
                setButtonEnabledEl(linkstatus_dict['0'][l0i], "link");
                setButtonDisabledEl(linkstatus_dict['0'][l0i], "video");
                setButtonDisabledEl(linkstatus_dict['0'][l0i], "sound");
            }
        }
    }

    // status "1" means ready
    for (var l1i in linkstatus_dict['1']) {
        if (linkstatus_dict['1'].hasOwnProperty(l1i)){
            setIconReadyEl(linkstatus_dict['1'][l1i]);
            setButtonOffEl(linkstatus_dict['1'][l1i], "link");
            setButtonEnabledEl(linkstatus_dict['1'][l1i], "link");
            setButtonDisabledEl(linkstatus_dict['1'][l1i], "video");
            setButtonDisabledEl(linkstatus_dict['1'][l1i], "sound");
            $("#btn-link-"+username).button('reset');
        }
    }

    // status "2" means connected
    for (var l2i in linkstatus_dict['2']) {
        if (linkstatus_dict['2'].hasOwnProperty(l2i)){
            setIconConnectedEl(linkstatus_dict['2'][l2i], roleid);
            setButtonOnEl(linkstatus_dict['2'][l2i], "link");
            setButtonEnabledEl(linkstatus_dict['2'][l2i], "link");
            setButtonEnabledEl(linkstatus_dict['2'][l2i], "video");
            setButtonEnabledEl(linkstatus_dict['2'][l2i], "sound");
            $("#btn-link-"+username).button('complete');
        }
    }

}


// Change Icon display according to video status;
function changeVideoStatusButton(roleid){
    "use strict";
    var videostatus_dict;
    // console.log(tealinkstatus_dict);
    if (roleid==='tea') {videostatus_dict=teavideostatus_dict;}
    if (roleid==='ass') {videostatus_dict=assvideostatus_dict;}
    if (roleid==='stu') {videostatus_dict=stuvideostatus_dict;}

    // status "0" means disconnected
    for (var l0i in videostatus_dict['0']) {
        if (videostatus_dict['0'].hasOwnProperty(l0i)){
            setButtonDisabledEl(videostatus_dict['0'][l0i], "video");
        }
    }

    // status "1" means ready
    for (var l1i in videostatus_dict['1']) {
        if (videostatus_dict['1'].hasOwnProperty(l1i)){
            setButtonEnabledEl(videostatus_dict['1'][l1i], "video");
            setButtonOffEl(videostatus_dict['1'][l1i], "video");
        }
    }

    // status "2" means connected
    for (var l2i in videostatus_dict['2']) {
        if (videostatus_dict['2'].hasOwnProperty(l2i)){
            setButtonEnabledEl(videostatus_dict['2'][l2i], "video");
            setButtonOnEl(videostatus_dict['2'][l2i], "video");
        }
    }

}


// Change Icon display according to sound status;
function changeSoundStatusButton(roleid){
    "use strict";
    var soundstatus_dict;
    // console.log(tealinkstatus_dict);
    if (roleid==='tea') {soundstatus_dict=teasoundstatus_dict;}
    if (roleid==='ass') {soundstatus_dict=asssoundstatus_dict;}
    if (roleid==='stu') {soundstatus_dict=stusoundstatus_dict;}

    // status "0" means disconnected
    for (var l0i in soundstatus_dict['0']) {
        if (soundstatus_dict['0'].hasOwnProperty(l0i)){
            setButtonDisabledEl(soundstatus_dict['0'][l0i], "sound");
        }
    }

    // status "1" means ready
    for (var l1i in soundstatus_dict['1']) {
        if (soundstatus_dict['1'].hasOwnProperty(l1i)){
            setButtonEnabledEl(soundstatus_dict['1'][l1i], "sound");
            setButtonOffEl(soundstatus_dict['1'][l1i], "sound");
        }
    }

    // status "2" means connected
    for (var l2i in soundstatus_dict['2']) {
        if (soundstatus_dict['2'].hasOwnProperty(l2i)){
            setButtonEnabledEl(soundstatus_dict['2'][l2i], "sound");
            setButtonOnEl(soundstatus_dict['2'][l2i], "sound");
        }
    }

}






// Initial webpage
$(document).ready(function() {
    "use strict";
    $.post("/info/", {tealinkstatus: '0'}).then(function() {
        $.getJSON('/info/', function(data) {
            classid = data.classid;
            userid = data.userid;
            classname = data.classname;
            username = data.username;
            stu_list = data.student;
            ass_list = data.assistant;
            tea_list = data.teacher;
            tealinkstatus_dict = data.tealinkstatuslist;
            asslinkstatus_dict = data.asslinkstatuslist;
            stulinkstatus_dict = data.stulinkstatuslist;

            $("title").text(classname);
            $("span#classname").text(classname);
            $("span#username").text(username);

            SetStatusBadgeEl("span#num_teainfo", tealinkstatus_dict);
            SetStatusBadgeEl("span#num_assinfo", asslinkstatus_dict);
            SetStatusBadgeEl("span#num_stuinfo", stulinkstatus_dict);


            for (var ti in tea_list) {
                if (tea_list.hasOwnProperty(ti)){
                    var newteacherEl = createIconEl(tea_list[ti], 'tea');
                    $("#teacherlist").append(newteacherEl);
                }
            }

            for (var ai in ass_list) {
                if (ass_list.hasOwnProperty(ai)){
                    var newassistantEl = createIconEl(ass_list[ai], 'ass');
                    $("#assistantlist").append(newassistantEl);
                }
            }


            for (var si in stu_list) {
                if (stu_list.hasOwnProperty(si)){
                    var newstudentEl = createIconEl(stu_list[si], 'stu');
                    $("#studentlist").append(newstudentEl);
                }
            }

            setButtonDisabledEl("", "link");
            setButtonDisabledEl("", "video");
            setButtonDisabledEl("", "sound");

            setButtonEnabledEl(username,"link");

        });
        // $(function () { $('#collapseOne').collapse('show')});
        // $(function () { $('#collapseTwo').collapse('')});
        // $(function () { $('#collapseThree').collapse('toggle')});
    });
});


// var stu_list;
// var tea_list;
// var teastatus_dict;
// var stustatus_dict;
// var teastatus_str;
// var stustatus_str;
// var classname;
// var username;
/*
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
*/

// Show all switch input  via bootstrap switch
// $.fn.bootstrapSwitch.defaults.state = true;
// $(".switch").bootstrapSwitch();

// Update student list and teacher list from /info/
// function updateClassInfo() {
//     "use strict";
//     $.getJSON('/info/', function(data) {
//         teastatus_dict = data.teastatuslist;
//         stustatus_dict = data.stustatuslist;
//         var num_alltea = tea_list.length;
//         var num_allstu = stu_list.length;
//         var num_readytea = teastatus_dict["1"].length;
//         var num_readystu = stustatus_dict["1"].length;
//         var num_onlinetea = teastatus_dict["2"].length;
//         var num_onlinestu = stustatus_dict["2"].length;
//         var newteastatus_str = num_readytea + " / " + num_onlinetea + " / " + num_alltea;
//         var newstustatus_str = num_readystu + " / " + num_onlinestu + " / " + num_allstu;
//         if (teastatus_str !== newteastatus_str || stustatus_str !== newstustatus_str) {
//             teastatus_str = newteastatus_str;
//             stustatus_str = newstustatus_str;
//             $("span#num_teainfo").text(teastatus_str);
//             $("span#num_stuinfo").text(stustatus_str);

//             for (var l0i in teastatus_dict['0']) {
//                 if (teastatus_dict['0'].hasOwnProperty(l0i)){
//                     setDisconnectedEl(teastatus_dict['0'][l0i]);
//                 }
//             }
//             for (var l1i in teastatus_dict['1']) {
//                 if (teastatus_dict['1'].hasOwnProperty(l1i)){
//                     setDisconnectedEl(teastatus_dict['1'][l1i]);
//                 }
//             }
//             for (var l2i in teastatus_dict['2']) {
//                 if (teastatus_dict['2'].hasOwnProperty(l2i)){
//                     setTeaConnectedEl(teastatus_dict['2'][l2i]);
//                 }
//             }
//             for (var s0i in stustatus_dict['0']) {
//                 if (stustatus_dict['0'].hasOwnProperty(s0i)){
//                     setDisconnectedEl(stustatus_dict['0'][s0i]);
//                 }
//             }
//             for (var s1i in stustatus_dict['1']) {
//                 if (stustatus_dict['1'].hasOwnProperty(s1i)){
//                     setReadyEl(stustatus_dict['1'][s1i]);
//                 }
//             }
//             for (var s2i in stustatus_dict['2']) {
//                 if (stustatus_dict['2'].hasOwnProperty(s2i)){
//                     setStuConnectedEl(stustatus_dict['2'][s2i]);
//                 }
//             }
//         }
//     });
// }

// window.setInterval(function(){"use strict";updateClassInfo();}, 2000);
//
//
// // Set Icon Connected Status of Teacher.
// function setAssIconConnectedEl(userinfo) {
//     "use strict";
//     var rolecolor;
//     if (roleid === "tea") {rolecolor = "#8A6D3B";}
//     if (roleid === "ass") {rolecolor = "#31708F";}
//     if (roleid === "stu") {rolecolor = "#3E773F";}
//     console.log("#media-" + userinfo);
//     ($("#media-" + userinfo).parent()).css("background", "#31708F");
//     $("#media-" + userinfo + " i").css("color", "#fff");
//     $("#media-" + userinfo + " p").css("color", "#fff");
//     ($("#media-" + userinfo).next()).css("color", "#fff");
// }

// // Set Icon Disconnected status of teacher
// function setAssIconDisconnectedEl(userinfo) {
//     "use strict";
//     // $("#media-" + userinfo).css("background", "#fff");
//     ($("#media-" + userinfo).parent()).css("background", "#fff");
//     $("#media-" + userinfo + " i").css("color", "#31708F");
//     $("#media-" + userinfo + " p").css("color", "#31708F");
//     ($("#media-" + userinfo).next()).css("color", "#31708F");
//     // $("#media-" + userinfo + " h4").css("color", "");
//     //console.log("button hided"+ " #btn-sound-" + userinfo);
// }

// // Set Icon Connected Status of Student.
// function setStuIconConnectedEl(userinfo) {
//     "use strict";
//     console.log("#media-" + userinfo);
//     //$("#media-" + userinfo).css("background", "#d9edf7");
//     ($("#media-" + userinfo).parent()).css("background", "#3E773F");
//     $("#media-" + userinfo + " i").css("color", "#fff");
//     $("#media-" + userinfo + " p").css("color", "#fff");
//     ($("#media-" + userinfo).next()).css("color", "#fff");
//     // $("#media-" + userinfo + " h4").css("color", "#fff");
// }

// // Set Icon Disconnected status of student
// function setStuIconDisconnectedEl(userinfo) {
//     "use strict";
//     // $("#media-" + userinfo).css("background", "#fff");
//     ($("#media-" + userinfo).parent()).css("background", "#fff");
//     $("#media-" + userinfo + " i").css("color", "#3E773F");
//     $("#media-" + userinfo + " p").css("color", "#3E773F");
//     ($("#media-" + userinfo).next()).css("color", "#3E773F");
//     // $("#media-" + userinfo + " h4").css("color", "");
//     //console.log("button hided"+ " #btn-sound-" + userinfo);
// }
//
//
// // Set connected status of student
// function setStuConnectedEl(userinfo) {
//     "use strict";
//     console.log("#media-" + userinfo);
//     //$("#media-" + userinfo).css("background", "##dff0d8");
//     $("#media-" + userinfo).css("background", "green");
//     ($("#media-" + userinfo).parent()).css("background", "green");
//     $("#media-" + userinfo + " i").css("color", "#fff");
//     $("#media-" + userinfo + " p").css("color", "#fff");
//     // ($("#media-" + userinfo).next()).css("color", "#fff");
//     $("#media-" + userinfo + " h4").css("color", "#fff");

//     $("#btn-video-" + userinfo).show();
//     $("#btn-video-" + userinfo).removeAttr("disabled");
//     $("#btn-video-" + userinfo).removeClass("btn-default");
//     $("#btn-video-" + userinfo).addClass("btn-primary");
//     $("#btn-video-" + userinfo).addClass("active");

//     $("#btn-sound-" + userinfo).show();
//     $("#btn-sound-" + userinfo).removeAttr("disabled");
//     $("#btn-sound-" + userinfo).removeClass("btn-default");
//     $("#btn-sound-" + userinfo).addClass("btn-success");
//     $("#btn-sound-" + userinfo).removeClass("active");

//     $("#btn-link-" + userinfo).show();
//     $("#btn-link-" + userinfo).removeAttr("disabled");
//     $("#btn-link-" + userinfo).removeClass("btn-default");
//     $("#btn-link-" + userinfo).addClass("btn-info");
//     $("#btn-link-" + userinfo).addClass("active");
// }

// // Set disconnected status of teacher or student
// function setDisconnectedEl(userinfo) {
//     "use strict";
//     $("#media-" + userinfo).css("background", "");
//     ($("#media-" + userinfo).parent()).css("background", "");
//     $("#media-" + userinfo + " i").css("color", "");
//     $("#media-" + userinfo + " p").css("color", "");
//     ($("#media-" + userinfo).next()).css("color", "#fff");
//     $("#media-" + userinfo + " h4").css("color", "");
//     //console.log("button hided"+ " #btn-sound-" + userinfo);
//     $("#btn-video-" + userinfo).show();
//     $("#btn-video-" + userinfo).attr("disabled", "true");
//     $("#btn-video-" + userinfo).addClass("btn-default");
//     $("#btn-video-" + userinfo).removeClass("btn-primary");

//     $("#btn-sound-" + userinfo).show();
//     $("#btn-sound-" + userinfo).attr("disabled", "true");
//     $("#btn-sound-" + userinfo).addClass("btn-default");
//     $("#btn-sound-" + userinfo).removeClass("btn-success");

//     $("#btn-link-" + userinfo).show();
//     $("#btn-link-" + userinfo).attr("disabled", "true");
//     $("#btn-link-" + userinfo).addClass("btn-default");
//     $("#btn-link-" + userinfo).removeClass("btn-info");

// }

// // Set ready status of teacher or student
// function setReadyEl(userinfo) {
//     "use strict";
//     $("#media-" + userinfo).css("background", "#d73d04");
//     ($("#media-" + userinfo).parent()).css("background", "#d73d04");
//     $("#media-" + userinfo + " i").css("color", "#fff");
//     $("#media-" + userinfo + " p").css("color", "#fff");
//     ($("#media-" + userinfo).next()).css("color", "#fff");
//     $("#media-" + userinfo + " h4").css("color", "#fff");

//     $("#btn-video-" + userinfo).show();
//     $("#btn-video-" + userinfo).removeAttr("disabled");
//     $("#btn-video-" + userinfo).addClass("btn-primary");
//     $("#btn-video-" + userinfo).removeClass("btn-default");

//     $("#btn-sound-" + userinfo).show();
//     $("#btn-sound-" + userinfo).removeAttr("disabled");
//     $("#btn-sound-" + userinfo).addClass("btn-success");
//     $("#btn-sound-" + userinfo).removeClass("btn-default");

//     $("#btn-link-" + userinfo).show();
//     $("#btn-link-" + userinfo).removeAttr("disabled");
//     $("#btn-link-" + userinfo).addClass("btn-info");
//     $("#btn-link-" + userinfo).removeClass("btn-default");

//     $("#btn-video-" + userinfo).removeClass("active");
//     $("#btn-sound-" + userinfo).removeClass("active");
//     $("#btn-link-" + userinfo).removeClass("active");
// }
//
//
//
// // // Show Teacher icon in Teacher list
// function createTeaIconEl(user_info) {
//     "use strict";
//     var iconContainer = '<div class="col-md-6"> </div>';
//     var serviceBoxV1 = '<div class="service-box-tea"> </div>';
//     var localMedia = '<div id="" class="local-media"> <i class="fa fa-user color-grey"></i></div>';
//     var userH = '<h4 id="" class="color-grey"></h4>';

//     var buttonTeaPreview = '<button id="" type="button" class="btn btn-primary btn-block btn-xs" data-toggle="button" data-complete-text=""> </button>';
//     var iconTeaPreview = '<i class="fa fa-eye color-grey"></i><span> / </span><i class="fa fa-microphone color-grey"></i><span>  PREVIEW</span>';
//     var iconTeaClose = '<i class="fa fa-eye-slash color-grey"></i><span> / </span><i class="fa fa-microphone-slash color-grey"></i><span>  CLOSE</span>';

//     var iconContainerEl = $(iconContainer);
//     var serviceBoxV1El = $(serviceBoxV1);
//     var localMediaEl = $(localMedia);
//     var userHEl = $(userH);
//     var buttonTeaPreviewEl = $(buttonTeaPreview);

//     localMediaEl.attr("id", "media-" + user_info);
//     userHEl.append(user_info);

//     serviceBoxV1El.append(localMediaEl);
//     serviceBoxV1El.append(userHEl);

//     buttonTeaPreviewEl.attr("id", "btn-media-" + user_info);
//     buttonTeaPreviewEl.attr("data-complete-text", iconTeaClose);
//     buttonTeaPreviewEl.append(iconTeaPreview);

//     iconContainerEl.append(serviceBoxV1El);
//     iconContainerEl.append(buttonTeaPreviewEl);
//     return iconContainerEl;
// }
//
//
// listenning on changed.linkstatus event for assistant.
// $("span#num_assinfo").on("changed.linkstatus", function(event){
//     "use strict";
//     var status_dict = linkstatus;
//     SetStatusBadgeEl(this, status_dict);

//     // status "0" means disconnected
//     for (var l0i in status_dict['0']) {
//         if (status_dict['0'].hasOwnProperty(l0i)){
//             setAssIconDisconnectedEl(status_dict['0'][l0i]);
//         }
//     }

//     // status "1" means ready
//     for (var l1i in status_dict['1']) {
//         if (status_dict['1'].hasOwnProperty(l1i)){
//             setIconReadyEl(status_dict['1'][l1i]);
//         }
//     }

//     // status "2" means connected
//     for (var l2i in status_dict['2']) {
//         if (status_dict['2'].hasOwnProperty(l2i)){
//             setAssIconConnectedEl(status_dict['2'][l2i]);
//         }
//     }
// });


// listenning on changed.linkstatus event for student.
// $("span#num_stuinfo").on("changed.linkstatus", function(event, linkstatus){
//     "use strict";
//     var status_dict = linkstatus;
//     SetStatusBadgeEl(this, status_dict);

//     for (var l0i in status_dict['0']) {
//         if (status_dict['0'].hasOwnProperty(l0i)){
//             setStuIconDisconnectedEl(status_dict['0'][l0i]);
//             setButtonDisabledEl(status_dict['0'][l0i]);
//         }
//     }
//     for (var l1i in status_dict['1']) {
//         if (status_dict['1'].hasOwnProperty(l1i)){
//             setIconReadyEl(status_dict['1'][l1i]);
//             setButtonOffEl(status_dict['1'][l1i], "link");
//         }
//     }
//     for (var l2i in status_dict['2']) {
//         if (status_dict['2'].hasOwnProperty(l2i)){
//             setStuIconConnectedEl(status_dict['2'][l2i]);
//             setButtonOnEl(status_dict['2'][l2i], "link");
//         }
//     }
// });

// PAGE VIEWS CODES END