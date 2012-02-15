/*
 * -- JJBM,	28/01/2012, h5gl.boxbound.js
 * -- JJBM,	02/02/2012, collision by modified Sweep
 * -- JJBM,	03/02/2012, AnimateBoxes
 * -- JJBM,	09/02/2012, optimizations
 * -- JJBM,	09/02/2012, BoxBoundForces
 * --/
 *
 * TODO:
 *
 *		[ ] use modified version of "Sweep and prune" algorithm for collision detection.
 *		[ ] DrawBoxes, sort zIndex only if any change
 *
 */

/*
	internal usage, is used to store coordinates along each axis
*/
var H5GL = (function (h5gl) {

	h5gl.BoxBoundCollideNode = function BoxBoundCollideNode(c, t, ref_object) {
		this.t = t; // coordinate type 0 - initial, 1 - final
		this.c = c; // coordinate in axis
		this.l = null; // left node
		this.r = null; // right node
		this.o = ref_object; // referenced object
	};

	return h5gl;
})(H5GL || {});

/*
	internal usage, is used to manage coordinates along each axis
*/
var H5GL = (function (h5gl) {

	h5gl.BoxBoundCollideAxis = function BoxBoundCollideAxis(axis_type, object_definition) {

		var _BoxBoundCollideAxis = new H5GL.Object('BoxBoundCollideAxis', {

			axis_type: axis_type, // 0 - X axis, 1 - Y axis
			startNode: null,
			endNode: null,

			InsertNew: function (/* H5GL.BoxBoundCollideNode */ node) {
				if(this.startNode == null) {
					this.startNode = this.endNode = node;
				} else {
					var cn = this.startNode;
					while(cn != null && cn.c < node.c)
						cn = cn.r;
					this.InsertBefore(node, cn);
				}
			},

			RemoveNode: function (/* H5GL.BoxBoundCollideNode */ node) {
				// unlik
				if(node.r != null) node.r.l = node.l; // if right node, then the left node of right node is my left node
				if(node.l != null) node.l.r = node.r; // if left node, then the right node of left node is my right node
				if(node.l == null) this.startNode = node.r; // if no left node, then my right node is now the first node
				if(node.r == null) this.endNode = node.l; // if no right node, then my left node is now the last node
				node.r = node.l = null;
			},

			/*
				* list can not be empty
				* you can not insert at first position
				* if 'before_this_node' is null then, node will be inserted at end
			*/
			InsertBefore: function (/* H5GL.BoxBoundCollideNode */ node, /* H5GL.BoxBoundCollideNode */ before_this_node) {
				var cn = before_this_node;
				if(cn == null) {
					// last
					this.endNode.r = node;
					node.l = this.endNode;
					this.endNode = node;
				} else {
					if(cn.l == null) {
						// first
						this.startNode.l = node;
						node.r = this.startNode;
						this.startNode = node;
					} else {
						// middle
						cn.l.r = node;
						node.l = cn.l;
						node.r = cn;
						cn.l = node;
					}
				}
			},

			MoveTo: function (/* H5GL.BoxBoundCollideNode */ node, newPos) /* return jumped coordinates */ {
				/*
					interactions = [ {ob: <other box interaction>, it: <interaction type [0 - in, 1 - out]>} ]

						Order is important!

				*/
				var interactions = [];

				var Z = "xy"[(this.axis_type + 1) % 2];
				var Zi = Z + 'i';
				var Zf = Z + 'f';
				var aI = node.o.LL[Zi].c;
				var aF = node.o.LL[Zf].c;

				if(node.c != newPos) {
					if(node.c < newPos) {
						// move to right
						if(node.r != null) {
							if(node.r.c < newPos) {
								var cn = node.r;
								if(node.t == 0) {
									do {
										if(cn.t == 1) {
											// posible OUT
											var bI = cn.o.LL[Zi].c;
											var bF = cn.o.LL[Zf].c;
											if(aF > bI && bF > aI)
												interactions.push({ob: cn.o, it: 1}); // OUT
										}
										cn = cn.r;
									} while(cn != null && cn.c < newPos);
								} else {
									do {
										if(cn.t == 0) {
											// posible IN
											var bI = cn.o.LL[Zi].c;
											var bF = cn.o.LL[Zf].c;
											if(aF > bI && bF > aI)
												interactions.push({ob: cn.o, it: 0}); // IN
										}
										cn = cn.r;
									} while(cn != null && cn.c < newPos);
								}
								if(cn != null && cn.c == newPos) {
									if(cn.l != null)
										newPos = Math.max((cn.l.c + cn.c) * 0.5, newPos - 0.1);
									else
										newPos -= 0.1;
								}
								this.RemoveNode(node);
								this.InsertBefore(node, cn);
							}
						}
					} else {
						// move to left
						if(node.l != null) {
							if(node.l.c > newPos) {
								var cn = node;
								if(node.t == 0) {
									do {
										cn = cn.l;
										if(cn.t == 1) {
											// posible IN
											var bI = cn.o.LL[Zi].c;
											var bF = cn.o.LL[Zf].c;
											if(aF > bI && bF > aI)
												interactions.push({ob: cn.o, it: 0}); // IN
										}
									} while(cn.l != null && cn.l.c > newPos);
								} else {
									do {
										cn = cn.l;
										if(cn.t == 0) {
											// posible OUT
											var bI = cn.o.LL[Zi].c;
											var bF = cn.o.LL[Zf].c;
											if(aF > bI && bF > aI)
												interactions.push({ob: cn.o, it: 1}); // OUT
										}
									} while(cn.l != null && cn.l.c > newPos);
								}
								if(cn.l != null && cn.l.c == newPos) {
									if(cn.l.r != null)
										newPos = Math.min(newPos + 0.1, (cn.l.c + cn.l.r.c) * 0.5);
									else
										newPos += 0.1;
								}
								this.RemoveNode(node);
								this.InsertBefore(node, cn);
							}
						}
					}
				}
				// set to new coord
				node.c = newPos;
/*
	DEBUG, check ordered list

if(this.startNode != null) {
	var n = this.startNode;
	while(n.r != null) {
		if(n.c > n.r.c) {
			console.log("ASSERTION! " + this.AxisName + ", " + n.c + " >> " + n.r.c);
			this.AxisName = null;
		}
		n = n.r;
	}
}
*/
				return interactions;
			}

		});

		// load source object definition, you can override as you need
		_BoxBoundCollideAxis.Define(object_definition);

		return _BoxBoundCollideAxis;
	};

	return h5gl;
})(H5GL || {});

