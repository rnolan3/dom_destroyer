/*
 * 
 *  Author: Robert Nolan
 *  www.rnolan.com
 * 
 * 
 * 
 */


/* 
 *  Table of contents
 *  --------------------
 *  Random number
 *  Element offsets
 *
 */


// Util object
ChallengeApp.util = {};


/* 
 *  Random number
 *
 *  ---------------------------------------------
 *
 *  // Params
 *  Max = maximum number
 *  Min = minimum number
 *
 */
ChallengeApp.util.randomNumber = function (max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

ChallengeApp.util.elementOffsets = function ($element, offset) {
	// If no offset provided, set default
	if (offset == undefined) offset = 0;

	return { 
			offsetTop: $element.offset().top - offset,
			offsetBottom: $element.offset().top + $element.outerHeight() + offset,
			offsetLeft: $element.offset().left - offset,
			offsetRight: $element.offset().left + $element.outerWidth() + offset 
	};
}