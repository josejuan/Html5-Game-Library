/*
 * -- JJBM,	28/01/2012, simple.boxbound.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Box Bound",
		description: "Show how use <b>H5GL .BoxBound</b> object to control boxed objects.",
		sourcecode: "demos/simple.boxbound.js",
		thumbnail: "demos/simple.boxbound.png"
	},

	started: false,

	onControllerActivation: function(s, d) {
		if(!this.started) {
			this.started = true;
			this.onDefaultDraw = function (b, s, d) {
				d.context.fillStyle = this.color;
				var p = this.position;
				d.context.fillRect( p.xi, p.yi, p.xf - p.xi, p.yf - p.yi );
			};
			this.AttachBox(new H5GL.BoxBoundBox(100, 100, 200, 200, 0, {
				color: 'red',
				onMouseIn: function() { this.color = 'green' },
				onMouseOut: function() { this.color = 'red' }
			}));
		}
	},

	onDraw: function(s, d) {

		d.context.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.DrawBoxes(s, d);

	}

}));