/*
	H5GL.BoxBoundBox
		* Private:
		* Public:

			BoxBoundBox(
				xi, yi,				// upper left box coordinate
				xf, yf,				// bottom right box coordinate (must be xi < xf and yi < yf)
				zIndex,				// order many box object
				object_definition	// object definition
			), create a box bound box object

			bool PointInside({x: <x>, y: <y>}), true/false if point is inside or not

		* Events:

			// all event, first arguments are H5GL.BoxBound and H5GL.Workspace objects
			onMouseIn, fired when mouse position enter on box.
			onMouseOut, fired when mouse position keep out box.
			onMouseMove, only if event occur inside box and this is top most		// {x: <x>, y: <y>} (on canvas)
			onMouseDown, only if event occur inside box and this is top most		// {x: <x>, y: <y>} (on canvas)
			onMouseUp, only if event occur inside box and this is top most			// {x: <x>, y: <y>} (on canvas)
			onDraw, request draw box object, is called in zIndex order				// {canvas: <canvas>, context: <context>}
			onAnimate, will be called inside H5GL.BoxBound.Animate method
			onCollideIn, if start collide with other object							// H5GL.BoxBoundBox other (two events triggered! one for each object)
			onCollideOut, if start collide with other object						// H5GL.BoxBoundBox other (two events triggered! one for each object)

*/
var H5GL = (function (h5gl) {

	h5gl.BoxBoundBox = function BoxBoundBox(xi, yi, xf, yf, zIndex, object_definition) {

		var _BoxBoundBox = new H5GL.Object('BoxBoundBox', {

			visible: true,
			position: {xi: xi, yi: yi, xf: xf, yf: yf, z: zIndex},

			//LL: { xi, yi, xf, yf } -- linked list coordinate refs

			//onMouseIn: undefined,
			//onMouseOut: undefined,
			//onMouseMove: undefined,
			//onMouseDown: undefined,
			//onMouseUp: undefined,
			//onCollideIn: undefined,
			//onCollideOut: undefined,
			//onDraw: undefined,
			//onAnimate: undefined,

			PointInside: function (p) {
				if(p.x <= this.position.xi) return false;
				if(p.y <= this.position.yi) return false;
				if(p.x >= this.position.xf) return false;
				if(p.y >= this.position.yf) return false;
				return true;
			}

		});

		// load source object definition, you can override as you need
		_BoxBoundBox.Define(object_definition);

		return _BoxBoundBox;
	};

	return h5gl;
})(H5GL || {});


