/*
 * -- JJBM,	03/02/2012, simple.boxcollide.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Box Collide",
		description: "Show how use <b>H5GL .BoxBound</b> object to check box to box collisions.",
		sourcecode: "demos/simple.boxcollide.js",
		thumbnail: "demos/simple.boxcollide.png"
	},

	started: false,
	NUM_BOXES: 160,
	BOX_WIDTH: 15,

	onControllerActivation: function(s, d) {
		if(!this.started) {

			this.started = true;

			this.onDefaultDraw = function (b, s, d) {
				d.context.fillStyle = this.color;
				var p = this.position;
				d.context.fillRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
			};
			this.onDefaultCollideOut = function(b, s, bc) {
				if(--this.collisions <= 0)
					this.color = this.bcolor;
			};
			this.onDefaultCollideIn = function(b, s, bc) {
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
						dx: 2 * Math.cos(a),
						dy: 2 * Math.sin(a)}));

				x += this.BOX_WIDTH + 3;
				if(x >= w - this.BOX_WIDTH) {
					x = 0;
					y += this.BOX_WIDTH + 3;
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
