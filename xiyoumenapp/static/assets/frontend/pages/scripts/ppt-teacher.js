// BEGIN PPT CODE

var pptposition;

// Send message of chat content.
$("iframe#ppt-area").contents().find("div#page-container").scroll(function(){
    "use strict";
    // console.log($(this).scrollTop());
    pptposition = $(this).scrollTop();
});

window.setInterval(function() {
    "use strict";
    $.post("/ppt/", {pptposition:pptposition});
}, 1000);

// Click upload button #btn-upload to upload files.
$("button#btn-upload").on('click', function(){
    if ($(this).hasClass("active")){
        $(this).button('reset');
        $("div#media-"+username + ">i").removeClass("hidden");

    }else{
        $(this).button('complete');
        $("div#media-"+username + ">i").addClass("hidden");

    }
});

// Inintial all chatmessage from endpoint /chatlist/
$(document).ready(function() {
    "use strict";
    $("iframe#ppt-area").contents().find("div#sidebar").remove();
    $("iframe#ppt-area").contents().find("loading_indicator").remove();
    // Show slimScroll bar at ppt
    // $(function(){
    //     "use strict";
    //     $("iframe#ppt-area").contents().find("div#page-container").slimScroll({
    //         width: '100%',
    //         height: '600px',
    //         size: '2px',
    //         position: 'right',
    //         color: '#cececc',
    //         opacity: 0.3,
    //         alwaysVisible: true,
    //         distance: '0px',
    //         start: 'top',
    //         railVisible: true,
    //         railColor: '#222',
    //         railOpacity: 0.3,
    //         wheelStep: 5,
    //         allowPageScroll: false,
    //         disableFadeOut: false
    //     });
    // });
    // $("iframe#ppt-area").contents().find("div#page-container").css("overflow-y","hidden");
});



// END PPT CODE