/*
 * -- JJBM,	10/02/2012, simple.sprite.js
 * --/
 */

demos.AttachDemo({

	demo: {
		title: "Simple Sprite",
		description: "Show how to use <b>H5GL.Sprite</b> to simple load and draw animated sprites.",
		sourcecode: "demos/simple.sprite.js",
		thumbnail: "demos/simple.sprite.png"
	},

	walker_image: null,
	walker: null,

	runner1_image: null,
	runner1: null,

	runner2_image: null,
	runner2: null,

	onControllerActivation: function(s, d) {
		if(this.walker_image == null) {
			this.walker_image = new Image();
			this.walker_image.src = 'demos/resources/sprites/walker1.png';
			this.runner1_image = new Image();
			this.runner1_image.src = 'demos/resources/sprites/walker2.png';
			this.runner2_image = new Image();
			this.runner2_image.src = 'demos/resources/sprites/walker3.png';
		}
	},

	// very simple loader mechanism
	onDraw: function(s, d) {
		if(this.walker_image.width > 0 && this.runner1_image.width > 0) {
			this.walker = new H5GL.Sprite(this.walker_image, {
				type: 'matrix',
				cols: 1,
				rows: 4,
				transforms: [{
					type: 'sequence',
					name: function(c){return 'pose' + c.local_index},
					mode: 0,
					cycle_time: 0.6,
					transforms: [{
						type: 'matrix',
						cols: 7,
						rows: 1,
						transforms: [{
							type: 'define',
							name: function(c){return 'walker' + c.global_index}
						}]
					}]
				}]
			});

			// generated with "h5gl_sprite_schema_generator.htm"
			this.runner1 = new H5GL.Sprite(this.runner1_image, {
				type: 'sequence',
				name: 'runner1',
				mode: 0,
				cycle_time: 1.0,
				transforms: [
					{type: 'coords', x:   0, y: 0, w: 29, h: 62, transforms: [{type: 'define', name: 'runner1_0', dx: 15, dy: 0}]},
					{type: 'coords', x:  29, y: 0, w: 35, h: 62, transforms: [{type: 'define', name: 'runner1_1', dx: 18, dy: 0}]},
					{type: 'coords', x:  64, y: 0, w: 47, h: 62, transforms: [{type: 'define', name: 'runner1_2', dx: 24, dy: 0}]},
					{type: 'coords', x: 111, y: 0, w: 41, h: 62, transforms: [{type: 'define', name: 'runner1_3', dx: 38, dy: 0}]},
					{type: 'coords', x: 152, y: 0, w: 35, h: 62, transforms: [{type: 'define', name: 'runner1_4', dx: 50, dy: 0}]},
					{type: 'coords', x: 187, y: 0, w: 39, h: 62, transforms: [{type: 'define', name: 'runner1_5', dx: 68, dy: 0}]},
					{type: 'coords', x: 226, y: 0, w: 46, h: 62, transforms: [{type: 'define', name: 'runner1_6', dx: 73, dy: 0}]},
					{type: 'coords', x: 272, y: 0, w: 33, h: 62, transforms: [{type: 'define', name: 'runner1_7', dx: 92, dy: 0}]}
				]
			});

			// generated with "h5gl_sprite_schema_generator.htm"
			this.runner2 = new H5GL.Sprite(this.runner2_image, {
			    type: 'sequence',
			    name: 'runner2',
			    mode: 0,
			    cycle_time: 1.5,
			    transforms: [
			        {type: 'coords', x:    3, y: 105, w: 68, h: 89, transforms: [{type: 'define', name: 'runner2_0',  dx:    0, dy:  0}]},
			        {type: 'coords', x:   85, y: 106, w: 46, h: 88, transforms: [{type: 'define', name: 'runner2_1',  dx:    0, dy:  2}]},
			        {type: 'coords', x:  133, y: 106, w: 81, h: 87, transforms: [{type: 'define', name: 'runner2_2',  dx:    2, dy:  2}]},
			        {type: 'coords', x:  219, y: 108, w: 65, h: 85, transforms: [{type: 'define', name: 'runner2_3',  dx:   -6, dy:  5}]},
			        {type: 'coords', x:  294, y: 105, w: 47, h: 87, transforms: [{type: 'define', name: 'runner2_4',  dx:  -14, dy:  2}]},
			        {type: 'coords', x:  349, y: 110, w: 41, h: 81, transforms: [{type: 'define', name: 'runner2_5',  dx:  -17, dy:  8}]},
			        {type: 'coords', x:  401, y: 105, w: 35, h: 85, transforms: [{type: 'define', name: 'runner2_6',  dx:  -10, dy:  4}]},
			        {type: 'coords', x:  444, y: 100, w: 32, h: 91, transforms: [{type: 'define', name: 'runner2_7',  dx:   -6, dy: -1}]},
			        {type: 'coords', x:  520, y:  98, w: 38, h: 92, transforms: [{type: 'define', name: 'runner2_8',  dx:  -12, dy: -1}]},
			        {type: 'coords', x:  569, y:  98, w: 42, h: 90, transforms: [{type: 'define', name: 'runner2_9',  dx:  -19, dy:  0}]},
			        {type: 'coords', x:  621, y:  99, w: 49, h: 88, transforms: [{type: 'define', name: 'runner2_10', dx:  -24, dy:  2}]},
			        {type: 'coords', x:  671, y:  99, w: 55, h: 89, transforms: [{type: 'define', name: 'runner2_11', dx:  -37, dy:  3}]},
			        {type: 'coords', x:  727, y: 102, w: 51, h: 86, transforms: [{type: 'define', name: 'runner2_12', dx:  -41, dy:  6}]},
			        {type: 'coords', x:  781, y: 101, w: 57, h: 85, transforms: [{type: 'define', name: 'runner2_13', dx:  -57, dy:  3}]},
			        {type: 'coords', x:  843, y: 102, w: 66, h: 88, transforms: [{type: 'define', name: 'runner2_14', dx:  -69, dy:  5}]},
			        {type: 'coords', x:  909, y:  98, w: 68, h: 89, transforms: [{type: 'define', name: 'runner2_15', dx:  -70, dy:  1}]},
			        {type: 'coords', x:  979, y: 100, w: 51, h: 87, transforms: [{type: 'define', name: 'runner2_16', dx:  -76, dy:  3}]},
			        {type: 'coords', x: 1031, y: 101, w: 58, h: 85, transforms: [{type: 'define', name: 'runner2_17', dx:  -95, dy:  5}]},
			        {type: 'coords', x: 1093, y: 102, w: 67, h: 85, transforms: [{type: 'define', name: 'runner2_18', dx: -111, dy:  4}]},
			        {type: 'coords', x: 1167, y:  99, w: 64, h: 89, transforms: [{type: 'define', name: 'runner2_19', dx: -116, dy:  3}]},
			        {type: 'coords', x: 1231, y: 102, w: 50, h: 85, transforms: [{type: 'define', name: 'runner2_20', dx: -131, dy:  5}]},
			    ]
			});

			this.runner1.getSequence('runner1').data = { last_pose: 0, x: 0 };
			this.runner2.getSequence('runner2').data = { last_pose: 0, x: 0 };

			this.onDraw = this.onDraw_scene;
		}
	},

	onDraw_scene: function(s, d) {

		var cv = d.canvas; // canvas to draw in
		var ct = d.context; // canvas graphics context
		var t  = s.currentTime; // elapsed time in seconds

		var vw = cv.width; // viewport whidth
		var vh = cv.height; // viewport height

		ct.clearRect(0, 0, vw, vh); // clear entire viewport

		{ // show static animated sprites
			for(var q = 0; q < 4; q++)
				this.walker.getSequence('pose' + q).Draw(s, d, 100 * (q + 1), vh >> 1);
		}

		{ // move and draw runner1
			var rnr = this.runner1.getSequence('runner1');
			var curpose = rnr.NextIndex(s, d);
			if(curpose != rnr.data.last_pose && curpose == 0) {
				// restart animation
				rnr.data.x += 92 + 5;
				if(rnr.data.x > vw)
					rnr.data.x = -30;
			}
			rnr.data.last_pose = curpose;
			rnr.Draw(s, d, rnr.data.x, vh / 3);
		}

		{ // move and draw runner2
			var rnr = this.runner2.getSequence('runner2');
			var curpose = rnr.NextIndex(s, d);
			if(curpose != rnr.data.last_pose && curpose == 0) {
				// restart animation
				rnr.data.x -= 131 + 5;
				if(rnr.data.x < -30)
					rnr.data.x = vw;
			}
			rnr.data.last_pose = curpose;
			rnr.Draw(s, d, rnr.data.x, (2 * vh) / 3);
		}

	}

});
