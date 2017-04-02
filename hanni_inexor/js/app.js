$(document).ready(function(){

var inexor_UI_fadeIn = 100;
var inexor_UI_fadeOut = 0;

// back to main menu
$('.inexor_button_backtomainmenu').click(function() {
   $('.inexor_centered_frame, .inexor_big_centered_frame, #inexor_window_options_tabs').fadeOut(inexor_UI_fadeOut);
   $('.inexor_centered_frame, .inexor_big_centered_frame, #inexor_window_options_tabs').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_window_mainmenu, #inexor_logo').fadeIn(inexor_UI_fadeIn);
   });
});


// quit Inexor :(
$("#inexor_button_quit").click(function(){
   alert('You quit Inexor!');
});


// open about window
$("#inexor_button_about").click(function(){
   $('#inexor_window_mainmenu, #inexor_logo').fadeOut(inexor_UI_fadeOut);
   $('#inexor_window_mainmenu').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_window_about, #inexor_logo').fadeIn(inexor_UI_fadeIn);
   });
});


// Show options
$("#inexor_button_options").click(function(){
   $('#inexor_window_mainmenu, #inexor_logo').fadeOut(inexor_UI_fadeOut);
   $('#inexor_window_mainmenu, #inexor_logo').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_window_options, #inexor_window_options_tabs').fadeIn(inexor_UI_fadeIn);
   });
});


// back to main menu button
$('#multiplayer_button').click(function() {
   $('.inexor_centered_frame, #inexor_logo').fadeOut(0);
   $('.inexor_centered_frame').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_server_browser').fadeIn(300);
   });
});


// show Inexor dev blog
$('#devblog_button').click(function() {
   $('.inexor_centered_frame, #inexor_logo').fadeOut(0);
   $('.inexor_centered_frame').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_dev_blog').fadeIn(300);
   });
});

// show Inexor dev blog
$('#loadmap_button').click(function() {
   $('.inexor_centered_frame, #inexor_logo').fadeOut(0);
   $('.inexor_centered_frame').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_loadmap').fadeIn(300);
   });
});

// show Inexor dev blog
$('#hostgame_button').click(function() {
   $('.inexor_centered_frame, #inexor_logo').fadeOut(0);
   $('.inexor_centered_frame').promise().done(function(){
      // will be called when all the animations on the queue finish
      $('#inexor_hostserver').fadeIn(300);
   });
});

});
