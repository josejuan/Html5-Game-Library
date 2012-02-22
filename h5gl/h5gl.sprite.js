/*
 * -- JJBM,	10/02/2012, h5gl.sprite.js
 * --/
 */

/*
	H5GL.Loader
		* Private:
		* Public:

			Sprite(
				HTMLImage bitmapSpriteSource,		// source image for this sprite
				string spliterSchema				// spliter schema to retrieve subsprite images bounds

															The initial Width and Height are image dimensions.

															All values can be a scalar or a function, if is a function then current space context is passed as argument.

																context = {
																	global_index: <global final sprite index>,
																	local_index: <enumerate subspaces when generated>,
																	width: <total original image width>,
																	height: <total original image height>,
																	x: <current global left position>,
																	y: <current global top position>,
																	w: <current global width length>,
																	h: <current global height length>
																}

															Transformations can be:

															1. a transformation define a operation into current sprite space.
															2. "define", define a subsprite image, the image bounds are current sprite space.

																{	type: 'define',
																	name: <subsprite image name>,
																	dx: <anchor x>,
																	dy: <anchor y>
																}

															3. "coords", cut current space into specified bounds

																{	type: 'coords',
																	x: <left coordinate>,
																	y: <top coordinate>,
																	w: <final width>,
																	h: <final height>,

																	transforms: [ <more transforms> ]
																}

															4. "matrix", split current space into cells

																{	type: 'matrix',
																	cols: <total cols>,
																	rows: <total rows>,

																	// for each generated cell, all transform are applied
																	transforms: [ <more transforms> ]
																}

															5. "sequence", define a named sprite sequence, CAN NOT RECURSE!

																{	type: 'sequence',
																	name: <sequence name>,

																	mode: <sequence play mode>,
																		0 - time_based

																	cycle_time: <total seconds to draw all sprites>,

																	transforms: [ <more transforms> ]
																}

			), create a Sprite object

			void DrawString(s, d, text), draw string

*/
var H5GL = (function (h5gl) {

	h5gl.Sprite = function Sprite(bitmapSpriteSource, spliterSchema) {

		if(typeof bitmapSpriteSource.width == 'undefined') {
			console.log("ERROR <H5GL.Sprite>, first argument must be a loaded image.");
			return null;
		}

		var _Sprite = new H5GL.Object('Sprite');

		var spriteList = {
			/*
				'sprite_name': {
					x: <left>,
					y: <top>,
					w: <width>,
					h: <height>
				}
			*/
		};
		var spriteGlobalIndex = 0;
		var sequenceList = {
			/*
				'sequence_name': {
					sprites: [ <sprite object>, <sprite object>, ... ]
				}
			*/
		};
		var currentSequence = null;
		var splitSprite = function (T /* transform */, C /* context */) {
			C.global_index = spriteGlobalIndex;
			var val = function (v) {
				if(typeof v == 'function')
					return v(C);
				return v;
			};
			switch(T.type) {
				case 'define':
					{
						var nm = val(T.name);
						if(typeof spriteList[nm] == 'undefined') {
							spriteList[nm] = {
								S: _Sprite,
								x: C.x,
								y: C.y,
								w: C.w,
								h: C.h,
								dx: (val(T.dx) || 0),
								dy: (val(T.dy) || 0),

								Draw: function(s, d, x /* = 0 */, y /* = 0 */, w /* = sprite.width */, h /* = sprite.height */) {
									d.context.drawImage(this.S.__bitmap, this.x, this.y, this.w, this.h, this.dx + (x || 0), this.dy + (y || 0), w || this.w, h || this.h);
								}
							};
							if(currentSequence != null)
								currentSequence.sprites.push(spriteList[nm]);
							spriteGlobalIndex++;
						} else
							console.log("WARNING <H5GL.Sprite>, redefined sprite name '" + nm + "'.");
					}
					break;
				case 'coords':
					{
						var nC = {
							local_index: 0,
							width: C.width,
							height: C.height,
							x: C.x + val(T.x),
							y: C.y + val(T.y),
							w: val(T.w),
							h: val(T.h)
						};
						for(var t in T.transforms)
							splitSprite(T.transforms[t], nC);
					}
					break;
				case 'matrix':
					{
						var cols = val(T.cols);
						var rows = val(T.rows);
						var colsR = C.w % cols;
						var rowsR = C.h % rows;
						var colW = (C.w - colsR) / cols;
						var rowH = (C.h - rowsR) / rows;
						if(colsR != 0)
							console.log("WARNING <H5GL.Sprite>, a 'matrix' transformation can not divide all cols space " + C.w + " % " + cols + " = " + colsR + ".");
						if(rowsR != 0)
							console.log("WARNING <H5GL.Sprite>, a 'matrix' transformation can not divide all rows space " + C.h + " % " + rows + " = " + rowsR + ".");
						var nC = {
							local_index: 0,
							width: C.width,
							height: C.height,
							w: colW,
							h: rowH
						};
						for(var ic = 0; ic < cols; ic++)
							for(var ir = 0; ir < rows; ir++) {
								nC.x = C.x + ic * colW;
								nC.y = C.y + ir * rowH;
								for(var t in T.transforms)
									splitSprite(T.transforms[t], nC);
								nC.local_index++;
							}
					}
					break;
				case 'sequence':
					{
						var sm = val(T.name);
						if(typeof sequenceList[sm] == 'undefined') {
							sequenceList[sm] = currentSequence = {
								S: _Sprite,
								mode: val(T.mode),
								cycle_time: val(T.cycle_time),
								sprites: [],

								// return next index to draw
								NextIndex: function(s, d) {
									return Math.floor((s.currentTime * this.sprites.length) / this.cycle_time) % this.sprites.length;
								},

								Draw: function(s, d, x /* = 0 */, y /* = 0 */, w /* = sprite.width */, h /* = sprite.height */) {
									this.DrawSprite(s, d, this.NextIndex(s, d), x, y, w, h);
								},

								DrawSprite: function(s, d, index, x /* = 0 */, y /* = 0 */, w /* = sprite.width */, h /* = sprite.height */) {
									this.sprites[index].Draw(s, d, x, y, w, h);
								}
							};
							for(var t in T.transforms)
								splitSprite(T.transforms[t], C);
							currentSequence = null;
						} else
							console.log("WARNING <H5GL.Sprite>, redefined sprite name '" + nm + "'.");
					}
					break;
				default:
					console.log("WARNING <H5GL.Sprite>, unknow transform type '" + T.type + "'.");
					break;
			}
		};

		splitSprite(spliterSchema, {
			local_index: 0,
			width: bitmapSpriteSource.width,
			height: bitmapSpriteSource.height,
			x: 0,
			y: 0,
			w: bitmapSpriteSource.width,
			h: bitmapSpriteSource.height
		});

		// I need instanciate _Sprite to make a 'self' alias.
		_Sprite.Define({

			__bitmap: bitmapSpriteSource,
			__spriteList: spriteList,
			__sequenceList: sequenceList,

			getSprite: function (sprite_name) {
				return this.__spriteList[sprite_name];
			},

			getSequence: function (sequence_name) {
				return this.__sequenceList[sequence_name];
			}

		});

		return _Sprite;
	};

	return h5gl;
})(H5GL || {});
