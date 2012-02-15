/*
 * -- JJBM, 19/01/2012, h5gl.core.js
 * -- JJBM, 19/01/2012, H5GL namespace
 * -- JJBM, 19/01/2012, H5GL.Object
 * -- JJBM, 19/01/2012, H5GL.EventHandler
 * -- JJBM, 19/01/2012, H5GL.Workspace
 * -- JJBM,	20/01/2012, H5GL.Controller
 * -- JJBM,	03/02/2012, rndf
 * --/
 */

 /*
 	Defined:

 		H5GL				namespace

 		H5GL.Object			virtual base class
 		H5GL.EventHandler	generic event handler
 		H5GL.Controller		generic loop controller
 		H5GL.Workspace		core of H5GL, wrap a canvas object

 */


// requestAnimationFrame?
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
                        function(callback, element){
                			return window.setTimeout(callback, 16.666666666666666666);
            			};


// H5GL namespace
var H5GL = {};

/*
    H5GL.Object
    	* Virtual class (must be inherit)
    	* Private:
    		__polyTypes (Array), contains all implemented types on current instance (extended types).

    	* Internal:
    		Object Object(type_name [, object_definition]), instance new type object, optional a object initializer.

    	* Public:
    		bool IsTypeOf(H5GL.Object), true/false if current object instance implement that type.
    		void Define(Object), extend current object with other object.
    		void Extend(H5GL.Object), extend current object with other H5GL object.
*/
var H5GL = (function (h5gl) {

	h5gl.Object = function Object(type_name, object_definition) {

		var _Object = {

			__polyTypes: ['Object', type_name],

			IsTypeOf: function (type) {
				return this.__polyTypes.indexOf(type.name) >= 0;
			},

			Define: function (object) {
				var self = this;
			    window.Object.getOwnPropertyNames(object).
				    forEach(function(k) {
				    	if(k != '__polyTypes')
				        	window.Object.defineProperty(self, k, window.Object.getOwnPropertyDescriptor(object, k));
				    });
			},

			Extend: function (object) {
				var self = this;
				object.__polyTypes.
					forEach(function(k) {
						if(self.__polyTypes.indexOf(k) < 0)
							self.__polyTypes.push(k);
					});
			    this.Define(object);
			}

		};

		if(object_definition)
			_Object.Define(object_definition);

		return _Object;
	};

    return h5gl;
})(H5GL || {});


/*
	H5GL.EventHandler
		* Private:
			__subscriptors (Hash), key is subscriptors name, value is callback

		* Public:
			void Attach(String name, (Function(H5GL.Object, Object)) callback), attach a named event handler
			void Detach(String name), detach a named event handler
			void Fire(H5GL.Object h5gl_Object, Object eventData), propagate event to handlers.
*/
var H5GL = (function (h5gl) {

	h5gl.EventHandler = function EventHandler() {

		var _EventHandler = new H5GL.Object('EventHandler', {

			__subscriptors: {},

			Attach: function(name, callback /* (h5gl_Object, eventData) */) {
				this.__subscriptors[name] = callback;
			},

			Detach: function(name) {
				delete this.__subscriptors[name];
			},

			Fire: function(h5gl_Object, eventData) {
				var S = this.__subscriptors;
				for(var k in S)
					S[k](h5gl_Object, eventData);
			}

		});

		return _EventHandler;
	};

	return h5gl;
})(H5GL || {});



/*
	H5GL.Controller
		* Private:
		* Public:

			Controller(Hash<Function(H5GL.Object, Object)> callbacks), create a controller with specified handler list
*/
var H5GL = (function (h5gl) {

	h5gl.Controller = function Controller(callbacks) {

		var _Controller = new H5GL.Object('Controller', callbacks);

		return _Controller;
	};

	return h5gl;
})(H5GL || {});



