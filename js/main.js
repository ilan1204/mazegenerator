// maze generator v0.01
const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');

let lightchk = $("input:radio[name='light']").prop("checked");
let sliderInt = 1;
let glowsize = 5;
let glowClr;
let lineClr = 'rgba(0,0,0,0.5)';
let stack, grid;
let w, raw, col;
let current;
let interval;
let linewidth;
let drawglow = false;

/* Cell Class */
class cell {
  constructor(index, w_top, w_right, w_bottom, w_left, visited, left, top, right, bottom) {
    this.index = index;
    this.wall_top = w_top;
    this.wall_right = w_right;
    this.wall_bottom = w_bottom;
    this.wall_left = w_left;
    this.visited = visited;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }
}

/* Create Maze without animation */
function createMaze(cellwidth) {
  mazeInit(cellwidth);

  /* Start a loop and look for unvisited Neighbors until Stack Array is empty */
  do {
    move_current();
  } while (stack.length > 0);

  stopTimer(); /* Clears the Timer if it is active */
  clearCanvas(); /* Clears the Canvas */
  drawcells(); /* Draw all cells Objects */
}

/* Init Maze */
function mazeInit(cellwidth) {
  w = cellwidth; /* Set the cellwidth */
  raw = Math.floor(canvas.width / w);
  col = Math.floor(canvas.height / w);
  stack = []; /* Set as empty Array */
  grid = []; /* Set as empty Array */
  createcells(); /* Create all Cells Objects */
  current = grid[0]; /* Set the current cell opbject as the first item in the Grid Array */
  current.visited = true; /* Set currect cell to visited */
  stack.push(current); /* Add current to the Stack Array */
}

/* Create all cell Objects in the Canvas */
function createcells() {
  let i = 0;
  for (let y = 0; y < raw; y++) {
    for (let x = 0; x < col; x++) {
      let mycell = new cell(i, false, false, false, false, false, x * w, y * w, (x * w) + w, (y * w) + w);
      grid.push(mycell);
      i++;
    }
  }
}

/* Start moving current Cell */
function move_current() {
  let left = current.index - 1;
  let right = current.index + 1;
  let top = current.index - col;
  let bottom = current.index + col;

  let rnd_l = [];

  /* Check Neighbor Cell if is a valid index, if true add it to the random list */
  if (left > 0 && left < grid.length && ((left + 1) % col) > 0) {
    let mycell = grid[left];
    if (!mycell.visited) {
      rnd_l.push(left)
    }
  }
  if (right > 0 && right < grid.length && (right % col) > 0) {
    let mycell = grid[right];
    if (!mycell.visited) {
      rnd_l.push(right)
    }
  }
  if (top > 0 && top < grid.length) {
    let mycell = grid[top];
    if (!mycell.visited) {
      rnd_l.push(top)
    }
  }
  if (bottom > 0 && bottom < grid.length) {
    let mycell = grid[bottom];
    if (!mycell.visited) {
      rnd_l.push(bottom)
    }
  }

  /* No unvisited Neighbors available so go back 1 cell */
  if (rnd_l.length === 0) {
    if (stack.length > 0) {
      current = stack[stack.length - 1];
      stack.pop();
    } else {
      stopTimer();
    }
    return; //Exit function
  }

  /* Get a random Cell Neighbor from the random list and Update his Walls */
  let rnd_cell = Math.floor(Math.random() * rnd_l.length);
  let mycell = grid[rnd_l[rnd_cell]];

  if ((mycell.index - current.index) === 1) {
    mycell.wall_left = true;
    current.wall_right = true;
  } else if (mycell.index - current.index === -1) {
    mycell.wall_right = true;
    current.wall_left = true;
  } else if (mycell.index - current.index > 0) {
    mycell.wall_top = true;
    current.wall_bottom = true;
  } else if (mycell.index - current.index < 0) {
    mycell.wall_bottom = true;
    current.wall_top = true;
  }

  /* Update the Current Cell and Push it to the Arrays */
  current = mycell;
  current.visited = true;
  stack.push(current);
}

/* Clear the Canvas */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Draw all Cells */
function drawcells() {
  ctx.beginPath();

  for (let i = 0; i < grid.length; i++) {
    let mycell = grid[i];

    if (!mycell.wall_top) {
      drawLine(mycell.left, mycell.top, mycell.right, mycell.top);
    }
    if (!mycell.wall_right) {
      drawLine(mycell.right, mycell.top, mycell.right, mycell.bottom);
    }
    if (!mycell.wall_bottom) {
      drawLine(mycell.right, mycell.bottom, mycell.left, mycell.bottom);
    }
    if (!mycell.wall_left) {
      drawLine(mycell.left, mycell.bottom, mycell.left, mycell.top);
    }
  }

  ctx.strokeStyle = lineClr;
  ctx.lineWidth = sliderInt;

  /* Check if Glow Effect is enabled */
  if (drawglow) {
    ctx.shadowBlur = glowsize; /* Glow-Effect blur size */
    ctx.shadowColor = glowClr; /* Glow-Effect color */
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.stroke();
}

/* Draw line function */
function drawLine(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

/* Draw Current Cell [ONLY AVAILABLE IN MAZE DRAWING WITH ANIMATION] */
function draw_current() {
  ctx.fillStyle = 'rgba(160,32,240,0.4)';
  ctx.fillRect(current.left, current.top, w, w);
}

/* ### CONTROLS SECTION ### */
/* Update the maze style from light to dark */
function updateMazeStyle(isLight) {
  clearCanvas(); /* Clear the Canvas first */
  if (isLight) {
    lineClr = 'rgba(0,0,0,0.5)';
  } else {
    lineClr = 'rgba(255,255,255,0.5)';
  }
  drawcells(); /* Redraw the cells */
}

/* Update the lineWidth by the slider element */
function updateLineWidth(size) {
  clearCanvas(); /* Clear the Canvas first */
  sliderInt = size;
  drawcells(); /* Redraw the cells */
}

/* Update the isglow boolean*/
function updateGlowStatus(isglow, color) {
  clearCanvas(); /* Clear the Canvas first */
  drawglow = isglow;
  glowClr = color;
  drawcells(); /* Redraw the cells */
}

/* Update the glow shadow size by the slider element */
function updateGlowSize(size) {
  glowsize = size;
  if (drawglow) {
    clearCanvas(); /* Clear the Canvas first */
    drawcells(); /* Redraw the cells */
  }
}
/* ### CONTROLS SECTION ### */

/* Create the Maze with an Animation */
function createMazeAnimated(cellwidth) {
  mazeInit(cellwidth);
  stopTimer();
  interval = setInterval(timer_tick, 20);
}

/* Stop Timer */
function stopTimer() {
  clearInterval(interval);
}

/* Set Timer Tick Event */
function timer_tick() {
  clearCanvas();
  if (stack.length > 0) {
    draw_current();
  }
  drawcells();
  move_current();
}

/* Print function */
function printMaze(cnvID) {
  const dataUrl = document.getElementById(cnvID).toDataURL();

  let windowContent = '<!DOCTYPE html>';
  windowContent += '<html>';
  windowContent += '<head><title>Print canvas</title></head>';
  windowContent += '<body>';
  windowContent += '<img src="' + dataUrl + ' "style="max-height: 100%;max-width: 100%;width: 95%;height: auto;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">';
  windowContent += '</body>';
  windowContent += '</html>';

  const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
  printWin.document.open();
  printWin.document.write(windowContent);

  printWin.document.addEventListener('load', function() {
    printWin.focus();
    printWin.print();
    printWin.document.close();
    printWin.close();
  }, true);
}
