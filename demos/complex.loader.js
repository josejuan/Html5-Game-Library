/*
 * -- JJBM,	26/01/2012, complex.loader.js
 * --/
 */

{ // local namespace

	var myLoaderDemo = new H5GL.Object('myLoaderDemo');

	// I need instanciate myLoaderDemo to make a 'self' alias.
	myLoaderDemo.Define({

		demo: {
			title: "Complex Image Loader",
			description: "Show how to use the <b>H5GL.Loader</b> object catching explicitly the <b>onLoader</b> event.",
			sourcecode: "demos/complex.loader.js",
			thumbnail: "demos/complex.loader.png"
		},

		loader: null,

		onControllerActivation: function(s, d) {

			if(this.loader == null) {
				var il = {};
				for(var n = 1; n <= 71; n++)
					il['tux' + n] = {src: 'demos/resources/tux/tux' + (n < 10 ? '0' : '') + n + '.png'};
				this.loader = new H5GL.Loader(

					// wrap object instance on callback but you (probably) not need this callback (you can access data onDraw event)
					(function(){var self=myLoaderDemo;return function(l){self.onLoader(l)}})(),

					il);

			}

		},

		onControllerDeactivation: function(s, d) {
			this.loader.Dispose();
			delete this.loader;
			this.loader = null;
		},

		onLoader: function(l) {
			console.log("Image " + this.loader.__imagesLoaded + " loaded.");
		},

		onDraw: function(s, d) {

			var cv = d.canvas; // canvas to draw in
			var ct = d.context; // canvas graphics context
			var t  = s.currentTime; // elapsed time in seconds

			var vw = cv.width; // viewport whidth
			var vh = cv.height; // viewport height

			var dw = (vw - 20) / this.loader.__imagesToLoad; // delta width
			var yi = vh >> 2;

			var di = 255.0 / this.loader.__imagesToLoad;

			ct.clearRect(0, 0, vw, vh); // clear entire viewport

			var text = "";

			if(!this.loader.Started()) {

				text = "Press 'S' key to start load.";

			} else {

				for(var x = 10, i = 1, cp = 0, L = this.loader.__imagesLoaded; i <= L; i++, x += dw, cp += di ) {
					var cc = Math.floor(cp);
					ct.fillStyle = 'rgb(' + (255 - cc) + ', ' + cc + ', 0)';
					ct.fillRect(x, 10, dw, yi - 10);
				}

				if(this.loader.__imagesLoaded < this.loader.__imagesToLoad) {

					text = "(" + this.loader.__imagesLoaded + "/" + this.loader.__imagesToLoad + ") " + Math.round((100.0 * this.loader.__imagesLoaded) / this.loader.__imagesToLoad) + "% " + "...".substr(0, Math.round(s.currentTime) % 4);

				} else {

					// in real program is better transfer control to other H5GL.Controller
					var iw = (vw < vh? vw : vh) >> 3;
					var ir = ((vw < vh? vw : vh) >> 1) - iw;
					var ox = (vw >> 1) - (iw >> 1);
					var oy = (vh >> 1) - (iw >> 1);
					var ia = 2.0 * Math.PI / this.loader.__imagesLoaded;
					for(var a = 0.0, n = 0; n < this.loader.__imagesToLoad; n++, a += ia)
						ct.drawImage(
							this.loader.Image(n),
							ox + Math.round(ir * Math.cos(a + s.currentTime)),
							oy + Math.round(ir * Math.sin(a + s.currentTime)),
							iw, iw
						);

					text = this.loader.__imagesLoaded + " images loaded.";

				}

			}

			ct.lineWidth = "1";
			ct.fillStyle = "green";
			ct.textAlign = "center";
			ct.textBaseline = "middle";
			ct.font = "30px sans-serif";
			ct.fillText(text, vw >> 1, vh >> 1);

		},

		onKeyUp: function(s, d) {
			if(d.keyCode == 83)
				this.loader.Start();
		}

	});

	demos.AttachDemo(myLoaderDemo);

}
