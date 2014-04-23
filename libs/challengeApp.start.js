/*
 * 
 *  Author: Robert Nolan
 *  www.rnolan.com
 * 
 * 
 * 
 */


/* 
 *  Start application
 *
 *  ---------------------------------------------
 */
ChallengeApp.start = function (settings) {

	this.config = $.extend({}, settings);

	// Initalize start screen
	this._init();
}

ChallengeApp.start.prototype = {
	_init : function () {
		var that = this;

		// Disable scrolling
		ChallengeApp.$.Body.css('overflow', 'hidden');
		//chrome.storage.local.remove('isNotFirstTime');
		// Mark first time play flag
		chrome.storage.local.get('isNotFirstTime', function (items) {
			ChallengeApp.firstTimePlay = items.isNotFirstTime == true ? false : true;
		});

		// Blur any focused fields
		$('input:focus').blur();

		// Esc to cancel game
		ChallengeApp.$.Window.unbind('keyup.challenge').bind('keyup.challenge', function (e) {
			if (e.which == 27)
				ChallengeApp.kill();
		});

		this.loadType();

		// Show title screen
		this.titleScreen = new ChallengeApp.titleScreen();
		this.titleScreen.show();

		ChallengeApp.locals.titleScreen = this.titleScreen;

		// Start game when 'start' button is clicked on
		this.titleScreen.modal.buttons.$startButton.bind('click', function () {
			that.titleScreen.modal.$wrapper.fadeOut('fast', function () {
				that.game();
			});		
		})
	},

	game : function () {
		var that = this;

		// Mark game as started
		ChallengeApp.hasGameStarted = true;
		// Hide title screen
		this.titleScreen.hide();

		this.directions = new ChallengeApp.directions();
		
		if (ChallengeApp.firstTimePlay) {
			// Next time we're not shoing the directions automatically
			chrome.storage.local.set({ isNotFirstTime : true });
			// Auto-show directions if this is our first time playing
			this.directions.show();

			// Automatically hide directions after set time
			setTimeout(function() {
				that.directions.hide(function () {
					// generate gameplay
					this.appendHelpButton();
				});
			}, 3000);
		} else {
			this.directions.appendHelpButton();
		}
		// Create reference objects
		ChallengeApp.locals.targets    = new ChallengeApp.targets();
		ChallengeApp.locals.scoreboard = new ChallengeApp.scoreboard();

		ChallengeApp.locals.weapon     = new ChallengeApp.weapon();
		ChallengeApp.locals.directions = this.directions;
	},

	loadType : function () {
		var $style = $('<style />', { 'type' : 'text/css'}); 

		$style.html("@font-face {" +                                                                                      
		  " font-family: 'exomedium';" + 
		  "  src: url('" + chrome.extension.getURL('fonts/exo-medium-webfont.eot') + " ');" +          
		  "  src: url('" + chrome.extension.getURL('fonts/exo-medium-webfont.woff') + " ') format('woff')," +
		  "       url('" + chrome.extension.getURL('fonts/exo-medium-webfont.ttf') + " ') format('truetype');" +
		  "  font-weight: normal; font-style: normal");

		var $link = $('<link />', {'rel' : 'stylesheet', 'href' : chrome.extension.getURL('css/styles.css') });

		ChallengeApp.$.Body.append($style);
		ChallengeApp.$.Body.append($link);
	}
};


/* 
 *  Title screen object
 *
 *  ---------------------------------------------
 * 
 *  // Public objects
 *  this.modal
 *  this.modal.buttons
 *
 */
ChallengeApp.titleScreen = function () {
	this.modal = {
		buttons : {}
	};
}

