/*
 * -- JJBM,	29/01/2012, simple.buttons.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Buttons",
		description: "Show how to manage buttons.",
		sourcecode: "demos/simple.buttons.js",
		thumbnail: "demos/simple.buttons.png"
	},

	started: false,

	onControllerDeactivation: function(s, d) {
		s.__canvas.style.cursor = 'default';
	},

	onControllerActivation: function(s, d) {
		if(!this.started) {
			this.started = true;

			s.__bcontext2d.lineWidth = "1";
			s.__bcontext2d.fillStyle = "green";
			s.__bcontext2d.textAlign = "left";
			s.__bcontext2d.textBaseline = "top";
			s.__bcontext2d.font = "20px sans-serif";

			// no loader, simply load images
			var I = [
				{ src: 'demos/resources/button1_a.png' },
				{ src: 'demos/resources/button1_b.png' },
				{ src: 'demos/resources/button1_c.png' }
			];
			for(var n = 0; n < I.length; n++) {
				var u = I[n].src;
				I[n] = new Image();
				I[n].src = u;
			}

			var x = s.__canvas.width / 3;
			var r = {n: 0, onPress: function () { this.n++ }};
			this.AttachBox(this.yes = new H5GL.BoxBoundButton(     x - 29, 50, 58, 69, 0, I[0], I[1], I[2], r));
			this.AttachBox(this.no  = new H5GL.BoxBoundButton( 2 * x - 29, 50, 58, 69, 0, I[0], I[1], I[2], r));

		}
	},

	onDraw: function(s, d) {

		var ct = d.context;

		ct.clearRect(0, 0, d.canvas.width, d.canvas.height);

		this.DrawBoxes(s, d);

		ct.fillText("Left: " + this.yes.n + ", Right: " + this.no.n, 10, 10);

	}

}));
