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

const TO_RAD = Math.PI / -180,
      SCALE = 4,
      LENGTH = 4096;

var lines = {},
    loaded = -1;

function main() {
  window.addEventListener('resize', resize);
  let canvas = document.getElementsByTagName('canvas')[0];
  
  resize();
}

function resize() {
  let canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  draw();
}

function draw() {
  let canvas = document.getElementsByTagName('canvas')[0],
      ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  for(const key in lines) {
    let line = lines[key],
        x_offset = Math.cos(line.ang * TO_RAD) * LENGTH,
        y_offset = Math.sin(line.ang * TO_RAD) * LENGTH,
        x = parseFloat(line.x) * SCALE,
        y = parseFloat(line.y) * SCALE,
        dx = parseFloat(line.dx) * SCALE,
        dy = parseFloat(line.dy) * SCALE,
        dash1 = parseFloat(line.dash1) * SCALE,
        dash2 = parseFloat(line.dash2) * SCALE;
        //dashed line: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash

    if(dx == 0 && dy == 0) continue;
    for(let j = -LENGTH / 2; j < LENGTH / 2; ++j) {
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
      line_nodes = list.children;
  
  for(var i = 0; i < line_nodes.length; ++i)
    if(i != line_nodes[i].value) {
      option.value = i;
      break;
    }

  lines[i] = new Line();

  option.text = 'Line ' + (parseInt(option.value) + 1);
  list.insertBefore(option, line_nodes[i]);
  option.selected = true;

  load_line();
  update();
}

function del() {
  let list = document.getElementById('list'),
      line_nodes = list.children;

  for(const i in line_nodes) {
    if(line_nodes[i].selected === true && !isNaN(line_nodes[i].value)) {
      delete(lines[line_nodes[i].value]);
      list.removeChild(line_nodes[i]);
      break;
    }
  }

  load_line();
  update();
}

function load_line() {
  let line_nodes = document.getElementsByTagName('option');
  for (const i in line_nodes) {
    if(line_nodes[i].selected === true && !isNaN(line_nodes[i].value)) {
      loaded = line_nodes[i].value;
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
  let line_nodes = document.getElementsByTagName('option');

  for (const i in line_nodes) {
    if(line_nodes[i].selected === true && line_nodes[i].value === loaded) {
      let line = lines[line_nodes[i].value];
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