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
 *  // The simpiliest way to call directions is to:
 *  new ChallengeApp.directions();
 *
 *  // To append a help button
 *  directions = new CallengeApp.directions();
 *  directions.appendHelpButton();
 *  
 */


/* 
 *  Directions object
 *
 *  ---------------------------------------------
 */
ChallengeApp.directions = function () {
	// Directions
	this.directions = {
		'Targets' : {
			innerText : "Targets are marked with a red border.",
			icon: "images/target.png"
		},
		'To Aim' : {
			innerText : "Move cursor in the direction of the target.",
			icon: "images/track-pad.png"
		},
		'To Fire' : {
			innerText : "Left-click or space bar.<br>&nbsp;",
			icon: "images/space-key.png"
		}
	}

	// Animation delay
	this.animationDelay = 600;
	// Generate cards
	this.generate();
}

ChallengeApp.directions.prototype = {
	animate : function (remove) {
		var that = this;

		if (this.$cards.length) {
			var $card = this.$cards.first();
			
			if ($card.hasClass('show'))
				$card.removeClass('show');
			else
				$card.addClass('show');

			this.$cards.splice(0, 1);
			
			setTimeout(function() {
				that.animate(remove);
			}, this.animationDelay);
		}
	},

	appendHelpButton : function () {
		var that = this;

		this.$helpButton = $('<button />', {
			'id' : ChallengeApp._prefix + 'help-button',
			'alt' : 'Help'
		}).text('?');

		this.$helpButton.bind('click', function (e) {
			e.stopPropagation();
			// Toggle between show and hide
			if (that.$helpButton.hasClass('active')) {
				that.$helpButton.removeClass('active');
				that.hide();
			} else {
				that.$helpButton.addClass('active');
				that.show();
			}
		});

		ChallengeApp.$.Body.append(this.$helpButton);
		
		// Inital fadein
		setTimeout(function() {
			that.$helpButton.addClass('show');
		}, 10);
	},

	generate : function () {
		var that = this;

		this.$directionsPopup = $('<div />', { 
			'id' : ChallengeApp._prefix + 'directions-wrapper' 
		});

		for (var key in this.directions) {
			var direction = this.directions[key];

			var $direction = $('<div />', { 'class' : ChallengeApp._prefix + 'card' })
													.append("<h2>" + key + "</h2>")
													.append("<p>" + direction.innerText + "</p>");

			if (direction.icon) {
				var iconPath = chrome.extension.getURL(direction.icon);
				$direction.append($('<img />', { 'src': iconPath }));
			};

			this.$directionsPopup.append($direction);
		};

		// Append directions popup 
		ChallengeApp.$.Body.append(this.$directionsPopup);
	},

	// Show directions
	show : function () {
		var that = this;

		setTimeout(function() {
			that.$cards = that.$directionsPopup.children();
			that.animate();
		}, 1);

		ChallengeApp.$.Window.bind('click.directions', function () {
			// Hide directions
			that.hide();
			// Only one click
			$(this).unbind('click.directions')
		});
	},

	hide : function (callback) {
		var that = this;

		if (!this.$cards.length) {
			setTimeout(function() {
					that.$cards = that.$directionsPopup.children();

					// Unbind window click event
					ChallengeApp.$.Window.unbind('click.directions');

					if (typeof callback == "function") {
						setTimeout(function() {
							callback.call(that);
						}, (that.animationDelay * that.$cards.length) + 10);
					};

					// Start hide animation
					that.animate(true);
			}, 1);

		} else if (typeof callback == "function") {
			callback.call(this);
		};
	}
}