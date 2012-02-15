/*
 * -- JJBM,	23/01/2012, simple.draw.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple Draw loop",
		description: "Show how to draw using a controller. Just draw on passed graphics context. You must clean the viewport (if needed).",
		sourcecode: "demos/simple.draw.js",
		thumbnail: "demos/simple.draw.png"
	},

	onDraw: function(s, d) {

		var cv = d.canvas; // canvas to draw in
		var ct = d.context; // canvas graphics context
		var t  = s.currentTime; // elapsed time in seconds

		var vw = cv.width; // viewport whidth
		var vh = cv.height; // viewport height

		ct.clearRect(0, 0, vw, vh); // clear entire viewport

		ct.fillStyle = 'black';
		ct.fillRect(10, 10, vw - 20, vh - 20);

	}

});
