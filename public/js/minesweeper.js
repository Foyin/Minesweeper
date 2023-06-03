const canvas = document.getElementById('myCanvas');
let ctx;
let mineImg;
let flagImg;
let mineHitImg;
let timeValue;
let tiles;
let cols;
let rows;
let scale;
let xpos;
let ypos;
let numBombs = 9;
let timer = window.setInterval(onTimerTick, 1000);
let numFlags;
let minesLeft;

//Maybe useful later
//let bomb = Math.random() < 0.081;

function ellipse(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function setDifficulty(callback) {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;
    const EASY = {
      cols: 4,
      rows: 4,
      numBombs: 6,
    }
    const NORMAL = {
      cols: 8,
      rows: 8,
      numBombs: 25,
    }
    const HARD = {
      cols: 16,
      rows: 16,
      numBombs: 40,
    }
    switch(difficulty) {
      case 0:
        cols = EASY.cols
        rows = EASY.rows
        numBombs = EASY.numBombs
        scale = 40
        break;
      case 1:
        cols = NORMAL.cols
        rows = NORMAL.rows
        numBombs = NORMAL.numBombs
        scale = 40
        break;
      case 2:
        cols = HARD.cols
        rows = HARD.rows
        numBombs = HARD.numBombs
        scale = 40
        break;
      default:
        cols = EASY.cols
        rows = EASY.rows
        numBombs = EASY.numBombs
        scale = 40
        // code block
    }
    startTimer();
    callback();
}

function gameSetup(){
  numFlags = 0;
  document.getElementById("flagCount").innerHTML = numBombs;
  document.getElementById("lose").style.visibility = "hidden";
  document.getElementById("win").style.visibility = "hidden";

  ctx = canvas.getContext('2d');

  mineImg = new Image();
  flagImg = new Image();
  flagImg.src = "images/flagRed.png"; 
  mineHitImg = new Image();
  mineHitImg.src = "images/mine_hit.png";


  //colorMode(RGB);
  //gridSet()
  ctx.canvas.width  = cols * scale;
  ctx.canvas.height = rows * scale;
  //createCanvas(cols * scale, rows * scale);
  tiles = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      tiles[i][j] = new tile(i, j);
    }
  }


  // Pick total Bomb spots
  var options = [];
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      options.push([i, j]);
    }
  }


  for (var n = 0; n < numBombs; n++) {
    var index = Math.floor(Math.random() * options.length);
    var choice = options[index];
    var i = choice[0];
    var j = choice[1];
    // Deletes that spot so it's no longer an option
    options.splice(index, 1);
    tiles[i][j].isBomb = true;
  }


  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      tiles[i][j].countBombs();
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      tiles[i][j].show(); 
      if(tiles[i][j].flagged && !tiles[i][j].isOpen){
        //ctx.fillStyle = "rgba(255, 0, 0)"
        //ellipse(tiles[i][j].x + tiles[i][j].w * 0.5, tiles[i][j].y + tiles[i][j].w * 0.5, tiles[i][j].w * 0.5);  
      }  
    }
  }
}

function startTimer() { 
    timeValue = 0;   
    window.clearInterval(timer);
    timer = window.setInterval(onTimerTick, 1000);
}

function stopTimer(){
  window.clearInterval(timer);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
    document.getElementById("win").style.visibility = "hidden";
    document.getElementById("myCanvas").style.visibility = "visible";
    setDifficulty(gameSetup);
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    document.getElementById("win").style.visibility = "hidden";
    smiley.classList.remove("face_down");
    smiley.classList.remove("face_limbo");
    smiley.classList.remove("face_win");
    smiley.classList.remove("face_lose");
}

function smileyWin() {
    var smiley = document.getElementById("smiley");
    document.getElementById("win").style.visibility = "visible";
    document.getElementById("myCanvas").style.visibility = "hidden";
    smiley.classList.add("face_win");   
}

function smileyLose() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_lose");   
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


//TODO: Lcheck here for redundancy
window.addEventListener('mouseup', draw);
function draw(e){
  //moveControl();
  var mouse = getMousePos(canvas, e);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      
      tiles[i][j].show(); 
      if(tiles[i][j].flagged && !tiles[i][j].isOpen){
        //ctx.fillStyle = "rgba(255, 0, 0)"
        //ellipse(tiles[i][j].x + tiles[i][j].w * 0.5, tiles[i][j].y + tiles[i][j].w * 0.5, tiles[i][j].w * 0.5); 
        ctx.drawImage(flagImg, 
          tiles[i][j].x,
          tiles[i][j].y,
          tiles[i][j].w, 
          tiles[i][j].h);
      }  
    }
  }
}


