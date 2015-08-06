(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {


var selectMenu = function (t, fromParent) {
	// $('#jump-preventer').width($(document).width());

	if(typeof t == 'boolean') {
		fromParent = t;
		t = undefined;
	}
	fromParent = (fromParent == true) ? true : false;

	var lastClicked = $('.clicked', menu);
	if(fromParent) {
		var menu  = (t === undefined) ? $(this) : $(t);
		var load  = menu.attr('id');
		var level = menu.data('level');
		$.disableNavigation(1);
		lastClicked.focus();
		menu.find('.clicked').removeClass('clicked');
		// $('#jump-preventer').width($(document).width()-$('.selected').getMenu().width());
	} else {
		var _this = (t === undefined) ? $(this) : $(t);
		var load = _this.data('load');
		var menu = _this.getMenu();
		var level = menu.data('level');
		menu.find('.clicked').removeClass('clicked');
		_this.addClass('clicked');
	}

	$.resetNavigation();

	menu.addClass('preview parent').data('enabled', false);

	var loadMenu = $('#' + load);

	$('*[data-level=' + level + ']').removeClass('selected');
	$.hideLevel(level+1);
	
	loadMenu
		.removeClass('preview')
		.addClass('selected')
		.addRecursiveNavigation()
		.data('enabled', true);

	$('~ .menu', loadMenu).removeClass('preview parent');

	var scrollLevel = fromParent ? level-1 : level;
	$('#surface').css('min-width', (80+scrollLevel*5) + '%');
	var domWidth = $(document).width();
	var windowWidth = $(window).width();
	var newScrollLeft = fromParent ? loadMenu.scrollLeft() : (domWidth-windowWidth);


	var animation = $('html, body').animate({
		'scrollLeft': newScrollLeft
	}, 500, 'swing');
}

var keyNavigation = true;

$.fn.extend({
	transitionEnd: function (callback) {
		var transition = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
		this.bind(transition, function () {
			callback();
			$(this).unbind(transition);
		});
	},
	getMenu: function () {
		var parents = this.parentsUntil('.menu');
		return $(parents[parents.length-1]).parent();
	},
	hideLevel: function (max) {
		return $.hideLevel(this.data('level'), max);
	},
	menu: function () {
		if(this.attr('tabindex') === undefined){
			this.attr('tabindex', '0');
		}
		this.not('input').not('textarea').on('focus mouseover', function () {
			if($(this).getMenu().data('enabled') == true)
			{
				var currentLoaded = $('.preview:not(.parent)');
				var load = $(this).data('load');
				if(currentLoaded.attr('id') != load)
				{
					currentLoaded.removeClass('preview');
					$('#' + load).addClass('preview');
				}
			}
		}).click(function () {
			if($(this).data('load') != undefined) {
				selectMenu(this);
			}
		}).keydown(function (e) {
			if($(this).data('load') != undefined) {
				if( (e.keyCode == 39 || e.keyCode == 13) && keyNavigation == true ) { // Arrow-right or enter
					selectMenu(this);
				}
			}
			if( (e.keyCode == 37 || e.keyCode == 8 ) && keyNavigation == true ) { // Left-arrow or backspace
				if($('.selected').data('parent') != undefined)
				{
					selectMenu('#' + $('.selected').data('parent'), true);
				} else {
					$.disableNavigation(1);
				}
			}

			if( e.keyCode == 8 && keyNavigation == true ) e.preventDefault();
		}).hover(function () { $(this).focus(); });
		$('.selected').addRecursiveNavigation();
	},
	toggleKeyNavigation: function () {
		keyNavigation = !keyNavigation;
	},
	enableKeyNavigation: function () {
		keyNavigation = true;
	},
	disableKeyNavigation: function () {
		keyNavigation = false;	
	},
	hideMenu: function () {
		this.removeClass('preview selected').data('enabled', false);
	},
	menuWindow: function () {
		$(this).addClass('window');
	}
});

$.extend({
	hideLevel: function (min, max) {
		var affected = 0;
		max = parseInt(max);
		$('*[data-level]:visible').each(function() {
			var _this = $(this);
			var level = _this.data('level');
			if(level >= min && (isNaN(max) || level <= max) )
			{
				_this.hideMenu();
				$('*[data-load]', _this).removeClass('clicked');
				affected++;
			}
		});
		return affected;
	}
});

}));