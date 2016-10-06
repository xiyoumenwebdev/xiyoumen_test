// BEGIN PPT CODE

var pptposition;
var ppt_source = new EventSource("/stream?channel=changed.ppt");

// Inintial all chatmessage from endpoint /chatlist/
$(document).ready(function() {
    "use strict";
    $("iframe#ppt-area").contents().find("div#sidebar").remove();
    $("iframe#ppt-area").contents().find("loading_indicator").remove();
    $("iframe#ppt-area").contents().find("div#page-container").css("overflow-y","hidden");
});


ppt_source.addEventListener("newposition",function(event){
    "use strict";
    var data = JSON.parse(event.data);
    pptposition = data.pptposition;
    $("iframe#ppt-area").contents().find("div#page-container").scrollTop(pptposition);
    console.log($("iframe#ppt-area").contents().find("div#page-container").scrollTop());
}, false);


// END PPT CODE