/*
	H5GL.BoxBoundButton
		* Private:
		* Public:

			BoxBoundButton(
				x, y,				// upper left button coordinate
				w, h,				// width and height
				zIndex,				// same as box
				object_definition	// object definition
			), create a button object

		* Events:

			onPress(b, s)		// fired when button pressed


*/
var H5GL = (function (h5gl) {

	h5gl.BoxBoundButton = function BoxBoundButton(x, y, w, h, z, imgOut, imgIn, imgDown, object_definition) {

		var _BoxBoundButton = new H5GL.BoxBoundBox(x, y, x + w, y + h, z, {

			imgOut: imgOut,
			imgIn: imgIn,
			imgDown: imgDown,
			img: imgOut,

			onPress: function (b, s) {}, // virtual
			onMouseIn: function (b, s) {
				this.bcursor = s.__canvas.style.cursor;
				s.__canvas.style.cursor = 'pointer';
				this.img = this.imgIn;
			},
			onMouseDown: function (b, s) {
				this.img = this.imgDown;
			},
			onMouseUp: function (b, s) {
				this.img = this.imgIn;
				this.onPress(b, s);
			},
			onMouseOut: function (b, s) {
				s.__canvas.style.cursor = this.bcursor;
				this.img = this.imgOut;
			},
			onDraw: function (b, s, d) {
				d.context.drawImage(this.img, this.position.xi, this.position.yi);
			}

		});

		// load source object definition, you can override as you need
		_BoxBoundButton.Define(object_definition);

		return _BoxBoundButton;
	};

	return h5gl;
})(H5GL || {});


/*
	// extend a BoxBoundBox

	H5GL.BoxBoundForces
		* Private:
		* Public:

			BoxBoundForces(
				mass,					// set mass object
				box_object_definition	// box object to extend
			)


*/
var H5GL = (function (h5gl) {

	h5gl.BoxBoundForces = function BoxBoundForces(mass, box_object_definition) {

		var _BoxBoundForces = new H5GL.Object('BoxBoundForces', {

			m: mass,
			v: {x: 0, y: 0},

			// Euler's method
			ApplyForces: function(F /* {x: <x>, y: <y>} forces */, R /* {x: <x>, y: <y>} friction */, t /* interval */) {
				var v = this.v;
				var a = {x: F.x * this.m, y: F.y * this.m};
				this.v = v = {x: R.x * v.x + a.x * t, y: R.y * v.y + a.y * t};
				var d = {x: v.x * t, y: v.y * t};
				var p = this.position;
				p.xi += d.x;
				p.xf += d.x;
				p.yi += d.y;
				p.yf += d.y;
			}

		});

		// load source object definition, you can override as you need
		_BoxBoundForces.Define(box_object_definition);

		return _BoxBoundForces;
	};

	return h5gl;
})(H5GL || {});



