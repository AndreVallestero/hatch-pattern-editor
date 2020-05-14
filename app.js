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

const TO_RAD = Math.PI / -180;

var lines = {},
    loaded = -1,
    length = -1;

function main() {
  resize();
  window.addEventListener('resize', resize);
  let canvas = document.getElementsByTagName('canvas')[0];
  canvas.getContext('2d').translate(0.5, 0.5);
}

function resize() {
  let canvas = document.getElementsByTagName('canvas')[0];
  canvas.width  = canvas.offsetWidth;
  canvas.height = window.innerHeight * 0.6;
  length = canvas.width + canvas.height;
  draw();
}

function draw() {
  let canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  /*
  draw first line from starting position to length
  draw delta x until starting point out of screen
  draw delta y until starting point out of screen

  dashed line:
  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
  */

  const SCALE = 4;
  for(const key in lines) {
    let line = lines[key],
        x_offset = Math.cos(line.ang * TO_RAD) * length,
        y_offset = Math.sin(line.ang * TO_RAD) * length,
        x = parseFloat(line.x) * SCALE,
        y = parseFloat(line.y) * SCALE,
        dx = parseFloat(line.dx) * SCALE,
        dy = parseFloat(line.dy) * SCALE,
        dash1 = parseFloat(line.dash1) * SCALE,
        dash2 = parseFloat(line.dash2) * SCALE;

    if(dx < SCALE && dy < SCALE) break;

    for(let j = 0; j < 256; ++j) {
      let mid_x = x + dx * j,
          mid_y = y + dy * j,
          start_x = mid_x - x_offset,
          start_y = mid_y - y_offset,
          end_x = mid_x + x_offset,
          end_y = mid_y + y_offset;
          
      ctx.moveTo(start_x, start_y);
      ctx.lineTo(end_x, end_y);
    }
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

  for(const i in lineNodes) {
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