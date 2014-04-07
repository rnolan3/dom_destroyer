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
 *  Expolision
 *
 */


// EFfects object
ChallengeApp.effects = {}


/* 
 *  Explosion object
 *
 *  ---------------------------------------------
 *
 *  // Params
 *  x = [Int] Position of explosion on the x axis
 *  y = [Int] Position of explosion on the y axis
 *  settings = [Object] Only configurable option is settings
 *						 					the maximum number of waves.
 */
ChallengeApp.effects.explosion = function (x, y, settings) {
	// Placement
	this.coords = {
		x: x,
		y: y
	};
	// Configuration
	this.config = $.extend({
		waveLimit: 4
	}, settings);
	// Colors
	this.colors = ['#FFDA3E', '#FF9921', '#FF493E', '#FF0451', '#92002C'];

	// Create explosion
	this._init();
}

ChallengeApp.effects.explosion.prototype = {
	_init : function () {
		// How many pulse waves should be generated?
		this.waves = Math.floor(Math.random() * (this.config.waveLimit - 1 + 1)) + 1;
		// Start the chain reaction.
		this.appendWave();
	},

	appendWave : function (startSize, endSize) {
		var that = this;

		var $wave = $('<div />', { 'class' : ChallengeApp._prefix + 'explosion-wave'});

		var delay = ChallengeApp.util.randomNumber(80, 30);
		var startSize = ChallengeApp.util.randomNumber(20, 3);
		var endSize = ChallengeApp.util.randomNumber(300, 50);
		var randomOffset = ChallengeApp.util.randomNumber(20, 0);

		setTimeout(function() {
			$wave.css({
					height: startSize,
					width: startSize,
					borderRadius: endSize/2,
					opacity: 1,
					position: 'absolute',
					top: that.coords.y - (startSize/2) + randomOffset,
					left: that.coords.x - (startSize/2) + randomOffset,
					background: that.colors[that.waves - 1]
				})
				.appendTo(ChallengeApp.$.Body)
				.bind('transitionend', function () {
					$(this).remove();
				});
			
			// Required to insure css transition works
			// I know, I know, it's ugly
			setTimeout(function() {
				$wave.css({
					height: endSize,
					width: endSize,
					marginLeft: -(endSize/2),
					marginTop: -(endSize/2),
					opacity: 0
				});				
			}, 1);

			that.waves--;

			// Another?
			if (that.waves) 
				that.appendWave();
		}, delay);
	}
};