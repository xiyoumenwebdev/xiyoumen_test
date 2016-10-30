// BEGIN PPT CODE

var pptposition;
var pptname;
var pptoldposition = 0;

var ppt_source = new EventSource("/stream?channel=changed.ppt");


$.getJSON("/info/", function (data) {
    "use strict";
    classid = data.classid;
    username = data.username;
    classstr = data.classstr;
    console.log(classid);
}).then(function(){
    "use strict";
    var ppteventtype = "pptinfo" + classstr;
    ppt_source.addEventListener(ppteventtype, function(event){
        var data = JSON.parse(event.data);
        pptname = data.pptinfo;
        if (pptname){
            $("iframe#ppt-area").removeClass("hidden");
            $("div#ppt-notice").addClass("hidden");
            $.when(addPPT(classid, pptname)).done(function(){
                sendPPTPosition();
            });
        }else{
            $("iframe#ppt-area").addClass("hidden");
            $("div#ppt-notice").removeClass("hidden");
        }
    });
});

function addPPT(classid, pptname){
    "use strict";
    $("iframe#ppt-area").attr("src","../../static/courseware/" + classid + "/ppt/" + pptname +"/index.html");
    console.log($("iframe#ppt-area").attr("src"));
}


function sendPPTPosition(){
    window.setInterval(function() {
        pptposition = $("iframe#ppt-area").contents().find("div#page-container").scrollTop();
        console.log("pptposition is " + pptposition + ", and oldpptposition is " + pptoldposition);
        if (pptposition !== pptoldposition && pptposition) {
            $.post("/ppt/", {pptposition:pptposition});
            pptoldposition = pptposition;
        }
    }, 1000);
}


// END PPT CODE





// function getPPTPosition(){
//         "use strict";
//         console.log($("iframe#ppt-area").contents().find("div#page-container"));
//         $("iframe#ppt-area").contents().find("div#sidebar").remove();
//         $("iframe#ppt-area").contents().find("div#loading-indicator").remove();
//         pptposition = $("iframe#ppt-area").contents().find("div#page-container").scrollTop();
//         $("iframe#ppt-area").contents().find("div#page-container").scroll(function(){
//             console.log($(this).scrollTop());
//             pptposition = $(this).scrollTop();
//         });
// }

// window.onload = function(){
//     "use strict";
//     console.log($("iframe#ppt-area").contents());
//     $("iframe#ppt-area").contents().find("div#sidebar").remove();
//     $("iframe#ppt-area").contents().find("div#loading-indicator").remove();
//     $("iframe#ppt-area").contents().find("div#page-container").scroll(function(){
//         "use strict";
//         console.log($(this).scrollTop());
//         pptposition = $(this).scrollTop();
//     });

//     window.setInterval(function() {
//         "use strict";
//         // console.log((pptposition !== pptoldposition));
//         if (pptposition !== pptoldposition) {
//             $.post("/ppt/", {pptposition:pptposition});
//             pptoldposition = pptposition;
//         }
//     }, 1000);

//         // $("button#btn-upload").on('click', function(){
//         //     "use strict";
//         //     if ($(this).hasClass("active")){
//         //         $(this).button('reset');
//         //         $("div#media-"+username + ">i").removeClass("hidden");

//         //     }else{
//         //         $(this).button('complete');
//         //         $("div#media-"+username + ">i").addClass("hidden");

//         //     }
//         // });
// }


