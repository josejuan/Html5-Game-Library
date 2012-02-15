/*
 * -- JJBM,	28/01/2012, simple.boxbound2.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Box Bound 2",
		description: "Same as <i>Simple Box Bound</i> but more boxes.",
		sourcecode: "demos/simple.boxbound2.js",
		thumbnail: "demos/simple.boxbound2.png"
	},

	started: false,

	NUM_BOXES: 30,

	onControllerActivation: function(s, d) {
		if(!this.started) {

			this.started = true;

			this.onDefaultMouseIn = function() {
				this.bcolor = this.color;
				this.color = 'red';
			};
			this.onDefaultMouseOut = function() {
				this.color = this.bcolor;
			};
			this.onDefaultDraw = function (b, s, d) {
				d.context.fillStyle = this.color;
				var p = this.position;
				d.context.fillRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
			};

			for(var n = 0; n < this.NUM_BOXES; n++) {
				var x = s.rnd(0, s.__canvas.width);
				var y = s.rnd(0, s.__canvas.height);
				var w = s.rnd(5, s.__canvas.width >> 2);
				var h = s.rnd(5, s.__canvas.height >> 2);
				this.AttachBox(new H5GL.BoxBoundBox(x, y, x + w, y + h, n, {
					color: "rgb(" + (x & 0xFF) + ", " + (y & 0xFF) + ", " + (w & 0xFF) + ")"
				}));
			}
		}
	},

	onDraw: function(s, d) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.DrawBoxes(s, d);

	}

}));
