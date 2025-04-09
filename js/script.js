window.addEventListener('load', function(){

  ////////////////////////////
  //    Project Selector    //
  ////////////////////////////

  // projects view: reload the iframe and change its src attribute when a new project is selected
  let projectPreview = $('#projectPreview')[0];
  let projectGroupSelect = $('#projectGroupSelect');
  let projectSelectElement = $('#projectSelect');
  let projectList;
  let nameList = {};
  let nameListProjectsHTML = '';
  let categoryList = {};
  let categoryListHTML = '';
  let categoryListProjectsHTML = {};
  let tagList = {};
  let tagListHTML = '';
  let tagListProjectsHTML = {};

  // populate the project list and category lists
  fetch('../files/projects.json')
    .then((response) => response.json())
    .then((json) => {
      // populate project list objects
      projectList = json;
      populateNameObj(projectList);
      populateCatObj(projectList);
      populateTagObj(projectList);
    })
    .then(() => {
      // populate project category or group HTML (formerly optgroups)
      categoryListHTML = listToHTML(categoryList, true, 'Select a Category');
      tagListHTML = listToHTML(tagList, true, 'Select a Tag');
    })
    .then(() => {
      // populate individual category HTML with each project as a group of opts
      nameListProjectsHTML = listToHTML(nameList, false);
      categoryListProjectsHTML = listToHTML(categoryList, false);
      tagListProjectsHTML = listToHTML(tagList, false);
    })
    .then(showAllProjects)
    .then(checkProjectInUrl);

  function checkProjectInUrl() {
      // If the user navigated here from a URL referencing a specific project,
      // load the project and scroll to it. Sanitize the query parameter!
      let projectUrlParamQueryString = window.location.search;
      let projectUrlParam = new URLSearchParams(projectUrlParamQueryString);
      let urlNavigatedProject = projectUrlParam.get('project') || '';
      let sanitizedQuery = encodeURI(urlNavigatedProject);
      if (sanitizedQuery !== '' && nameList[sanitizedQuery]) {
        hideProjectError();
        projectSelectElement.val(sanitizedQuery);
        projectSelectElement.trigger('change');
      } else if (sanitizedQuery !== '') {
        showProjectError(sanitizedQuery);
      }
  }

  function hideProjectError() {
    $('#project-not-found-notification').hide();
    $('#project-query-attempted').text('');
  }

  function showProjectError(attemptedProject) {
    $('#project-not-found-notification').show();
    $('#project-query-attempted').html(`<pre><code>${attemptedProject}</code></pre>`);
    softScrollTo('#projects-list-prose', 0, 400);
  }

  // helper function for gathering project names
  function populateNameObj(projectList) {
    for (projName in projectList) {
      nameList[projName] = projName;
    }
  }

  // helper function for gathering categories
  function populateCatObj(projectList) {
    for (projName in projectList) {
      let p = projectList[projName];
      let cat = p.category;
      if (categoryList[cat] == undefined) {
        categoryList[cat] = [projName]
      } else {
        categoryList[cat].push(projName);
      }
    }
  }

  // helper function for gathering tags; slightly different, since the tags are arrays, where the category is a single item
  function populateTagObj(projectList) {
    for (projName in projectList) {
      let p = projectList[projName];
      let tags = p.tags;
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        if (tagList[tag] == undefined) {
          tagList[tag] = [projName]
        } else {
          tagList[tag].push(projName);
        }
      }
    }
  }

  function listToHTML(list, isCategory = false, defaultOptText = 'Select a Project') {
    let tempSelect = document.createElement('SELECT');

    // include the default option when requested
    let defaultOpt = document.createElement('OPTION');  // the "default" option, viewable when the page loads
    defaultOpt.innerText = defaultOptText;
    defaultOpt.value = 'defaultSelection';
    tempSelect.appendChild(defaultOpt);

    // sorting will always happen; do preliminary sorting here
    let sortedArr = [];
    if (!list.length) {
      for (proj in list) {
        sortedArr.push(proj)
      }
    } else {
      sortedArr = list;
    }
    sortedArr.sort();

    if (isCategory) {
      for (category in sortedArr) {
        let opt = document.createElement('OPTION');
        opt.value = sortedArr[category];
        opt.innerText = sortedArr[category];
        tempSelect.appendChild(opt);
      }
      return tempSelect.innerHTML;
    } else if (projectList[sortedArr[0]]) {
      // working with a raw project name;
      // ok to immediately process projectList items using projectList[sortedArr[itemName]]
      for (proj in sortedArr) {
        let opt = document.createElement('OPTION');
        opt.value = sortedArr[proj];
        opt.innerText = projectList[sortedArr[proj]].displayName;
        tempSelect.appendChild(opt);
      }
      return tempSelect.innerHTML;

    } else if (categoryList[sortedArr[0]]) {
      let tempObj = {};
      // working with a list of categories that contains project names;
      // recursively call this function passing each sublist (which contains project names a la projectList, and will return the right HTML)
      for (category in sortedArr) {
        let projectsInCategory = listToHTML(categoryList[sortedArr[category]], false);
        tempObj[sortedArr[category]] = projectsInCategory;
      }
      return tempObj;
    } else if (tagList[sortedArr[0]]) {
      let tempObj = {};
      // working with a list of tags that contains project names;
      // recursively call this function passing each sublist (which contains project names a la projectList, and will return the right HTML)
      for (tag in sortedArr) {
        let projectsInTag = listToHTML(tagList[sortedArr[tag]], false);
        tempObj[sortedArr[tag]] = projectsInTag;
      }
      return tempObj;
    }
  }

  // on changing project group, swap the project selector options
  projectGroupSelect.change(selectGroup);

  function selectGroup() {
    let groupSelection = this.value;
    if (this.children[0].innerText == 'Select a Category') {
      projectSelectElement[0].style.display = 'block';
      projectSelectElement[0].innerHTML = categoryListProjectsHTML[groupSelection];
      projectSelectElement[0].children[0].innerText += ' from the ' + this.value + ' Category';
    } else if (this.children[0].innerText == 'Select a Tag') {
      projectSelectElement[0].style.display = 'block';
      projectSelectElement[0].innerHTML = tagListProjectsHTML[groupSelection];
      projectSelectElement[0].children[0].innerText += ' with the ' + this.value + ' Tag';
    }
  }

  // on changing the project selector, swap the iframe src and update the header/description fields
  projectSelectElement.change(selectProject);

  function selectProject() {
    if (this.value == "defaultSelection") { return; }

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

    projectElements.tags.innerHTML = '';

    for (let i = 0; i < project.tags.length; i++) {
      let tagSpan = document.createElement('SPAN');
      tagSpan.className = 'project-tag';
      tagSpan.innerText = project.tags[i];
      projectElements.tags.appendChild(tagSpan);
    }

    projectElements.displayName.innerText = project.displayName;
    projectElements.descriptionText.innerHTML = convertMarkdownToHtml(project.descriptionText);
    projectElements.gitHubUrl.innerText = gitHubUrl;
    projectElements.gitHubUrl.href = gitHubUrl;

    hideProjectError();
    
    softScrollTo('#projectName', 0, 400);
  }

  // random project selector button
  let randomProjectButton = $('#randomProject');
  randomProjectButton.click(selectRandomProject);

  function selectRandomProject() {
    showAllProjects();

    let projectNameArray = [];
    for (let proj in projectList) {
      if (proj != projectSelectElement[0].value) { projectNameArray.push(proj); }
    }
    let selection = Math.floor(Math.random() * projectNameArray.length);
    let selectedProject = projectNameArray[selection];
    let currentProj = projectPreview.src.match(/submods\/([\w\-]*)\/markup.html/);
    if (currentProj) { currentProj = currentProj[1]; }

    while (selectedProject == currentProj) {
      selection = Math.floor(Math.random() * projectNameArray.length);
      selectedProject = projectNameArray[selection];
    }
    
    
    softScrollTo('#projectName', 0, 400, () => {
      projectSelectElement.val(selectedProject);
      projectSelectElement.trigger('change');
    });
  }

  let sortByCategoryButton = document.getElementById('sortByCategory');
  sortByCategoryButton.addEventListener('click', sortByCategory);
  let sortByTagsButton = document.getElementById('sortByTags');
  sortByTagsButton.addEventListener('click', sortByTags);
  let showAllProjectsButton = document.getElementById('showAllProjects');
  showAllProjectsButton.addEventListener('click', showAllProjects);

  function sortByCategory() {
    sortByCategoryButton.classList.add('active');
    sortByTagsButton.classList.remove('active');
    showAllProjectsButton.classList.remove('active');

    projectGroupSelect[0].style.display = 'block';
    projectGroupSelect[0].innerHTML = categoryListHTML;
    projectSelectElement[0].innerHTML = '';
    projectSelectElement[0].style.display = 'none';
  }

  function sortByTags() {
    sortByCategoryButton.classList.remove('active');
    sortByTagsButton.classList.add('active');
    showAllProjectsButton.classList.remove('active');

    projectGroupSelect[0].style.display = 'block';
    projectGroupSelect[0].innerHTML = tagListHTML;
    projectSelectElement[0].innerHTML = '';
    projectSelectElement[0].style.display = 'none';
  }

  function showAllProjects() {
    sortByCategoryButton.classList.remove('active');
    sortByTagsButton.classList.remove('active');
    showAllProjectsButton.classList.add('active');

    projectGroupSelect[0].style.display = 'none';
    projectGroupSelect[0].innerHTML = '';
    projectSelectElement[0].style.display = 'block';
    projectSelectElement[0].innerHTML = nameListProjectsHTML;
  }

  ////////////////////////////
  //  IntersectionObserver  //
  ////////////////////////////
  let intObserverOpts = {
    threshold: [0.5, 1]
  }

  let intObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let el = entry.target;
        
        if (entry.intersectionRatio >= intObserverOpts.threshold[1]) {
          el.classList.remove('not-in-view');
        } else {
          el.classList.add('not-in-view');
        }
      }
    });
  }

  let intObserver = new IntersectionObserver(intObserverCallback, intObserverOpts);

  let intObserverTargets = document.querySelectorAll('.splash h1');
  intObserverTargets.forEach((el) => { intObserver.observe(el); });

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
      if ($(".top-nav .nav-container").css('display') !== 'none' && (innerWidth < 666 || innerHeight < 400)) {
        $(".top-nav .nav-container").slideUp();
      }
    }

    if (el.id.match(/exp_.*/)) {
      handleExperienceClick(el);
    }

    // if the user clicks on a project tag, automatically jump to filtering by tags, select the relevant tag, and show its projects
    if (el.classList.contains('project-tag')) {
      sortByTags();
      let tagSelected = el.innerText;
      projectGroupSelect[0].value = tagSelected;
      softScrollTo($('div.projects-list div.sort-type'), 0, 400, () => {projectGroupSelect.trigger('change');})
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
  
  ////////////////////////////////////
  //          End load event        //
  ////////////////////////////////////
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

  let achievingList = $('#achieving_list');
  let listRect = achievingList[0].getBoundingClientRect();
  
  // begin animation sequence
  utilParent.slideUp(400, () => { populateUtils(groupName); });
  paraParent.slideUp(400, ()=>{
    paraGroup.slideUp(0);
    let paragraph = $('#ach_' + groupName);
    paragraph.addClass('active');
    paragraph.slideDown(0,()=>{
      paraParent.slideDown(400, ()=>{
        utilParent.slideDown(400, ()=>{
          if (innerWidth >= 666 && innerHeight > 600) { 
            softScrollTo('section.experience.sub-container', 0, 400);
          } else {
            softScrollTo(achievingList, Math.abs(listRect.top - listRect.bottom), 400);
          }
        });
      });
    });
  });
}

