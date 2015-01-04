(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {



/**
 * Returs an Element next to the current focused element.
 * @param direction: The direction where the focus should go. Down = 0, Left = 1, Up = 2, Right = 3 ( Hint: arrowkeys mod 4 does it correctly ;-) )
 * @return jquery-object
 */
function getFocusElement(direction)
{
	// Gets the central coords of an element
	var getCenterCoords = function (el) {
		if(el.length == 0) 
		{
			el = $('*[tabindex=1]').first();
			if(el.length == 0) return { x: $(document).width()/2, y: Infinity };
		}
		return { x : el.offset().left + el.width() / 2, y : el.offset().top + el.height() / 2 };
	}

	var focusedPoint = getCenterCoords($('*:focus'));
	var possibilities = navElements.filter(':focusable:not(:focus)');
	var shortestDistance = Infinity;
	var currentReturn = false;
	var overwrite = true;
	var extreme = { max : { x: -Infinity, y: -Infinity }, min : {x: Infinity, y: Infinity}}
	
	// Returns (if possible) the next object.
	function getNextFocus() {
		possibilities.each(function () {
			var _this = $(this);
			var coords = getCenterCoords(_this);
			var xmc = _this.width() / 2;
			var ymc = _this.height() / 2;
			coords.max = {x: coords.x + 1 + xmc, y: coords.y + 1 + ymc};
			coords.min = {x: coords.x - 1 - xmc, y: coords.y - 1 - ymc};
			if(coords.max.x > extreme.max.x) { extreme.max.x = coords.max.x; }
			else if(coords.min.x < extreme.min.x) { extreme.min.x = coords.min.x; }
			if(coords.max.y > extreme.max.y) { extreme.max.y = coords.max.y; }
			else if(coords.min.y < extreme.min.y) { extreme.min.y = coords.min.y; }

			var diffCoords = { x: coords.x - focusedPoint.x, y: focusedPoint.y - coords.y };
			diffCoords.abs = { x: Math.abs(diffCoords.x), y: Math.abs(diffCoords.y) };
			var pass = false;
			var owswitch = false;
			if(direction == 0 && diffCoords.y <= 0)
			{
				if(diffCoords.abs.y >= diffCoords.abs.x)
				{
					owswitch = overwrite;
					overwrite = false;
					pass = true;
				} 
				else if(overwrite)
				{
					pass = true;
				}
			} 
			else if(direction == 2 && diffCoords.y >  0)
			{
				if(diffCoords.abs.y >= diffCoords.abs.x)
				{
					owswitch = overwrite;
					overwrite = false;
					pass = true;
				} 
				else if(overwrite)
				{
					pass = true;
				}
			}
			else if(direction == 1 && diffCoords.x <= 0)
			{
				if(diffCoords.abs.x >  diffCoords.abs.y)
				{
					owswitch = overwrite;
					overwrite = false;
					pass = true;
				} 
				else if(overwrite)
				{
					pass = true;
				}
			}
			else if(direction == 3 && diffCoords.x >  0)
			{
				if(diffCoords.abs.x >  diffCoords.abs.y)
				{
					owswitch = overwrite;
					overwrite = false;
					pass = true;
				} 
				else if(overwrite)
				{
					pass = true;
				}
			}
			if (pass)
			{
				var distance = Math.pow(diffCoords.y, 2) + Math.pow(diffCoords.x, 2);
				if(distance < shortestDistance || owswitch)
				{
					shortestDistance = distance;
					currentReturn = this;
				}
			}
		});
		return currentReturn;
	}
	var gnf = getNextFocus();
	// When no next object is found, start beginning from the other side.
	if(gnf == false)
	{
		switch(direction)
		{
			case 0:
				focusedPoint.y = extreme.min.y;
			break;
			case 2:
				focusedPoint.y = extreme.max.y;
			break;
			case 1:
				focusedPoint.x = extreme.max.x;
			break;
			case 3:
				focusedPoint.x = extreme.min.x;
			break;
		}
		gnf = getNextFocus();
	}
	return $(gnf);
}

var navElements = $();

$.fn.extend({
	addNavigation: function() {
		navElements = navElements.add(this);
		return this;
	},
	addRecursiveNavigation: function () {
		this.addNavigation();
		$("*", this).addNavigation();
		return this;
	},
	removeNavigation: function () {
		navElements = navElements.not(this);
		return this;
	},
	removeRecursiveNavigation: function () {
		this.removeNavigation();
		$('*', this).removeNavigation()
		return this;
	}
});

$.extend({
	navigate: function (direction) {
		getFocusElement(direction%4).focus();
	}
});

}));

(function (document, undefined) {
	$(document).ready(function () {
		$(document).addRecursiveNavigation();
	});
	// Set listener for arrow-keys
	$(document).keydown(function (e) {
		if(e.keyCode >= 37 && e.keyCode <= 40) {
			$.navigate(e.keyCode);
		}
	});
})(document)