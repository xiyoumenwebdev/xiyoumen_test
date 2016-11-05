// BEGIN PAGE VIEWS CODES
var classid;
var userid;
var classstr;
var classname;
var username;

var stu_list;
var tea_list;

var tealinkstatus_dict;
var stulinkstatus_dict;

var roleid = 'tea';
var rolecolor_tea = "#8A6D3B";
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

    var iconContainerEl = $(iconContainer);
    var serviceBoxV1El = $(serviceBoxV1);
    var iconMediaEl = $(iconMedia);
    var userHEl = $(userH);

    serviceBoxV1El.addClass("service-box-" + roleid);

    iconMediaEl.attr("id", "media-" + user_info);
    userHEl.append(user_info);

    serviceBoxV1El.append(iconMediaEl);
    serviceBoxV1El.append(userHEl);

    iconContainerEl.append(serviceBoxV1El);
    return iconContainerEl;
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
    var num_ready = linkstatus_dict["0"].length;
    var num_online = linkstatus_dict["2"].length;
    // $(id_badge).text(num_ready + " / " + num_online + " / " + num_all);
    $(id_badge).text(num_online + " / " + num_all);
}


// Update link status to status_val;
function updateLinkStatus(roleid, username, status_val){
    "use strict";
    if (roleid==='tea') {
        $.post("/info/", {teaname:username, tealinkstatus:status_val});
    }

    if (roleid==='stu') {
        $.post("/info/", {stuname:username, stulinkstatus:status_val});
    }
}


function createPPTEl(pptname){
    "use strict";
    var containerEl = $('<div class="ppt-item col-md-4 margin-bottom-10 padding-top-10"> </div>');
    var pptEl = $('<div class="service-box-ppt"> </div>');
    var iconPPTEl = '<i class="fa fa-file-powerpoint-o color-grey"></i>';
    pptEl.attr("id", "ppt-" + pptname);
    pptEl.append(iconPPTEl);
    pptEl.append("<h4>" + pptname +"</h4>");
    containerEl.append(pptEl);
    $("div#pptlist").append(containerEl);
}

$("div#media-dialog").dialog({
    autoOpen: false,
    show:{
        effect:"blind",
        duration: 1000
    },
    hide:{
        effect:"blind",
        duration: 1000
    }
});


// Initial webpage
$(document).ready(function() {
    "use strict";
    $.getJSON('/info/', function(data) {
        classid = data.classid;
        userid = data.userid;
        classstr = data.classstr;
        classname = data.classname;
        username = data.username;

        stu_list = data.student;
        tea_list = data.teacher;

        tealinkstatus_dict = data.tealinkstatuslist;
        stulinkstatus_dict = data.stulinkstatuslist;

        $("title").text(classname);
        $("span#classname").text(classname);
        $("span#username").text(username);

        SetStatusBadgeEl("span#num_teainfo", tealinkstatus_dict);
        SetStatusBadgeEl("span#num_stuinfo", stulinkstatus_dict);


        for (var ti in tea_list) {
            if (tea_list.hasOwnProperty(ti)){
                var newteacherEl = createIconEl(tea_list[ti], 'tea');
                // Click teacher list link button #btn-link-**** to link or unlink.
                $.when($("#teacherlist").append(newteacherEl)).done(function(){

                });
            }
        }


        for (var si in stu_list) {
            if (stu_list.hasOwnProperty(si)){
                var newstudentEl = createIconEl(stu_list[si], 'stu');
                $.when($("#studentlist").append(newstudentEl)).done(function(){

                });
            }
        }


    });

    $.getJSON('/ppt/', function(data) {
       var pptlist = data.pptlist;
       var pptname;
       for (var pi in pptlist) {
           if (pptlist.hasOwnProperty(pi)){
               pptname = pptlist[pi];
               createPPTEl(pptname);
           }
       }
       $("div#pptlist").click(function(event){
           event.stopPropagation();
           event.preventDefault();
           postPPTInfo(event);
       });

    });

        // $(function () { $('#collapseOne').collapse('')});
        // $(function () { $('#collapseTwo').collapse('')});
        // $(function () { $('#collapseThree').collapse('')});
        $(function () {  $('#collapseFour').collapse('toggle');});
});


