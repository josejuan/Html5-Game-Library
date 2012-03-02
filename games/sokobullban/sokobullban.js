/*
    Soko Bull Ban Game

    Yet another "Sokoban game"

    *** THIS GAME IS NOT UNDER GPL v3 ***

    Copyright 2012 (all right reserved)
    jose-juan(at)computer-mind.com

 */

function body_onLoad() {
	var s = new H5GL.Workspace(document.getElementById('G'));
	s.onInit.Attach('init', function(s, d) { s.UpdateViewport(500, 500) });
	s.Init();
	s.font = new H5GL.Font('gfx/font.png');

	s.ctlLoader = create_Loader();
	s.ctlMenu = create_Menu();
	s.ctlGame = create_Game();
	s.ctlNewGame = create_NewGame();
	s.ctlCredits = create_Credits();
 	s.ctlHelp = create_Help();

	s.util = create_Util();

    s.AttachController('loader', s.ctlLoader);
}

//=== create_Loader ==============================================================================

function create_Loader() {
	return {
		loader: null,
		onControllerActivation: function(s, d) {
			var il = {
				ground: {src: 'gfx/ground.jpg'},
				bulltop: {src: 'gfx/bull-top.png'},
				bulltopshadow: {src: 'gfx/bull-top-shadow.png'},
				conttop: {src: 'gfx/cont-top.png'},
				conttopshadow: {src: 'gfx/cont-top-shadow.png'},
				walltop: {src: 'gfx/wall-top.png'},
				dsttop: {src: 'gfx/dst-top.png'},
				dsttopshadow: {src: 'gfx/dst-top-shadow.png'},
				logo: {src: 'gfx/logo.png'},
				bull: {src: 'gfx/bull.png'}
			};
			this.loader = new H5GL.Loader(function(){}, il);
			this.loader.Start();
			s.util.images = this.loader.__images;
		},
		onDraw: function(s, d) {
			if(this.loader.__imagesLoaded < this.loader.__imagesToLoad) {
				var vw = d.canvas.width, vh = d.canvas.height;
				d.context.clearRect(0, 0, vw, vh);
				s.font.DrawString(s, d,
					this.loader.__imagesLoaded + " / " + this.loader.__imagesToLoad,
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
			} else {
				s.DetachController('loader');
			    s.AttachController('menu', s.ctlMenu);
			}
		}
	};
}

//=== create_Util ==============================================================================

function create_Util() {
	return {
		drawBull: function(dc, x, y, direction, shadow) {
			dc.save();
			dc.translate(x, y);
			dc.rotate(1.5708 * direction);
			dc.drawImage(shadow ? this.images.bulltopshadow : this.images.bulltop, -23, -31);
			dc.restore();
		},
		drawCont: function(dc, x, y, shadow) {
			dc.drawImage(shadow ? this.images.conttopshadow : this.images.conttop, x - 28, y - 28);
		},
		drawWall: function(dc, x, y) {
			dc.drawImage(this.images.walltop, x - 25, y - 25);
		},
		drawDst: function(dc, x, y, shadow, time) {
			if(shadow)
				dc.drawImage(this.images.dsttopshadow, x - 28, y - 28);
			else {
				var k = Math.cos(4 * time);
				if(k > 0) {
					dc.globalAlpha = k;
					dc.drawImage(this.images.dsttop, x - 28, y - 28);
					dc.globalAlpha = 1.0;
				}
			}
		},
		drawMap: function(dc, x, y, map, bullO, time, scale, rotate) {
			dc.save();
			dc.translate(x, y);
			if(scale)
				dc.scale(scale, scale);
			dc.translate(25, 25);
			if(rotate)
				dc.rotate(rotate)
			var left = -25 * map.cols; // -50 * cols / 2
			var top = -25 * map.rows;

			for(var n = 0, L = map.dst.length; n < L; n++)
				this.drawDst(dc, left + 50 * map.dst[n].x, top + 50 * map.dst[n].y, true);
			for(var n = 0, L = map.cont.length; n < L; n++)
				this.drawCont(dc, left + 50 * map.cont[n].x, top + 50 * map.cont[n].y, true);
			this.drawBull(dc, left + 50 * map.bull.x, top + 50 * map.bull.y, bullO, true);

			for(var n = 0, L = map.dst.length; n < L; n++)
				this.drawDst(dc, left + 50 * map.dst[n].x, top + 50 * map.dst[n].y, false, time);
			this.drawBull(dc, left + 50 * map.bull.x, top + 50 * map.bull.y, bullO, false);
			for(var n = 0, L = map.cont.length; n < L; n++) {
				var t = false;
				var x = map.cont[n].x;
				var y = map.cont[n].y;
				for(var d = 0, M = map.dst.length; d < M; d++)
					if(map.dst[d].x == x && map.dst[d].y == y) {
						t = true;
						break;
					}
				if(t)
					dc.globalAlpha = 0.75;
				this.drawCont(dc, left + 50 * x, top + 50 * y, false);
				if(t)
					dc.globalAlpha = 1;
			}
			for(var n = 0, L = map.wall.length; n < L; n++)
				this.drawWall(dc, left + 50 * map.wall[n].x, top + 50 * map.wall[n].y);
			dc.restore();
		}
	};
}

//=== create_Menu ==============================================================================

function create_Menu() {
	return {

		options: ["New game", "Continue game", "Credits", "Help"],
		currentOption: 0,
		ANIMATIONTIME: 0.5,
		onControllerActivation: function(s, d) {
			this.animationStartTime = s.currentTime;
		},
		onDraw: function(s, d) {
			var dc = d.context;
			var vw = d.canvas.width;
			var vh = d.canvas.height;

			dc.drawImage(s.util.images.ground, 0, 0);

			var dy = vh / (this.options.length + 1);
			var dx = 100;

			for(var n = 0; n < this.options.length; n++)
				s.font.DrawString(s, d,
					this.options[n],
					{x: dx, y: dy * (n + 1), middle: true, maxheight: 25});

			s.util.drawBull(dc, dx - 40 + 5 * Math.cos(5 * s.currentTime), dy * (this.currentOption + 1), 3, true);
			s.util.drawBull(dc, dx - 40 + 5 * Math.cos(5 * s.currentTime), dy * (this.currentOption + 1), 3, false);

			dc.save();
			dc.translate(345, 360);
			var t = (s.currentTime - this.animationStartTime) / this.ANIMATIONTIME;
			if(t <= 1) {
				var k = 10 * (1 - t) + t;
				dc.scale(k, k);
			}
			dc.drawImage(s.util.images.logo, -145, -130);
			dc.restore();

		},
		onKeyUp: function(s, d) {
			switch(d.keyCode) {
				case 38: // UP
					this.currentOption = (this.currentOption + this.options.length - 1) % this.options.length;
					break;
				case 40: // DOWN
					this.currentOption = (this.currentOption + 1) % this.options.length;
					break;
				case 13: // ENTER
					switch(this.currentOption) {
						case 0:
							s.DetachController('menu');
							s.AttachController('newgame', s.ctlNewGame);
							break;
						case 1:
							if(s.ctlGame.map != null || s.ctlNewGame.map != null) {
								s.DetachController('menu');
								s.AttachController('game', s.ctlGame);
							}
							break;
						case 2:
							s.DetachController('menu');
							s.AttachController('credits', s.ctlCredits);
							break;
						case 3:
							s.DetachController('menu');
							s.AttachController('help', s.ctlHelp);
							break;
					}
					break;
				default:
					console.log(d.keyCode);
					break;
			}
		}
	};
}

//=== create_Credits ==============================================================================

function create_Credits() {
	return {
		size: 18,
		txt: "\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
SOKO BULL BAN\n\
=============\n\
\n\
\n\
Yet another Sudoku game.\n\
\n\
\n\
Author:\n\
\n\
     http://jose-juan.computer-mind.com\n\
\n\
\n\
Game engine:\n\
\n\
     http://h5gl.computer-mind.com\n\
\n\
\n\
Enjoy it!\n\
",
		onControllerActivation: function(s, d) {
			this.vtext = this.txt.split('\n');
		},
		onDraw: function(s, d) {
			var dc = d.context;
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			dc.drawImage(s.util.images.ground, 0, 0);
			for(var n = 0, A = this.vtext, L = A.length; n < L; n++)
				s.font.DrawString(s, d, A[n], {x: 25, y: n * this.size, maxheight: this.size});
			dc.drawImage(s.util.images.bull, -15, 10);
		},
		onKeyUp: function(s, d) {
			if(d.keyCode == 27) {
				s.DetachController('credits');
				s.AttachController('menu', s.ctlMenu);
			}
		}
	};
}

//=== sbb_map ==============================================================================
var sbb_map = function(idx_map) {
	var dstL = [];
	var contL = [];
	var wallL = [];
	var bull = {x: 0, y: 0};
	var map = sokomaps[idx_map].map.split('\n');
	var cols = 0;
	for(var r = 0, L = map.length; r < L; r++) {
		var H = map[r].length;
		if(H > cols)
			cols = H;
		for(var c = 0; c < H; c++) {
			var w = map[r][c];
			var p = {x: c, y: r};
			if(w == 'U' || w == 'A') bull = p;
			if(w == 'A' || w == 'x' || w == '@') dstL.push(p);
			if(w == 'o' || w == '@') contL.push(p);
			if(w == 'W') wallL.push(p);
		}
	}
	var self = {
		idx: idx_map,
		cols: cols,
		rows: map.length,
		dst: dstL,
		cont: contL,
		bull: bull,
		wall: wallL,
		width: 50 * map[0].length,
		height: 50 * map.length,
		Cell: function(x, y) {
			if(x < 0 || x >= this.cols || y < 0 || y >= this.rows)
				return '!';
			for(var n = 0, A = this.wall, L = A.length; n < L; n++) if(A[n].x == x && A[n].y == y) return 'W';
			for(var n = 0, A = this.cont, L = A.length; n < L; n++) if(A[n].x == x && A[n].y == y) return 'o';
			for(var n = 0, A = this.dst, L = A.length; n < L; n++) if(A[n].x == x && A[n].y == y) return 'x';
			return ' ';
		},
		getCont: function(x, y) {
			if(x < 0 || x >= this.cols || y < 0 || y >= this.rows)
				return null;
			for(var n = 0, A = this.cont, L = A.length; n < L; n++)
				if(A[n].x == x && A[n].y == y)
					return A[n];
			return null;
		},
		isSolved: function() {
			for(var n = 0, A = this.cont, L = A.length; n < L; n++) {
				var inplace = false;
				for(var m = 0, B = this.dst, M = B.length; m < M; m++)
					if(A[n].x == B[m].x && A[n].y == B[m].y) {
						inplace = true;
						break;
					}
				if(!inplace)
					return false;
			}
			return true;
		}
	};
	return self;
};

//=== create_Help ==============================================================================

function create_Help() {
	return {
		size: 18,
		txt: "\
KEYS\n\
====\n\
\n\
<arrows>, move bulldozer.\n\
<ESC>, exit current page.\n\
<+/->, control game speed.\n\
\n\
\n\
GAME\n\
====\n\
\n\
You must move all containers\n\
over destination platforms.\n\
\n\
You only can push container, not pull.\n\
\n\
\n\
Good luck!\n\
",
		onControllerActivation: function(s, d) {
			this.vtext = this.txt.split('\n');
		},
		onDraw: function(s, d) {
			var dc = d.context;
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			dc.drawImage(s.util.images.ground, 0, 0);
			for(var n = 0, A = this.vtext, L = A.length; n < L; n++)
				s.font.DrawString(s, d, A[n], {x: 25, y: n * this.size, maxheight: this.size});
			dc.drawImage(s.util.images.bull, -15, 10);
		},
		onKeyUp: function(s, d) {
			if(d.keyCode == 27) {
				s.DetachController('help');
				s.AttachController('menu', s.ctlMenu);
			}
		}
	};
}

//=== create_Game ==============================================================================

function create_Game() {
	return {
		ANIMATIONTIME: (1/5),
		animationSpeed: 5,
		state: 0,
			/*
				0 - wait orders
				1 - bull moving in progress -> pA to pB
				2 - bull rotating -> rA to rB
				3 - bull translating -> pA to pB

				4 - game completed!
			*/
		direction: 0,

		lastMessageTime: -1000,
		lastMessage: "",
		Message: function(message) {
			this.lastMessageTime = this.ws.currentTime + 2;
			this.lastMessage = message;
		},

		onControllerActivation: function(s, d) {
			if(this.map == null) {
				this.map = s.ctlNewGame.map;
				console.log(this.map);
				this.scale = 10.0 / Math.max(this.map.cols, this.map.rows);
				this.state = 0;
				this.direction = 0;
				this.ws = s;
			}
		},
		onDraw: function(s, d) {
			var dc = d.context;
			var vw = d.canvas.width;
			var vh = d.canvas.height;

			dc.drawImage(s.util.images.ground, 0, 0);

			if(this.state == 0) {
				if(s.IsKeyDown(37 /* left   */)) this.MoveIfLegal(-1,  0);
				if(s.IsKeyDown(38 /* top    */)) this.MoveIfLegal( 0, -1);
				if(s.IsKeyDown(39 /* right  */)) this.MoveIfLegal( 1,  0);
				if(s.IsKeyDown(40 /* bottom */)) this.MoveIfLegal( 0,  1);
			}

			switch(this.state) {
				case 0:
					break;
				case 1:
					{ // compute necesary direction
						var dx = this.pB.x - this.pA.x;
						var dy = this.pB.y - this.pA.y;
						var dd;
						if(dx == 0)	dd = dy < 0 ? 2 : 0;
						else		dd = dx < 0 ? 1 : 3;
						// do move or rotate
						var cd = Math.round(this.direction);
						if(dd == cd) {
							this.state = 3;
						} else {
							this.state = 2;
							this.rA = this.direction;
							// rotate to
							if(dd == 3 && cd == 0)
								this.rB = -1;
							else
								if(dd == 0 && cd == 3)
									this.rB = 4;
								else
									if(Math.abs(dd - cd) > 1)
										this.rB = (dd + cd) >> 1;
									else
										this.rB = dd;
						}
						this.animationStartTime = s.currentTime;
					}
					break;
				case 2:
					{ // rotating
						var t = (s.currentTime - this.animationStartTime) / this.ANIMATIONTIME;
						if(t > 1) {
							this.state = 1;
							this.direction = (Math.round(this.direction) + 4) % 4;
						} else
							this.direction = this.rA * (1 - t) + this.rB * t;
					}
					break;
				case 3:
					{ // moving
						var t = (s.currentTime - this.animationStartTime) / ((this.curCont != null ? 4 : 2) * this.ANIMATIONTIME);
						if(t > 1) {
							this.state = 0;
							this.map.bull = this.pB;
							if(this.curCont != null) {
								// don't replace object! (references object is on this.map.dst array)
								this.curCont.x = this.cpB.x;
								this.curCont.y = this.cpB.y;
								// desref
								this.curCont = null;
								// ¿solved?
								if(this.map.isSolved())
									this.state = 4;
							}
						} else {
							this.map.bull.x = this.pA.x * (1 - t) + this.pB.x * t;
							this.map.bull.y = this.pA.y * (1 - t) + this.pB.y * t;
							if(this.curCont != null) {
								this.curCont.x = this.cpA.x * (1 - t) + this.cpB.x * t;
								this.curCont.y = this.cpA.y * (1 - t) + this.cpB.y * t;
							}
						}
					}
					break;
			}

			s.util.drawMap(dc, vw >> 1, vh >> 1, this.map, this.direction, s.currentTime, this.scale, 0);

			if(this.state == 4)
				s.font.DrawString(s, d, "MAP SOLVED!", {x: vw >> 1, y: vh >> 1, center: true, middle: true, maxwidth: 250});
			else {
				if(this.lastMessageTime > s.currentTime)
					s.font.DrawString(s, d, this.lastMessage, {x: 10, y: 10, maxheight: 25});
			}
		},
		// check if this.pB is a bull legal movement and set for animate
		MoveIfLegal: function(dx, dy) {
			var cp = this.map.bull;
			var np = {x: cp.x + dx, y: cp.y + dy};
			this.pA = {x: cp.x, y: cp.y};
			this.pB = np;
			this.curCont = null;
			var ct = this.map.Cell(np.x, np.y);
			if(ct == ' ' || ct == 'x')
				this.state = 1;
			else
				if(ct == 'o') {
					var cnp = {x: np.x + dx, y: np.y + dy};
					var cct = this.map.Cell(cnp.x, cnp.y);
					if(cct == ' ' || cct == 'x') {
						this.state = 1;
						this.curCont = this.map.getCont(np.x, np.y);
						this.cpA = np;
						this.cpB = cnp;
					}
				}
			if(this.state != 1)
				this.Message("Ilegal movement!");
		},
		onKeyUp: function(s, d) {
			if(d.keyCode == 27) {
				s.DetachController('game');
				s.AttachController('menu', s.ctlMenu);
				return;
			}
			if(this.state != 0)
				return;
			switch(d.keyCode) {
				case 107:
					if(this.animationSpeed < 10)
						this.animationSpeed++;
					this.Message(this.animationSpeed + " current game speed!");
					this.ANIMATIONTIME = 1.0 / this.animationSpeed;
					break;
				case 109:
					if(this.animationSpeed > 1)
						this.animationSpeed--;
					this.Message(this.animationSpeed + " current game speed!");
					this.ANIMATIONTIME = 1.0 / this.animationSpeed;
					break;
				case 13:
					break;
				default:
					console.log(d.keyCode);
					break;
			}
		}
	};
}

//=== create_NewGame ==============================================================================

function create_NewGame() {
	return {
		ANIMATIONTIME: 0.75, // seconds
		state: 0,	/* 0 - in, 1 - static, 2 - out */
		onControllerActivation: function(s, d) {
			this.map = new sbb_map(0);
			this.state = 0;
			this.animationStartTime = s.currentTime;
		},
		onDraw: function(s, d) {
			var dc = d.context;
			var vw = d.canvas.width;
			var vh = d.canvas.height;

			dc.drawImage(s.util.images.ground, 0, 0);

			var scale, position;
			var mscale = 9.0 / Math.max(this.map.cols, this.map.rows) + 0.005 * Math.cos(4 * s.currentTime);
			switch(this.state) {
				case 0: {
						var t = (s.currentTime - this.animationStartTime) / this.ANIMATIONTIME;
						scale = mscale * t;
						if(t > 1)
							this.state = 1;
					}
					break;
				case 1:
					scale = mscale;
					break;
				case 2: {
						var t = (s.currentTime - this.animationStartTime) / this.ANIMATIONTIME;
						scale = mscale * (1 - t);
						if(t > 1) {
							this.map = this.nextMap;
							this.state = 0;
							this.animationStartTime = s.currentTime;
						}
					}
					break;
			}

			s.util.drawMap(dc, vw >> 1, vh >> 1, this.map, 0, s.currentTime, scale, 0);

			s.font.DrawString(s, d, "Map number " + (this.map.idx + 1), {x: 10, y: 10, maxheight: 25});
		},
		onKeyUp: function(s, d) {
			switch(d.keyCode) {
				case 27: // ESC
					this.map = null; // no map selected
					s.DetachController('newgame');
					s.AttachController('menu', s.ctlMenu);
					break;
				case 37:
					this.nextMap = new sbb_map((this.map.idx + 1) % sokomaps.length);
					this.state = 2;
					this.animationStartTime = s.currentTime;
					break;
				case 39:
					this.nextMap = new sbb_map((this.map.idx + sokomaps.length - 1) % sokomaps.length);
					this.state = 2;
					this.animationStartTime = s.currentTime;
					break;
				case 13:
					s.ctlGame.map = null;
					s.DetachController('newgame');
					s.AttachController('game', s.ctlGame);
					break;
			}
		}
	};
}
