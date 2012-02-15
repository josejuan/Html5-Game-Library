/*
 * -- JJBM,	23/01/2012, simple.water.js
 * --/
 */

// insert this demo into demos list
demos.AttachDemo(

	// extend a "Simple 3D Wired Controller" with our logic
	new H5GL.Simple3DWiredController({

		demo: {
			title: "Simple 3D Water",
			description: "Show how to manipulate 3D objects using <b>H5GL.Simple3DWiredController</b>. This is useful not only for wireframe drawing, you can use too to generate pseudo 3D games using bitmaps. This too use a <i>'adaptative frame rate'</i> decreasing (or increasing) geometric complexity.",
			sourcecode: "demos/simple.water.js",
			thumbnail: "demos/simple.water.png"
		},

		SIDE_POINTS: 30,	// initial side points, total points will be NxN
		MIN_FPS: 30,		// if frame rate is below this value then, decrease side points by one
		MAX_FPS: 40,		// if frame rate is over this value then, increase side points by one

		// frame rate control
		onFPS: function(s, fps) {
			if(fps < this.MIN_FPS) {
				this.SIDE_POINTS--;
				this.initialization(s, null);
				s.resetFPS();
			} else
				if(fps > this.MAX_FPS) {
					this.SIDE_POINTS++;
					this.initialization(s, null);
					s.resetFPS();
				}
		},

		// our initialization process
		initialization: function(s, d) {
			this.s3dwInit();
			this.s3dwPerspective(Math.PI * 0.0025, 1, 10, 50);

			var SIDE_LENGTH = 90;
			var SIDE_POINTS = this.SIDE_POINTS;

			this.msg = SIDE_POINTS + "x" + SIDE_POINTS + " squares, " + (2 * SIDE_POINTS * (SIDE_POINTS + 1)) + " edges.";

			var P = new Array();
			var D = SIDE_LENGTH / (SIDE_POINTS - 1.0);
			var O = SIDE_LENGTH * 0.5;
			for(var z = 0, pz = 0, ix = 0; z < SIDE_POINTS; z++, pz += D)
				for(var x = 0, px = 0; x < SIDE_POINTS; x++, ix++, px += D)
					P[ix] = $V([ px - O,  0,  pz - O, 1]);
			this.pointList['water'] = P;
			this.SIDE_STEP = D;
		},

		onControllerActivation: function(s, d) {
			this.initialization(s, d);
		},

		onControllerDeactivation: function(s, d) {
			delete this.pointList;
			this.pointList = {};
			delete this.SIDE_STEP;
		},

		onDraw: function(s, d) {

			var ct = d.context;

			// center of view
			var mw = d.canvas.width >> 1;
			var mh = d.canvas.height >> 1;

			// recreate 3D grid
			var SIDE_POINTS = this.SIDE_POINTS;
			var P = this.pointList['water'];
			for(var z = 0, ix = 0; z < SIDE_POINTS; z++)
				for(var x = 0; x < SIDE_POINTS; x++, ix++) {
					var q = P[ix].elements;
					var cx = q[0], cz = q[2];
					q[1] = this.SIDE_STEP * Math.cos( Math.sqrt(cx * cx + cz * cz) * 0.25 + s.currentTime * 1.5);
				}

			// clear canvas
			ct.clearRect(0, 0, d.canvas.width, d.canvas.height);
			ct.fillStyle = 'red';

			// load identity view 3D matrix
			this.s3dwIdentity();

			// set camera position and direction
			this.s3dwLookAt($V([0, 30, -60]), $V([0, 0, 0]));

			// rotate object
			this.s3dwRotateOY(s.currentTime * 0.75);

			// transform 3D points to 2D points (to projection plane, not clip, not viewport translation)
			this.s3dwTransformPoints('water');

			// draw only one path (multiple subpaths)
			ct.beginPath();
			for(var z = 0, ix = 0; z < SIDE_POINTS; z++) {
				ct.moveTo(mw + P[ix]._p.e(1), mh + P[ix]._p.e(2));
				for(var x = 0; x < SIDE_POINTS; x++, ix++)
					ct.lineTo(mw + P[ix]._p.e(1), mh + P[ix]._p.e(2));
			}
			for(var x = 0; x < SIDE_POINTS; x++, ix++) {
				ct.moveTo(mw + P[x]._p.e(1), mh + P[x]._p.e(2));
				for(var z = 0, iz = x; z < SIDE_POINTS; z++, iz += SIDE_POINTS)
					ct.lineTo(mw + P[iz]._p.e(1), mh + P[iz]._p.e(2));
			}
			ct.stroke();

			ct.lineWidth = "1";
			ct.fillStyle = "green";
			ct.textAlign = "left";
			ct.textBaseline = "top";
			ct.font = "12px sans-serif";
			ct.fillText(this.msg, 10, 10);
		}

	})

);
