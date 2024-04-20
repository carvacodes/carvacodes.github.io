function Options(){
    this.animation = 'curls';
    this.type = 'source-over';
    this.clearRect = 'false';
    this.canvasColor = '#000';
    this.fill = function() {
      ctx.fillStyle = this.canvasColor;
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      if (this.type == 'curls') { newSphere(); }
    }
    this.clearCanvas = function(){ 
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (this.type == 'curls') { newSphere(); }
    }
  };
  
  var gui = new dat.GUI();
  var ops = new Options();
  
  var f0 = gui.addFolder('Animation');
  f0.add(ops, 'animation', ['curls', 'circles', 'particles']);
  f0.open();
  
  var f1 = gui.addFolder('Composite Operation');
  f1.add(ops, 'type', ['source-over', 'source-out', 'source-atop', 'destination-over', 'destination-out', 'destination-atop', 'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity', 'source-in', 'destination-in']);
  f1.open();
  
  var f2 = gui.addFolder('Canvas/Background');
  f2.addColor(ops, 'canvasColor');
  f2.add(ops, 'fill');
  f2.add(ops, 'clearRect', ['false', 'true']);
  f2.add(ops, 'clearCanvas');
  
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  
  window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    centerX = innerWidth/2;
    centerY = innerHeight/2;
  })
  
  canvas.addEventListener('click', function(e){
    e.preventDefault();
    if (ops.animation == 'curls') {
      newSphere(e.clientX, e.clientY);
    }
  })
  
  var animation, type, mod, lastX, lastY, counter, endIteration, hue, lightness, mainColor, shadowColor, centerX = innerWidth/2, centerY = innerHeight/2;
  
  function newSphere(x, y) {
    type = Math.random() < 0.5 ? 0 : 1;
    mod = 1 + Math.random() * 2;
    lastX = x || (Math.random() * (innerWidth));
    lastY = y || (Math.random() * (innerHeight));
    counter = 0;
    endIteration = 100 + Math.round(Math.random() * 300);
    hue = Math.random() * 255;
    lightness = 50 + Math.random() * 30;
    mainColor = 'hsl(' + hue + ',100%,' + lightness + '%)';
    shadowColor = 'hsl(' + hue + ',100%,' + (lightness - 40) + '%)';
  }
  
  function updateGradient(x,y,r,mc,sc) {
    var x = x - r/4
    var y = y - r/4
    var grad = ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0, mc);
    grad.addColorStop(1, sc);
    return grad;
  }
  
  function drawCurl() {
    if (counter < endIteration) {
      var i = counter/endIteration;
      var x = lastX;
      var y = lastY;
      var r = type? 60 - (60 * i) : 60 * i;
      ctx.fillStyle = updateGradient(x,y,r,mainColor,shadowColor);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2, true);
      ctx.fill();
      lastX = x + Math.cos(Math.PI * (2 - (2 * i))) * mod;
      lastY = y + Math.sin(Math.PI * (2 - (2 * i))) * mod;
    } else {
      newSphere();
    }
  }
  
  function drawCircles() {
    if (counter < endIteration) {
      var i = counter/endIteration;
      var r = Math.round(innerWidth/10);
      var ax = centerX + Math.cos(Math.PI * 2 * i) * r;
      var ay = centerY + Math.sin(Math.PI * 2 * i) * r;
      var bx = centerX + Math.cos(Math.PI * 2 * i + (Math.PI * 2/3)) * r;
      var by = centerY + Math.sin(Math.PI * 2 * i + (Math.PI * 2/3)) * r;
      var cx = centerX + Math.cos(Math.PI * 2 * i + (Math.PI * 4/3)) * r;
      var cy = centerY + Math.sin(Math.PI * 2 * i + (Math.PI * 4/3)) * r;
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(ax, ay, r, 0, Math.PI*2, true);
      ctx.fill();
      ctx.fillStyle = '#0f0';
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI*2, true);
      ctx.fill();
      ctx.fillStyle = '#00f';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2, true);
      ctx.fill();
    } else {
      counter = 0;
    }
  }
  
  function Particle(x, y) {
    this.size = 5 + Math.round(Math.random() * 10);
    this.x = centerX;
    this.y = centerY;
    this.xSpeed = -1 + Math.random() * 2;
    this.ySpeed = -1 + Math.random() * 2;
    this.hue = Math.random() * 360;
    this.color = 'hsla(' + this.hue + ',100%,50%,0.5)';
  }
  
  Particle.prototype.move = function() {
    if (this.x < 0 || this.x > innerWidth || this.y < 0 || this.y > innerHeight) {
      this.x = centerX;
      this.y = centerY;
      this.xSpeed = -1 + Math.random() * 2;
      this.ySpeed = -1 + Math.random() * 2;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.xSpeed *= 1.01;
    this.ySpeed *= 1.01;
  }
  
  var particles = [];
  
  for (var i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
  
  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      particles[i].move();
      ctx.fillStyle = particles[i].color;
      ctx.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
    }
  }
  
  function draw() {
    canvas.style.backgroundColor = ops.canvasColor;
    ctx.globalCompositeOperation = ops.type;
    if (ops.clearRect == 'true') {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
    
    if (ops.animation == 'curls') {
      drawCurl();
      counter += mod;
    } else if (ops.animation == 'circles') {
      drawCircles();
      counter += 0.5;
    } else {
      drawParticles();
    }
    requestAnimationFrame(draw);
  }
  
  draw();
  