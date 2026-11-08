window.addEventListener('load', (e) => {
  let l = document.querySelector('.nav-layout-select');
  let p = document.querySelector('.portfolio-view');
  let page = window.location.pathname;
  let smallScreen = window.innerWidth <= 1028 || window.innerHeight < 1024;

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // automatically switch to large tiles on small screens
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (page.indexOf('models') > -1 || page.indexOf('jsdemos') > -1) {
    if (smallScreen) {
      document.querySelector('.layout-select-item.active').classList.remove('active');
      document.querySelector('.layout-select-item[layout-type="tiles-large"]').classList.add('active');
      document.querySelector('.portfolio-view.tiles-small').className = 'portfolio-view tiles-large';
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // populate the portfolio page
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (page.indexOf('models') > -1) {
    let view = document.querySelector('.portfolio-view');

    for (let model in modelList) {
      let filePath = `./assets/models/${model}`;
      let portfolioItem = document.createElement('div');
      portfolioItem.classList.add('portfolio-item');
      portfolioItem.setAttribute('model-name', model);

      let itemImg = document.createElement('div');
      itemImg.classList.add('portfolio-item-img');
      itemImg.style.backgroundImage = `url('${filePath}/thumbnail.png')`;

      let itemImgWire = document.createElement('div');
      itemImgWire.classList.add('portfolio-item-img-wire');
      itemImgWire.style.backgroundImage = `url('${filePath}/thumbnail wireframe.png')`;

      let itemText = document.createElement('div');
      itemText.classList.add('portfolio-item-text');
      itemText.innerText = modelList[model].displayName ? modelList[model].displayName : model;

      portfolioItem.appendChild(itemImg);
      portfolioItem.appendChild(itemImgWire);
      portfolioItem.appendChild(itemText);

      view.appendChild(portfolioItem);
    }
  } else if (page.indexOf('jsdemos') > -1) {
    let view = document.querySelector('.portfolio-view');

    for (let demo in demoList) {
      let filePath = `./assets/demos/${demo}.png`;
      let formattedName = demo.replace(/-/g, ' ');

      let portfolioItem = document.createElement('div');
      portfolioItem.classList.add('portfolio-item');
      portfolioItem.setAttribute('demo-name', demo);

      let itemImg = document.createElement('div');
      itemImg.classList.add('portfolio-item-img');
      itemImg.style.backgroundImage = `url('${filePath}')`;

      let itemText = document.createElement('div');
      itemText.classList.add('portfolio-item-text');
      itemText.innerText = formattedName;

      portfolioItem.appendChild(itemImg);
      portfolioItem.appendChild(itemText);

      view.appendChild(portfolioItem);
    }
  } else {
    // log as needed, but generally not when live
    // console.log('No portfolio page indicated. Not loading portfolio items.');
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // open the correct demo if the user navigated here from a relevant URL
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (window.location.search) {
    let searchParams = new URLSearchParams(window.location.search);
    if (window.location.search.indexOf('demo') > -1) {
      let d = searchParams.get('demo');
      setModalContents(document.querySelector('.modal'), d, 'demo')
    } else if (window.location.search.indexOf('model') > -1) {
      let m = searchParams.get('model');
      setModalContents(document.querySelector('.modal'), m, 'model')
    }
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // click listeners
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  window.addEventListener('click', (e) => {
    let t = e.target;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // nav layout selection logic
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (t.classList.contains('nav-layout')) {
      l.classList.toggle('expanded');
    }

    if (!t.classList.contains('nav-layout') && l && l.classList.contains('expanded')) {
      l.classList.remove('expanded');
    }

    if (t.classList.contains('layout-select-item') && !t.classList.contains('active')) {
      document.querySelector('.layout-select-item.active').classList.remove('active');
      t.classList.add('active');
      p.className = 'portfolio-view ' + t.getAttribute('layout-type');
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // selecting a portfolio item
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let itemParent = getPortfolioParent(t);

    if (itemParent) {
      let itemName;
      let itemType;

      // found an item; open the view with the appropriate contents
      if (itemParent.hasAttribute('model-name')) {
        itemName = itemParent.getAttribute('model-name');
        itemType = 'model';
      } else if (itemParent.hasAttribute('demo-name')) {
        itemName = itemParent.getAttribute('demo-name');
        itemType = 'demo';
      }

      setModalContents(document.querySelector('.modal'), itemName, itemType)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // selecting a portfolio item background color
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (t.parentElement.classList.contains('bg-style') && !t.classList.contains('active')) {
      let m = document.querySelector('.modal-body');
      m.classList.remove('bg-semi-trans', 'bg-black', 'bg-white');
      m.classList.add(t.getAttribute('bg-enable'));
      m.querySelector('img.active').classList.remove('active');
      t.classList.add('active');
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // downloading an image
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (t.hasAttribute('downloadable')) {
      // create new blank images and a blank canvas
      let modelParent = t.parentElement.parentElement;
      let i = new Image();
      let l = new Image();
      let a = new Image();
      let c = document.createElement('canvas');
      let w = 1920;
      let h = 1080;

      // set canvas width and height, create context
      c.width = w;
      c.height = h;
      let ctx = c.getContext('2d');

      // paint blank canvas with the user's currently-selected background-color
      let activeBgColor = modelParent.querySelector('.bg-style img.active').getAttribute('bg-enable');
      let bgColor = activeBgColor === 'bg-black' ? 'rgb(0,0,0)' : activeBgColor === 'bg-white' ? 'rgb(255,255,255)' : 'rgb(22, 31, 32)';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // set blank image "i" source image to target's image
      i.src = t.src;

      // when i has loaded, draw i onto the canvas, then attach attribution
      i.onload = ()=>{
        ctx.drawImage(i, 0, 0, w, h, 0, 0, w, h);

        // set attribution source image
        a.src = './assets/attribution.png';

        // when a has loaded, draw a onto the canvas
        a.onload = ()=>{
          ctx.drawImage(a, 0, 0, w, h, 0, 0, w, h);

          // set logo source image, draw on load
          l.src = './assets/rel-logo-32.png';

          l.onload = ()=>{
            ctx.drawImage(l, 0, 0, 32, 32, 4, h - 32 - 4, 32, 32);

            // convert the existing canvas to a blob, then create an empty link, populate it with the relevant data, then simulate a click on it
            c.toBlob((b) => {
              let link = document.createElement('a');
              link.setAttribute('target', '_blank');

              // dynamically create the file name from the item's related data element
              link.download = `arielle-carvajal-${modelParent.querySelector('.item-name').innerText.replace(/(%20|\s)/g, '-')}-model.png`;

              let url = URL.createObjectURL(b);
              link.href = url;
              window.open(url, '_blank');
              link.click();

              URL.revokeObjectURL(url)
            });

          }
        };
      };
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // closing the modal
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (t.classList.contains('modal') && t.classList.contains('active')) {
      unsetModal(t);
      const url = new URL(location.origin + location.pathname);
      history.pushState({}, "", url);
    }

    if (t.classList.contains('modal-close')) {
      unsetModal(document.querySelector('.modal.active'));
      const url = new URL(location.origin + location.pathname);
      history.pushState({}, "", url);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // the user clicked on the "info" button
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (t.classList.contains('details-control')) {
      let navSection = t.parentElement.parentElement.parentElement;

      if (navSection.classList.contains('condensed')) {
        navSection.classList.remove('condensed');
        navSection.classList.add('expanded');
      } else {
        navSection.classList.remove('expanded');
        navSection.classList.add('condensed');
      }
    }

  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// recurse up the DOM tree from t until you find a .portfolio-item, otherwise return null
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPortfolioParent(t) {
  if (t === document.body) {
    return null;
  } else {
    if (t.classList.contains('portfolio-item')) {
      return t;
    } else {
      return getPortfolioParent(t.parentElement);
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// set the contents of the modal popover based on the item type and its name, populating the modal appropriately
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setModalContents(modal, itemName, type) {
  if (type === 'model') {
    populateModelItem(modal, itemName);
  } else if (type === 'demo') {
    populateDemoItem(modal, itemName);
  } else {
    if (!itemName) {
      console.log(`No portfolio item name defined. Not opening modal.`);
      return;
    }
    console.log(`Tried to load portfolio item ${itemName}, but it was not found.`);
    return;
  }

  if (type === 'demo') {
    modal.querySelector('.item-name').innerText = itemName.replace(/-/g, ' ');
  } else {
    modal.querySelector('.item-name').innerText = modelList[itemName].displayName ? modelList[itemName].displayName : itemName;
  }
  modal.classList.add('active');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// dismiss the modal and clear its title and contents
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function unsetModal(m) {
  m.querySelectorAll('.item-info span').forEach(el => el.style.display = '');
  
  m.classList.remove('active');
  m.querySelector('.item-name').innerText = '';
  m.querySelector('.info-expanded').innerText = '';
  m.querySelector('.nav-section.lower-nav').className = 'nav-section lower-nav condensed';
  let mc = m.querySelector('.modal-contents');

  while (mc.firstChild) {
    mc.removeChild(mc.firstChild);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// the user clicked on a 3d model portfolio item; create the appropriate modal content for it
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function populateModelItem(modal, itemName) {
  let modalContents = modal.querySelector('.modal-contents');
  let model = modelList[itemName];
  
  for (let i = 1; i <= model.imgs; i++) {
    let filePath = `../assets/models/${itemName}/${i.toString().padStart(2, '0')}.png`;
    let newImg = document.createElement('img');
    newImg.setAttribute('src', filePath);
    newImg.setAttribute('downloadable', 'true');
    modalContents.appendChild(newImg);
  }

  if (model.hasInfo) {
    let req = new Request('../assets/models/' + itemName + '/info.txt');

    fetch(req)
      .then((response) => {
        if (response.ok) {
          let s = response.text();
          return s;
        }
      })
      .then((s) => {
        document.querySelector('.info-expanded').appendChild(genPm(s));
      });
  } else {
    document.querySelectorAll('.item-info span').forEach(el => el.style.display = 'none');
  }

  const url = new URL(location);
  url.searchParams.set("model", itemName.replace(' ', '-'));
  history.pushState({}, "", url);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// the user clicked on a js demo portfolio item; create the appropriate modal content for it
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function populateDemoItem(modal, itemName) {
  let modalContents = modal.querySelector('.modal-contents');
  let demo = demoList[itemName];
  let dirPath = `./submods/${itemName}`;
  let iframe = document.createElement('iframe');

  iframe.src = `${dirPath}/markup.html`;
  modalContents.appendChild(iframe);

  if (demo.hasInfo) {
    document.querySelector('.item-info').style.display = 'flex';
    let req = new Request('../assets/demos/' + itemName + '-info.txt');

    fetch(req)
      .then((response) => {
        if (response.ok) {
          let s = response.text();
          return s;
        }
      })
      .then((s) => {
        document.querySelector('.info-expanded').innerText = s;
      });
  }

  const url = new URL(location);
  url.searchParams.set("demo", itemName);
  history.pushState({}, "", url);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generate PseudoMarkdown from a chunk of text
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function genPm(text) {
  let p = document.createElement('p');

  // replace all line breaks with <br>s
  let pText = text.replace(/(\n|"\n")/g, '<br>');

  // replace all |i| with <i>
  let iLength = pText.split(/\|i\|/g).length - 1;

  for (let i = 0; i < iLength; i++) {
    if (i % 2 === 0) {
      pText = pText.replace('|i|', '<i>');
    } else {
      pText = pText.replace('|i|', '</i>');
    }
  }

  // replace all |b| with <b>
  let bLength = pText.split(/\|b\|/g).length - 1;

  for (let b = 0; b < bLength; b++) {
    if (b % 2 === 0) {
      pText = pText.replace('|b|', '<b>');
    } else {
      pText = pText.replace('|b|', '</b>');
    }
  }

  // replace all |a| with <a>
  let aIterator = 0;
  pText = pText.replaceAll(/\|a (href=".*")\|/g, '<a $1 target="_blank">');
  pText = pText.replaceAll('|a|', '</a>');

  // replace |-| with <ul>
  let bl = pText.split(/\|-\|/g).length - 1;

  for (let b = 0; b < bl; b++) {
    if (b % 2 === 0) {
      pText = b === 0 ? pText.replace('|-|', '<ul><li>') : pText.replace('|-|', '<li>');
    } else {
      pText = b === bl - 1 ? pText.replace('|-|', '</li></ul>') : pText.replace('|-|', '</li>');
    }
  }

  pText = pText.replaceAll(/<\/li>\s<br>/g, '</li>');
  pText = pText.replace(/<\/li><\/ul>\s<br>/, '</li></ul>');

  // set the innerHTML and return the new element
  p.innerHTML = pText;
  return p;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// models
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let modelList = {  
  'upright-piano': { imgs : 6, displayName: 'upright piano', hasInfo: 'true' },
  'behringer-u-phoria': { imgs: 6, displayName: 'behringer u-phoria umc22', hasInfo: 'true'},
  'phaser-one': { imgs: 8, displayName: 'phaser one (mark i), star trek tos', hasInfo: 'true' },
  'phaser-two': { imgs: 6, displayName: 'phaser two (mark i), star trek tos', hasInfo: 'true' },
  'lightsaber-1': { imgs: 7, displayName: 'luke\'s first lightsaber (episode iv)' },
  'lightsaber-2': { imgs: 7, displayName: 'obi wan\'s lightsaber (episode iv)' },
  'lightsaber-3': { imgs: 7, displayName: 'vader\'s lightsaber (episode iv)' },
  'lightsaber-4': { imgs: 7, displayName: 'luke\'s second lightsaber (episode v)' },
  'commlock': { imgs: 8, displayName: 'commlock' },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// demos
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let demoList = {
  'amoeboid': {},
  'dynamic-lighted-buttons': {},
  'flying-with-the-sky-dragon': {},
  'moving-boxes': {},
  'particle-explosions': {},
  'tower-of-the-gods': {},
  'canvas-composite-operations': {},
  'emulating-pixelisa': {},
  'lissajous': {},
  'neon-grid': {},
  'pastel-orbits': {},
  'symyn': {},
  'water-caustics': {},
  'crt-magnet-interference': {},
  'flame': {},
  'magnetic-lines-of-force': {},
  'particle-cyclone': {},
  'post-dusk': {},
  'tic-tac-toe': {},
  'wireframe-grayscale-triangles': {},
};


