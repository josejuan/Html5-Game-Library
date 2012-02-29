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
	s.ctlMenu = create_Menu();
	s.ctlGame = create_Game();
	s.ctlNewGame = create_NewGame();
	s.ctlCredits = create_Credits();
 	s.ctlHelp = create_Help();
    s.AttachController('loader', create_Loader());
}

//=== create_Loader ==============================================================================

function create_Loader() {
	return {
		onControllerActivation: function(s, d) {
			var il = {};
			for(var n = 1; n <= 71; n++)
				il['tux' + n] = {src: '../../demos/resources/tux/tux' + (n < 10 ? '0' : '') + n + '.png'};
			s.loader = new H5GL.Loader(function(){}, il);
			s.loader.Start();
		},
		onDraw: function(s, d) {
			if(s.loader.__imagesLoaded < s.loader.__imagesToLoad) {
				var vw = d.canvas.width, vh = d.canvas.height;
				d.context.clearRect(0, 0, vw, vh);
				s.font.DrawString(s, d,
					s.loader.__imagesLoaded + " / " + s.loader.__imagesToLoad,
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
			} else {
				s.DetachController('loader');
			    s.AttachController('menu', s.ctlMenu);
			}
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
		onControllerActivation: function(s, d) {
			this.currentOption = 0;
		},
		onDraw: function(s, d) {
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			d.context.clearRect(0, 0, vw, vh);
			s.font.DrawString(s, d,
					"game...",
					{x: vw >> 1, y: vh >> 1, center: true, middle: true, maxheight: 25});
		},
		onKeyUp: function(s, d) {
			if(d.keyCode == 27) {
				s.DetachController('game');
				s.AttachController('menu', s.ctlMenu);
			}
		}
	};
}

//=== create_NewGame ==============================================================================

function create_NewGame() {
	return {
		onControllerActivation: function(s, d) {
			this.currentOption = 0;
		},
		onDraw: function(s, d) {
			var vw = d.canvas.width;
			var vh = d.canvas.height;
			d.context.clearRect(0, 0, vw, vh);
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
