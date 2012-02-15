/*
 * -- JJBM,	15/02/2012, h5gl.bspline.js
 * --/
 */

/*
	H5GL.BSpline
		* Private:
		* Public:

			BSpline(points, closed), create a (cubic) b-spline object

				points, are a matrix with N points (0, 1, ..., N-1) like [{x: <x>, y: <y>}]
				closed, if false, first and last points are control points.
						if true, path start on first point (interpolate with last point).

			void DrawString(s, d, text), draw string

*/
var H5GL = (function (h5gl) {

	h5gl.BSpline = function BSpline(points, closed) {

		var _BSpline = new H5GL.Object('BSpline');

		var poly = []; // {a: <a>, b: <b>, c: <c>, d: <d>} -> p(t) = a t^3 + b t^2 + c t + d




		_BSpline.Define({


		});

		return _BSpline;
	};

	return h5gl;
})(H5GL || {});

