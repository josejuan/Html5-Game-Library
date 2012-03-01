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
				dsttopshadow: {src: 'gfx/dst-top-shadow.png'}
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
			var a = 0;
			switch(direction) {
				case 0: a = 3.1416; break;
				case 1: a = -1.5708; break;
				//case 2: a = 0; break;
				case 3: a = 1.5708; break;
			}
			dc.rotate(a);
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
			for(var n = 0, L = map.cont.length; n < L; n++)
				this.drawCont(dc, left + 50 * map.cont[n].x, top + 50 * map.cont[n].y, false);
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

		onDraw: function(s, d) {
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			d.context.clearRect(0, 0, vw, vh);

			var dy = vh / (this.options.length + 1);

			for(var n = 0; n < this.options.length; n++)
				s.font.DrawString(s, d,
					(n == this.currentOption ? ">>> " : "") + this.options[n] + (n == this.currentOption ? " <<<" : ""),
					{x: vw >> 1, y: dy * (n + 1), center: true, middle: true, maxheight: 25});
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
							s.DetachController('menu');
							s.AttachController('game', s.ctlGame);
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
		onControllerActivation: function(s, d) {
			this.currentOption = 0;
		},
		onDraw: function(s, d) {
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			d.context.clearRect(0, 0, vw, vh);
			s.font.DrawString(s, d,
					"credits...",
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
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
	for(var r = 0, L = map.length, H = map[0].length; r < L; r++)
		for(var c = 0; c < H; c++) {
			var w = map[r][c];
			var p = {x: c, y: r};
			if(w == '@' || w == '*') bull = p;
			if(w == '*' || w == '-' || w == '+') dstL.push(p);
			if(w == '|' || w == '+') contL.push(p);
			if(w == 'X') wallL.push(p);
		}
	var self = {
		idx: idx_map,
		cols: map[0].length,
		rows: map.length,
		dst: dstL,
		cont: contL,
		bull: bull,
		wall: wallL,
		width: 50 * map[0].length,
		height: 50 * map.length
	};
	return self;
};

//=== create_Help ==============================================================================

function create_Help() {
	return {
		onControllerActivation: function(s, d) {
			this.currentOption = 0;
		},
		onDraw: function(s, d) {
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			d.context.clearRect(0, 0, vw, vh);
			s.font.DrawString(s, d,
					"help...",
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
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
		ANIMATIONTIME: 0.5, // seconds
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
			switch(this.state) {
				case 0: {
						var t = (s.currentTime - this.animationStartTime) / this.ANIMATIONTIME;
						scale = 0.5 * t;
						position = vh * (1 - scale);
						if(scale > 0.5)
							this.state = 1;
					}
					break;
				case 1:
					scale = 0.5 + 0.005 * Math.cos(4 * s.currentTime);
					position = vh >> 1;
					break;
				case 2: {
						var t = (s.currentTime - this.animationStartTime) / this.ANIMATIONTIME;
						scale = 0.5 * (1 - t);
						position = vh * (1 - scale);
						if(scale < 0) {
							this.map = this.nextMap;
							this.state = 0;
							this.animationStartTime = s.currentTime;
						}
					}
					break;
			}
			s.util.drawMap(dc, vw >> 1, position, this.map, 0, s.currentTime, scale, s.currentTime * 0.1);

			s.font.DrawString(s, d,
					"game...",
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
		},
		onKeyUp: function(s, d) {
			switch(d.keyCode) {
				case 27: // ESC
					s.DetachController('game');
					s.AttachController('menu', s.ctlMenu);
					break;
				case 37:
					this.nextMap = new sbb_map((this.map.idx + 1) % sokomaps.length);
					this.state = 2;
					this.animationStartTime = s.currentTime;
					break;
				case 39:
					break;
			}
		}
	};
}

//=== create_NewGame ==============================================================================

function create_NewGame() {
	return {
		selectedMap: 0,
		onControllerActivation: function(s, d) {
		},
		onDraw: function(s, d) {
			var dc = d.context;
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			s.font.DrawString(s, d,
					"new game...",
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
		},
		onKeyUp: function(s, d) {
			if(d.keyCode == 27) {
				s.DetachController('newgame');
				s.AttachController('menu', s.ctlMenu);
			}
		}
	};
}
