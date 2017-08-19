function createSnake(snake){
  //生成蛇头和蛇身的一个节点
  var snakeHead = {
    x: 10,
    y: 10,
    direction: 1//direction取0,1,2,3 分别代表上右下左
  }
  var snakeBodyItem = {
    x: 9,
    y: 10,
    direction: 1
  }
  snake.push(snakeHead, snakeBodyItem);
  console.log(snake);
}

function gameInit(cxt, snake, foods){
  //初始化画布, 将画布看做25个单元*25个单元，每个单元的长宽都是20px
  cxt.fillStyle="black";
  cxt.fillRect(0,0,500,500);
  //界面上画蛇
  cxt.fillStyle = "white";
  //初始化蛇的位置
  createSnake(snake);
  
  for(let i = 0;i < snake.length;i++){
    let x = snake[i].x*20;
    let y = snake[i].y*20;
    // cxt.beginPath();
    cxt.fillRect(x,y,20,20);
  }

  //初始化第一个食物
  randomFood(cxt, foods);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function timer(cxt, snake, foods){
  //判断此时游戏的可执行状态,flag为false表示处于暂停中，flag为true表示可以开始
  while(!flag){
    console.log('Hello')
    await sleep(1000)
    console.log('world!')
  }

  var oldDirection = snake[0].direction;
  var oldX = snake[0].x;
  var oldY = snake[0].y;
  var newX;
  var newY; 
  //如果获取的按键方向与蛇头当前方向相同或相反，则不作任何处理,否则的话更新蛇头方向
  if(newDirection === undefined || oldDirection === newDirection || (oldDirection + newDirection === 3)){
    newDirection = oldDirection;
  }

  switch(newDirection){
    case 0:newX = oldX;newY = oldY - 1;break;
    case 1:newX = oldX + 1;newY = oldY;break;
    case 2:newX = oldX - 1;newY = oldY;break;
    case 3:newX = oldX;newY = oldY+1;break;
  }
  //获取蛇头新单元坐标
  var newHead = {
    x: newX,
    y: newY,
    direction: newDirection
  }
  console.log(newHead.x, newHead.y)
  snake.unshift(newHead);
  //绘制新蛇头
  // cxt.strokeStyle = "white";
  // cxt.beginPath();
  // cxt.strokeRect(newHead.x*20,newHead.y*20,20,20);
  cxt.fillStyle = "white";
  cxt.fillRect(newHead.x*20,newHead.y*20,20,20);
  //抹除蛇尾
  var length = snake.length;
  console.log("蛇尾坐标:", snake[length-1].x, snake[length-1].y);

  cxt.fillStyle = "black";
  // cxt.strokeStyle = "black";
  cxt.fillRect(snake[length-1].x*20, snake[length-1].y*20, 20, 20);
  // cxt.strokeStyle = "rgba(0,0,0,1)";
  // cxt.beginPath();
  // cxt.strokeRect(snake[length-1].x*20, snake[length-1].y*20, 20, 20);
  snake.splice(length-1,1);

  //检查蛇头位置
  checkBorderAndFoods(cxt, snake, foods);
  setTimeout(function(){
    timer(cxt, snake, foods);
  }, speed);
}

//开始游戏
function gameRun(cxt, snake, foods){



  // var newDirection;
  // var newX;
  // var newY; 
  //每一帧中处理两件事。1: 头部朝指定方向移动;2: 删除尾部元素(画面中将其隐藏)
  //先判断键盘事件，WASD代表上下左右
  document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==87){ // 按 W 上
        //要做的事情
        newDirection = 0;
        
      }
    if(e && e.keyCode==68){ // 按 D 右
         //要做的事情
         newDirection = 1;
         
       }            
    if(e && e.keyCode==83){ // 按 S 下
         //要做的事情
         newDirection = 3;
         
    }
    if(e && e.keyCode==65){ // 按 A 左
         //要做的事情
         newDirection = 2;
    }
    console.log("新direction为:",newDirection);
  }; 
  
  timer(cxt, snake, foods);
}

function randomFood(cxt, foods){
  //随机生成符合地图范围(25*25)的食物，分为3种，普通(0,身体加1，蓝色)，加速(1,黄色)，毒药(2,身体减半，绿色)
  
  //控制屏幕中食物数量在8个以内
  if(foods.length < 8){
    var x = Math.floor(Math.random()*25);
    var y = Math.floor(Math.random()*25);
    var type = Math.floor(Math.random()*3);

    //判断食物数组中是否有位置相同项，有的话重新生成，直到生成不相同的项
    var length = foods.length;
    var foodFlag = false;
    while(!foodFlag){
      for(var i = 0;i < length;i++){
        if(foods[i].x === x && foods[i].y === y){
          foodFlag = true;
          break;
        }
      }
      if(!foodFlag){
        foods.push({x: x,y: y,type: type});
        break;
      }else{
        x = Math.floor(Math.random()*25);
        y = Math.floor(Math.random()*25);
        type = Math.floor(Math.random()*3);
        foodFlag = false;
      }
    }
    
    var style;
    //地图上画食物
    switch(type){
      case 0: style = "blue";break;
      case 1: style = "yellow";break;
      case 2: style = "green";break;
    }  
    cxt.fillStyle = style;
    cxt.fillRect(x*20,y*20, 20,20);
  }
  
}