function postPPTInfo(event){
    "use strict";
    console.log(event);
    if (event.target.localName === "h4") {
        var pptname = event.target.innerText;
        $.post("/ppt/", {pptinfo:pptname});
    }
    if (event.target.localName === "i") {

        var pptname = event.target.nextSibling.innerText;
        $.post("/ppt/", {pptinfo:pptname});
    }
    if (event.target.localName === "div") {
        var pptname = event.target.children[1].innerText;
        $.post("/ppt/", {pptinfo:pptname.toString()});
    }
}



// PAGE VIEWS CODES END







            //         $.when($("#teacherlist").append(newteacherEl)).done(function(){
            //             // console.log($("#btn-link-"+tea_list[ti]));
            //             // $("button#btn-link-"+tea_list[ti]).on('click', function(){
            //             //     var newLinkStatus;
            //             //     if ($(this).hasClass("active")){
            //             //         $(this).button('reset');
            //             //         console.log("click link off");
            //             //         newLinkStatus = "0";
            //             //         updateLinkStatus("tea", tea_list[ti], newLinkStatus);
            //             //     }else{
            //             //         $(this).button('loading');
            //             //         console.log("click Link on");
            //             //         newLinkStatus = "2";
            //             //         updateLinkStatus("tea", tea_list[ti], newLinkStatus);
            //             //     }
            //             // });
            //             // $("button#btn-video-"+tea_list[ti]).on('click', function(){
            //             //     var newVideoStatus;
            //             //     if ($(this).hasClass("active")){
            //             //         $(this).button('reset');
            //             //         console.log("click video off");
            //             //         newVideoStatus = "0";
            //             //         updateVideoStatus("tea", tea_list[ti], newVideoStatus);
            //             //     }else{
            //             //         $(this).button('loading');
            //             //         console.log("click video on");
            //             //         newVideoStatus = "2";
            //             //         updateVideoStatus("tea", tea_list[ti], newVideoStatus);
            //             //     }
            //             // });
            //             // $("button#btn-sound-"+tea_list[ti]).on('click', function(){
            //             //     var newSoundStatus;
            //             //     if ($(this).hasClass("active")){
            //             //         $(this).button('reset');
            //             //         console.log("click Sound off");
            //             //         newSoundStatus = "0";
            //             //         updateSoundStatus("tea", tea_list[ti], newSoundStatus);
            //             //     }else{
            //             //         $(this).button('loading');
            //             //         console.log("click Sound on");
            //             //         newSoundStatus = "2";
            //             //         updateSoundStatus("tea", tea_list[ti], newSoundStatus);
            //             //     }
            //             // });
            //         });
            //     }
            // }

            // // for (var ai in ass_list) {
            // //     if (ass_list.hasOwnProperty(ai)){
            // //         var newassistantEl = createIconEl(ass_list[ai], 'ass');
            // //         $.when($("#assistantlist").append(newassistantEl)).done(function(){
            // //             // console.log($("button#btn-link-"+ass_list[ai]));
            // //             $("button#btn-link-"+ass_list[ai]).on('click', function(){
            // //                 var newLinkStatus;
            // //                 if ($(this).hasClass("active")){
            // //                     $(this).button('reset');
            // //                     console.log("click link off");
            // //                     newLinkStatus = "0";
            // //                     updateLinkStatus("ass", ass_list[ai], newLinkStatus);
            // //                 }else{
            // //                     $(this).button('loading');
            // //                     console.log("click Link on");
            // //                     newLinkStatus = "2";
            // //                     updateLinkStatus("ass", ass_list[ai], newLinkStatus);
            // //                 }
            // //             });
            // //             $("button#btn-video-"+ass_list[ai]).on('click', function(){
            // //                 var newVideoStatus;
            // //                 if ($(this).hasClass("active")){
            // //                     $(this).button('reset');
            // //                     console.log("click video off");
            // //                     newVideoStatus = "0";
            // //                     updateVideoStatus("ass", ass_list[ai], newVideoStatus);
            // //                 }else{
            // //                     $(this).button('loading');
            // //                     console.log("click video on");
            // //                     newVideoStatus = "2";
            // //                     updateVideoStatus("ass", ass_list[ai], newVideoStatus);
            // //                 }
            // //             });
            // //             $("button#btn-sound-"+ass_list[ai]).on('click', function(){
            // //                 var newSoundStatus;
            // //                 if ($(this).hasClass("active")){
            // //                     $(this).button('reset');
            // //                     console.log("click Sound off");
            // //                     newSoundStatus = "0";
            // //                     updateSoundStatus("ass", ass_list[ai], newSoundStatus);
            // //                 }else{
            // //                     $(this).button('loading');
            // //                     console.log("click Sound on");
            // //                     newSoundStatus = "2";
            // //                     updateSoundStatus("ass", ass_list[ai], newSoundStatus);
            // //                 }
            // //             });
            // //         });
            // //     }
            // // }


            // for (var si in stu_list) {
            //     if (stu_list.hasOwnProperty(si)){
            //         var newstudentEl = createIconEl(stu_list[si], 'stu');
            //         $.when($("#studentlist").append(newstudentEl)).done(function(){
            //             // console.log($("button#btn-link-"+stu_list[si]));
            //             // $("button#btn-link-"+stu_list[si]).on('click', function(){
            //             //     var newLinkStatus;
            //             //     if ($(this).hasClass("active")){
            //             //         $(this).button('reset');
            //             //         console.log("click link off");
            //             //         newLinkStatus = "0";
            //             //         updateLinkStatus("stu", stu_list[si], newLinkStatus);
            //             //     }else{
            //             //         $(this).button('loading');
            //             //         console.log("click Link on");
            //             //         newLinkStatus = "2";
            //             //         updateLinkStatus("stu", stu_list[si], newLinkStatus);
            //             //     }
            //             // });
            //             // $("button#btn-video-"+stu_list[si]).on('click', function(){
            //             //     var newVideoStatus;
            //             //     if ($(this).hasClass("active")){
            //             //         $(this).button('reset');
            //             //         console.log("click video off");
            //             //         newVideoStatus = "0";
            //             //         updateVideoStatus("stu", stu_list[si], newVideoStatus);
            //             //     }else{
            //             //         $(this).button('loading');
            //             //         console.log("click video on");
            //             //         newVideoStatus = "2";
            //             //         updateVideoStatus("stu", stu_list[si], newVideoStatus);
            //             //     }
            //             // });
            //             // $("button#btn-sound-"+stu_list[si]).on('click', function(){
            //             //     var newSoundStatus;
            //             //     if ($(this).hasClass("active")){
            //             //         $(this).button('reset');
            //             //         console.log("click Sound off");
            //             //         newSoundStatus = "0";
            //             //         updateSoundStatus("stu", stu_list[si], newSoundStatus);
            //             //     }else{
            //             //         $(this).button('loading');
            //             //         console.log("click Sound on");
            //             //         newSoundStatus = "2";
            //             //         updateSoundStatus("stu", stu_list[si], newSoundStatus);
            //             //     }
            //             // });
            //         });
            //     }
            // }







