var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

var width = canvas.width;
var height = canvas.height;

var left = false;
var right = false;
var space = false;

var leftarrow = false;
var rightarrow = false;
var uparrow = false;

var p = 
{
  x: width/2,
  y: 30,
  width: 100,
  height: 25,
  speed: 5
};

var p2 = 
{
  x: width/2,
  y: height-40,
  width: 100,
  height: 25,
  speed: 5
};

var CloudSpawnChance = Math.floor(Math.random()*51)+5;
//alert(CloudSpawnChance);
var clouds = [];

var timesincelastshot = 0;
var p2timesincelastshot = 0;
var score = 0;
var p2score = 0;

var cloud = function()
{
    this.x = -1;
    this.y = 0;
    this.height = Math.floor(Math.random()*15)+5;
    this.width = Math.floor(Math.random()*30)+20;
    this.speed = 1;
    
    this.update = function()
    {
        this.x += this.speed;
        if(this.x >= width)
        {
            clouds.shift();
        }
    };
    
    this.draw = function()
    {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

var SubSpawnChance = 40;
var subs = [];
var sub = function()
{
    this.x = width;
    this.y = Math.floor(Math.random()*(height-150))+100;
    this.width = 100;
    this.height = 30;
    this.speed = -Math.floor(Math.random()*3)-1;
    
    this.update = function()
    {
      this.x += this.speed;
      if(this.x + this.width <= 0)
      {
        subs.shift();
      }
    };
    this.draw = function()
    {
      ctx.fillStyle = "grey";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

var torpedos = [];
var torpedo = function()
{
  this.id = 0;
  this.x = 1;
  this.y = 1;
  this.width = 10;
  this.height = 20;
  this.yvel = 2;
  
  this.update = function()
  {
    this.y += this.yvel;
    for(var i = 0; i < subs.length; i++)
    {
      var nsub = subs[i];
      if(this.x + this.width >= nsub.x 
        && this.y + this.height >= nsub.y
        && this.x <= nsub.x + nsub.width
        && this.y <= nsub.y + nsub.height)
      {
        subs.splice(i, 1);
        torpedos.splice(this.id, 1);
        for(var i = this.id; i < torpedos.length; i++)
        {
          torpedos[i].id -= 1;
        }
      }
    }
    
    if(this.y >= height || this.y <= -this.height)
    {
      torpedos.shift();
      for(var i = this.id; i < torpedos.length; i++)
        {
          torpedos[i].id -= 1;
        }
    }
    
    if(this.x + this.width >= p.x
    && this.y + this.height >= p.y
    && this.x <= p.x + p.width
    && this.y <= p.y + p.height)
    {
      score += 1;
      torpedos.splice(this.id, 1);
      for(var i = this.id; i < torpedos.length; i++)
        {
          torpedos[i].id -= 1;
        }
    }
    if(this.x + this.width >= p2.x
    && this.y + this.height >= p2.y
    && this.x <= p2.x + p2.width
    && this.y <= p2.y + p2.height)
    {
      p2score += 1;
      torpedos.splice(this.id, 1);
      for(var i = this.id; i < torpedos.length; i++)
        {
          torpedos[i].id -= 1;
        }
    }
  };
  this.draw = function()
  {
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
};

window.requestAnimationFrame(main);
function main()
{
    subspawn();
    cloudspawn();
    update();
    draw();
    
    timesincelastshot += 1;
    p2timesincelastshot += 1;
    window.requestAnimationFrame(main);
}

function subspawn()
{
  var rand = Math.floor(Math.random()*(SubSpawnChance+1))+1;
  if(rand == SubSpawnChance)
  {
    subs.push(new sub());
  }
}

function cloudspawn()
{
    var rand = Math.floor(Math.random()*(CloudSpawnChance+1))+1;
    if(rand == CloudSpawnChance)
    {
        clouds.push(new cloud());
    }
}

function update()
{
    for(var i = 0; i < clouds.length; i++)
    {
      clouds[i].update();
    }
    for(var i = 0; i < subs.length; i++)
    {
      subs[i].update();
    }
    for(var i = 0; i < torpedos.length; i++)
    {
      torpedos[i].update();
    }
       
    //move player 1
    if(left == true ){ p.x -= p.speed }
    if(right == true){ p.x += p.speed }
    
    //move player 2
    if(leftarrow == true){ p2.x -= p2.speed}
    if(rightarrow == true){ p2.x += p2.speed}
    
    
    //shoot
    if(space == true)
    {
      if(timesincelastshot >= 30)
      {
        timesincelastshot = 0;
        torpedos.push(new torpedo());
        torpedos[torpedos.length-1].id = torpedos.length-1;
        torpedos[torpedos.length-1].y = p.y + p.height;
        torpedos[torpedos.length-1].x = p.x + p.width/2; 
      }
    }
    
    if(uparrow == true)
    {
      if(p2timesincelastshot >= 30)
      {
        p2timesincelastshot = 0;
        torpedos.push(new torpedo());
        torpedos[torpedos.length-1].id = torpedos.length-1;
        torpedos[torpedos.length-1].yvel *= -1;
        torpedos[torpedos.length-1].y = p2.y - torpedos[torpedos.length-1].height;
        torpedos[torpedos.length-1].x = p2.x + p2.width/2;
      }
      
    }
    
    //offscreen player
    p.x = p.x<=0? 0:p.x;
    p.x = p.x+p.width>=width? width-p.width:p.x;
    p2.x = p2.x<=0? 0:p2.x;
    p2.x = p2.x+p2.width>=width? width-p2.width:p2.x;
}

function draw()
{
    //clear
    ctx.clearRect(0,0,width,height);
    
    //sky
    ctx.fillStyle = "#aaaaff";
    ctx.fillRect(0,0,width,p.y+p.height-5);
    
    //sand
    ctx.fillStyle = "#cccc44";
    ctx.fillRect(0,height-20,width,height);
    
    //clouds
    for(var i = 0; i < clouds.length; i++)
    {
      clouds[i].draw();
    }
    
    //subs
    for(var i = 0; i < subs.length; i++)
    {
      subs[i].draw();
    }
    
    //torpedos
    for(var i = 0; i < torpedos.length; i++)
    {
      torpedos[i].draw();
    }
    
    //players
    ctx.fillStyle = "#999999";
    ctx.fillRect(p.x, p.y, p.width, p.height);
    
    ctx.fillStyle = "#999999";
    ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
    
    //score
    ctx.fillStyle = "red";
    ctx.font = "30px Courier New";
    ctx.fillText(score, width-50, height, 50);
    ctx.fillText(p2score, width-50, 50, 50);
}

document.addEventListener("keydown",keyPressed);
document.addEventListener("keyup",keyun);
function keyPressed(key)
{
  if(key.keyCode == 65)
  {
    left = true;
  }
  if(key.keyCode == 68)
  {
    right = true;
  }
  if(key.keyCode == 32)
  {
    space = true;
  }
  if(key.keyCode == 37)
  {
    leftarrow = true;
  }
  if(key.keyCode == 39)
  {
    rightarrow = true;
  }
  if(key.keyCode == 38)
  {
    uparrow = true;
  }
}
function keyun(key)
{
  if(key.keyCode == 65)
  {
    left = false;
  }
  if(key.keyCode == 68)
  {
    right = false;
  }
  if(key.keyCode == 32)
  {
    space = false;
  }
  if(key.keyCode == 37)
  {
    leftarrow = false;
  }
  if(key.keyCode == 39)
  {
    rightarrow = false;
  }
  if(key.keyCode == 38)
  {
    uparrow = false;
  }
}