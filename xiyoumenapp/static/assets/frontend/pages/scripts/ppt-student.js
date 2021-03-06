// BEGIN PPT CODE

var pptposition;
var pptname;
var ppt_source = new EventSource("/stream?channel=changed.ppt");


function addPPT(classid, pptname){
    "use strict";
    $("iframe#ppt-area").attr("src","../../static/courseware/" + classid + "/ppt/" + pptname +"/index.html");
    console.log($("iframe#ppt-area").attr("src"));
}

function getPPTPosition(){
    "use strict";
    var myeventtype = "newposition"+classstr;
    console.log(myeventtype);
    ppt_source.addEventListener("newposition"+classstr,function(event){
        var data = JSON.parse(event.data);
        pptposition = data.pptposition;
        $("iframe#ppt-area").contents().find("div#page-container").scrollTop(pptposition);
        console.log($("iframe#ppt-area").contents().find("div#page-container").scrollTop());
    }, false);
}

$(document).ready(function(){
    "use strict";
    $.getJSON("/info/", function (data) {
        // "use strict";
        classstr = data.classstr;
        classid = data.classid;
    }).then(function(){
        // "use strict";
        $.getJSON("/ppt/", function(data){
            pptname = data.pptinfo;
        });

        if (pptname){
            console.log("pptname is " + pptname);
            $("iframe#ppt-area").removeClass("hidden");
            $("div#ppt-notice").addClass("hidden");
            addPPT(classid, pptname);
        }else{
            var ppteventtype = "pptinfo" + classstr;
            ppt_source.addEventListener(ppteventtype, function(event){
                var data = JSON.parse(event.data);
                pptname = data.pptinfo;
                console.log("pptname is " + pptname);
                $("iframe#ppt-area").removeClass("hidden");
                $("div#ppt-notice").addClass("hidden");
                addPPT(classid, pptname);
            });
        }

        getPPTPosition();
    });
});




// END PPT CODE



// window.onload = function(){
//     "use strict";
//     console.log($("iframe#ppt-area").contents());
//     console.log($("iframe#ppt-area").contents().find("div#page-container"));
//     $("iframe#ppt-area").contents().find("div#sidebar").remove();
//     $("iframe#ppt-area").contents().find("div#loading-indicator").remove();
//     $("iframe#ppt-area").contents().find("#page-container").css("overflow","hidden");
//     var myeventtype = "newposition"+classstr;
//     console.log(myeventtype);
//     ppt_source.addEventListener("newposition"+classstr,function(event){
//         // "use strict";
//         var data = JSON.parse(event.data);
//         pptposition = data.pptposition;
//         $("iframe#ppt-area").contents().find("div#page-container").scrollTop(pptposition);
//         console.log($("iframe#ppt-area").contents().find("div#page-container").scrollTop());
//     }, false);
// };