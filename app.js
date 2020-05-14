/*
+-----------------+-------------------+----------------+
|	pattern name  |					  |		read only  |
|-----------------|					  |	output text box|
|list box of lines|					  |				   |
|-----------------|canvas for preview |				   |
|control panel for|					  |----------------|
|selected line	  |					  |download pattern|
+-----------------+-------------------+----------------+
*/

/* download button
https://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side/19332584#19332584
https://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side/17486753#17486753
https://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side/56153423#56153423

TODO:
  Add description field

*/
'use strict';

var lines = {},
    loaded = -1;

function main() {
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  let canvas = document.getElementsByTagName('canvas')[0];
  canvas.width  = canvas.offsetWidth;
  canvas.height = window.innerHeight * 0.6;
  draw();
}

function draw() {
  console.log('draw')
  let canvas = document.getElementsByTagName('canvas')[0],
      ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (const i in lines) {
    let line = lines[i];
    
    ctx.moveTo(32*i, 32*i);
    ctx.lineTo(32+32*i, 100+32*i);
  }
  ctx.stroke();
}

function add() {
  let list = document.getElementById('list'),
      option = document.createElement('option'),
      lineNodes = list.children;
  
  for(var i = 0; i < lineNodes.length; ++i)
    if(i != lineNodes[i].value) {
      option.value = i;
      break;
    }

  lines[i] = new Line();

  option.text = 'Line ' + (parseInt(option.value) + 1);
  list.insertBefore(option, lineNodes[i]);
  option.selected = true;

  load_line();
  update();
}

function del() {
  let list = document.getElementById('list'),
      lineNodes = list.children;

  for (const i in lineNodes) {
    if(lineNodes[i].selected === true && !isNaN(lineNodes[i].value)) {
      delete(lines[lineNodes[i].value]);
      list.removeChild(lineNodes[i]);
      break;
    }
  }

  load_line();
  update();
}

function load_line() {
  let lineNodes = document.getElementsByTagName('option');
  for (const i in lineNodes) {
    if(lineNodes[i].selected === true && !isNaN(lineNodes[i].value)) {
      loaded = lineNodes[i].value;
      let line = lines[loaded];
      document.getElementById('ang').value = line.ang;
      document.getElementById('x').value = line.x;
      document.getElementById('y').value = line.y;
      document.getElementById('dx').value = line.dx;
      document.getElementById('dy').value = line.dy;
      document.getElementById('dash1').value = line.dash1;
      document.getElementById('dash2').value = line.dash2;
      return
    }
  }

  document.getElementById('ang').value = 0;
  document.getElementById('x').value = 0;
  document.getElementById('y').value = 0;
  document.getElementById('dx').value = 0;
  document.getElementById('dy').value = 0;
  document.getElementById('dash1').value = 0;
  document.getElementById('dash2').value = 0;
}

function change_line() {
  let lineNodes = document.getElementsByTagName('option');

  for (const i in lineNodes) {
    if(lineNodes[i].selected === true && lineNodes[i].value === loaded) {
      let line = lines[lineNodes[i].value];
      line.ang = document.getElementById('ang').value;
      line.x = document.getElementById('x').value;
      line.y = document.getElementById('y').value;
      line.dx = document.getElementById('dx').value;
      line.dy = document.getElementById('dy').value;
      line.dash1 = document.getElementById('dash1').value;
      line.dash2 = document.getElementById('dash2').value;
      break;
    }
  }

  update();
}

function update() {
  draw()
}

function download() {
  let name = document.getElementById('name').value,
      str = document.getElementsByTagName('textarea')[0].value,
      link = document.createElement('a');
      
  link.href = 'data:x-application/xml;charset=utf-8,' + escape(str);
  if (!name.endsWith('.pat')) name += '.pat';
  link.download = name;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

class Line {
  constructor() {
    this.ang = 0;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.dash1 = 0;
    this.dash2 = 0;
  }
}

window.onload = main;