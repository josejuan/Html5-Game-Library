/*
* -- JJBM, 26/02/2012, simple.particles.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Particles",
		description: "Show how to use <b>H5GL. BoxBoundForces</b> to extend a <b>H5GL. BoxBoundBox</b> object and simulate (very simple) physics. <b>H5GL.BSpline</b> is used for particles path.",
		sourcecode: "demos/simple.particles.js",
		thumbnail: "demos/simple.particles.png"
	},

	started: false,
	NUM_PARTICLES: 290,
	breset: 0,

	onKeyUp: function(s, d) {
		if(d.keyCode == 72)
			this.stateA = !this.stateA;
		this.stateB = d.keyCode == 74;
	},

	onControllerActivation: function(s, d) {
		if(!this.started) {
			this.started = true;

			// simple image loader
			var colors = ['red', 'green', 'blue', 'orange', 'purple'];
			for(var n = 0; n < colors.length; n++) {
				var i = new Image();
				i.src = 'demos/resources/particles/' + colors[n] + '.png';
				colors[n] = i;
			}

			var w = s.__canvas.width, h = s.__canvas.height;

			this.onDefaultDraw = function (b, s, d) {
				if(this.alpha > 0) {
					this.alpha -= 0.005;
					d.context.globalAlpha = this.alpha;
					d.context.drawImage(this.color, this.position.xi, this.position.yi, this.w, this.w);
					d.context.globalAlpha = 0.0;
				}
			};
			this.onDefaultAnimate = function(b, s, d) {
				this.ApplyForces(d.F, d.R, d.t);
			};

			var x = w >> 1, n = -1;
			while(++n < this.NUM_PARTICLES)
				this.AttachBox(
					new H5GL.BoxBoundForces(10,
						new H5GL.BoxBoundBox(
							x, h, x + 1, h + 1, n,
							{
								color: colors[n % colors.length],
								alpha: 0.0,
								v: {x: 0, y: n},
								index: n,
								w: s.rnd(8, 16)
							}
						)
					)
				);

			var m = Math.min(w, h) >> 4;
			this.points = [
				{x:     m, y:     m}, {x: m, y: m}, {x: m, y: m},
				{x: w - m, y:     m}, {x: w - m, y:     m},
				{x:     m, y: h - m},
				{x: w - m, y: h - m},
				{x:     m, y:     m}, {x: m, y: m}, {x: m, y: m}
			];
			this.bspline = new H5GL.BSpline(this.points, false);
			this.bspline.ComputeLengths(0.99, 200);
		}

		this.lastTime = s.currentTime;
	},

	onDraw: function(s, d) {

		var ct = s.currentTime;

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		d.context.globalAlpha = 0.0;
		this.DrawBoxes(s, d);

		{ // reset particle
			this.breset = (this.breset + 1) % this.__box_list.length;
			var t = ct; t *= 0.2; t = t - ~~t; // spline time
			var p = this.bspline.GetNormalizedPoint(t);
			var b = this.__box_list[this.breset];
			var a = s.rndf(Math.PI / 4, 3 * Math.PI / 4);
			b.position.xi = p.x; b.position.xf = p.x + 1;
			b.position.yi = p.y; b.position.yf = p.y + 1;
			b.v = {x: 40 * Math.cos(a), y: -90 * Math.sin(a)};
			b.alpha = 1.0;
		}

		this.AnimateBoxes(s, {F: {x: 0, y: 9.8 + 5}, R: {x: 0.999, y: 0.999}, t: ct - this.lastTime});
		this.lastTime = ct;
		d.context.globalAlpha = 1.0;

	}

}));