// // Update video status to status_val;
// function updateVideoStatus(roleid, username, status_val){
//     "use strict";
//     if (roleid==='tea') {
//         $.post("/info/", {teaname:username, teavideostatus:status_val});
//     }
//     if (roleid==='ass') {
//         $.post("/info/", {assname:username, assvideostatus:status_val});
//     }
//     if (roleid==='stu') {
//         $.post("/info/", {stuname:username, stuvideostatus:status_val});
//     }
// }

// // Update sound status to status_val;
// function updateSoundStatus(roleid, username, status_val){
//     "use strict";
//     if (roleid==='tea') {
//         $.post("/info/", {teaname:username, teasoundstatus:status_val});
//     }
//     if (roleid==='ass') {
//         $.post("/info/", {assname:username, asssoundstatus:status_val});
//     }
//     if (roleid==='stu') {
//         $.post("/info/", {stuname:username, stusoundstatus:status_val});
//     }
// }

// Show Student icon in Student list.
// function createIconEl(user_info, roleid) {
//     "use strict";
//     var iconContainer = '<div class="col-md-6 margin-bottom-10"> </div>';
//     var serviceBoxV1 = '<div> </div>';
//     var iconMedia = '<div id="" class="icon-media"> <i class="fa fa-user fa-2x color-grey"></i></div>';
//     var userH = '<h4 id="" class="color-grey"></h4>';

