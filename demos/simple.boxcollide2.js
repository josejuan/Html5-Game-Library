/*
 * -- JJBM,	03/02/2012, simple.boxcollide2.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Box Collide 2",
		description: "No box collides! All are bouncing!.",
		sourcecode: "demos/simple.boxcollide2.js",
		thumbnail: "demos/simple.boxcollide2.png"
	},

	started: false,
	NUM_BOXES: 60,
	BOX_WIDTH: 20,

	onControllerActivation: function(s, d) {
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
				if(--this.collisions <= 0)
					this.color = this.bcolor;
			};
			this.onDefaultCollideIn = function(b, s, bc) {
				var c1 = {x: (this.position.xf + this.position.xi) * 0.5, y: (this.position.yf + this.position.yi) * 0.5};
				var c2 = {x: (  bc.position.xf +   bc.position.xi) * 0.5, y: (  bc.position.yf +   bc.position.yi) * 0.5};
				var dc = {x: c1.x - c2.x, y: c1.y - c2.y};
				if(Math.abs(dc.x) > Math.abs(dc.y))
					this.dx = Math.abs(this.dx * dc.x) / dc.x;
				else
					this.dy = Math.abs(this.dy * dc.y) / dc.y;
				this.collisions++;
				this.color = 'red';
			};
			this.onDefaultAnimate = function(b, s) {

				// viewport bounds
				if(this.position.xi < 0) this.dx = Math.abs(this.dx);
				if(this.position.yi < 0) this.dy = Math.abs(this.dy);
				if(this.position.xf > s.__canvas.width) this.dx = -Math.abs(this.dx);
				if(this.position.yf > s.__canvas.height) this.dy = -Math.abs(this.dy);

				// step
				this.position.xi += this.dx;
				this.position.xf += this.dx;
				this.position.yi += this.dy;
				this.position.yf += this.dy;

			};

			var colors = ['yellow', 'green', 'orange', 'blue'];
			var w = s.__canvas.width, h = s.__canvas.height;
			var x = 0, y = 0, n = 0;
			while(y < h - this.BOX_WIDTH && n < this.NUM_BOXES) {

				var a = s.rndf(0, 2 * Math.PI);
				this.AttachBox(new H5GL.BoxBoundBox(
					x, y, x + this.BOX_WIDTH, y + this.BOX_WIDTH, n,
					{	bcolor: colors[n % colors.length],
						color: colors[n % colors.length],
						collisions: 0,
						dx: 3 * Math.cos(a),
						dy: 3 * Math.sin(a)}));

				x += this.BOX_WIDTH + 5;
				if(x >= w - this.BOX_WIDTH) {
					x = 0;
					y += this.BOX_WIDTH + 5;
				}

				n++;
			}

		}
	},

	onDraw: function(s, d) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.AnimateBoxes(s);
		this.DrawBoxes(s, d);

	}

}));