/*
	H5GL.Workspace
		* Private:
			__subscriptors (Hash), key is subscriptors name, value is callback
			__canvas (HTMLCanvasElement), visible canvas to draw into
			__context2d (CanvasRenderingContext2D), rendering context of __canvas object
			__bcanvas (HTMLCanvasElement), invisible canvas to draw back buffer
			__bcontext2d (CanvasRenderingContext2D), rendering context of ____bcanvas object
			__keyIsUp (Array), current pressed keys
			__canvas_position ({x: <left>, y: <top>}), canvas (left, top) position into page

			void __requestRedraw(), internal redrawing loop
			void __registerKeyState(keyCode, isUp), internal keyboard event registering

		* Public:

			startTime (long), new Date().getTime() at object creation
			currentTime (double), elapsed second from object creation (startTime is ref time)

			data (Object), custom user data

			void AttachController(String name, Hash<Function(H5GL.Object, Object)> callbacks)
			void AttachController(String name, H5GL.Controller controller)
						attach all event handlers to a named controller

			void DetachController(String name), detach all events associated to a named controller

			void UpdateViewport(width, height), must be call to change viewport geometry or when position is changed

			bool IsKeyDown(keyCode), true/false if that keyCode is down

			void Init(), start game loop

			int getCurrentFPS(), return last fps statistics
			void resetFPS(), reset fps calculus

			int rnd(int from, int to)

		* Events

			onUpdateViewport				// {width: <width>, height: <height>}
			onDraw							// {canvas: <canvas>, context: <context>}
			onKeyUp							// <keyboard event data>
			onKeyDown						// <keyboard event data>
			onKeyStateChange				// {keyCode: <keyCode>, isUp: <boolean>}
			onMouseMove						// {x: <x>, y: <y>} (on canvas)
			onMouseDown						// {x: <x>, y: <y>} (on canvas)
			onMouseUp						// {x: <x>, y: <y>} (on canvas)
			onInit							// null
			onFPS							// last fps statistics
			onControllerActivation			// <name> (activated controller name) (after of)
			onControllerDeactivation		// <name> (deactivated controller name) (after of)

*/
var H5GL = (function (h5gl) {

	h5gl.Workspace = function Workspace(canvas) {

		var bb = document.createElement('canvas');

		var _Workspace = new H5GL.Object('Workspace');

		// I need instanciate _Workspace to make a 'self' alias.
		_Workspace.Define({

			// visible canvas and 2d context
			__canvas: canvas,
			__context2d: canvas.getContext('2d'),

			// invisible canvas and 2d context for double buffer drawing
			__bcanvas: bb,
			__bcontext2d: bb.getContext('2d'),

			// current pressed keys
			__keyIsUp: [],

			// canvas (left, top) position into page
			__canvas_position: null,

			// start time
			startTime: new Date().getTime(),

			// current game time in seconds
			currentTime: 0,

			// frame count
			__SECONDS_STAT: 1,		// statistics each N seconds
			__frameCount: 0,		// total frames on current statistics
			__lastCountTime: 0,		// last statistic calculus time
			__lastFPS: 0,			// last statistic calculus result

			// FPS
			getCurrentFPS:
				function () {
					return this.__lastFPS;
				},

			resetFPS:
				function() {
					this.__frameCount = 0;
					this.__lastCountTime = this.currentTime;
				},

			// custom game data (you can use controller object too)
			data: {},

			// event handlers
			onUpdateViewport: new H5GL.EventHandler(),			// {width: <width>, height: <height>}
			onDraw: new H5GL.EventHandler(),					// {canvas: <canvas>, context: <context>}
			onKeyUp: new H5GL.EventHandler(),					// <keyboard event data>
			onKeyDown: new H5GL.EventHandler(),					// <keyboard event data>
			onKeyStateChange: new H5GL.EventHandler(),			// {keyCode: <keyCode>, isUp: <boolean>}
			onMouseMove: new H5GL.EventHandler(),				// {x: <x>, y: <y>} (on canvas)
			onMouseDown: new H5GL.EventHandler(),				// {x: <x>, y: <y>} (on canvas)
			onMouseUp: new H5GL.EventHandler(),					// {x: <x>, y: <y>} (on canvas)
			onInit: new H5GL.EventHandler(),					// null
			onFPS: new H5GL.EventHandler(),						// last fps statistics
			onControllerActivation: new H5GL.EventHandler(),	// <name> (activated controller name) (after of)
			onControllerDeactivation: new H5GL.EventHandler(),	// <name> (deactivated controller name) (after of)

			// push controller events
			AttachController:
				function(name, handlers /* { eventType: callback } */) {
					for(var k in handlers)
						if(k[0] == 'o' && k[1] == 'n') {
							var doCall = (function(){
										    var O = handlers;
										    var K = k;
										    return function(s, d) {
										        return O[K](s, d);
										    };
										})();
							switch(k) {
								case 'onUpdateViewport': this.onUpdateViewport.Attach(name, doCall); break;
								case 'onDraw': this.onDraw.Attach(name, doCall); break;
								case 'onKeyUp': this.onKeyUp.Attach(name, doCall); break;
								case 'onKeyDown': this.onKeyDown.Attach(name, doCall); break;
								case 'onKeyStateChange': this.onKeyStateChange.Attach(name, doCall); break;
								case 'onMouseMove': this.onMouseMove.Attach(name, doCall); break;
								case 'onMouseDown': this.onMouseDown.Attach(name, doCall); break;
								case 'onMouseUp': this.onMouseUp.Attach(name, doCall); break;
								case 'onFPS': this.onFPS.Attach(name, doCall); break;
								case 'onControllerActivation': this.onControllerActivation.Attach(name, doCall); break;
								case 'onControllerDeactivation': this.onControllerDeactivation.Attach(name, doCall); break;
							}
						}
					this.onControllerActivation.Fire(this, name);
				},

			// pop controller events
			DetachController:
				function(name) {
					this.onUpdateViewport.Detach(name);
					this.onDraw.Detach(name);
					this.onKeyUp.Detach(name);
					this.onKeyDown.Detach(name);
					this.onKeyStateChange.Detach(name);
					this.onMouseMove.Detach(name);
					this.onMouseDown.Detach(name);
					this.onMouseUp.Detach(name);
					this.onFPS.Detach(name);
					this.onControllerActivation.Detach(name);

					this.onControllerDeactivation.Fire(this, name);
					this.onControllerDeactivation.Detach(name);
				},

			// internal drawing loop
			__requestRedraw:
				(function () {
					var self = _Workspace;
					return function () {
						window.requestAnimationFrame(function(){
							self.currentTime = (new Date().getTime() - self.startTime) * 0.001;
							self.__frameCount++;
							self.onDraw.Fire(self, {canvas: self.__bcanvas, context: self.__bcontext2d});
							self.__context2d.clearRect(0, 0, self.__canvas.width, self.__canvas.height);
							self.__context2d.drawImage(self.__bcanvas, 0, 0);
							self.__requestRedraw();

							var dt = self.currentTime - self.__lastCountTime;
							if(dt > self.__SECONDS_STAT) {
								self.__lastCountTime = self.currentTime;
								self.__lastFPS = self.__frameCount / dt;
								self.__frameCount = 0;
								self.onFPS.Fire(self, self.__lastFPS);
							}
						});
					};
				})(),

			// must call when geometry or position change
			UpdateViewport:
				function(width, height) {
					this.__canvas.width  = this.__bcanvas.width  = width;
					this.__canvas.height = this.__bcanvas.height = height;

					{ // compute canvas page position
						var x = this.__canvas.offsetLeft;
						var y = this.__canvas.offsetTop;
						var e = this.__canvas.offsetParent;
						while(e) {
							x += e.offsetLeft;
							y += e.offsetTop;
							e = e.offsetParent;
						}
						this.__canvas_position = {x: x, y: y};
					}

    				this.onUpdateViewport.Fire(this, null);
				},

			// query if a keyCode is up (true) or down (false)
			IsKeyDown:
				function(keyCode) {
					return typeof this.__keyIsUp[keyCode] != 'undefined';
				},

			// internal, register keyCode state
			__registerKeyState:
				function(keyCode, isUp) {
					var c = !this.IsKeyDown(keyCode);
					if(c == isUp)
						return; // no change
					if(isUp)
						delete this.__keyIsUp[keyCode];
					else
						this.__keyIsUp[keyCode] = true;
					this.onKeyStateChange.Fire(this, {keyCode: keyCode, isUp: isUp});
				},

			// start game loop with initializations
			Init:
				function() {

					(function () {
						var self = _Workspace;
						window.addEventListener('keydown', function(e) {
							self.onKeyDown.Fire(self, e);
							self.__registerKeyState(e.keyCode, false);
						}, true);
						window.addEventListener('keyup', function(e) {
							self.onKeyUp.Fire(self, e);
							self.__registerKeyState(e.keyCode, true);
						}, true);
						self.__canvas.addEventListener('mousemove', function(e) {
							self.onMouseMove.Fire(self, {
								x: e.clientX - self.__canvas_position.x,
								y: e.clientY + window.pageYOffset - self.__canvas_position.y
							});
						}, true);
						self.__canvas.addEventListener('mousedown', function(e) {
							self.onMouseDown.Fire(self, {
								x: e.clientX - self.__canvas_position.x,
								y: e.clientY + window.pageYOffset - self.__canvas_position.y
							});
						}, true);
						self.__canvas.addEventListener('mouseup', function(e) {
							self.onMouseUp.Fire(self, {
								x: e.clientX - self.__canvas_position.x,
								y: e.clientY + window.pageYOffset - self.__canvas_position.y
							});
						}, true);
					})();

					this.onInit.Fire(this, null);
					this.__requestRedraw();
				},

			rnd: function(a, b) {
				return a + Math.round((b - a) * Math.random());
			},

			rndf: function(a, b) {
				return a + (b - a) * Math.random();
			}

		});

		return _Workspace;
	};

	return h5gl;
})(H5GL || {});