//     var buttonStuGroup = '<div class= "btn-group-vertical btn-block btn-group-xs"> </div>';
//     var buttonStuLink = '<button id="" type="button" class="btn btn-primary hidden" data-toggle="button" data-complete-text="" data-loading-text="" ></button>';
//     var buttonStuVideo = '<button id="" type="button" class="btn btn-success hidden" data-toggle="button" data-complete-text="" data-loading-text="" ></button>';
//     var buttonStuSound = '<button id="" type="button" class="btn btn-info hidden"  data-toggle="button" data-complete-text="" data-loading-text="" ></button>';

//     var iconLoading = '<i class="fa fa-spinner fa-pulse color-grey"></i><span></span>';

//     var iconStuVideoOn = '<i class="fa fa-eye color-grey"></i><span></span>';
//     var iconStuVideoOff = '<i class="fa fa-eye-slash color-grey"></i><span></span>';
//     var iconStuSoundOn = '<i class="fa fa-volume-up color-grey"></i><span></span>';
//     var iconStuSoundOff = '<i class="fa fa-volume-off color-grey"></i><span></span>';
//     var iconStuLinkOn = '<i class="fa fa-link color-grey"></i><span></span>';
//     var iconStuLinkOff = '<i class="fa fa-unlink color-grey"></i><span></span>';

//     var iconContainerEl = $(iconContainer);
//     var serviceBoxV1El = $(serviceBoxV1);
//     var iconMediaEl = $(iconMedia);
//     var userHEl = $(userH);
//     var buttonStuGroupEl = $(buttonStuGroup);
//     var buttonStuLinkEl = $(buttonStuLink);
//     var buttonStuVideoEl = $(buttonStuVideo);
//     var buttonStuSoundEl = $(buttonStuSound);

//     serviceBoxV1El.addClass("service-box-" + roleid);

//     iconMediaEl.attr("id", "media-" + user_info);
//     userHEl.append(user_info);

//     serviceBoxV1El.append(iconMediaEl);
//     serviceBoxV1El.append(userHEl);

//     buttonStuLinkEl.attr("id", "btn-link-" + user_info);
//     buttonStuLinkEl.attr("data-complete-text", iconStuLinkOn);
//     buttonStuLinkEl.attr("data-loading-text", iconLoading);
//     buttonStuLinkEl.append(iconStuLinkOff);

//     buttonStuVideoEl.attr("id", "btn-video-" + user_info);
//     buttonStuVideoEl.attr("data-complete-text", iconStuVideoOn);
//     buttonStuVideoEl.attr("data-loading-text", iconLoading);
//     buttonStuVideoEl.append(iconStuVideoOff);

//     buttonStuSoundEl.attr("id", "btn-sound-" + user_info);
//     buttonStuSoundEl.attr("data-complete-text", iconStuSoundOn);
//     buttonStuSoundEl.attr("data-loading-text", iconLoading);
//     buttonStuSoundEl.append(iconStuSoundOff);

//     buttonStuGroupEl.append(buttonStuLinkEl);
//     buttonStuGroupEl.append(buttonStuVideoEl);
//     buttonStuGroupEl.append(buttonStuSoundEl);

//     iconContainerEl.append(serviceBoxV1El);
//     iconContainerEl.append(buttonStuGroupEl);
//     return iconContainerEl;
// }


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

