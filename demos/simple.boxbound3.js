/*
 * -- JJBM,	28/01/2012, simple.boxbound3.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Box Bound 3",
		description: "Same as <i>Simple Box Bound 2</i> but not use events. Instead, use <b>H5HL .BoxBound .MouseInBox</b> method to highlight mouse in box.",
		sourcecode: "demos/simple.boxbound3.js",
		thumbnail: "demos/simple.boxbound3.png"
	},

	started: false,

	NUM_BOXES: 30,

	onControllerActivation: function(s, d) {
		if(!this.started) {
			this.started = true;
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
		s.__bcontext2d.strokeStyle = 'yellow';
		s.__bcontext2d.lineWidth = 5;
		s.__bcontext2d.lineJoin = 'round';
	},

	onDraw: function(s, d) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.DrawBoxes(s, d);

		var sb = this.MouseInBox();
		if(sb != null)
			d.context.strokeRect(
				sb.position.xi,
				sb.position.yi,
				sb.position.xf - sb.position.xi,
				sb.position.yf - sb.position.yi
			);
	}

}));
