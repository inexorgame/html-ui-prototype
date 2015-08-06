(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {


var navElements = $();
var options = {
	minDuration: 250,
	maxDuration: 750,
	minBlur: 2,
	maxBlur: 15,
	easing: 'swing'
};

$.fn.extend({
	animateBlur: function(to, duration, easing, complete) {
		if(typeof duration == 'function') complete = duration;
		else if(parseInt(duration) != NaN) duration = parseInt(duration);
		else duration = $.random(options.minDuration, options.maxDuration);
		if(easing == undefined) easing = 'swing';
		else if(typeof easing == 'function') { complete = easing; easing = 'swing'; }

		var filter = this.css("-webkit-filter");
		var matches = /(.*)(blur\()([0-9\.]*)(.*)/gim.exec(filter);
		var filterstring = {};
		var currentblur;
		if(matches == null) {
			filterstring.pre = "blur(";
			if(filter != "none") filterstring.pre = filter + filterstring.pre + " ";
			filterstring.suf = "px) ";
			currentblur = $.random(options.minBlur, options.maxBlur);
		} else {
			filterstring.pre = matches[1] + matches[2];
			filterstring.suf = matches[4];
			currentblur = matches[3];
		}
		var _this = this;
		$({ blurValue: currentblur }).animate({ blurValue: to }, {
			duration: duration,
			easing: easing,
			step: function () {
				var fi = filterstring.pre + this.blurValue + filterstring.suf;
				_this.css({
					"-webkit-filter": fi,
					"filter": fi
				});
			},
			complete: complete
		})
		return this;
	},
	blurLoop: function() {
		this.each(function () {
			var _this = this;
			$(this).animateBlur($.random(options.minBlur, options.maxBlur), $.random(options.minDuration, options.maxDuration), function () {
				$(_this).blurLoop();
			});
		});
	}
});

$.extend({
	setBlurSettings: function(nOptions) {
		$.extend(options, nOptions);
	},
	random: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
});

}));