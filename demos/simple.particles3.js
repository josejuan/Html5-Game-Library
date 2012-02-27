/*
 * -- JJBM,	27/02/2012, simple.particles3.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Particles 3",
		description: "Same as <i>\"Simple Particles 3\"</i> but particle images instead boxes.",
		sourcecode: "demos/simple.particles3.js",
		thumbnail: "demos/simple.particles3.png"
	},

	started: false,
	NUM_PARTICLES: 290,
	to_reset: 0,

	stateA: false,
	stateB: false,
	ctime: 0,

	onKeyUp: function(s, d) {
		if(d.keyCode == 72)
			this.stateA = !this.stateA;
		if(d.keyCode == 74)
			this.stateB = true;
	},

	onControllerActivation: function(s, d) {
		var controller = this;

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
					this.alpha -= 0.02;
					if(b.to_reset == this.index)
						console.log("Painting: " + this.index);
					d.context.globalAlpha = this.alpha;
					d.context.drawImage(this.color, this.position.xi, this.position.yi);
				}
			};
			this.onDefaultAnimate = function(b, s, d) {
				this.ApplyForces(d.F, d.R, d.t);
			};

			var x = w >> 1, n = -1;
			while(++n < this.NUM_PARTICLES)
				this.AttachBox(
					new H5GL.BoxBoundForces(10,
						new H5GL.BoxBoundBox(x, h, x + 1, h + 1, n, {color: colors[n % colors.length], alpha: 1.0, v: {x: 0, y: n}, index: n})
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

			ct = this.ctime;

		if(this.stateA || this.stateB) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.DrawBoxes(s, d);


			this.stateB = false;

			this.ctime += 0.005;

		{ // reset one
			var t = ct; t *= 0.2; t = t - ~~t; // spline time

			var b = this.__box_list[(++this.to_reset) % this.__box_list.length];
			var new_pos = this.bspline.GetNormalizedPoint(t);
console.log("Reset: " + b.index);
			b.position.xi = new_pos.x;
			b.position.xf = new_pos.x + 1;
			b.position.yi = new_pos.y;
			b.position.yf = new_pos.y + 1;
			this.UpdateBoxCollidePositions(s, b);
			b.alpha = 1.0;
			var a = s.rndf(Math.PI / 4, 3 * Math.PI / 4);
			b.v = {x: 40 * Math.cos(a), y: -90 * Math.sin(a)};
		}

		this.AnimateBoxes(s, {F: {x: 0, y: 9.8 + 5}, R: {x: 0.999, y: 0.999}, t: ct - this.lastTime});

	}
		this.lastTime = ct;

	}

}));
