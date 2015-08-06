$(document).ready(function () {
	var test = $('#test');
	var healthinput = $('<input type="number" placeholder="health in %" min="0" max="100" value="100">');
	var weaponinput = $('<select><option value="chaingun">chaingun</option><option value="chainsaw">chainsaw</option><option value="pistol">pistol</option><option value="rifleround">rifleround</option><option value="rocket">rocket</option><option value="shotgun">shotgun</option></select>')
	test.append(healthinput);
	test.append(weaponinput);
	healthinput.change(function () {
		var newval = parseInt(healthinput.val());
		$('.abs-health').text(newval);
		var fullel = parseInt(newval / 25);
		var bar = $('footer .health .bar');	
		bar.slice(0, -fullel-1).children('div').css('top', "0");
		if(fullel > 0)
			bar.slice(-fullel, bar.length).children('div').css('top', "-100%");
		bar.eq(-fullel-1).children('div').css('top', -(newval%25*bar.length)+"%");
	});
	weaponinput.change(function () {
		$('.weapon').removeClass('selected');
		$('.weapon-' + weaponinput.val()).addClass('selected');
	});
});