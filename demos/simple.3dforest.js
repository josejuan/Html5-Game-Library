/*
 * -- JJBM,	26/01/2012, simple.3dforest.js
 * --/
 */

// insert this demo into demos list
demos.AttachDemo(

	// extend a "Simple 3D Wired Controller" with our logic
	new H5GL.Simple3DWiredController({

		demo: {
			title: "Simple 3D Forest",
			description: "Show how to use <b>H5GL.Simple3DWiredController</b> to create a 3D world of 2D sprites (like <b>3D Wolfenstein</b>). Use <b>AWSD</b> to move and <b>KL</b> keys to twist camera.",
			sourcecode: "demos/simple.3dforest.js",
			thumbnail: "demos/simple.3dforest.png"
		},

		MAX_TREES: 120,
        SIDE_LENGTH: 200,
        STEP_LENGTH: 60, // this is STEP_LENGTH / TimeUnit --> walk speed must be fps independent
        ANGLE_LENGTH: 1.0, // this is ANGLE_LENGTH / TimeUnit --> twist speed must be fps independent
		tree: new Image(),

		camera: {
			position: {x: 0, z: -60},
			angle: -Math.PI * 0.5
		},

		onControllerDeactivation: function(s, d) {
			delete this.tree;
			this.tree = new Image();
			delete this.pointList;
			this.pointList = {};
		},

		onControllerActivation: function(s, d) {

			s.__bcontext2d.fillStyle = '#996600';

			this.s3dwInit();
			this.s3dwPerspective(Math.PI * 0.0025, 1, 10, 50);

			this.tree.src = 'demos/resources/tree1.png';

			// tree's reference points
			var P = new Array();
			for(var n = 0; n < this.MAX_TREES; n++)
				P[n] = $V([(Math.random() - 0.5) * this.SIDE_LENGTH, 10, (Math.random() - 0.5) * this.SIDE_LENGTH, 1]);
			this.pointList['trees'] = P;

			this.lastTime = s.currentTime;

		},

		onDraw: function(s, d) {
			var ct = d.context;
            var cw = d.canvas.width;
            var ch = d.canvas.height;
			var c = this.camera;
			var cp = c.position;

			// center of view
			var mw = cw >> 1;
			var mh = ch >> 1;

			// load identity view 3D matrix
			this.s3dwIdentity();

			// set camera position and direction
			var cx = cp.x, cz = cp.z;
			var dx = Math.cos(c.angle), dz = Math.sin(c.angle);
			this.s3dwLookAt(
			    $V([cx, 0, cz]),
			    $V([cx + dx, 0, cz + dz])
			);

			// frame to frame elapsed time
			var st = s.currentTime - this.lastTime;
			var sl = this.STEP_LENGTH * st;
			this.lastTime = s.currentTime;

			// key state
			if(s.IsKeyDown(87)) { cp.z -= dz * sl; cp.x -= dx * sl; }
			if(s.IsKeyDown(83)) { cp.z += dz * sl; cp.x += dx * sl; }
			if(s.IsKeyDown(65)) { cp.z += dx * sl; cp.x -= dz * sl; }
			if(s.IsKeyDown(68)) { cp.z -= dx * sl; cp.x += dz * sl; }
			if(s.IsKeyDown(75)) { c.angle -= this.ANGLE_LENGTH * st; }
			if(s.IsKeyDown(76)) { c.angle += this.ANGLE_LENGTH * st; }

			this.s3dwTransformPoints('trees');

			// draw scene
			ct.fillRect(0, mh, cw, mh);
			var P = this.pointList['trees'];
			for(var n = 0; n < this.MAX_TREES; n++) {
			    var h = P[n]._p.e(2);
			    if(P[n]._p.e(3) > 0 && h > 0)
			        ct.drawImage( this.tree, mw + P[n]._p.e(1), mh + h, h, h << 1 );
			}

			// message
			if(s.currentTime < 5) {
				ct.clearRect(0, 0, cw, mh);

				ct.lineWidth = "1";
				ct.fillStyle = "green";
				ct.textAlign = "center";
				ct.textBaseline = "middle";
				ct.font = "20px sans-serif";
				ct.fillText("Use AWSD to move and KL to twist!", mw, mh >> 1);
			}

		}

	})

);
