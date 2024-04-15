$(document).ready(function(){
  // projects view: reload the iframe and change its src attribute when a new project is selected
  let projectPreview = $('#projectPreview')[0];
  let projectSelect = $('#projectSelect');
  projectSelect.change(function(e){
    let projectUrl = './submods/' + this.value + '/markup.html'
    projectPreview.setAttribute('src', projectUrl);
  });

  // global click operations
  $(window).click(function(e){
    let el = e.target;  // the element targeted by the click/tap

    // elements to watch for nav toggling
    let navToggle = document.getElementById('nav-toggle');    // the nav bar
    let navToggleI = navToggle.querySelector('i');            // the hamburger icon

    // expand or collapse the nav when the user clicks/taps the nav menu
    // also, collapse the nav if the user clicks anywhere on the page
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

  // update the select list to gray out projects that are not currently available
  let projectSelectEl = projectSelect[0];
  let opts = projectSelectEl.getElementsByTagName('OPTION');
  let optsArray = [].slice.call(opts)
  optsArray.forEach(el => {
    if (el.getAttribute('data-status') == 'inactive') {
      el.disabled = true;
      el.innerText += ' - Coming Soon!';
      el.style.fontStyle = 'italic';
      el.style.color = '#bbb';
    }
  });

  // Smooth scrolling to on-page links
  // Select all links with hashes
  $('a[href*="#"]').click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      let target = $(this.hash);
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
          let $target = $(target);
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

  // address the viewport height bug affecting iOS 7.x devices
  let allEls = document.body.querySelector("*");
  for (let i = 0; i < allEls.length; i++) {
    if (window.getComputedStyle(allEls[i]).height.slice(0, -2) > window.innerHeight * 3) {
      allEls[i].style.height = windowHeight + "px";
      allEls[i].style.maxHeight = windowHeight + "px";
      allEls[i].style.overflow = "auto";
      allEls[i].style.backgroundSize = "auto 100%";
    }
  }
});

let projectData = {
  'categories': [
    'Games',
    'Tests, Proof-of-Concepts, and Educational',
    'Spinners',
    'Fun, Artsy, and Miscellaneous'
  ],
  'tagList': [
    'CSS',                    // 0
    'CSS-Only',               // 1
    'Sass/SCSS',              // 2
    'HTML-Heavy',             // 3
    'HTML Libraries',         // 4
    'HTML Canvas',            // 5
    'JavaScript',             // 6
    'JavaScript-Only',        // 7
    'Vanilla JavaScript',     // 8
    'JavaScript Libraries',   // 9
    'Gradients'               // 10

  ],
  'ctaList': [
    'Move the mouse cursor',
    'Click on the demo'
  ],
  'projectList': [
    {
      'optValue': 'dynamic-lighted-buttons',
      'category': '1',
      'displayName': 'Dynamic Lighted Buttons',
      'descriptionHtml': "In this proof of concept, the mouse cursor acts as a light source, causing the page background and several buttons on the page to illuminate and case shadows.\nThe page background effect is a simple radial gradient with a large radius (500px), centered on the mouse cursor.\nThe `fancy-button` class on the page buttons enables lighting effects for them. Similar to the page background, a radial gradient on each button simulates a light source emanating from the cursor. However, the gradient is significantly smaller, and its center is constrained to the button boundaries (the `left`, `right`, `top`, and `bottom` of the button's `BoundingClientRect`). The gradient also appears more diffuse when the mouse is off of and/or farther away from the button.\nThe shadows cast by the interaction of the buttons and [apparent] cursor light source are more diffuse when the mouse cursor is far from the button, and less diffuse when the cursor is closer to the button. The shadows also appear to move opposite the light source and grow slightly with more distance from the mouse cursor, as one would expect.\nThe behavior is triggered by the `mousemove` event, during which the position and diffusion of the gradients and shadows are calculated on a per-element basis.\nThis version improves on the calculations for `shadowXOffset`, `shadowYOffset`, `shadowDispersion`, and `shadowDepth`. It also reformats the setting of `proxy.style.boxShadow` to use all five possible `boxShadow` parameters, using the `shadowDispersion` value for both the blur radius and the spread radius of the shadow.",
      'githubUrl': 'https://github.com/carvacodes/dynamic-lighted-buttons',
      'tags': [8, 2]
    },
    {
      'optValue': 'canvas-composite-operations',
      'category': '1',
      'displayName': 'Canvas Composite Operations',
      'descriptionHtml': "A quick look at the various composite operations provided to us by the `CanvasRenderingContext2D` interface.\nClick on the page to form a new curl, or check out the other animations using the **Animation** tab in the GUI. Check out https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation for the complete `CanvasRenderingContext2D` reference.\nThis demo also uses the [dat.GUI](https://github.com/dataarts/dat.gui) controller library for its graphical user interface.",
      'githubUrl': 'https://github.com/carvacodes/canvas-composite-operations',
      'tags': [5, 8, 9, 10]
    },
    {
      'optValue': 'lissajous',
      'category': '3',
      'displayName': 'Lissajous',
      'descriptionHtml': "In this demo, an animated grid of lissajous curves are drawn to an HTML canvas using vanilla JavaScript.\nEach curve has a point (a \"dot\") associated with it that draws a piece of its curve on every window animation frame (via `window.requestAnimationFrame`). The farther right or farther down each grid square is, the faster its dot's X or Y coordinate (respectively) moves. Setting the HTML `<canvas>` element's `fadeIntensity` value to 0 initially allows the user to see the geometry of the curves as they relate to one another, and neatly visualizes how changing the X or Y oscillation speed changes the resulting graph.",
      'githubUrl': 'https://github.com/carvacodes/lissajous',
      'tags': [5, 8, 10]
    }
  ]
}