// helper function to make scrolling to an individual element easier
function softScrollTo(elementSelector, additionalScrollOffset = 0, milliseconds, callback = null) {
  // check if there is a visible nav bar and add an additional offset to compensate if so
  let navBarOffset = 0;
  let navBarStyle = window.getComputedStyle($('#nav-toggle')[0]);
  if (navBarStyle.display == 'block') {
    navBarOffset = Math.round(Number(navBarStyle.height.slice(0, -2)));
  }

  // compensate for an element's margin (in whatever form it takes)
  let elementStyle = window.getComputedStyle($(elementSelector)[0]);
  let elementMarginOffset = elementStyle.marginTop.slice(0, -2) ||
                            elementStyle.marginBlockStart.slice(0, -2) ||
                            elementStyle.margin.slice(0, -2);
  
  // get an element's current screen position, rounded
  let elementScreenPosition = Math.round($(elementSelector)[0].getBoundingClientRect().top);

  // calculate the offset value and scroll to it, executing a provided callback
  // uses a promise for additional chaining, if needed
  let scrollToValue = $(elementSelector).offset().top + additionalScrollOffset - navBarOffset - elementMarginOffset;
  let promise = new Promise((resolve) => {
    // if the element is already scrolled correctly, execute any callback and return immediately; no need to wait for the scroll animation
    if (elementScreenPosition == navBarOffset) {
      if (callback) { callback(); }
      return resolve();
    } else {
      // if the element is not already scrolled correctly, scroll to it, executing the callback
      $('html').animate({
        scrollTop: scrollToValue
      }, milliseconds, callback);
      return resolve();
    }
  })
  return promise;
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
  // naive replace for angle brackets; greater than/less than symbols will need to be HTML encoded
  let text = markdownText.replaceAll('<', '`');
  text = text.replaceAll('>', '`');

  // replace backticks in pairs
  while (text.indexOf('`') >= 0) {
    text = text.replace('`', '<pre><code>');
    text = text.replace('`', '</code></pre>');
  }
  return text;
}