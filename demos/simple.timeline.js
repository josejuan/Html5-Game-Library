/*
 * -- JJBM,	25/01/2012, simple.timeline.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple Timeline loop",
		description: "Show how to do a based time drawing. The <b>H5GL.Workspace.currentTime</b> contains elapsed time in seconds.",
		sourcecode: "demos/simple.timeline.js",
		thumbnail: "demos/simple.timeline.png"
	},

	onDraw: function(s, d) {

		var cv = d.canvas; // canvas to draw in
		var ct = d.context; // canvas graphics context
		var t  = s.currentTime; // elapsed time in seconds

		var vw = cv.width; // viewport whidth
		var vh = cv.height; // viewport height

		var L  = 0.25 * (vw < vh ? vw : vh); // min side length

		ct.clearRect(0, 0, vw, vh); // clear entire viewport

		ct.fillStyle = 'black';
		ct.fillRect(
			((vw - L) >> 1) + L * Math.cos(t * 5),
			((vh - L) >> 1) + L * Math.sin(t * 5),
			L, L
		);

	}

});