/*
	H5GL.BoxBound
		* Private:
		* Public:

			BoxBound(H5GL.Object object_definition), create a box bound controller

			void AttachBox(H5GL.BoxBoundBox box), attach box
			void DrawBoxes(H5GL.Workspace workspace, {canvas: <canvas>, context: <context>}), draw boxes in zIndex order
			void AnimateBoxes(H5GL.Workspace workspace, aditional_data), animate boxes

		* Events:

			onGlobalMouseMove, to catch original workspace mouse event			// {x: <x>, y: <y>} (on canvas)
			onGlobalMouseDown, to catch original workspace mouse event			// {x: <x>, y: <y>} (on canvas)
			onGlobalMouseUp, to catch original workspace mouse event			// {x: <x>, y: <y>} (on canvas)

			onDefaultMouseIn: function () {},
			onDefaultMouseOut: function () {},
			onDefaultMouseMove: function () {},
			onDefaultMouseDown: function () {},
			onDefaultMouseUp: function () {},
			onDefaultCollideIn: function () {},
			onDefaultCollideOut: function () {},
			onDefaultDraw: function () {},
			onDefaultAnimate: function () {},


*/
var H5GL = (function (h5gl) {

	h5gl.BoxBound = function BoxBound(object_definition) {

		var _BoxBound = new H5GL.Object('BoxBound');

		// load source object definition
		_BoxBound.Define(object_definition);

		// I need instanciate _BoxBound to make a 'self' alias.
		_BoxBound.Define({

			// coordinates linked list

			xLL: new H5GL.BoxBoundCollideAxis(0, {}),
			yLL: new H5GL.BoxBoundCollideAxis(1, {}),

			// box list
			__box_list: [],

			// box with mouse in
			__mouse_in_box: null,

			// jumped events on source object_definition
			__original_onMouseMove: (object_definition.onMouseMove || function(){}),
			__original_onMouseDown: (object_definition.onMouseDown || function(){}),
			__original_onMouseUp: (object_definition.onMouseUp || function(){}),

			// default events to all attached boxes (if you change default, this not affect existing boxes, only next attached boxes)
			onDefaultMouseIn: function () {},
			onDefaultMouseOut: function () {},
			onDefaultMouseMove: function () {},
			onDefaultMouseDown: function () {},
			onDefaultMouseUp: function () {},
			onDefaultCollideIn: function () {},
			onDefaultCollideOut: function () {},
			onDefaultDraw: function () {},
			onDefaultAnimate: function () {},

			// workspace events
			onMouseMove: function (s, d) {
				this.__original_onMouseMove(s, d);

				// *** brute force ******************************
				var actual = null;
				for(var n = 0, A = this.__box_list, L = A.length; n < L; n++)
					if(A[n].PointInside(d) && (actual == null || actual.position.z < A[n].position.z))
						actual = A[n];

				if(actual == null) {
					if(this.__mouse_in_box != null)
						this.__mouse_in_box.onMouseOut(this, s);
				} else {
					if(actual != this.__mouse_in_box) {
						if(this.__mouse_in_box != null)
							this.__mouse_in_box.onMouseOut(this, s);
						actual.onMouseIn(this, s);
					}
				}
				this.__mouse_in_box = actual;

				if(actual != null)
					actual.onMouseMove(this, s, d);
			},

			onMouseDown: function (s, d) {
				this.__original_onMouseDown(s, d);

				if(this.__mouse_in_box != null)
					this.__mouse_in_box.onMouseDown(this, s, d);
			},

			onMouseUp: function (s, d) {
				this.__original_onMouseUp(s, d);

				if(this.__mouse_in_box != null)
					this.__mouse_in_box.onMouseUp(this, s, d);
			},

			AttachBox: function (box) {
				box.onMouseIn    = box.onMouseIn    || this.onDefaultMouseIn;
				box.onMouseOut   = box.onMouseOut   || this.onDefaultMouseOut;
				box.onMouseMove  = box.onMouseMove  || this.onDefaultMouseMove;
				box.onMouseDown  = box.onMouseDown  || this.onDefaultMouseDown;
				box.onMouseUp    = box.onMouseUp    || this.onDefaultMouseUp;
				box.onCollideIn  = box.onCollideIn  || this.onDefaultCollideIn;
				box.onCollideOut = box.onCollideOut || this.onDefaultCollideOut;
				box.onDraw		 = box.onDraw		|| this.onDefaultDraw;
				box.onAnimate	 = box.onAnimate	|| this.onDefaultAnimate;
				this.__box_list.push(box);

				// collision structs
				box.LL = {};
				this.xLL.InsertNew(box.LL.xi = new H5GL.BoxBoundCollideNode(box.position.xi, 0, box));
				this.xLL.InsertNew(box.LL.xf = new H5GL.BoxBoundCollideNode(box.position.xf, 1, box));
				this.yLL.InsertNew(box.LL.yi = new H5GL.BoxBoundCollideNode(box.position.yi, 0, box));
				this.yLL.InsertNew(box.LL.yf = new H5GL.BoxBoundCollideNode(box.position.yf, 1, box));
			},

			UpdateBoxCollidePositions: function (s, box) {
				var J = [].concat(
					this.xLL.MoveTo(box.LL.xi, box.position.xi),
					this.yLL.MoveTo(box.LL.yi, box.position.yi),
					this.xLL.MoveTo(box.LL.xf, box.position.xf),
					this.yLL.MoveTo(box.LL.yf, box.position.yf)
				);
				for(var n = 0, L = J.length; n < L; n++) {
					var j = J[n];
					if(j.it == 0) {
						box.onCollideIn(this, s, j.ob);
						j.ob.onCollideIn(this, s, box);
					} else {
						box.onCollideOut(this, s, j.ob);
						j.ob.onCollideOut(this, s, box);
					}
				}
			},

			MouseInBox: function () {
				return this.__mouse_in_box;
			},

			DrawBoxes: function (s, d) {

				var A = this.__box_list;

				// sort only when a zIndex change
				A.sort(function(a, b) { if(a.z < b.z) return -1; if(a.z > b.z) return 1; return 0; });

				for(var n = 0, L = A.length; n < L; n++)
					A[n].onDraw(this, s, d);

			},

			AnimateBoxes: function (s, aditional_data) {

				for(var n = 0, A = this.__box_list, L = A.length; n < L; n++) {
					var b = A[n];
					b.onAnimate(this, s, aditional_data);
					this.UpdateBoxCollidePositions(s, b);
				}

			}

		});

		return _BoxBound;
	};

	return h5gl;
})(H5GL || {});

