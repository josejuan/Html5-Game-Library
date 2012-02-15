/*
 * -- JJBM,	29/01/2012, simple.dragdrop.js
 * --/
 */

demos.AttachDemo(new H5GL.BoxBound({

	demo: {
		title: "Simple Drag & Drop",
		description: "Same as <i>Simple Box Bound 3</i> but show how to do a drag and drop management.",
		sourcecode: "demos/simple.dragdrop.js",
		thumbnail: "demos/simple.dragdrop.png"
	},

	started: false,

	NUM_BOXES: 30,

	dragStartBox: null,
	dragEndBox: null,
	dragPosRef: {},
	dragLastPos: null,

	onControllerDeactivation: function(s, d) {
		s.__canvas.style.cursor = 'default';
	},

	onControllerActivation: function(s, d) {
		s.__canvas.style.cursor = 'not-allowed';
		if(!this.started) {

			this.started = true;

			this.onDefaultMouseIn = function (b, s) {
				s.__canvas.style.cursor = b.dragStartBox == null ? 'pointer' : 'help';
			};
			this.onDefaultMouseOut = function (b, s) {
				s.__canvas.style.cursor = b.dragStartBox == null ? 'not-allowed' : 'move';
			};
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

	// you can use onDefaultMouseDown too on specific boxes
	onMouseDown: function (s, d) {
		this.dragStartBox = this.MouseInBox();
		if(this.dragStartBox != null) {
			s.__canvas.style.cursor = 'move';
			this.dragPosRef.x = this.dragStartBox.position.xi - d.x;
			this.dragPosRef.y = this.dragStartBox.position.yi - d.y;
			this.dragLastPos = d;
		}
	},

	// you can use onDefaultMouseMove too on specific boxes
	onMouseMove: function(s, d) {
		if(this.dragStartBox != null)
			this.dragLastPos = d;
	},

	// you can use onDefaultMouseUp too on specific boxes
	onMouseUp: function(s, d) {
		if(this.dragStartBox != null) {
			if(this.MouseInBox() != null) {
				this.MouseInBox().color = this.dragStartBox.color;
				s.__canvas.style.cursor = 'pointer';
			} else {
				s.__canvas.style.cursor = 'not-allowed';
			}
			this.dragStartBox = null;
		}
	},

	onDraw: function(s, d) {

		var ct = d.context; // canvas graphics context

		ct.clearRect(0, 0, d.canvas.width, d.canvas.height); // clear entire viewport

		this.DrawBoxes(s, d);

		var sb = this.MouseInBox();
		if(sb != null)
			ct.strokeRect(
				sb.position.xi,
				sb.position.yi,
				sb.position.xf - sb.position.xi,
				sb.position.yf - sb.position.yi
			);

		if(this.dragStartBox != null) {
			ct.globalAlpha = 0.5;
			ct.fillStyle = this.dragStartBox.color;
			ct.fillRect(
				this.dragLastPos.x + this.dragPosRef.x,
				this.dragLastPos.y + this.dragPosRef.y,
				this.dragStartBox.position.xf - this.dragStartBox.position.xi,
				this.dragStartBox.position.yf - this.dragStartBox.position.yi
			);
			ct.globalAlpha = 1.0;
		}
	}

}));
