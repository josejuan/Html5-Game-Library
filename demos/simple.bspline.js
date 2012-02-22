/*
 * -- JJBM,	17/02/2012, simple.bspline.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple B-Spline",
		description: "Show how to use <b>H5GL.BSpline</b> to manage b-spline objects.",
		sourcecode: "demos/simple.bspline.js",
		thumbnail: "demos/simple.bspline.png"
	},

	bspline: null,

	onControllerActivation: function(s, d) {

		var w = s.__canvas.width;
		var h = s.__canvas.height;
		var m = Math.min(w, h) >> 4;

		this.points = [
			{x:     m, y:     m}, {x: m, y: m}, {x: m, y: m},
			{x: w - m, y:     m},
			{x: w - m, y: h - m},
			{x:     m, y: h - m},
			{x: w >> 1, y: h >> 1}, {x: w >> 1, y: h >> 1}, {x: w >> 1, y: h >> 1}
		];
		this.bspline = new H5GL.BSpline(this.points, false);

		s.__bcontext2d.lineWidth = 6;
		s.__bcontext2d.lineCap = 'round';
		s.__bcontext2d.lineJoin = 'round';
	},

	onDraw: function(s, d) {

		var ct = d.context;
		var cw = d.canvas.width;
		var ch = d.canvas.height;

		ct.clearRect(0, 0, cw, ch);

		s.drawPath(this.points, {color: 'red'});

		s.drawPath(this.bspline.GetPointsFromTInterval(0, 1, 0.01), {color: 'black'});

		var t = s.currentTime;
		t *= 0.1;
		t = t - ~~t;
		s.drawPath(this.bspline.GetPointsFromTInterval(t, Math.min(1, t + 0.01), 0.001), {color: 'orange'});


	}

});
