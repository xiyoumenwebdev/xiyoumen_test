// BEGIN PPT CODE

var pptposition;
var ppt_source = new EventSource("/stream?channel=changed.ppt");


var classstr;

$.getJSON("/info/", function (data) {
    "use strict";
    classstr = data.classstr;
}).then(function(){
    "use strict";
    var myeventtype = "newposition"+classstr;
    console.log(myeventtype);
	ppt_source.addEventListener("newposition"+classstr,function(event){
	    "use strict";
	    var data = JSON.parse(event.data);
	    pptposition = data.pptposition;
	    $("iframe#ppt-area").contents().find("div#page-container").scrollTop(pptposition);
	    console.log($("iframe#ppt-area").contents().find("div#page-container").scrollTop());
	}, false);
});


// Inintial all chatmessage from endpoint /chatlist/
$(document).ready(function() {
    "use strict";
    $("iframe#ppt-area").contents().find("div#sidebar").remove();
    $("iframe#ppt-area").contents().find("loading_indicator").remove();
    $("iframe#ppt-area").contents().find("div#page-container").css("overflow-y","hidden");
});




// END PPT CODE