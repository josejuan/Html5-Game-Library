/*
 * -- JJBM,	26/01/2012, simple.keys.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple Key Control",
		description: "Show how to manage keyboard events and use keyboard state data.",
		sourcecode: "demos/simple.keys.js",
		thumbnail: "demos/simple.keys.png"
	},

	onControllerActivation: function(s, d) {
		this.messageText = "Press any AWSD key!";
		this.messageTime = s.currentTime;

		this.plain = {
			x: s.__canvas.width >> 1,
			y: s.__canvas.height >> 3
		};

		// no loader, simply load images
		this.images = {
			layer: { src: 'demos/resources/key_awsd.png' },
			key_a: { src: 'demos/resources/key_a.png' },
			key_w: { src: 'demos/resources/key_w.png' },
			key_s: { src: 'demos/resources/key_s.png' },
			key_d: { src: 'demos/resources/key_d.png' },
			plain: { src: 'demos/resources/airplain.png' }
		};
		for(var k in this.images) {
			var u = this.images[k].src;
			this.images[k] = new Image();
			this.images[k].src = u;
		}

	},

	onKeyDown: function(s, d) {
		this.messageText = "Key [" + d.keyCode + "] is DOWN!";
		this.messageTime = s.currentTime;
	},

	onKeyUp: function(s, d) {
		this.messageText = "Key [" + d.keyCode + "] is UP!";
		this.messageTime = s.currentTime;
	},

	onDraw: function(s, d) {

		var cv = d.canvas; // canvas to draw in
		var ct = d.context; // canvas graphics context
		var t  = s.currentTime; // elapsed time in seconds

		var vw = cv.width; // viewport whidth
		var vh = cv.height; // viewport height

		ct.clearRect(0, 0, vw, vh); // clear entire viewport

		ct.drawImage(this.images.layer, 0, vh - this.images.layer.height);

		// you can catch key events but, H5GL manage kay state layour for you
		if(s.IsKeyDown(87)) { this.plain.y--; ct.drawImage(this.images.key_w, 0, vh - this.images.layer.height); }
		if(s.IsKeyDown(83)) { this.plain.y++; ct.drawImage(this.images.key_s, 0, vh - this.images.layer.height); }
		if(s.IsKeyDown(65)) { this.plain.x--; ct.drawImage(this.images.key_a, 0, vh - this.images.layer.height); }
		if(s.IsKeyDown(68)) { this.plain.x++; ct.drawImage(this.images.key_d, 0, vh - this.images.layer.height); }

		ct.drawImage(
			this.images.plain,
			this.plain.x - (this.images.plain.width >> 1),
			this.plain.y - (this.images.plain.height >> 1)
		);

		if(this.messageTime + 2 > s.currentTime) {
			ct.lineWidth = "1";
			ct.fillStyle = "green";
			ct.textAlign = "left";
			ct.textBaseline = "top";
			ct.font = "12px sans-serif";
			ct.fillText(this.messageText, 10, 10);
		}

	}

});
