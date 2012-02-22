/*
 * -- JJBM,	23/01/2012, simple.loader.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple Image Loader",
		description: "Show how to use the <b>H5GL.Loader</b> object to preload and progress images.<br /><br /><b style='text-decoration: blink; color: red'>Reload page to uncache images!</b>",
		sourcecode: "demos/simple.loader.js",
		thumbnail: "demos/simple.loader.png"
	},

	loader: null,

	onControllerActivation: function(s, d) {

		if(this.loader == null) {
			var il = {};
			for(var n = 1; n <= 71; n++)
				il['tux' + n] = {src: 'demos/resources/tux/tux' + (n < 10 ? '0' : '') + n + '.png'};
			this.loader = new H5GL.Loader(function(){}, il);
		}

	},

	onControllerDeactivation: function(s, d) {
		this.loader.Dispose();
		delete this.loader;
		this.loader = null;
	},

	onDraw: function(s, d) {

		var ct = d.context; // canvas graphics context
		var vw = d.canvas.width; // viewport whidth
		var vh = d.canvas.height; // viewport height

		ct.clearRect(0, 0, vw, vh); // clear entire viewport

		var text = "";

		if(!this.loader.Started()) {

			// no loader started (you can start it on "onControllerActivation" event)
			text = "Press 'S' key to start load.";

		} else {

			if(this.loader.__imagesLoaded < this.loader.__imagesToLoad) {

				// on progress...
				text = this.loader.__imagesLoaded + " / " + this.loader.__imagesToLoad;

				// too long time? you can use "s.currentTime" to do a timeout
				// if(s.currentTime > TOO_TIME) ...

			} else {

				// loading completed (you can pass control to next game controller)
				//		s.DetachController("thisLoader");
				//		s.AttachController("firstPage", firstPage);
				text = "Load completed!";

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
