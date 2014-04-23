/*
 * 
 *  Author: Robert Nolan
 *  www.rnolan.com
 * 
 * 
 * 
 */


/* 
 *  Kill application
 *
 *  ---------------------------------------------
 */
ChallengeApp.kill = function (settings) {
	ChallengeApp.$.Window.unbind('keypress.challenge');

	if (ChallengeApp.hasGameStarted) {
		ChallengeApp.locals.weapon.remove();
		ChallengeApp.locals.scoreboard.remove();
		ChallengeApp.locals.directions.remove();
	} 
	else {
		// Fool the explosion function to stop
		ChallengeApp.hasGameStarted = true;
		// Hide title screen
		ChallengeApp.locals.titleScreen.hide();
	}
	
}