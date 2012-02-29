/*
    Soko Bull Ban Game

    Yet another "Sokoban game"

    *** THIS GAME IS NOT UNDER GPL v3 ***

    Copyright 2012 (all right reserved)
    jose-juan(at)computer-mind.com

==============================================

	Map symbols:

		"·", empty cell
		"X", solid wall
		"*", bulldozer start point
		"-", objetive platform
		"|", block to move to objetive platform
		"+", block over a objetive platform

 */

var sokomaps = [

	{	id: "test1",
		name: "Test map 1",
		description: "A simple test map",
		map: "\
XXXXXXXXXX\n\
X···XX··*X\n\
X········X\n\
X---XX|||X\n\
XXXXXXXXXX"
	},

	{	id: "test2",
		name: "Test map 2",
		description: "Other simple test map",
		map: "\
·XXX··XXX·\n\
X-··XX··*X\n\
X········X\n\
X·--XX|||X\n\
·XXX··XXX·"
	}

];
