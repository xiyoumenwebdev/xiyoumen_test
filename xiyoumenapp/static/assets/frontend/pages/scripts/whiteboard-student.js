
var lc = null;
var loadmySnapShot = null;
/*
var tools;
var strokeWidths;
var colors;

var setCurrentByName;
var findByName;
var canvasData;
*/

// the only LC-specific thing we have to do
var containerOne = document.getElementsByClassName('literally')[0];

var showLC = function() {
  $.get('/whiteboard/',function (data) {
		loadmySnapShot = data.drawing;  		
  });
  
  lc = LC.init(containerOne, {
    snapshot: loadmySnapShot,
    defaultStrokeWidth: 5,
    strokeWidths: [5, 10, 20, 50],
    primaryColor: '#ff0000',
    secondaryColor: 'transparent',
    backgroundColor: 'transparent'
  });
  
window.demoLC = lc;

console.log('Success to load whiteboard.');
//console.log(loadmySnapShot);
}
	
$(document).ready(function() {
  showLC();
  console.log("Success to load whiteboard");
});

var updateLC = function () {
	
	if (!lc) {
		showLC();
		console.log("Success to load whiteboard again");
	}else {
		$.get('/whiteboard/',function (data) {
		//loadmySnapShot = JSON.parse(data.drawing);
		loadmySnapShot = data.drawing;
		lc.loadSnapshot(loadmySnapShot); 
		window.demoLC = lc;
	 	console.log('Success to update whiteboard.'); 		
  		});
	}	
}

window.setInterval('updateLC()', 1000);

/*	
  var save = function() {
    localStorage.setItem('drawing', JSON.stringify(lc.getSnapshot()));
  }

  lc.on('drawingChange', save);
  lc.on('pan', save);
  lc.on('zoom', save);

  $("#open-image").click(function() {
    window.open(lc.getImage({
      scale: 1, margin: {top: 10, right: 10, bottom: 10, left: 10}
    }).toDataURL());
  });

  $("#change-size").click(function() {
    lc.setImageSize(null, 200);
  });

  $("#reset-size").click(function() {
    lc.setImageSize(null, null);
  });

  $("#clear-lc").click(function() {
    lc.clear();
  });

  // Set up our own tools...
  tools = [
    {
      name: 'pencil',
      el: document.getElementById('tool-pencil'),
      tool: new LC.tools.Pencil(lc)
    },{
      name: 'eraser',
      el: document.getElementById('tool-eraser'),
      tool: new LC.tools.Eraser(lc)
    },{
      name: 'text',
      el: document.getElementById('tool-text'),
      tool: new LC.tools.Text(lc)
    },{
      name: 'line',
      el: document.getElementById('tool-line'),
      tool: new LC.tools.Line(lc)
    },{
      name: 'arrow',
      el: document.getElementById('tool-arrow'),
      tool: function() {
        arrow = new LC.tools.Line(lc);
        arrow.hasEndArrow = true;
        return arrow;
      }()
    },{
      name: 'dashed',
      el: document.getElementById('tool-dashed'),
      tool: function() {
        dashed = new LC.tools.Line(lc);
        dashed.isDashed = true;
        return dashed;
      }()
    },{
      name: 'ellipse',
      el: document.getElementById('tool-ellipse'),
      tool: new LC.tools.Ellipse(lc)
    },{
      name: 'tool-rectangle',
      el: document.getElementById('tool-rectangle'),
      tool: new LC.tools.Rectangle(lc)
    },{
      name: 'tool-polygon',
      el: document.getElementById('tool-polygon'),
      tool: new LC.tools.Polygon(lc)
    },{
      name: 'tool-select',
      el: document.getElementById('tool-select'),
      tool: new LC.tools.SelectShape(lc)
    }
  ];

  strokeWidths = [
    {
      name: 10,
      el: document.getElementById('sizeTool-1'),
      size: 10
    },{
      name: 20,
      el: document.getElementById('sizeTool-2'),
      size: 20
    },{
      name: 50,
      el: document.getElementById('sizeTool-3'),
      size: 50
    }
  ];

  colors = [
  	 {
      name: 'red',
      el: document.getElementById('colorTool-red'),
      color: '#ff0000'
    }
    ,{
      name: 'blue',
      el: document.getElementById('colorTool-blue'),
      color: '#0000ff'
    },{
      name: 'yellow',
      el: document.getElementById('colorTool-yellow'),
      color: '#FFFF00'
    }
  ];

  setCurrentByName = function(ary, val) {
    ary.forEach(function(i) {
      $(i.el).toggleClass('current', (i.name == val));
    });
  };

  findByName = function(ary, val) {
    var vals;
    vals = ary.filter(function(v){
      return v.name == val;
    });
    if ( vals.length == 0 )
      return null;
    else
      return vals[0];
  };

  // Wire tools
  tools.forEach(function(t) {
    $(t.el).click(function() {
      var sw;

      lc.setTool(t.tool);
      setCurrentByName(tools, t.name);
      setCurrentByName(strokeWidths, t.tool.strokeWidth);
      $('#tools-sizes').toggleClass('disabled', (t.name == 'text'));
    });
  });
  setCurrentByName(tools, tools[0].name);

  // Wire Stroke Widths
  // NOTE: This will not work until the stroke width PR is merged...
  strokeWidths.forEach(function(sw) {
    $(sw.el).click(function() {
      lc.trigger('setStrokeWidth', sw.size);
      setCurrentByName(strokeWidths, sw.name);
    })
  })
  setCurrentByName(strokeWidths, strokeWidths[0].name);

  // Wire Colors
  colors.forEach(function(clr) {
    $(clr.el).click(function() {
      lc.setColor('primary', clr.color)
      setCurrentByName(colors, clr.name);
    })
  })
  setCurrentByName(colors, colors[0].name);

};



$('#hide-lc').click(function() {
  if (lc) {
    lc.teardown();
    lc = null;
  }
});

$('#show-lc').click(function() {
  if (!lc) { showLC(); }
});
*/