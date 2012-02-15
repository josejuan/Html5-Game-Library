/*
 * -- JJBM,	09/02/2012, simple.boxforces.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Box Forces",
		description: "Show how to use <b>H5GL. BoxBoundForces</b> to extend a <b>H5GL. BoxBoundBox</b> object and simulate (very simple) physics. If you need a more complex physics schema, I recommend to you use <b>Box2D</b> engine.",
		sourcecode: "demos/simple.boxforces.js",
		thumbnail: "demos/simple.boxforces.png"
	},

	started: false,
	NUM_BOXES: 90,
	BOX_WIDTH: 60,
	RESTITUTION: 0.8,

	onControllerActivation: function(s, d) {
		var controller = this;

		if(!this.started) {

			this.started = true;
			s.__bcontext2d.strokeStyle = 'black';

			this.onDefaultDraw = function (b, s, d) {
				d.context.fillStyle = this.color;
				var p = this.position;
				d.context.fillRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
				d.context.strokeRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
			};
			this.onDefaultCollideOut = function(b, s, bc) {
				var w = this.colliders;
				for(var k in w)
				    if(w[k] == bc) {
				        w.splice(k, 1);
				        break;
				    }
				//if(w.length <= 0)
				//	this.color = this.bcolor;
			};
			this.onDefaultCollideIn = function(b, s, bc) {
				this.colliders.push(bc);
				//this.color = 'red';

				var c1 = {x: (this.position.xf + this.position.xi) * 0.5, y: (this.position.yf + this.position.yi) * 0.5};
				var c2 = {x: (bc.position.xf + bc.position.xi) * 0.5, y: (bc.position.yf + bc.position.yi) * 0.5};
				var dc = {x: c1.x - c2.x, y: c1.y - c2.y};
				if(Math.abs(dc.x) > Math.abs(dc.y)) {
					this.v.x = Math.abs(controller.RESTITUTION * this.v.x * dc.x) / dc.x;
				} else {
					this.v.y = Math.abs(controller.RESTITUTION * this.v.y * dc.y) / dc.y;
				}
			};
			this.onDefaultAnimate = function(b, s, d) {

				// viewport bounds
				var dx = 0, dy = 0;
				if(this.position.xi < 0) { dx = -this.position.xi; this.v.x = Math.abs(controller.RESTITUTION * this.v.x); }
				if(this.position.yi < 0) { dy = -this.position.yi; this.v.y = Math.abs(controller.RESTITUTION * this.v.y); }
				if(this.position.xf > s.__canvas.width) { dx = s.__canvas.width - this.position.xf; this.v.x = -Math.abs(controller.RESTITUTION * this.v.x); }
				if(this.position.yf > s.__canvas.height) { dy = s.__canvas.height - this.position.yf; this.v.y = -Math.abs(controller.RESTITUTION * this.v.y); }

				this.position.xi += dx;
				this.position.yi += dy;
				this.position.xf += dx;
				this.position.yf += dy;

				// step
				var fx = d.F.x, fy = d.F.y;
				var c1 = {x: (this.position.xf + this.position.xi) * 0.5, y: (this.position.yf + this.position.yi) * 0.5};
				for(var n = 0, cld = this.colliders, L = cld.length; n < L; n++) {
					var c2 = {x: (cld[n].position.xf + cld[n].position.xi) * 0.5, y: (cld[n].position.yf + cld[n].position.yi) * 0.5};
					var dc = {x: c1.x - c2.x, y: c1.y - c2.y};
					if(Math.abs(dc.x) > Math.abs(dc.y)) {
						fx += 1000 / dc.x;
					} else {
						fy += 1000 / dc.y;
					}
				}

				this.ApplyForces({x: fx, y: fy}, d.R, d.t);
			};

			var colors = ['yellow', 'green', 'orange', 'blue'];
			var w = s.__canvas.width, h = s.__canvas.height;
			var x = 0, y = h >> 3, n = 0;
			while(y < h - this.BOX_WIDTH && n < this.NUM_BOXES) {

				var a = s.rndf(0, 2 * Math.PI);
				var bw = this.BOX_WIDTH * s.rndf(0.75, 1);
				this.AttachBox(
					new H5GL.BoxBoundForces(10,
						new H5GL.BoxBoundBox(
							x, y, x + bw, y + this.BOX_WIDTH * s.rndf(0.75, 1), n,
							{	bcolor: colors[n % colors.length],
								color: colors[n % colors.length],
								colliders: [],
								v: {x: 40 * Math.cos(a), y: 40 * Math.sin(a)}
							}
						)
					)
				);

				x += bw + 22;
				if(x >= w - this.BOX_WIDTH) {
					x = 0;
					y += this.BOX_WIDTH + 22;
				}

				n++;
			}

		}

		this.lastTime = s.currentTime;
	},

	onDraw: function(s, d) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.AnimateBoxes(s, {
			F: {x: 0, y: 9.8},
			R: {x: 0.9999, y: 0.9999},
			t: s.currentTime - this.lastTime
		});
		this.lastTime = s.currentTime;

		this.DrawBoxes(s, d);

	}

}));
