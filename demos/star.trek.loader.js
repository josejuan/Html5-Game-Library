/*
 * -- JJBM,	01/02/2012, star.trek.loader.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Star Trek Loader",
		description: "Show how to use the <b>H5GL.Loader</b> to create a beautiful (beautiful?) loader.",
		sourcecode: "demos/star.trek.loader.js",
		thumbnail: "demos/star.trek.loader.png"
	},

	loader1: null, // images loader
	loader2: null, // images game
	font: null,
	started: false,

	onControllerActivation: function(s, d) {

		if(this.font == null)
			this.font = new H5GL.Font('demos/resources/strek/digifont.png');

		if(this.loader1 == null)
			// in a real case, a good method is:
			//
			//		1. create a simple loader controller to load ONLY the loader resources.
			//		2. when [1] loader has all resources loaded then, activate real loader controller.
			//		3. when [2] loader has all resources loaded then, activate game controller.
			//
			// in this example, I link two loader on same controller (ugly but simply)
			this.loader1 = new H5GL.Loader(function(){}, {
				'l1': { src: 'demos/resources/strek/loader1.png' },
				'l2': { src: 'demos/resources/strek/loader2.png' },
				'l3': { src: 'demos/resources/strek/loader3.png' },
				'l4': { src: 'demos/resources/strek/loader4.png' }
			});

	},

	onControllerDeactivation: function(s, d) {
		this.loader2.Dispose();
		delete this.loader2;
		this.loader2 = null;
	},

	onDraw: function(s, d) {

		var ct = d.context; // canvas graphics context
		var vw = d.canvas.width; // viewport whidth
		var vh = d.canvas.height; // viewport height

		ct.fillStyle = 'black';
		ct.fillRect(0, 0, vw, vh); // clear entire viewport (to black)

		if(!this.loader1.Started()) {

			this.font.DrawString(s, d, "Press 'S' key to start load.", {x: vw >> 1, y: vh >> 1, center: true, middle: true, maxwidth: 400});

		} else {

			if(this.loader1.__imagesLoaded >= this.loader1.__imagesToLoad) {

				if(this.loader2 == null) {
					// real game images
					var il = {};
					for(var n = 1; n <= 71; n++)
						il['tux' + n] = {src: 'demos/resources/tux/tux' + (n < 10 ? '0' : '') + n + '.png'};
					this.loader2 = new H5GL.Loader(function(){}, il);
					this.loader2.Start();
				} else {

					var i1 = this.loader1.Image('l1');
					var i2 = this.loader1.Image('l2');
					var i3 = this.loader1.Image('l3');
					var i4 = this.loader1.Image('l4');

					ct.globalAlpha = this.loader2.__imagesLoaded / this.loader2.__imagesToLoad;
					ct.drawImage(i4, 0, 150);
					ct.globalAlpha = 1;
					ct.drawImage(i3, 10, 10);

					if(this.loader2.__imagesLoaded < this.loader2.__imagesToLoad) {

						ct.drawImage(i2, 220, 322);

						// on progress...
						var lw = ~~((i1.width * this.loader2.__imagesLoaded) / this.loader2.__imagesToLoad);
						var rw = i1.width - lw;
						ct.drawImage(i1, lw, 0, rw, i1.height, 290 + lw, 394, rw, i1.height );

						var pt = ~~((100 * this.loader2.__imagesLoaded) / this.loader2.__imagesToLoad);
						this.font.DrawString(s, d, pt + "% loaded...", {x: 110, y: 410, center: true, maxwidth: 200});

						// too long time? you can use "s.currentTime" to do a timeout
						// if(s.currentTime > TOO_TIME) ...

					} else {

						this.tref = this.tref || s.currentTime;

						var ny = (~~(178.0 * (s.currentTime - this.tref))) / 2.0;
						if(ny < 500)
							ct.drawImage(i2, 220, 322 + ny);

						if((~~(s.currentTime * 3 - this.tref)) % 3)
							this.font.DrawString(s, d, "Load completed", {x: vw >> 1, y: 410, center: true, maxwidth: 350});

						this.font.DrawString(s, d, "(press any key)", {x: vw >> 1, y: 410 + this.font.__cellHeight, center: true, maxwidth: 350});

						// loading completed (you can pass control to next game controller)
						//		s.DetachController("thisLoader");
						//		s.AttachController("firstPage", firstPage);
					}

				}

			}

		}

	},

	onKeyUp: function(s, d) {
		if(d.keyCode == 83)
			this.loader1.Start();
	}

});
