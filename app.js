'use strict';

var lines = {},
    loaded = -1;

function main() {
  //*AR-BRELM, Standard brick elevation english bond with mortar joints
  lines[0] = new Line(0,0,0,0,5.334,[7.625,-.375,0,0,0,0]);
  lines[1] = new Line(0,0,2.25, 0,5.334,[7.625,-.375,0,0,0,0]);
  lines[2] = new Line(0,2,2.667,0,5.334,[3.625,-.375,0,0,0,0]);
  lines[3] = new Line(0,2,4.917,0,5.334,[3.625,-.375,0,0,0,0]);
  lines[4] = new Line(90,0,0,0,8,[2.25,-3.084,0,0,0,0]);
  lines[5] = new Line(90,-0.375,0,0,8,[2.25,-3.084,0,0,0,0]);
  lines[6] = new Line(90,2,2.667,0,4,[2.25,-3.084,0,0,0,0]);
  lines[7] = new Line(90,1.625,2.667,0,4,[2.25,-3.084,0,0,0,0]);
  
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  let canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  draw();
}

function draw() {
  const TO_RAD = Math.PI / -180,
        LENGTH = 2048,
        ROWS = Math.round(LENGTH / 8);

  let canvas = document.getElementsByTagName('canvas')[0],
      ctx = canvas.getContext('2d'),
      scale = parseFloat(document.getElementById('scale').value);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for(const key in lines) {
    let line = lines[key],
        cos = Math.cos(line.ang * TO_RAD),
        sin = Math.sin(line.ang * TO_RAD),
        x_offset = cos * LENGTH,
        y_offset = sin * LENGTH,
        x = line.x * scale,
        y = line.y * -scale,
        dx = (line.dx*cos + line.dy*sin) * scale,
        dy = (line.dx*sin + line.dy*cos) * -scale;
      
    if(dx == 0 && dy == 0) continue;
    
    ctx.beginPath();
    ctx.setLineDash(gen_cdashes(line.dashes, scale));
    for(let i = -ROWS; i < ROWS; ++i) {
      let mid_x = x + dx * i,
          mid_y = y + dy * i,
          end_x = mid_x + x_offset,
          end_y = mid_y + y_offset;
      ctx.moveTo(mid_x, mid_y);
      ctx.lineTo(end_x, end_y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash(gen_cdashes(line.dashes.slice().reverse(), scale));
    for(let i = -ROWS; i < ROWS; ++i) {
      let mid_x = x + dx * i,
          mid_y = y + dy * i,
          end_x = mid_x - x_offset,
          end_y = mid_y - y_offset;
      ctx.moveTo(mid_x, mid_y);
      ctx.lineTo(end_x, end_y);
    }
    ctx.stroke();
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
function gen_cdashes(dashes, scale) {
  let cdashes = [];
  for(let i = 0; i < dashes.length; ++i) {
    if(dashes[i] == 0)
      continue;
    else if((dashes[i] < 0 && cdashes.length%2 == 0) || (dashes[i] > 0 && cdashes.length%2 == 1))
      cdashes.push(0);

    if (dashes[i] > 0)
      cdashes.push(dashes[i] * scale);
    else
      cdashes.push(dashes[i] * -scale);
  }
  if(cdashes.length%2 == 1) cdashes.push(0);
  return cdashes;
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

  for(const line_node of line_nodes) {
    if(line_node.selected === true && !isNaN(line_node.value)) {
      delete(lines[line_node.value]);
      list.removeChild(line_node);
      break;
    }
  }

  load_line();
  update();
}

function load_line() {
  for (const line_node of document.getElementsByTagName('option')) {
    if(line_node.selected === true && !isNaN(line_node.value)) {
      loaded = line_node.value;
      let line = lines[loaded];
      document.getElementById('ang').value = line.ang;
      document.getElementById('x').value = line.x;
      document.getElementById('y').value = line.y;
      document.getElementById('dx').value = line.dx;
      document.getElementById('dy').value = line.dy;
      for(let j = 1; j < 7; ++j)
        document.getElementById('dash'+j).value = line.dashes[j-1];
      return
    }
  }

  document.getElementById('ang').value = 0;
  document.getElementById('x').value = 0;
  document.getElementById('y').value = 0;
  document.getElementById('dx').value = 0;
  document.getElementById('dy').value = 0;
  for(let i = 1; i < 7; ++i)
    document.getElementById('dash'+i).value = 0;
}

function change_line() {
  let line_nodes = document.getElementsByTagName('option');

  for (const line_node of line_nodes) {
    if(line_node.selected === true && line_node.value === loaded) {
      let line = lines[line_node.value];
      line.ang = parseFloat(document.getElementById('ang').value);
      line.x = parseFloat(document.getElementById('x').value);
      line.y = parseFloat(document.getElementById('y').value);
      line.dx = parseFloat(document.getElementById('dx').value);
      line.dy = parseFloat(document.getElementById('dy').value);
      for(let j = 1; j < 7; ++j)
        line.dashes[j-1] = parseFloat(document.getElementById('dash'+j).value);
      break;
    }
  }

  update();
}

function update() {
  draw();
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
  constructor(ang=0, x=0, y=0, dx=0, dy=0, dashes=(new Array(6).fill(0))) {
    this.ang = ang;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.dashes = dashes;
  }
}

window.onload = main;