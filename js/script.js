$(document).ready(function(){

  ////////////////////////////
  //    Project Selector    //
  ////////////////////////////

  // projects view: reload the iframe and change its src attribute when a new project is selected
  let projectPreview = $('#projectPreview')[0];
  let projectSelectElement = $('#projectSelect');
  let projectList;

  // populate the project list
  fetch('../files/projects.json')
    .then((response) => response.json())
    .then((json) => { projectList = json; });

  // on changing the project selector, swap the iframe src and update the header/description fields
  projectSelectElement.change(selectProject);

  function selectProject() {
    if (this.value == "selectProject") { return; }

    let projectName = this.value;
    let project = projectList[projectName];
    let projectMarkupUrl = './submods/' + projectName + '/markup.html';
    let gitHubUrl = 'https://github.com/carvacodes/' + projectName;
    projectPreview.setAttribute('src', projectMarkupUrl);

    let projectElements = {
      displayName: $('#projectName')[0],
      descriptionText: $('#projectDescriptionText')[0],
      gitHubUrl: $('#projectGitHubUrl a')[0],
      tags: $('#projectTags')[0]
    }

    projectElements.displayName.innerText = project.displayName;
    projectElements.descriptionText.innerHTML = convertMarkdownToHtml(project.descriptionText);
    projectElements.gitHubUrl.innerText = gitHubUrl;
    projectElements.gitHubUrl.href = gitHubUrl;
  }

  // random project selector button
  let randomProjectButton = $('#randomProject');
  randomProjectButton.click(selectRandomProject);

  function selectRandomProject() {
    let projectNameArray = [];
    for (let proj in projectList) {
      if (proj != projectSelectElement[0].value) { projectNameArray.push(proj); }
    }
    let selection = projectNameArray[Math.floor(Math.random() * projectNameArray.length)];
    projectSelectElement.val(selection);
    projectSelectElement.trigger('change');
  }

  // update the select list to gray out projects that are not currently available
  let projectSelectEl = projectSelectElement[0];
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

  ////////////////////////////
  //     Event Listeners    //
  ////////////////////////////

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

    if (el.id.match(/exp_.*/)) {
      handleExperienceClick(el);
    }
  })

  // event listener hack for touchmove compatibility on iOS devices
  window.addEventListener('touchstart', {});

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
        // Only prevent default if animation is actually going to happen
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

////////////////////////////////////
//  Functions and Event Handlers  //
////////////////////////////////////

function handleExperienceClick(el) {
  if (el.classList.contains('active')) {
    return;
  }
  let elGroup = $(el).siblings('li');
  let groupName = el.id.match(/exp_(\w*)/)[1];

  // set classes for categories
  $(elGroup).removeClass('active');
  $(el).addClass('active');

  // set classes for paragraph parents and organize paragraph groups
  let paraParent = $('div.achieving');
  let paraGroup = $('div.achieving > div');

  let utilParent = $('div.utilizing');

  utilParent.slideUp(500, () => { populateUtils(groupName); });
  
  paraParent.slideUp(500, ()=>{
    paraGroup.slideUp(100, () => {
      let paragraph = $('#ach_' + groupName);

      paragraph.addClass('active');
      paragraph.slideDown(100, () => {
        paraParent.slideDown(500, () => {
          utilParent.slideDown(500);
        });
      });
    });
  });
}

