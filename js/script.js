$(document).ready(function(){
  // projects view: reload the iframe and change its src attribute when a new project is selected
  let projectPreview = $('#projectPreview')[0];
  let projectSelect = $('#projectSelect');

  // on changing the project selector, swap the iframe src and update the header/description fields
  projectSelect.change(function(e){
    let projectName = this.value;
    let project = projectData.projectList[projectName];
    let projectMarkupUrl = './submods/' + projectName + '/markup.html'
    projectPreview.setAttribute('src', projectMarkupUrl);

    let projectElements = {
      displayName: $('#projectName')[0],
      descriptionText: $('#projectDescriptionText')[0],
      gitHubUrl: $('#projectGitHubUrl a')[0],
      tags: $('#projectTags')[0]
    }

    projectElements.displayName.innerText = project.displayName;
    projectElements.descriptionText.innerHTML = convertMarkdownToHtml(project.descriptionText);
    projectElements.gitHubUrl.innerText = project.gitHubUrl;
    projectElements.gitHubUrl.href = project.gitHubUrl;
  });

  // random project selector button
  let randomProjectButton = $('#randomProject');
  randomProjectButton.click((e) => {
    let projectNameArray = [];
    for (let proj in projectData.projectList) {
      if (proj != projectSelect[0].value) { projectNameArray.push(proj); }
    }
    let selection = projectNameArray[Math.floor(Math.random() * projectNameArray.length)];
    projectSelect.val(selection);
    projectSelect.trigger('change');
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

function convertMarkdownToHtml(markdownText) {
  let text = markdownText.replace('<', '`');
  text = text.replace('>', '`');
  text = text.replace('`', '<pre><code>');
  text = text.replace('`', '</code></pre>');
  return text;
}

let projectData = {
  'categories': [
    'Games',
    'UI/UX',
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
  'projectList': {
    'dynamic-lighted-buttons': {
      'optValue': 'dynamic-lighted-buttons',
      'category': 'UI/UX',
      'displayName': 'Dynamic Lighted Buttons',
      'descriptionText': "In this proof of concept, the mouse cursor acts as a light source, causing the page background and several buttons on the page to illuminate and case shadows.",
      'gitHubUrl': 'https://github.com/carvacodes/dynamic-lighted-buttons',
      'tags': ['Vanilla JavaScript', 'Sass/SCSS']
    },
    'canvas-composite-operations':
    {
      'optValue': 'canvas-composite-operations',
      'category': 'UI/UX',
      'displayName': 'Canvas Composite Operations',
      'descriptionText': "A quick look at the various composite operations provided to us by the `CanvasRenderingContext2D` interface.",
      'gitHubUrl': 'https://github.com/carvacodes/canvas-composite-operations',
      'tags': ['HTML Canvas', 'Vanilla JavaScript', 'JavaScript Libraries', 'dat.GUI', 'UI/UX', 'Gradients']
    },
    'lissajous':
    {
      'optValue': 'lissajous',
      'category': 'Fun, Artsy, and Miscellaneous',
      'displayName': 'Lissajous',
      'descriptionText': "In this demo, an animated grid of lissajous curves are drawn to an HTML `canvas` using vanilla JavaScript.",
      'gitHubUrl': 'https://github.com/carvacodes/lissajous',
      'tags': ['HTML Canvas', 'Vanilla JavaScript', 'Gradients']
    },
    'moving-boxes':
    {
      'optValue': 'moving-boxes',
      'category': 'UI/UX',
      'displayName': 'Moving Boxes Game',
      'descriptionText': "A brief experiment with speeds, click handlers, etc. on the HTML `canvas`. Also a fun little game :)",
      'gitHubUrl': 'https://github.com/carvacodes/moving-boxes',
      'tags': ['HTML Canvas', 'Vanilla JavaScript']
    },
    'crt-magnet-interference':
    {
      'optValue': 'crt-magnet-interference',
      'category': 'Fun, Artsy, and Miscellaneous',
      'displayName': 'CRT Magnet Interference',
      'descriptionText': "A cubic Bezier curve experiment that ended up simulating a kid, a magnet, and an old TV. Move the mouse, click to freeze.",
      'gitHubUrl': 'https://github.com/carvacodes/crt-magnet-interference',
      'tags': ['HTML Canvas', 'Vanilla JavaScript', 'Gradients']
    },
    'symyn':
    {
      'optValue': 'symyn',
      'category': 'Games',
      'displayName': 'Symyn',
      'descriptionText': 'A modern clone of the classic "Simon" game, using the HTML5 `AudioContext` API for sound.',
      'gitHubUrl': 'https://github.com/carvacodes/symyn',
      'tags': ['Sass/SCSS', 'JavaScript', 'jQuery', 'AudioContext']
    }
  }
}