/*
* -- JJBM, 26/02/2012, simple.particles2.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Particles 2",
		description: "Show how to use <b>H5GL. BoxBoundForces</b> to extend a <b>H5GL. BoxBoundBox</b> object and simulate (very simple) physics. If you need a more complex physics schema, I recommend to you use <b>Box2D</b> engine.",
		sourcecode: "demos/simple.particles.js",
		thumbnail: "demos/simple.particles.png"
	},

	started: false,
	NUM_PARTICLES: 290,
	PARTICLE_WIDTH: 10,
	to_reset: 0,

	onControllerActivation: function(s, d) {
		var controller = this;

		if(!this.started) {

			this.started = true;
			s.__bcontext2d.strokeStyle = 'black';

			var colors = ['yellow', 'green', 'orange', 'blue'];
			var w = s.__canvas.width, h = s.__canvas.height;

			this.onDefaultDraw = function (b, s, d) {
				d.context.fillStyle = this.color;
				var p = this.position;
				d.context.fillRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
				d.context.strokeRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
			};
			this.onDefaultAnimate = function(b, s, d) {
				this.ApplyForces(d.F, d.R, d.t);
			};

			var x = w >> 1, y = h >> 3, n = 0;
			var dy = (h - y) / (1.0 * this.NUM_PARTICLES);
			while(n < this.NUM_PARTICLES) {

				var bw = this.PARTICLE_WIDTH * s.rndf(0.75, 1);
				this.AttachBox(
					new H5GL.BoxBoundForces(10,
						new H5GL.BoxBoundBox(
							x, y, x + bw, y + this.PARTICLE_WIDTH * s.rndf(0.75, 1), n,
							{	bcolor: colors[n % colors.length],
								color: colors[n % colors.length],
								colliders: [],
								v: {x: 0, y: 1 * n}
							}
						)
					)
				);

				y += dy;
				n++;
			}

			var m = Math.min(w, h) >> 4;

			this.points = [
				{x:     m, y:     m}, {x: m, y: m}, {x: m, y: m},
				{x: w - m, y:     m}, {x: w - m, y:     m},
				{x:     m, y: h - m},
				{x: w - m, y: h - m},
				{x:     m, y:     m}, {x: m, y: m}, {x: m, y: m}
			];
			this.bspline2 = new H5GL.BSpline(this.points, false);
			this.bspline2.ComputeLengths(0.99, 200);

		}

		this.lastTime = s.currentTime;
	},

	onDraw: function(s, d) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.AnimateBoxes(s, {
			F: {x: 0, y: 9.8 + 5},
			R: {x: 0.999, y: 0.999},
			t: s.currentTime - this.lastTime
		});
		this.lastTime = s.currentTime;

		{ // reset one
			var t = s.currentTime;
			t *= 0.2;
			t = t - ~~t;

			var b = this.__box_list[++this.to_reset % this.__box_list.length];
			var new_pos = this.bspline2.GetNormalizedPoint(t);

			var dx = new_pos.x - (b.position.xf + b.position.xi) * 0.5;
			var dy = new_pos.y - (b.position.yf + b.position.yi) * 0.5;
			b.position.xi += dx;
			b.position.xf += dx;
			b.position.yi += dy;
			b.position.yf += dy;
			var a = s.rndf(Math.PI / 4, 3 * Math.PI / 4);
			b.v = {x: 40 * Math.cos(a), y: -90 * Math.sin(a)};
		}

		this.DrawBoxes(s, d);

	}

}));
