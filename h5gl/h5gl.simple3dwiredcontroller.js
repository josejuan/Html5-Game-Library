/*
 * -- JJBM,	20/01/2012, h5gl.simple3dwiredcontroller.js
 * --/
 */

// require "external/sylvester.src.js" for matrix manipulation

/*
	H5GL.Simple3DWiredController
		* Private:
		* Public:

			Simple3DWiredController(Hash<Function(H5GL.Object, Object)> callbacks), create a controller with specified handler list

			void s3dwInit(s, d), reset Simple3DWiredController internal data.

			// Functions OpenGL style:

			void s3dwFrustum(float width, float height, float near, float far), set (and replace) a projection matrix
			void s3dwPerspective(float fovy, float aspect, float near, float far), set (and replace) a projection matrix

			void s3dwIdentity(), set identity matrix on view matrix

			void s3dwPushMatrix(), push current view matrix
			void s3dwPopMatrix(), push current view matrix

			void s3dwLookAt(Vector source, Vector destination), set transform matrix to look at

			void s3dwRotateOX(float angle), add rotation OX axis transform to view matrix
			void s3dwRotateOY(float angle), add rotation OY axis transform to view matrix
			void s3dwRotateOZ(float angle), add rotation OZ axis transform to view matrix

			void s3dwTranslate(float x, float y, float z), add translation transform to view matrix
			void s3dwScale(float sx, float sy, float sz), add scale transform to view matrix

			// specific functions:

			void s3dwTransformAllPoints(), apply 3D to 2D transform to all point of all objects

			void s3dwTransformPoints(name), apply 3D to 2D transform to all point of named object

*/
var H5GL = (function (h5gl) {

	h5gl.Simple3DWiredController = function Controller(callbacks) {

		var _Simple3DWiredController = new H5GL.Object('Simple3DWiredController', callbacks);

		// add facilities
		_Simple3DWiredController.Define({

			s3dwInit: function(s, d) {

				// named 3d point list, ej: pointList['triangle'] = [$V([2, 1, 0]), $V([2, 1, 0]), $V([2, 1, 0])]
				this.pointList = {};

				// like OpenGL
				this.matrixStack = [];

			},

			s3dwPushMatrix: function () {
				this.matrixStack.push(this.viewMatrix);
			},

			s3dwPopMatrix: function () {
				this.viewMatrix = this.matrixStack.pop();
			},

			s3dwFrustum: function(width, height, near, far) {

				var w = 1.0 * width;
				var h = 1.0 * height;
				var n = 1.0 * near;
				var f = 1.0 * far;

				this.projectionMatrix = $M([
					[(2 * n) / w,           0,                 0,                     0],
					[          0, (2 * n) / h,                 0,                     0],
					[          0,           0, (f + n) / (n - f), (2 * f * n) / (n - f)],
					[          0,           0,                -1,                     0]
				]);

			},

			s3dwPerspective: function(fovy, aspect, near, far) {
				var f = 1.0 / Math.tan(fovy * 0.5);
				this.projectionMatrix = $M([
					[f / aspect,           0,                           0,                               0],
					[         0,           f,                           0,                               0],
					[         0,           0, (far + near) / (near - far), (2 * far * near) / (near - far)],
					[         0,           0,                          -1,                               0]
				]);
			},

			s3dwIdentity: function () {
				this.viewMatrix = $M([
					[1, 0, 0, 0],
					[0, 1, 0, 0],
					[0, 0, 1, 0],
					[0, 0, 0, 1]
				]);
			},

			s3dwLookAt: function(/*Vector*/ e/*ye*/, /*Vector*/ a/*t*/) {

				var z = a.subtract(e).toUnitVector();
				var x = $V([0, 1, 0]).cross(z).toUnitVector();
				var y = z.cross(x);

				this.viewMatrix = $M([
						[   x.e(1),    y.e(1),    z.e(1), 0],
						[   x.e(2),    y.e(2),    z.e(2), 0],
						[   x.e(3),    y.e(3),    z.e(3), 0],
						[-x.dot(e), -y.dot(e), -z.dot(e), 1]
					]).multiply(this.viewMatrix);

			},

			s3dwRotateOY: function(angle) {
				var c = Math.cos(angle);
				var s = Math.sin(angle);
				this.viewMatrix = $M([
						[c, 0, -s, 0],
						[0, 1,  0, 0],
						[s, 0,  c, 0],
						[0, 0,  0, 1]
					]).multiply(this.viewMatrix);
			},

			s3dwRotateOX: function(angle) {
				var c = Math.cos(angle);
				var s = Math.sin(angle);
				this.viewMatrix = $M([
						[1, 0,  0, 0],
						[0, c, -s, 0],
						[0, s,  c, 0],
						[0, 0,  0, 1]
					]).multiply(this.viewMatrix);
			},

			s3dwRotateOZ: function(angle) {
				var c = Math.cos(angle);
				var s = Math.sin(angle);
				this.viewMatrix = $M([
						[c, -s, 0, 0],
						[s,  c, 0, 0],
						[0,  0, 1, 0],
						[0,  0, 0, 1]
					]).multiply(this.viewMatrix);
			},

			s3dwTranslate: function(x, y, z) {
				this.viewMatrix = $M([
						[1, 0, 0, 0],
						[0, 1, 0, 0],
						[0, 0, 1, 0],
						[x, y, z, 1]
					]).multiply(this.viewMatrix);
			},

			s3dwScale: function(sx, sy, sz) {
				sy = sy || sx;
				sz = sz || sx;
				this.viewMatrix = $M([
						[sx,  0,  0, 0],
						[ 0, sy,  0, 0],
						[ 0,  0, sz, 0],
						[ 0,  0,  0, 1]
					]).multiply(this.viewMatrix);
			},

			s3dwTransformAllPoints: function () {
				for(var o in this.pointList)
					this.s3dwTransformPoints(o);
			},

			s3dwTransformPoints: function (name) {
				var self = this;
				var P = this.pointList[name];
				var M = this.viewMatrix.multiply(this.projectionMatrix);
				M = M.transpose();
				P.forEach(function(v) {
					var p = M.multiply(v);
					var w = 1.0 / p.e(3);
					v._p = p.x(w);
				});

			}

		});

		return _Simple3DWiredController;
	};

	return h5gl;
})(H5GL || {});