window.addEventListener("mousedown", buttonControl);
function buttonControl(e) {
  var mouse = getMousePos(canvas, e);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
        //check right
        if (e.button === 1 && tiles[i][j].inside(mouse) ) {
          if (tiles[i][j].flagged) {
            tiles[i][j].flagged = false;
            numFlags--;
            //console.log(numFlags);
            ctx.fillStyle = "rgba(255, 255, 255)";
            ctx.fillRect(tiles[i][j].x, tiles[i][j].y, tiles[i][j].w, tiles[i][j].w);
            break;
          } 
          numFlags++;
          
          if (tiles[i][j].isBomb){
              minesLeft = (numBombs - numFlags);
              document.getElementById("flagCount").innerHTML = minesLeft;
          }

          tiles[i][j].flagged = true;
        }
        //check left
        else if (e.button === 0) {
          if (tiles[i][j].inside(mouse)) {
            if (tiles[i][j].flagged) {
              //tiles[i][j].flagged = false;
              break;
            }
            tiles[i][j].openTile();
            if (tiles[i][j].isBomb) {
              gameOver();
              ctx.drawImage(mineHitImg, tiles[i][j].x , tiles[i][j].y, tiles[i][j].w, tiles[i][j].h);
              break;
            }else{
              break;
            }
            youWin();
          }
        }          
    }
  }
}

window.addEventListener("mousemove", moveControl);
function moveControl(e) {
    var mouse = getMousePos(canvas, e);
    var timeOut;
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_limbo");
    clearTimeout(timeOut);
    timeOut = setTimeout(function(){
                        smiley.classList.remove("face_limbo");
                        }, 2000);
}

function gameOver() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      tiles[i][j].isOpen = true;         
    }
  }
  stopTimer();
  document.getElementById("lose").style.visibility = "visible";
  smileyLose();
}

function youWin() {
  //noLoop();
  winCount = 0;
  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (tiles[i][j].isOpen && !tiles[i][j].isBomb) {
                  winCount++;
                  if (winCount === ((cols * rows) - numBombs)) {
                    stopTimer();
                    smileyWin();
                  }  
        }
      }
    }
}

function tile(i, j) {
  this.i = i;
  this.j = j;
  this.w = 40;
  this.h = 40;
  this.x = i * this.w;
  this.y = j * this.w;
  this.numNeighbour = 0;
  this.flagged = false;
  this.isBomb = false;
  this.isOpen = false;

  this.show = function() {
    mineImg.src = "images/mine.png"; 
    
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "rgba(127, 127, 127)";
    ctx.fill();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "white";
    ctx.stroke();

    if (this.isOpen) {
      if (this.isBomb) {
          ctx.drawImage(mineImg, this.x , this.y, this.w, this.h);
      } else {
        ctx.beginPath();
        ctx.fillStyle = "rgba(200, 200, 200)";
        ctx.fillRect(this.x, this.y, this.w, this.w);
        if (this.numNeighbour > 0) {
          ctx.textAlign = "center";
          ctx.font = "30px Arial";
          switch(this.numNeighbour) {
            case 1:
              ctx.fillStyle = "rgba(0, 0, 180)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 2:
              ctx.fillStyle = "rgba(0, 120, 0)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 3:
              ctx.fillStyle = "rgba(255, 0, 0)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 4:
              ctx.fillStyle = "rgba(0, 0, 255)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 5:
              ctx.fillStyle = "rgba(170, 0, 0)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 6:
              ctx.fillStyle = "rgba(100, 0, 0)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 7:
              ctx.fillStyle = "rgba(0, 0, 0)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            case 8:
              ctx.fillStyle = "rgba(170, 80, 20)";
              ctx.fillText(this.numNeighbour, this.x + this.w * 0.5, this.y + this.w - 6);
              break;
            default:
               // code block
          }
        }
      }
    }
  }

  this.inside = function(mouse) {
    if (mouse.x > this.x && mouse.x < this.x + this.w && mouse.y > this.y && mouse.y < this.y + this.h) {
      return true;
    } else {
      return false;
    }
  }

  this.openTile = function() {
    this.isOpen = true;
    if (this.numNeighbour == 0) {
      // flood fill time
      this.floodFill();
    }
  }

  this.floodFill = function() {
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
      var i = this.i + xOffset;
      if (i < 0 || i >= cols) continue;

      for (var yOffset = -1; yOffset <= 1; yOffset++) {
        var j = this.j + yOffset;
        if (j < 0 || j >= rows) continue;

        var neighbor = tiles[i][j];
        // Note the neighbor.bee check was not required.
        // See issue #184
        if (!neighbor.isOpen) {
          neighbor.openTile();
        }
      }
    }
  }

  this.countBombs = function() {
    if (this.isBomb) {
      this.numNeighbour = -1;
      return;
    }
    var total = 0;
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
      var i = this.i + xOffset;
      if (i < 0 || i >= cols) continue;

      for (var yOffset = -1; yOffset <= 1; yOffset++) {
        var j = this.j + yOffset;
        if (j < 0 || j >= rows) continue;

        var neighbor = tiles[i][j];
        if (neighbor.isBomb) {
          total++;
        }
      }
    }
    this.numNeighbour = total;
  }
}
