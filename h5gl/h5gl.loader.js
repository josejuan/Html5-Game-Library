/*
 * -- JJBM,	25/01/2012, h5gl.loader.js
 * -- JJBM,	26/01/2012, if started no restart
 * -- JJBM,	26/01/2012, this.Images(string|number)
 * -- JJBM,	27/01/2012, Dispose
 * --/
 */

/*
	H5GL.Loader
		* Private:
		* Public:

			Loader(
				Function(H5GL.Loader loader) callback,			// progress callback
				Hash<string name, object> images				// images to load, initialize as:
																//		{ 'image1': {src: 'url1'}, ... }
			), create a loader

			void Start(), start download process
			void Dispose(), free all resources and initialize object, the current object is not reusable (create other)
			bool Started(), return true if has been started, false if not
			HTMLImageElement Image(string), get a image object by name
			HTMLImageElement Image(index), get a image object by index (0, 1, 2, ...)

*/
var H5GL = (function (h5gl) {

	h5gl.Loader = function Loader(callback, images) {

		var _Loader = new H5GL.Object('Loader');

		// I need instanciate _Loader to make a 'self' alias.
		_Loader.Define({

			__images: images,
			__imagesIndex: [],
			__imagesLoaded: 0,
			__imagesToLoad: 0,
			__callback: callback,
			__started: false,

			__onImageLoad:
				(function () {
					var self = _Loader;
					return function () {
						self.__imagesLoaded++;
						self.__callback(self);
					};
				})(),

			Image: function(k) {
				if(typeof k == "number")
					return this.__images[this.__imagesIndex[k]];
				return this.__images[k];
			},

			Dispose: function() {
				for(var k in this.__images)
					delete this.__images[k];
				delete this.__images;
				delete __imagesIndex;
			},

			Started: function() {
				return this.__started;
			},

			Start: function() {
				if(!this.__started) {
					this.__started = true;
					for(var k in this.__images) {
						this.__imagesIndex[this.__imagesToLoad++] = k;
						var i = new Image();
						i.onload = this.__onImageLoad;
						i.src = this.__images[k].src;
						this.__images[k] = i;
					}
				}
			}

		});

		return _Loader;
	};

	return h5gl;
})(H5GL || {});
