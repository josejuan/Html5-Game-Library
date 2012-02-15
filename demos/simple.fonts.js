/*
 * -- JJBM,	31/01/2012, simple.fonts.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple Drawing Fonts",
		description: "Show how to draw fonts using <b>H5GL .Font</b> objects. This is faster than realtime rastering fonts.",
		sourcecode: "demos/simple.fonts.js",
		thumbnail: "demos/simple.fonts.png"
	},

	font: null,

	onControllerActivation: function(s, d) {
		if(this.font == null) {
			this.font = new H5GL.Font('demos/resources/fonts/andale_monospace.png');
		}
	},

	onDraw: function(s, d) {

		var cv = d.canvas; // canvas to draw in
		var ct = d.context; // canvas graphics context
		var t  = s.currentTime; // elapsed time in seconds

		var vw = cv.width; // viewport whidth
		var vh = cv.height; // viewport height

		ct.clearRect(0, 0, vw, vh); // clear entire viewport

		this.font.DrawString(s, d, "Left/top anchor!");
		this.font.DrawString(s, d, "Center/middle anchor!", {x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
		this.font.DrawString(s, d, "Right/bottom anchor!", {x: vw, y: vh, right: true, bottom: true, maxwidth: 350});

		ct.save();
		ct.globalAlpha = 0.3;
		ct.translate(vw >> 1, vh >> 1);
		ct.rotate(-Math.PI * 0.25);
		this.font.DrawString(s, d, "Text examples!", {x: 0, y: 0, center: true, middle: true, maxheight: 30 * (2 + Math.cos(s.currentTime * 4))});
		ct.restore();

	}

});
