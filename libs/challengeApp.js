/*
 * 
 *  Author: Robert Nolan
 *  www.rnolan.com
 * 
 * 
 * 
 */


/* 
 *  Application properties
 *
 *  ---------------------------------------------
 */
var ChallengeApp = {
	// Jquery objects
	$ : {
		HTML 							 : $('html'),
		Body               : $('body'),
		Window             : $(window),
		Document           : $(document)
	},

	// Debug mode
	DEBUG                : false,

	// Application prefix
	_prefix 						 : 'challenge-',

	// Flags
	hasGameStarted       : false,
	firstTimePlay				 : true	
}


/* 
 *  Available weapons
 *
 *  ---------------------------------------------
 */
ChallengeApp.weaponList = {
	'single'   : { image: 'images/single.png' }
}


/* 
 *  Appication Classes
 *
 *  ---------------------------------------------
 */
ChallengeApp.classes = {
	// Targets
	activeTarget   			 : 'challenge-active-target',
	selectedTarget			 : 'target-selected'
}


/* 
 *  Locals (generated later)
 *
 *  ---------------------------------------------
 */
ChallengeApp.locals = {};