function checkBorderAndFoods(cxt, snake, foods){
  var snakeLength = snake.length;
  var snakeHead = snake[0];
  var headX = snakeHead.x;
  var headY = snakeHead.y;
  var snakeTail = snake[snakeLength-1];
  var tailX = snakeTail.x;
  var tailY = snakeTail.y;
  var foodLength = foods.length;
  
  var type;//吃掉的食物类型
  
  //先判断边界，当蛇头 位于x<0 或x > 24，y<0 或 y>24算出界
  console.log("蛇头坐标:",snakeHead.x,snakeHead.y);
  if(headX < 0 || headX > 24 || headY < 0 || headY > 24){
    gameOver();
  }
  //再判断头部是否碰到身体
  for(var i = 4;i < snakeLength;i++){//身长至少为5，头部才能碰到自己的身体
    if(headX === snake[i].x && headY === snake[i].y){
      gameOver();
    }
  }


  //再检查食物,判断当前蛇头是否吃掉了食物
  for(var i = 0;i < foodLength;i++){
    if(foods[i].x === headX && foods[i].y === headY){
      type = foods[i].type;
      //吃掉食物后，食物从食物数组删除
      foods.splice(i,1);
      break;
    } 
  }

  //如果吃掉食物的话，根据食物状态决定蛇的变化
  if(type !== undefined){
    if(type === 0){//蓝色，尾部加长一格
      let tailDirection = snakeTail.direction;
      let newTail = {direction: tailDirection};
      switch(tailDirection){
        case 0:newTail.x = snakeTail.x;newTail.y = snakeTail.y+1;break;
        case 1:newTail.x = snakeTail.x-1;newTail.y = snakeTail.y;break;
        case 2:newTail.x = snakeTail.x+1;newTail.y = snakeTail.y;break;
        case 3:newTail.x = snakeTail.x;newTail.y = snakeTail.y-1;break;
      }
      snake.push(newTail);
      //绘制新的尾部一格
      cxt.fillStyle = "white";
      cxt.fillRect(newTail.x*20,newTail.y*20, 20, 20);
      score++;//分数加1，并更新对应视图
      console.log("分数加1为", score);
      scoreVal.innerHTML = score;
    }
    if(type === 1){//黄色加速，假设每吃一个快200ms，速度最小为200
      if(speed > 200){
        speed -= 200;
      }
    }
    if(type === 2){//绿色毒药，吃了之后断掉一半，即舍弃从数组1/2处至尾部的元素
      cxt.fillStyle = "black";
      let leftLength = Math.floor(snakeLength/2);
      //当除2后剩下的长度大于2等于时
      if(leftLength >= 2){
        for(let i = leftLength;i < snakeLength;i++){
          cxt.fillRect(snake[i].x*20, snake[i].y*20, 20, 20);
        }
        score = Math.floor((score+2)/2) - 2;
        console.log("分数减半为:", score);
        scoreVal.innerHTML = score;
        snake.splice(leftLength, snakeLength - leftLength);
      }else{//此时蛇长度为2或3
        if(snakeLength > 2){//为3的话
          cxt.fillRect(snakeTail.x*20, snakeTail.y*20, 20, 20);
          snake.splice(2,1);
        }
        //默认蛇身长最少为2，所以长为2的蛇吃毒药不做处理
        score = 0;
        scoreVal.innerHTML = score;
        console.log("分数减为0")
      }
    }

    //再生成随机个新食物, 食物数在1~3中随机
    var foodNum = Math.random()*3 + 1;
    for(var j = 0;j < foodNum;j++){
      randomFood(cxt, foods);
    }
  }
}

function gameOver(){//游戏结束
  alert("Game Over");
  window.location.reload();
}

var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
//蛇身体数组
var snake = [];
//食物数组
var foods = [];
//速度
var speed = 1000;//默认1000ms
//蛇头当前方向
var newDirection;
//分数
var score = 0;

var flag = false;//游戏
//获取按钮对象
var startButton = document.getElementById("start");
var stopButton = document.getElementById("pause");
//获取score对象
var scoreVal = document.getElementById("scoreVal");
scoreVal.innerHTML = 0;

startButton.addEventListener("click", function(){
  flag = true;
})

stopButton.addEventListener("click", function(){
  flag = false;
})

gameInit(cxt, snake, foods);

gameRun(cxt, snake, foods);
