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
 *  // The simpiliest way to make targets looks like this:
 *  new ChallengeApp.targets();
 *  
 *  // Or you can set how many targets to show at once
 *  new ChallengeApp.targets({ queueLength: 20 });
 *
 *  // If your calling within the CallengeApp you can simply call it like this
 *  this.targets();
 */


/* 
 *  Targets object
 *
 *  ---------------------------------------------
 */

ChallengeApp.targets = function (settings) {
	this.config = $.extend({
		queueLength: 10
	}, settings);

	this.queue = this.config.queueLength;
	this.mode = 'random';
	// The chosen ones.
	this.$targets = [];
	this.targetCount = 0;

	this._init();
}

ChallengeApp.targets.prototype = {
	_init : function () {
		this.grab();
		this.sort();
		this.mark(true);
	},

	get : function () {
		return this.$targets;
	},

	grab : function () {
		var that = this;
		// Select elements that will most likely be fun to shoot.
		this.$elements = $('body *:visible').not("[id*=" + ChallengeApp._prefix + "], [id*=" + ChallengeApp._prefix + "] *"), 

		this.$elements.each(function () {
			var $element = $(this);
		
			if (that.isValidTarget($element)) {
				that.$targets.push($element);
				$element.addClass(ChallengeApp.classes.selectedTarget);
			};
		});
		// We have no use of these elements now.
		delete this.$element
		
		this.targetCount = that.$targets.length;
	},

	isValidTarget : function ($element) {
		var minSize      = this.$elements.length > 150 ? 18 : 13,
				windowHeight = ChallengeApp.$.Window.outerHeight();

		return ($element.css('opacity') == 1 && 
						$element.offset().left >= 0 &&
						$element.offset().top >= ChallengeApp.$.Window.scrollTop() &&
						$element.offset().top < windowHeight &&
						$element.outerHeight() < windowHeight &&
					  $element.outerHeight() > minSize && 
					  $element.outerWidth() > minSize);
	},

	mark : function (init_flag) {
		for (var i = 0; i < this.$targets.length; i++) {
			var $target = this.$targets[i];
			// Get index so we can remove from array.
			var index = this.$targets.indexOf($target);
			
			// Remove missing target
			if ($target == undefined) {
				this.$targets.splice(index, 1);
				// Let's try selecting a new one
				if (this.$targets.length)
					this.mark();

				this.updateTargetCount();
				break;
			};

			var active = $('.' + ChallengeApp.classes.activeTarget);
			
			// If target is empty remove from array
			if ($target.text().replace(/\s/g, '') == '') {
				// Remove target from queue
				$target.removeClass(ChallengeApp.classes.selectedTarget);
				this.$targets.splice(index, 1);
				this.updateTargetCount();
			} else {
				if (this.isValidTarget($target)) {
					// Remove target from queue
					this.$targets.splice(index, 1);
					// Mark target and preserve height and width
					$target
						.css({ height: $target.outerHeight(), width: $target.outerWidth() })
						.addClass(ChallengeApp.classes.activeTarget);

					if ($target.css('position') == 'absolute' && $target.css('bottom') != '') {
						$target.css({ top: $target.offset().top, bottom: 'auto' });
					};

					// If target is static position then mark it as 
					// relative for targeting purposes
					if ($target.css('position') == 'static') {
						$target.css('position', 'relative');
					};
				} else {
					$target.removeClass(ChallengeApp.classes.selectedTarget);
					this.updateTargetCount();
				}
			}	

			if (this.queue <= active.length) {
				break;
			};		
		}
	},

	updateTargetCount : function () {
		this.targetCount = $('.' + ChallengeApp.classes.selectedTarget).length;

		if (this.targetCount == 0) {
			gameOver();
			ChallengeApp.$.Window.unbind('click, keydown');
		};
	},

	remove : function ($target) {
		var that = this;
		
		// Remove target
		$target.remove();
		// Mark target
		this.mark();
		// Update target count
		this.updateTargetCount();
	},

	sort : function () {
		var that = this;

		this.$targets.sort(function (a, b) {
			return a.parents().length - b.parents().length;
		});

		this.$targets.reverse();
		this.uniquify();
	},

	uniquify : function () {
		for (var i = 0; i < this.$targets.length; i++) {
			this.$targets[i].data('target-id', i);
		};
	}
};