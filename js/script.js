$(document).ready(function(){
  // expand or collapse the nav when the user clicks/taps the nav menu
  // also, collapse the nav if the user clicks anywhere on the page
  $(window).click(function(e){
    let el = e.target;  // the element targeted by the click/tap

    // elements to watch for nav toggling
    let navToggle = document.getElementById('nav-toggle');    // the nav bar
    let navToggleI = navToggle.querySelector('i');            // the hamburger icon

    // used a custom toggle instead of jQuery's built-in, since the nav should only be hidden when the user clicks anywhere on the screen except the nav
    if (el == navToggle || el == navToggleI) {
      $(".top-nav .nav-container").slideToggle();
    }
    else {
      if ($(".top-nav .nav-container").css('display') !== 'none') {
        $(".top-nav .nav-container").slideUp();
      }
    }
  })
  // Select all links with hashes
  $('a[href*="#"]').click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
  let all = $('*');
  let tested = false;
  for (let i = 0; i < all.length; i++) {
    if (window.getComputedStyle(all[i]).height > window.innerHeight * 2) {
      alert(all[i]);
    }
    if (tested === true) { i = all.length; }
  }
});