function populateUtils(groupName) {
  // create a list of related <li> elements from the groupName passed in
  let categories = [
    /*0*/ 'uiux',
    /*1*/ 'tools',
    /*2*/ 'techwriting',
    /*3*/ 'games',
    /*4*/ 'graphic',
    /*5*/ 'automation',
    /*6*/ 'web',
    /*7*/ 'selfstudy'
  ];

  let groupNum = categories.indexOf(groupName);

  // all utilizations will have a display name and a string indicating the categories to be included in
  let utilLangs = [
    {
      name: 'HTML 5',
      categoryList: '01234567'
    },
    {
      name: 'Haml',
      categoryList: '07'
    },
    {
      name: 'CSS',
      categoryList: '03467',
    },
    {
      name: 'Less',
      categoryList: '03467',
    },
    {
      name: 'Sass/SCSS',
      categoryList: '03467',
    },
    {
      name: 'JavaScript',
      categoryList: '0123467'
    },
    {
      name: 'jQuery',
      categoryList: '03467'
    },
    {
      name: 'CoffeeScript',
      categoryList: '0167'
    },
    {
      name: 'React',
      categoryList: '067'
    },
    {
      name: 'ExpressJS',
      categoryList: '067'
    },
    {
      name: 'KnockoutJS',
      categoryList: '067'
    },
    {
      name: 'EmberJS',
      categoryList: '67'
    },
    {
      name: 'Angular',
      categoryList: '67'
    },
    {
      name: 'Laravel',
      categoryList: '067'
    },
    {
      name: 'GML (Game Maker Language)',
      categoryList: '37'
    },
    {
      name: 'C#',
      categoryList: '01237'
    },
    {
      name: 'AutoHotKey (AHK)',
      categoryList: '01247'
    },
    {
      name: 'Markdown',
      categoryList: '012367'
    },
    {
      name: 'C++',
      categoryList: '7'
    },
    {
      name: 'Ruby',
      categoryList: '7'
    },
    {
      name: 'Python',
      categoryList: '7'
    },
    {
      name: 'Bash',
      categoryList: '012467'
    },
    {
      name: 'Windows Command Line/PowerShell',
      categoryList: '012467'
    },
    {
      name: 'YAML',
      categoryList: '0127'
    },
    {
      name: 'TypeScript',
      categoryList: '7'
    }
  ];
  let utilApps = [
    {
      name: 'XAMPP',
      categoryList: '0267'
    },
    {
      name: 'AMPPS',
      categoryList: '0267'
    },
    {
      name: 'DocFX',
      categoryList: '012367'
    },
    {
      name: 'Git',
      categoryList: '012367'
    },
    {
      name: 'GitHub',
      categoryList: '0123467'
    },
    {
      name: 'GitHub Actions Workflows',
      categoryList: '01237'
    },
    {
      name: 'Google Cloud Platform',
      categoryList: '01237'
    },
    {
      name: 'Unity',
      categoryList: '012367'
    },
    {
      name: 'Game Maker',
      categoryList: '347'
    },
    {
      name: 'InkScape',
      categoryList: '0123467'
    },
    {
      name: 'IrfanView',
      categoryList: '013467'
    },
    {
      name: 'GIMP',
      categoryList: '0123467'
    },
    {
      name: 'Adobe Creative Suite',
      categoryList: '0123467'
    },
    {
      name: 'Microsoft Office Suite',
      categoryList: '0123467'
    },
    {
      name: 'Visual Studio',
      categoryList: '01237'
    },
    {
      name: 'Visual Studio Code',
      categoryList: '0123467'
    },
    {
      name: '.NET 6+',
      categoryList: '0127'
    },
    {
      name: 'Sublime Text',
      categoryList: '0123467'
    },
    {
      name: 'Audacity',
      categoryList: '012367'
    },
    {
      name: 'OBS (Open Broadcast Software)',
      categoryList: '012367'
    },
    {
      name: 'Procreate',
      categoryList: '013467'
    },
    {
      name: 'SnagIt',
      categoryList: '01247'
    },
    {
      name: 'SnagIt',
      categoryList: '01247'
    },
    {
      name: 'Microsoft Visio',
      categoryList: '01247'
    },
    {
      name: 'Draw.io',
      categoryList: '01247'
    },
    {
      name: 'Blender',
      categoryList: '347'
    }
  ];

  let newItemList = [];
  for (let i = 0; i < utilLangs.length; i++) {
    let lang = utilLangs[i];
    if (lang.categoryList.indexOf(groupNum) >= 0) {
      newItemList.push({itemData: lang, itemType: 'lang'});
    }
  }
  for (let i = 0; i < utilApps.length; i++) {
    let app = utilApps[i];
    if (app.categoryList.indexOf(groupNum) >= 0) {
      newItemList.push({itemData: app, itemType: 'app'});
    }
  }

  let util = $('#util');
  $(util)[0].innerHTML = '';

  for (let i = 0; i < newItemList.length; i++) {
    let item = newItemList[i];
    let li = getNewLi(item);
    $(util).append(li);
  }
}

function getNewLi(item) {
  let li = document.createElement('LI');
  let i = item;
  $(li).addClass(i.itemType);
  li.innerText = i.itemData.name;
  return li;
}

function convertMarkdownToHtml(markdownText) {
  let text = markdownText.replace('<', '`');
  text = text.replace('>', '`');
  text = text.replace('`', '<pre><code>');
  text = text.replace('`', '</code></pre>');
  return text;
}