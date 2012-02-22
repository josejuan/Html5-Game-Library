/*
 * -- JJBM,	15/02/2012, h5gl.bspline.js
 * -- JJBM,	17/02/2012, GetPointsFromTInterval
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

		var poly = []; // {x: P[t], y: P[t]} -> P[t] := {a: <a>, b: <b>, c: <c>, d: <d>} -> p(t) = a t^3 + b t^2 + c t + d

		{
			// compute P[x^3] coefficients
			var C = function (P0, P1, P2, P3) {
				return {
					a: (-P0 + 3 * P1 - 3 * P2 + P3) / 6.0,
					b: (3 * P0 - 6 * P1 + 3 * P2) / 6.0,
					c: (-3 * P0 + 3 * P2) / 6.0,
					d: (P0 + 4 * P1 + P2) / 6.0
				};
			};

			// simple 4 by 4 step
			for(var n = 3; n < points.length; n++)
				poly.push({
					x: C(points[n-3].x, points[n-2].x, points[n-1].x, points[n].x),
					y: C(points[n-3].y, points[n-2].y, points[n-1].y, points[n].y)
				});
		}


		_BSpline.Define({

			poly: poly,

			// (poly, t) -> {x, y}
			Pt: function (/*poly*/ index, t) {
				var t2 = t * t;
				var t3 = t2 * t;
				var px = this.poly[index].x;
				var py = this.poly[index].y;
				return {
					x: px.a * t3 + px.b * t2 + px.c * t + px.d,
					y: py.a * t3 + py.b * t2 + py.c * t + py.d
				};
			},

			/*
				return {x: float, y: float}

					0 <= from_t <= 1
					from_t <= to_t <= 1
			*/
			GetPointsFromTInterval: function(from_t, to_t, step_t) {
				var L = this.poly.length;
				var t = from_t * L;
				var M = to_t * L;
				var d = step_t * L;
				var r = [];
				while(t < M) {
					var n = ~~t;
					r.push(this.Pt(n, t - n));
					t += d;
				}
				return r;
			}

		});

		return _BSpline;
	};

	return h5gl;
})(H5GL || {});
