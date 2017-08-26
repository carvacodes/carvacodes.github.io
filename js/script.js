$(document).ready(function(){
  /* expand or collapse the nav when the user clicks/taps the nav menu */
  /* also, collapse the nav if the user clicks anywhere on the page */
  $(window).click(function(e){
    let el = e.target;
    console.log($("#nav-toggle"));
    let navToggle = document.getElementById('nav-toggle');
    let navToggleI = navToggle.querySelector('i');
    if (el == navToggle || el == navToggleI) {
      $(".top-nav .nav-container").css('display') == 'none' ?
        $(".top-nav .nav-container").slideDown() :
        $(".top-nav .nav-container").slideUp();
    }
    else {
      if ($(".top-nav .nav-container").css('display') !== 'none') {
        $(".top-nav .nav-container").slideUp();
      }
    }
  })
});