ChallengeApp.titleScreen.prototype = {
	backgroundEffects : function () {
		var that = this;
		var offset = 20;

		// Position explosion effects around hero
		this.explosion = ChallengeApp.util.elementOffsets(this.$hero, offset);

		// Get new offsets is window changes size
		ChallengeApp.$.Window.bind('resize', function () {
			that.explosion = ChallengeApp.util.elementOffsets(that.$hero, offset);
		});

		// Start the effect
		__explosion();

		function __explosion () {
			// Continue random explosions around hero until game has started
			if (!ChallengeApp.hasGameStarted) {
				var randomY = ChallengeApp.util.randomNumber(that.explosion.offsetTop, that.explosion.offsetBottom),
						randomX = ChallengeApp.util.randomNumber(that.explosion.offsetLeft, that.explosion.offsetRight),
						randomTimeout = ChallengeApp.util.randomNumber(2500, 1000);
				
				new ChallengeApp.effects.explosion(randomX, randomY, { waveLimit: 2 });

				setTimeout(function() {
					__explosion();
				}, randomTimeout);
			};
		}
	},

	hide : function () {
		// Unbind resize event... we don't need you anymore
		ChallengeApp.$.Window.unbind('resize');
		// Remove modal
		this.modal.$wrapper.remove();
	},

	modalContents : function () {
		var that = this;

		// Logo
		this.$hero = $('<img />', { 
				'src' : chrome.extension.getURL('images/logo.png'), 
				'id' : 'hero' 
		});
		// Run background effects after image has loaded.
		// Insures correct effect placement.
		this.$hero.load(function () {
			that.backgroundEffects();
		}).appendTo(this.modal.$wrapper);

		// Append and initalize
		this.startButton();	
	},

	show : function () {
		var that = this;

		this.modal.$wrapper = $('<div />', { 
			'id' : ChallengeApp._prefix + 'dialog-wrapper' 
		});

		// Append dialog contents
		this.modalContents();

		// Disable scrolling
		ChallengeApp.$.Body.css('overflow', 'hidden');
		// Append Dialog
		ChallengeApp.$.Body.append(this.modal.$wrapper);
	},

	startButton : function () {
		var that = this;
		this.modal.buttons.$startButton = $("<button />", { 
			'id' : 'challenge-start-button'
		}).text('Start DEMO');

		this.modal.$wrapper.append(this.modal.buttons.$startButton);
	}
}


/* 
 *  Scoreboard object
 *
 *  ---------------------------------------------
 * 
 *  // Public elements
 *  this.$currentScore
 *
 */
ChallengeApp.scoreboard = function () {
	// Scoreboard id
	this.scoreBoardId = ChallengeApp._prefix + 'scoreboard';
	this.totalTargets = this.getTargetCount();
	this.append();
}

ChallengeApp.scoreboard.prototype = {
	// Append board and score count
	append : function () {
		var $scoreBoard = $('<div />', { 'id' : this.scoreBoardId }).hide();
		var $scoreLabel = $('<span />', { 'class' : 'score-label' }).text('0');
		var $totalLabel = $('<span />').text(this.totalTargets);

		$scoreBoard
			.append($scoreLabel)
			.append($totalLabel)
			.appendTo(ChallengeApp.$.Body)
			.fadeIn(300);

		// Make these elements public
		this.$currentScore = $scoreLabel;
		this.$scoreBoard = $scoreBoard;
	},

	// Get target count from targets object
	getTargetCount : function () {
		return ChallengeApp.locals.targets.targetCount;
	},

	// Update score
	update : function () {
		this.$currentScore.text(this.totalTargets - this.getTargetCount());
	},

	remove : function () {
		this.$scoreBoard.remove();
	}
}


/* 
 *  Game over screen
 *
 *  ---------------------------------------------
 */
function gameOver () {
	if (!$('#challenge-game-over').length) {
		var $dialog = $('<div />', { 'id' : 'challenge-game-over' }),
				$container = $('<div />', { 'class' : 'container' });

		var headerOptions = [
			"You see, freedom has a way of destroying things.",
			"Right or wrong, it's very pleasant to break something from time to time.",
			"The urge to destroy is also a creative urge.",
			"Hey, even the Mona Lisa is falling apart."
		];

		var successTitle = headerOptions[Math.floor(Math.random()*headerOptions.length)];
		var uri = window.location + '';

		$container.html("<h1>" + successTitle + "</h1><a href=\"#\" id=\"challenge-reload-button\" onclick=\"javascript: location.reload();\">Reload Page</a>").appendTo($dialog);
		ChallengeApp.$.Body.append($dialog);

		$container.css({
			marginTop: -($container.outerHeight()/2)
		});

		$dialog.animate({opacity: 1}, 'slow');
	};
}


// Only start if app is not currently running
if (!$('#' + ChallengeApp._prefix + 'scoreboard').length && !$('#' + ChallengeApp._prefix + 'dialog-wrapper').length)
	new ChallengeApp.start(); // Let's light this candle!
else
	location.reload();




