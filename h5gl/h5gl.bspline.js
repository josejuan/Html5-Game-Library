/*
 * -- JJBM,	15/02/2012, h5gl.bspline.js
 * -- JJBM,	17/02/2012, GetPointsFromTInterval
 * -- JJBM,	24/02/2012, length and parameter normalization
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

				t, time parameter along basic (not length normalized) spline, must be 0 <= t <= 1
			*/
			GetPoint: function(t) {
				if(t >= 1.0)
					return this.Pt(this.poly.length - 1, 1.0);
				var L = this.poly.length;
				var q = t * L;
				var n = ~~q;
				return this.Pt(n, q - n);
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
			},

			/*
				compute by numeric method the segment length

				max_length_error, max internal length percentage error when a segment is splited. AB + BC ~ AC
					the process stop when "1 - AC / (AB + BC) <= max_length_error"

				t0, t1	parameter interval

				possible optimizations:
					- some intermediate variables
					- x*x vs pow(x, 2)
					- l01 length calculation is computed two times (one as l01 and another one as l0m or lm1).
			*/
			ComputeSegmentLength: function(max_length_error, t0, t1) {
				var tm = (t0 + t1) * 0.5;
				var p0 = this.GetPoint(t0);
				var pm = this.GetPoint(tm);
				var p1 = this.GetPoint(t1);
				var l0m = Math.sqrt(Math.pow(p0.x - pm.x) + Math.pow(p0.y - pm.y)); // optimize
				var lm1 = Math.sqrt(Math.pow(pm.x - p1.x) + Math.pow(pm.y - p1.y)); // optimize
				var l01 = Math.sqrt(Math.pow(p0.x - p1.x) + Math.pow(p0.y - p1.y)); // optimize
				if(1.0 - l01 / (l0m + lm1) < max_length_error)
					return l0m + lm1;
				return this.ComputeSegmentLength(max_length_error, t0, tm) + this.ComputeSegmentLength(max_length_error, t0, tm);
			},

			/*
				max_length_error, max internal length percentage error when a segment is splited. AB + BC ~ AC
					the process stop when "1 - AC / (AB + BC) <= max_length_error"
				final_marks, number of 'final_marks' length marks are stored
			*/
			ComputeLengths: function(max_length_error, final_marks) {
				this.length_marks = []; /* {t: <parameter>, L: <accumulated length>}
												first element (first mark) ever is
														{t: 0, L: 0}
												last element (last mark) ever is
														{t: 1, L: <total curve length>}
										*/
				for(var n = 0; n < final_marks; n++)
					this.length_marks[n] = {t: n / (final_marks - 1.0), L: 0.0};
				for(var n = 1; n < final_marks; n++)
					this.length_marks[n].L = this.ComputeSegmentLength(max_length_error, this.length_marks[n - 1].t, this.length_marks[n].t);
			}

		});

		return _BSpline;
	};

	return h5gl;
})(H5GL || {});
