/*
 * 
 *  Author: Robert Nolan
 *  www.rnolan.com
 * 
 * 
 * 
 */


/*
 *  Usage
 * 
 *  // The simpiliest way to generate a weapon is to:
 *  new ChallengeApp.weapon();
 *  
 */


/* 
 *  Weapon object
 *
 *  ---------------------------------------------
 */
ChallengeApp.weapon = function (settings) {
	this.config = $.extend({
		dartSpeed: 800,
		targetSelector: '.' + ChallengeApp.classes.activeTarget,
		style: {
			height: 260,
			width: 80
		}
	}, settings);

	this.target = this.config.targetSelector;

	// Cursor position => this.bindCursor
	this.page = {
		x: 0,
		y: 0
	};
	
	// Initialize the fun!
	this._init();
}

ChallengeApp.weapon.prototype = {
	_init : function () {
		// Append weapon and bind events
		this.append();
	},

	// Append weapon
	append : function () {
		// Backdrop prevent user from accidentally clicking on links
		this.$backdrop = $('<div />').css({
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 9999
		}).appendTo(ChallengeApp.$.Body);

		// Generate weapon element
		this.$gun = $('<div />').css({
			backgroundImage: 'url(' + chrome.extension.getURL('images/top-view.png') + ')',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'top center',
			backgroundSize: 'auto 160px',
			height: this.config.style.height,
			width: this.config.style.width,
			position: 'fixed',
			bottom: -(this.config.style.height/2),
			left: '50%',
			marginLeft: -(this.config.style.width/2),
			zIndex: 10000,
			display: 'block',
			opacity: 1
		}).appendTo(ChallengeApp.$.Body);

		// Bind weapon functionality
		this.bindFireEvent();
		this.bindCursor();
	},

	bindCursor : function () {
		var that = this;

		var p1 = {}, p2 = {};

		ChallengeApp.$.Window.unbind('mousemove.challenge').bind('mousemove.challenge', function (event) {
			// Start point
			p1 = {
				y: 0,
				x: ChallengeApp.$.Window.outerWidth()/2
			};
			
			// End point
			p2 = {
				y: ChallengeApp.$.Window.outerHeight() + ChallengeApp.$.Window.scrollTop() - event.pageY,
				x: event.pageX
			};

			// Cursor position
			that.page = {
				x: event.pageX,
				y: event.pageY
			};

			// Store angle to calculate dart trajectory
			that.angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
			// Rotate gun
			that.$gun.css('-webkit-transform', 'rotate(' + -(that.angle - 90) + 'deg)');
		});
	},

	bindFireEvent : function () {
		var that = this;

		ChallengeApp.$.Window.bind({
			click : function (event) {
				that.fire();
			},
			keydown : function (event) {
				// 32 => spacebar
				if (event.keyCode == 32) {
					event.preventDefault();
					that.fire();
				}
			}
		});
	},

	fire : function () {
		var that = this;

		// Store window dimensions
		var windowHeight = ChallengeApp.$.Window.outerHeight(),
				windowWidth  = ChallengeApp.$.Window.outerWidth();

		var trajectory = this.getTrajectory(this.angle);

		// Dart and targets
		var $dart        = $('<div />', { 'class' : 'dart' }),
				$targets     = $(this.target);

		$dart.css({
			height: 20,
			width: 20,
			background: 'red',
			borderRadius: 10,
			position: 'absolute',
			top: windowHeight + ChallengeApp.$.Window.scrollTop(),
			left: windowWidth/2,
			zIndex: 9999
		});

		ChallengeApp.$.Body.append($dart);

		var isDartOver = setInterval(function () {
			$targets.each(function () {
				var $target = $(this);

				if (that.isOver($dart, $target)) {
					// Clear interval
					clearInterval(isDartOver);

					if ($target.offset().left > 0 && $target.offset().top > 0)
						new ChallengeApp.effects.explosion($target.offset().left, $target.offset().top);

					// Remove target and queue up new one
					ChallengeApp.locals.targets.remove($target);
					
					$dart.remove();
					// Stop iterative over targets. We've hit one already!
					return false;
				}

				// Update scoreboard
				ChallengeApp.locals.scoreboard.update();
			});
		}, 2);

		// "fire" dart
		$dart.animate({
			top: trajectory.top,
			left: trajectory.left,
		}, this.config.dartSpeed, function () {
			// If we missed :(
			clearInterval(isDartOver);
			$dart.remove();
			// Update score... just in case
			ChallengeApp.locals.scoreboard.update();
		});
	},

	getTrajectory : function (angle) {
		var top = ChallengeApp.$.Window.scrollTop(), left = 0;
		
		var windowHeight = ChallengeApp.$.Window.outerHeight(),
				windowWidth  = ChallengeApp.$.Window.outerWidth();

		if (angle >= 35 && angle <= 145) {
			left = Math.tan((90-angle)/180*Math.PI) * windowHeight;
			left += (windowWidth/2);
		} else {
			if (angle < 90) {
				top = Math.tan(angle/180*Math.PI) * (windowWidth/2);
				left = windowWidth - 20;
			} else {
				top = Math.tan((-angle)/180*Math.PI) * (windowWidth/2);
			}
			top = windowHeight + ChallengeApp.$.Window.scrollTop() - top;
		};

		return { top: top, left: left };
	},

	isOver : function ($dart, $target) {
		return ($dart.offset().top >= $target.offset().top && 
						$dart.offset().top <= $target.offset().top + $target.outerHeight() &&
						$dart.offset().left >= $target.offset().left &&
						$dart.offset().left <= $target.offset().left + $target.outerWidth())
	},

	remove : function () {
		// Unbind window events
		ChallengeApp.$.Window.unbind('click keydown mousemove.challenge');
		
		// remove target classes
		$(this.target).removeClass(ChallengeApp.classes.activeTarget);
		$(this.target).removeClass(ChallengeApp.classes.selectedTarget);

		// Remove generated elements
		this.$backdrop.remove();
		this.$gun.remove();
	}
};