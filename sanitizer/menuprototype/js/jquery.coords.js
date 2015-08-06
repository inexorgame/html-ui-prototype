(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

function c(obj)
{
	return {
		y: obj.top,
		x: obj.left
	}
}

$.fn.extend({
	coords: function () {
		var corner = this.children('.corner');
		if(corner.length != 4)
		{
			corner.remove();
			this.prepend('<div class="corner top left" /><div class="corner top right" /><div class="corner bottom left" /><div class="corner bottom right" />');
			corner = this.children('.corner');
		}
		return {
			top : {
				left  : c(corner.filter('.top.left' ).offset()),
				right : c(corner.filter('.top.right').offset()),
			},
			bottom : {
				left  : c(corner.filter('.bottom.left' ).offset()),
				right : c(corner.filter('.bottom.right').offset()),
			}
		}
	}
});


$.extend({
});

}));