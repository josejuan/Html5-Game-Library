/*
 * -- JJBM,	31/01/2012, h5gl.font.js
 * --/
 */

/*
	H5GL.Loader
		* Private:
		* Public:

			Font(URLString urlBitmapFont), create a Font object with a 16x17 chars cells (extended ASCII symbols), this is GLUT style.

			void DrawString(s, d, text), draw string

*/
var H5GL = (function (h5gl) {

	h5gl.Font = function Font(urlBitmapFont) {

		var _Font = new H5GL.Object('Font');

		// I need instanciate _Font to make a 'self' alias.
		_Font.Define({

			__urlFont: urlBitmapFont,
			__cellWidth: -1,
			__cellHeight: -1,
			__bitmap: null,
			__deltaY: 0,
			__charLength: 0,

			__onImageLoad:
				(function () {
					var self = _Font;
					return function () {
						self.__cellWidth = self.__bitmap.width >> 4;
						self.__cellHeight = self.__bitmap.height / 17;
						self.__charLength = self.__cellWidth;
					};
				})(),

			DrawString: function(s, d, text, options /*
													x: horizontal translation (or anchor position)
													y: horizontal translation (or anchor position)
													maxwidth: max width
													maxheight: max height
													center: true/false
													middle: true/false
													right: true/false			// center must be false
													bottom: true/false			// middle must be false
											*/) {
				// not loaded
				if(this.__cellWidth <= 0)
					return;

				options = options || {};

				var ct = d.context;
				ct.save();
				var cw = this.__cellWidth;
				var ch = this.__cellHeight;
				var cl = this.__charLength;
				var dy = this.__deltaY;
				var dx = this.__deltaX;
				var L = text.length;

				if(options.x)
					ct.translate(options.x, 0);
				if(options.y)
					ct.translate(0, options.y);

				if(options.maxwidth || options.maxheight) {
					var s = 1;
					if(options.maxwidth)
						s = options.maxwidth / (L * cl);
					if(options.maxheight) {
						var sy = options.maxheight / ch;
						if(!(options.maxwidth || false) || sy < s)
							s = sy;
					}
					ct.scale(s, s);
				}

				if(options.center)
					ct.translate((-cl * L) >> 1, 0);
				else
					if(options.right)
						ct.translate(-cl * L, 0);

				if(options.middle)
					ct.translate(0, -(ch >> 1));
				else
					if(options.bottom)
						ct.translate(0, -ch);

				for(var n = 0; n < L; n++) {
					var c = text.charCodeAt(n);
					ct.drawImage(this.__bitmap, (c & 0xF) * cw, dy + (c >> 4) * ch, cw, ch, 0, 0, cw, ch);
					ct.translate(cl, 0);
				}
				ct.restore();
			}

		});

		// start image loading
		_Font.__bitmap = new Image();
		_Font.__bitmap.onload = _Font.__onImageLoad;
		_Font.__bitmap.src = _Font.__urlFont;

		return _Font;
	};

	return h5gl;
})(H5GL || {});

