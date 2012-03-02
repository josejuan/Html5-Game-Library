/*
    Soko Bull Ban Game

    Yet another "Sokoban game"

    *** THIS GAME IS NOT UNDER GPL v3 ***

    Copyright 2012 (all right reserved)
    jose-juan(at)computer-mind.com

==============================================

	Map symbols:

		" ", empty cell
		"W", solid wall
		"U", bulldozer start point
		"A", bulldozer over a objetive platform
		"x", objetive platform
		"o", block to move to objetive platform
		"@", block over a objetive platform

 */

var sokomaps = [

{map: "\
WWWWWW\n\
Wx   W\n\
Woo xW\n\
W  o W\n\
WU x W\n\
WWWWWW"
},

{map: "\
     WWWWWWWWW\n\
     Wxxx  x W\n\
  WWWW WxWx  W\n\
WWW    xxxxxxW\n\
W   o o oWxxWW\n\
W oWWWWxxWWWW\n\
W  o   WWW  WW\n\
W ooo o o oU W\n\
W  o o o o o W\n\
WW          WW\n\
 WWWWWWWWWWWW"
},

{map: "\
    WWWWWW\n\
WWWWW    WWW\n\
W    xWWx  WW\n\
W xoWW   W  W\n\
WWoo W  o   W\n\
W x  WWoWo WW\n\
W  U x  x WW\n\
WWWWWWWWWWW"
},

{map: "\
    WWWWW\n\
 WWWW   W\n\
 WxWWx oW\n\
WWoW  o W\n\
W @  xx WW\n\
W   W@@o W\n\
WWWWW U  W\n\
    WWWWWW"
},

{map: "\
    WWWW\n\
 WWWW  WWW\n\
 W  o  o W\n\
 Woxxo x WWW\n\
WW WxWWxx  W\n\
W  xxoUo o W\n\
W o x Wx WWW\n\
WWWWo  o W\n\
   W  WWWW\n\
   WWWW"
},

{map: "\
    WWWW\n\
WWWWW  W\n\
W o x  W\n\
W   @o W\n\
WWWxxo W\n\
 WWWUWWW\n\
 W ox WWW\n\
 W o@x  W\n\
 W  x o W\n\
 W  WWWWW\n\
 WWWW"
},

{map: "\
   WWWWWW\n\
 WWW    WW\n\
 W oooo  W\n\
 W  @xx@ W\n\
 W  ox oxW\n\
WW oWxoWxWW\n\
W  ox ox  W\n\
W oo@oWxW W\n\
W  xxxx W W\n\
WWWWWWW  UW\n\
      WWWWW"
},

{map: "\
   WWWWW\n\
   W   W\n\
   Wx oW\n\
   W o W\n\
WWWWxx WW\n\
W o @@  W\n\
W x  Uo W\n\
WWWWWWWWW"
},

{map: "\
   WWWWW\n\
   W   W\n\
WWWWxx W\n\
W      W\n\
W@@@@@@W\n\
W      W\n\
W ooWWWW\n\
W U W\n\
WWWWW"
},

{map: "\
   WWWW\n\
WWWW  W\n\
W xo@ WW\n\
W   o  W\n\
W xW x W\n\
W @WoUWW\n\
WW    W\n\
 WWWWWW"
},

{map: "\
  WWWWWWW\n\
  W     W\n\
WWW WWW W\n\
W  @o  xW\n\
W  @ oWxW\n\
WW @Uo xW\n\
 Woo@ x W\n\
 W W xWWW\n\
 W WW W\n\
 W    W\n\
 WWWWWW"
},

{map: "\
  WWWWWW\n\
  W    W\n\
WWWoo  W\n\
W o Wo W\n\
W o W  W\n\
W o UW WW\n\
W oWx@x W\n\
W  o@ WxW\n\
WW  x WxW\n\
 WWWxxx W\n\
   W    W\n\
   WWWWWW"
},

{map: "\
  WWWWWW\n\
WWW  x WWW\n\
W oxooo  W\n\
W W Wx W W\n\
W Ux x W W\n\
WWWW o   W\n\
   WoxWWWW\n\
   W  W\n\
   WWWW"
},

{map: "\
  WWWWW\n\
  W   WWWW\n\
WWWo   o W\n\
W  o W   W\n\
W W xWW WW\n\
Wx@@xWWoW\n\
W U x   W\n\
WWWWWWWWW"
},

{map: "\
  WWWWW\n\
  W   WWW\n\
WWWxW   W\n\
W oxo W W\n\
W W@ o  W\n\
WU x WWWW\n\
WWWWWW"
},

{map: "\
  WWWWW\n\
  W   WW\n\
WWWo   WW\n\
W  xoxo W\n\
W WxWxW W\n\
W  @o@  W\n\
WWW   WWW\n\
  W U W\n\
  WWWWW"
},

{map: "\
  WWWWW\n\
  W   WW\n\
WWWoxU W\n\
W  ox  W\n\
W W @ WW\n\
W   WWW\n\
WWWWW"
},

{map: "\
  WWWWW\n\
  W   W\n\
WWW WoW\n\
W  xoxWWW\n\
W Wo@o  W\n\
W  xo W W\n\
WWW Wx  W\n\
  W   WWW\n\
  WWWWW"
},

{map: "\
  WWWWW\n\
  W   W\n\
WWWoW WWW\n\
W   WxU W\n\
W   @xW W\n\
W   W W W\n\
WWWoW   W\n\
  W   WWW\n\
  WWWWW"
},

{map: "\
  WWWWW\n\
  W U WW\n\
WWWooo WWW\n\
W  xW x  W\n\
W WxW xW W\n\
W  x WxW W\n\
W @ooo   W\n\
WWW  W WWW\n\
  WW   W\n\
   WWWWW"
},

{map: "\
  WWWWW\n\
  W U W\n\
WWW W WWW\n\
W ooWoo W\n\
W xx x  W\n\
WW  WxoWW\n\
 W   x W\n\
 WWWWWWW"
},

{map: "\
  WWWWW\n\
  W U W\n\
WWW @ WWW\n\
W  xxx  W\n\
W WWoWW W\n\
W o   o W\n\
WWW   WWW\n\
  W   W\n\
  WWWWW"
},

{map: "\
  WWWWW\n\
 WW   WW\n\
 W  oxxWW\n\
WWo WxoxW\n\
W   WxxxW\n\
W oWWWo W\n\
W  o o WW\n\
WWU    W\n\
 WWWWWWW"
},

{map: "\
  WWWWW\n\
 WW xUWW\n\
 W  @  W\n\
 W o@o W\n\
 WxxWxxW\n\
WWo x oWW\n\
W o W o W\n\
W   W   W\n\
WWWWWWWWW"
},

{map: "\
  WWWWW\n\
 WW U WW\n\
 W xox W\n\
 W @ @ W\n\
 Wo Wx@W\n\
WW  W  WW\n\
W oxoxo W\n\
W   W   W\n\
WWWWWWWWW"
},

{map: "\
  WWWWW\n\
WWW   WWW\n\
W  oxxo W\n\
W W WW  W\n\
W W WWUWW\n\
W  oxxoW\n\
WWW Wo W\n\
  W x xW\n\
  WoW xW\n\
  W  o W\n\
  WWW  W\n\
    WWWW"
},

{map: "\
  WWWWW\n\
WWW   WWW\n\
W x o x W\n\
W WxoxW W\n\
W o W o W\n\
WWW U WWW\n\
  WWWWW"
},

{map: "\
  WWWWW\n\
WWW   WW\n\
W  x @ W\n\
W xoxWUW\n\
WW W o W\n\
 W o W W\n\
 WWW   W\n\
   WWWWW"
},

{map: "\
  WWWWW\n\
WWW   W\n\
W o W WW\n\
W oxox W\n\
W WWx  W\n\
W  U WWW\n\
WWWWWW"
},

{map: "\
  WWWWW\n\
WWW   W\n\
W ooxoW\n\
W x x W\n\
W W W W\n\
W xx@ WW\n\
WWWUoo W\n\
  W    W\n\
  WWWWWW"
},

{map: "\
  WWWW\n\
  W  WWW\n\
WWW o  WW\n\
W oxxxo W\n\
W WWx W W\n\
W  xoxW W\n\
W oWx o W\n\
WW WoWWUW\n\
 W      W\n\
 WWWWWWWW"
},

{map: "\
  WWWW\n\
  W  W\n\
  Wx W\n\
  W oW\n\
  Wx W\n\
WWW oWWW\n\
W  xo  WW\n\
W W oo  W\n\
W xWWx UW\n\
WW @  oWW\n\
 W  x  W\n\
 WWWWWWW"
},

{map: "\
  WWWW\n\
WWW  WW\n\
W   o W\n\
W WxWUW\n\
W Wo xW\n\
W  xo W\n\
WW   WW\n\
 WWWWW"
},

{map: "\
  WWWW\n\
WWW  WW\n\
W xx  WWW\n\
W @x@   W\n\
WUooxoo W\n\
W  WW   W\n\
WWWWWWWWW"
},

{map: "\
  WWW\n\
  WxW\n\
 WWoWWW\n\
WW @  W\n\
W @  @WW\n\
W @  @ W\n\
W  @@  W\n\
W @   WW\n\
WW U WW\n\
 WWWWW"
},

{map: "\
 WWWWWWWWWW\n\
 W        W\n\
 W WWoW W W\n\
 W xxxxxW W\n\
WWWooooo  W\n\
W  @ xU@WWW\n\
W  ooooo  W\n\
W W xxxWW W\n\
W  xWx xW W\n\
WWW WoW   W\n\
  W   WWWWW\n\
  WWWWW"
},

{map: "\
 WWWWWW\n\
WW    WW\n\
W  WW  W\n\
W W  W W\n\
Wx  xWoWW\n\
W W @ o W\n\
W W @ oUW\n\
W  xx o W\n\
WWWWWWWWW"
},

{map: "\
 WWWWW\n\
 W   W\n\
 Wx oW\n\
 W o W\n\
WWxx WW\n\
W @@o W\n\
W  U  W\n\
WWWWWWW"
},

{map: "\
 WWWWW\n\
WW   WWW\n\
W xxxx W\n\
W Wx W W\n\
W oooo W\n\
W oxUoWWW\n\
W oooo  W\n\
WWoxxoW W\n\
 W xx W W\n\
 WxWWx  W\n\
 W    WWW\n\
 WWWWWW"
},

{map: "\
 WWWWW\n\
WW   W\n\
W  W WWW\n\
W @ o  W\n\
Wx @ WUW\n\
W @ @  W\n\
WW @  WW\n\
 WWWWWW"
},

{map: "\
 WWWWW\n\
WW  WWWWWW\n\
W  o o   W\n\
W    Wx  W\n\
WWUWWWW WW\n\
 W   Wx WW\n\
WW W Woo W\n\
W @@ W xxW\n\
W  @WW ooW\n\
WW    xx W\n\
 WWWWW   W\n\
     WWWWW"
},

{map: "\
 WWWWW\n\
WW  UWWW\n\
W  @@  W\n\
W W  W W\n\
W W@o  W\n\
W W  WxW\n\
W  @ox W\n\
WWW   WW\n\
  WWWWW"
},

{map: "\
 WWWW\n\
 W  WWWWWW\n\
 W oWW U WWW\n\
WWx WW  x  W\n\
W x    oxo W\n\
W @o WoWxWWW\n\
WWW  W   W\n\
  WWWWWWWW"
},

{map: "\
 WWWW\n\
WWU WWWW\n\
W o@ @ W\n\
W  @ W W\n\
W  @   W\n\
W W@x  W\n\
W   W  W\n\
WWWWWWWW"
},

{map: "\
WWWWWWWWWWWWWWWWWWW\n\
W   xxx  U  xxx   W\n\
W ooo  WWWWW  ooo W\n\
WW   WWW   WWW   WW\n\
 WW  W       WW  W\n\
  WWWW        WWWW"
},

{map: "\
WWWWWWWWWWW\n\
W    @    W\n\
WUW @ x W W\n\
W W@@@@@W W\n\
W W o @ W W\n\
W    @    W\n\
WWWWWW  WWW\n\
     WWWW"
},

{map: "\
WWWWWWWWWWW\n\
WUo   xxxxWW\n\
W ooooWxxxxW\n\
W o  oxx@@@WW\n\
WW   W WWxx W\n\
W oooW  WW  W\n\
W    WW W  WW\n\
W  oo W    W\n\
W     WWW  W\n\
WWWWWWW WWWW"
},

{map: "\
WWWWWWWWW\n\
W   x   W\n\
W WWoWW W\n\
W W @   W\n\
W W @UW W\n\
W W o W W\n\
W W WWW W\n\
W   x   W\n\
WWWWWWWWW"
},

{map: "\
WWWWWWWWW\n\
W   x   W\n\
W WWoWW W\n\
W W @   W\n\
W W @UW W\n\
W W o W W\n\
W W WWW W\n\
W   x   W\n\
WWWWWWWW"
},

{map: "\
WWWWWWWWW\n\
W  U x  W\n\
W  xW@o W\n\
W ox xo W\n\
WWoxWWo W\n\
 W  WW  W\n\
 WWWWWWWW"
},

{map: "\
WWWWWWWW\n\
W      W\n\
W ooWo W\n\
W ox@  W\n\
WW xxxWW\n\
 WWxoWW\n\
WWxxx WW\n\
W  @xo W\n\
W oWoo W\n\
W  U   W\n\
WWWWWWWW"
},

{map: "\
WWWWWWWW\n\
W   @  W\n\
W @ x  W\n\
W @@@ WW\n\
W o @ W\n\
WW U  W\n\
 WWWWWW"
},

{map: "\
WWWWWW\n\
W    W\n\
W    W\n\
WWo WWW\n\
W o   W\n\
Wx@@@xW\n\
W  U  W\n\
WWWWWWW"
},

{map: "\
WWWWWW\n\
W    W\n\
W x@ WWW\n\
W xoxo W\n\
WW o  UW\n\
 WWWW  W\n\
    WWWW"
},

{map: "\
WWWWW\n\
W   WW\n\
W @o WW\n\
WU @  WW\n\
W xWo  W\n\
WW xxxoWW\n\
 WWW o@ W\n\
   W    W\n\
   WWWWWW"
},

{map: "\
WWWW\n\
W  WWWW\n\
W     WWW\n\
W  Wo x W\n\
WW WxWo W\n\
W  W U@ W\n\
W   @  WW\n\
WWWW  WW\n\
   WWWW"
}

];
