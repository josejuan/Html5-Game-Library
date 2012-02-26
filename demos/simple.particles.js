/*
* -- JJBM, 26/02/2012, simple.particles.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Particles",
		description: "Show how to use <b>H5GL. BoxBoundForces</b> to extend a <b>H5GL. BoxBoundBox</b> object and simulate (very simple) physics. If you need a more complex physics schema, I recommend to you use <b>Box2D</b> engine.",
		sourcecode: "demos/simple.particles.js",
		thumbnail: "demos/simple.particles.png"
	},

	started: false,
	NUM_PARTICLES: 290,
	PARTICLE_WIDTH: 10,
	last_mouse_pos: {x: 0, y: 0},
	floor_box: null,

	onMouseMove: function(s, d) {
		this.last_mouse_pos = d;
	},

	onControllerActivation: function(s, d) {
		var controller = this;

		if(!this.started) {

			this.started = true;
			s.__bcontext2d.strokeStyle = 'black';

			var colors = ['yellow', 'green', 'orange', 'blue'];
			var w = s.__canvas.width, h = s.__canvas.height;

			this.last_mouse_pos = {x: w >> 1, y: h >> 3};

			this.AttachBox(
				this.floor_box =
					new H5GL.BoxBoundForces(10,
						new H5GL.BoxBoundBox(
							-10000, h + this.PARTICLE_WIDTH, 10000, 10000, 0,
							{	bcolor: colors[n % colors.length],
								color: colors[n % colors.length],
								colliders: [],
								v: {x: 0, y: 0}
							}
						)
					)
			);

			this.onDefaultDraw = function (b, s, d) {
				d.context.fillStyle = this.color;
				var p = this.position;
				d.context.fillRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
				d.context.strokeRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
			};
			this.onDefaultCollideIn = function(b, s, bc) {
				if(bc == b.floor_box) {
					var dx = b.last_mouse_pos.x - (this.position.xf + this.position.xi) * 0.5;
					var dy = b.last_mouse_pos.y - (this.position.yf + this.position.yi) * 0.5;
					this.position.xi += dx;
					this.position.xf += dx;
					this.position.yi += dy;
					this.position.yf += dy;
					var a = s.rndf(Math.PI / 4, 3 * Math.PI / 4);
					this.v = {x: 40 * Math.cos(a), y: -90 * Math.sin(a)};
				}
			};
			this.onDefaultAnimate = function(b, s, d) {
				this.ApplyForces(d.F, d.R, d.t);
			};

			var x = w >> 1, y = h >> 3, n = 1;
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

		this.DrawBoxes(s, d);

	}

}));
