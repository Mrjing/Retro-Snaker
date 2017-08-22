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

function createAI(AISnake){
  var AIHead = {
    x: 5,
    y: 5,
    direction: 1//direction取0,1,2,3 分别代表上右下左
  }
  var AIBodyItem = {
    x: 4,
    y: 5,
    direction: 1
  }
  AISnake.push(AIHead, AIBodyItem); 
}

function drawSnake(cxt, snake, snakeType){
  //界面上画蛇

  if(snakeType === 0){
    //初始化蛇的位置
    createSnake(snake);
  }else{
    createAI(snake);
  }
  for(let i = 0;i < snake.length;i++){
    if(i === 0){
      cxt.fillStyle = "red";
    }else{
      cxt.fillStyle = "white";
    }
    let x = snake[i].x*20;
    let y = snake[i].y*20;
    // cxt.beginPath();
    cxt.fillRect(x,y,20,20);
  }
}

function gameInit(cxt, snake, AISnake, foods){
  //初始化画布, 将画布看做25个单元*25个单元，每个单元的长宽都是20px
  cxt.fillStyle="black";
  cxt.fillRect(0,0,500,500);
  //界面上画蛇
  // cxt.fillStyle = "white";
  // //初始化蛇的位置
  // createSnake(snake);
  
  // for(let i = 0;i < snake.length;i++){
  //   let x = snake[i].x*20;
  //   let y = snake[i].y*20;
  //   // cxt.beginPath();
  //   cxt.fillRect(x,y,20,20);
  // }
  drawSnake(cxt, snake, 0);
  drawSnake(cxt, AISnake, 1);

  //初始化第一个食物
  randomFood(cxt, foods);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function timer(cxt, snake, AISnake, foods){
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
  cxt.fillStyle = "red";
  cxt.fillRect(newHead.x*20,newHead.y*20,20,20);
  //绘制蛇颈
  cxt.fillStyle = "white";
  cxt.fillRect(oldX*20,oldY*20,20,20);

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
  checkBorderAndFoods(cxt, snake, AISnake, foods);
  setTimeout(function(){
    timer(cxt, snake, AISnake, foods);
  }, speed);
}

//根据指定方向设置新蛇头坐标
function setNewHead(position, oldX, oldY){//返回根据指定方向的新蛇头坐标
  var newHead = {};
  switch(position){
    case 0:newX = oldX;newY = oldY - 1;break;
    case 1:newX = oldX + 1;newY = oldY;break;
    case 2:newX = oldX - 1;newY = oldY;break;
    case 3:newX = oldX;newY = oldY+1;break;
  }
  newHead.x = newX;
  newHead.y = newY;
  newHead.direction = position;
  return newHead;
}

function checkSnakeBody(cxt, snake, AISnake){//AI蛇需要判断可能前进的一步是否撞击自己的身体或者玩家蛇身体或者撞墙，从而设置头部方向, 函数的返回值为经过筛选后蛇头可以走的坐标
  
  var headX = AISnake[0].x;
  var headY = AISnake[0].y;
  var headDirection = AISnake[0].direction;

  //判断当前蛇头是否已经紧挨身体，先找到当前蛇头可以紧挨的三个坐标, 当前蛇头反方向的坐标(即蛇颈处坐标不被考虑，因为蛇头不可能碰蛇颈)
  var clearPositions = [];
  console.log("headDirection****:", headDirection);
  switch(headDirection){//默认把蛇头前进的那个方向对应的新坐标放在数组第一位，方便后面检查
    case 0:clearPositions.push({x: headX,y: headY-1, direction: 0}, {x: headX-1,y: headY, direction: 2}, {x: headX+1, y: headY, direction: 1});break;
    case 1:clearPositions.push({x: headX+1,y: headY, direction: 1}, {x: headX,y: headY-1, direction: 0}, {x: headX,y: headY+1, direction: 3});break;
    case 3:clearPositions.push({x: headX,y: headY+1, direction: 3}, {x: headX-1,y: headY, direction: 2}, {x: headX+1,y: headY, direction: 1});break;
    case 2:clearPositions.push({x: headX-1,y: headY, direction: 2}, {x: headX,y: headY-1, direction: 0}, {x: headX,y: headY+1, direction: 3});break;
  }

  // var flag = false;
  //将玩家蛇和AI蛇共同组成一个蛇身边界数组
  console.log("过滤前的边界筛选数组clearPositions:", clearPositions);
  var mergeSnakeBorder = snake.concat(AISnake);
  var mergeSnakeLength = mergeSnakeBorder.length;
  
  var tempRestPositions = [];//经过蛇身体筛选后剩余的坐标

  var restPositions = [];//再经过墙边界筛选后的

  //判断蛇头可以前进的三个坐标是否满足边界和蛇身体限制(撞到墙边界，撞到自己蛇身，撞到玩家蛇身)
  for(let i = 0;i < 3;i++){
    let flag = false;
    for(let j=0;j < mergeSnakeLength;j++){
      if(mergeSnakeBorder[j].x == clearPositions[i].x && mergeSnakeBorder[j].y == clearPositions[i].y){
        flag = true;
        break;
      }
    }
    if(!flag){
      tempRestPositions.push(clearPositions[i]);
    }
  }
  //再用边界判断
  for(let i = 0;i < tempRestPositions.length;i++){
    if(!(tempRestPositions[i].x < 0 || tempRestPositions[i].x > 24 || tempRestPositions[i].y < 0 || tempRestPositions[i].y > 24)){
      restPositions.push(tempRestPositions[i]);
    }
  }
  
  if(restPositions.length == 0){//蛇无路可走
    gameOver();
  }else{
    return restPositions;
  }
}

//根据食物和蛇头的关系,设置新蛇头 
function headPosCore(cxt, snake, foods, positions){
  var length = positions.length;
  var headX = snake[0].x;
  var headY = snake[0].y;
  var oldDirection = snake[0].direction;
  var newHead;//
  console.log("原蛇头方向:", oldDirection);

  if(length === 2){
    let flag = false;
    for(let i = 0;i < length;i++){
      if(oldDirection === positions[i]){//如果原蛇头方向与食物方向数组中的一个一致的话, 则继续使用原方向
        // newHead.direction = oldDirection;
        newHead = setNewHead(oldDirection, headX, headY);
        flag = true;
        break;
      }
    }
    if(!flag){//表明蛇头方向不在食物方向数组中
      console.log("蛇头原方向:", oldDirection);
      let reverseDirect = 3- oldDirection;
      for(let i = 0;i < length;i++){
        if(positions[i] !== reverseDirect){
          // newHead.direction = positions[i];
          console.log("蛇头新方向:", positions[i]);
          newHead = setNewHead(positions[i], headX, headY);
          break;
        }
      }
    }
  }else if(length === 1){
    let position = positions[0];//食物的方位，为0,1,2,3四种情况
    if(oldDirection !== 3 - position){
      // newHead.direction = position;
      newHead = setNewHead(position, headX, headY);
    }else{
      if(oldDirection == 1 || oldDirection == 2){
        //检查当前头离两水平边界的垂直距离，让蛇头往距离大的一方转
        if(headY < 24 - headY){
          // newHead.direction = 3;
          newHead = setNewHead(3, headX, headY);

        }else{
          // newHead.direction = 0;
          newHead = setNewHead(0, headX, headY);
        }
        // newHead = setNewHead(newHead.direction, headX, headY);
      }
      if(oldDirection == 0 || oldDirection == 3){
        //检查当前头离两垂直边界的水平距离，让蛇头往距离大的一方转
        if(headX < 24 - headX){
          // newHead.direction = 1;
          newHead = setNewHead(1, headX, headY);
        }else{
          // newHead.direction = 2;
          newHead = setNewHead(2, headX, headY);
        }
        // setNewHead(newHead, newHead.direction, headX, headY);
      }
    } 
  }
  return newHead;
  // else{//蛇头此时刚好与食物重合
  //   //重合的时候先检查食物
  //   // AIcheckFoods(cxt, snake, foods);
  //   //然后再检查边界
  //   AIcheckBorder(cxt, snake, newHead);
  // } 
}

//AI timer
async function AITimer(cxt, snake, AISnake, foods){
  //判断此时游戏的可执行状态,flag为false表示处于暂停中，flag为true表示可以开始
  while(!flag){
    console.log('Hello')
    await sleep(1000)
    console.log('world!')
  }

  var headX = AISnake[0].x;
  var headY = AISnake[0].y;
  var oldDirection = AISnake[0].direction;

  var neckX = headX;
  var neckY = headY;//新蛇的蛇颈处取旧蛇蛇头(蛇颈即为第二格)

  var newHead;//
  var newHeadByBorder;//根据边界(包括墙和身体筛选而来)
  var newHeadByFood;//根据食物位置筛选而来、

  //找食物需要的属性
  var nearestX;
  var nearestY;
  var foodsLen = foods.length;

  var MinDis = 5000;//默认初始的最小距离为5000
  var positions = [];//存储位置标记的，比如食物位置位于蛇头右上角就会存储0,1两个数(0,1,3,2代表上右下左)
  //测试用
  frame++;
  //遍历食物数组，找到离蛇头最近的食物
  for(let i = 0;i < foodsLen;i++){
    let foodDis = Math.pow(Math.abs(foods[i].x - headX),2) + Math.pow(Math.abs(foods[i].y - headY), 2)//此处用x差值与y差值的平分和表示距离
    console.log("帧数:", frame, "当前食物坐标:", foods[i].x, foods[i].y, "食物距离:", foodDis);
    if(foodDis < MinDis){
      MinDis = foodDis;
      nearestX = foods[i].x;
      nearestY = foods[i].y;
    }
  }


  // console.log("当前最近食物坐标:")
  console.log("当前最近食物坐标:",nearestX, nearestY, "最近距离:", MinDis);
  //得到食物的x,y后调整蛇头方向,分9种情况 ，食物位于蛇头左上，左下，右上，右下，上，下，左，右以及重合
  
  //先处理当前蛇头吃到食物的情况
  if(nearestX === headX && nearestY === headY){
    //重合的时候先检查食物
    AIcheckFoods(cxt, AISnake, foods);

  }

  //
  newHeadByBorder = checkSnakeBody(cxt, snake, AISnake);
  console.log("***newHeadByBorder:", newHeadByBorder);

  if(nearestX > headX && nearestY < headY){
    positions.push(0,1);
  }
  if(nearestX > headX && nearestY > headY){
    positions.push(1,3);
  }
  if(nearestX < headX && nearestY < headY){
    positions.push(0,2);
  }
  if(nearestX < headX && nearestY > headY){
    positions.push(2,3);
  }
  if(nearestX === headX && nearestY < headY){
    positions.push(0);
  }
  if(nearestX === headX && nearestY > headY){
    positions.push(3);
  }
  if(nearestX > headX && nearestY ===  headY){
    positions.push(1);
  }
  if(nearestX < headX && nearestY === headY){
    positions.push(2);
  }

  if(positions.length == 0){//当前蛇头吃到食物的情况，只需要根据边界筛选的结果设置newHead
    newHead = newHeadByBorder[0];
  }else{
    newHeadByFood = headPosCore(cxt, AISnake, foods, positions);//得到根据食物设置的新蛇头坐标
    console.log("***newHeadByFood:", newHeadByFood);

    var sameFlag = false;
    //再次筛选
    for(var i = 0;i < newHeadByBorder.length;i++){
      //判断边界筛选过的坐标中是否有和食物筛选后的吻合
      if(newHeadByBorder[i].x == newHeadByFood.x && newHeadByBorder[i].y == newHeadByFood.y){
        //吻合的话, 取这个为头坐标
        newHead = newHeadByFood;
        sameFlag = true;
        break;
      }
    }
    if(!sameFlag){//食物筛选后坐标不在边界筛选后坐标范围内，则取newHeadByBorder[0]
      newHead = newHeadByBorder[0];
    }
  }
  

  //绘制新蛇头
  AISnake.unshift(newHead);
  cxt.fillStyle = "red";
  cxt.fillRect(newHead.x*20,newHead.y*20,20,20);
  console.log("新蛇头坐标:", newHead.x, newHead.y);

  //绘制蛇颈
  cxt.fillStyle = "white";
  cxt.fillRect(headX*20,headY*20,20,20);
  //抹除蛇尾
  var length = AISnake.length;
  console.log("旧蛇尾坐标:", AISnake[length-1].x, AISnake[length-1].y);

  cxt.fillStyle = "black";
  cxt.fillRect(AISnake[length-1].x*20, AISnake[length-1].y*20, 20, 20);
  AISnake.splice(length-1,1);

  setTimeout(function(){
    AITimer(cxt, snake, AISnake, foods);
  }, 200);
}

//开始游戏
function gameRun(cxt, snake, AISnake, foods){
  //AI蛇不接受键盘指令，

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
  timer(cxt, snake, AISnake, foods);
  AITimer(cxt, snake, AISnake, foods);
}

function randomFood(cxt, foods){
  //随机生成符合地图范围(25*25)的食物，分为3种，普通(0,身体加1，蓝色)，加速(1,黄色)，毒药(2,身体减半，绿色)
  
  //控制屏幕中食物数量在8个以内
  if(foods.length < 8){
    var x = Math.floor(Math.random()*25);
    var y = Math.floor(Math.random()*25);
    var randomNum = Math.floor(Math.random()*6);
    var type;
    if(randomNum == 0){
      type = 2;
    }
    if(randomNum >= 1 && randomNum <= 2){
      type = 1;
    }
    if(randomNum >= 3 && randomNum <= 5){
      type = 0;
    }

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
        randomNum = Math.floor(Math.random()*6);
        if(randomNum == 0){
          type = 0;
        }
        if(randomNum >= 1 && randomNum <= 2){
          type = 1;
        }
        if(randomNum >= 3 && randomNum <= 5){
          type = 2;
        }
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

// function AIcheckBorder(cxt, snake, newHead){
//   //根据蛇头方向和蛇头坐标判断是否挨墙, 挨墙后需要设置新蛇头方向，没挨墙则按原方向加头
//   var headX = snake[0].x;
//   var headY = snake[0].y;
//   var headDirection = snake[0].direction;
//   var flag = false;
//   if((headDirection === 0 && headY === 0) || (headDirection === 3 && headY === 24)){//蛇头朝上碰到顶部边界或朝下碰到底部边界
//     flag = true;
//     if(headX < 24 - headX){
//       newHead.direction = 1;
//       newHead.x = headX + 1;
//       newHead.y = headY;
//     }else{
//       newHead.direction = 2;
//       newHead.x = headX - 1;
//       newHead.y = headY;
//     }
//   }
//   if((headDirection === 2 && headX === 0) || (headDirection === 1 && headX === 24)){//蛇头朝左碰到左部边界或朝右碰到右边界
//     flag = true;
//     if(headY < 24 - headY){
//       newHead.direction = 3;
//       newHead.x = headX;
//       newHead.y = headY + 1;
//     }else{
//       newHead.direction = 0;
//       newHead.x = headX;
//       newHead.y = headY - 1;
//     }
//   }
//   if(!flag){//没碰到墙
//     newHead.direction = headDirection;
//     setNewHead(newHead, headDirection, headX, headY)
//   }
// }

function AIcheckFoods(cxt, snake, foods){//AI蛇吃食物不影响分数
  var snakeLength = snake.length;
  var snakeHead = snake[0];
  var headX = snakeHead.x;
  var headY = snakeHead.y;
  var snakeTail = snake[snakeLength-1];
  var tailX = snakeTail.x;
  var tailY = snakeTail.y;
  var foodLength = foods.length;
  
  var type;//吃掉的食物类型

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
      // score++;//分数加1，并更新对应视图
      // console.log("分数加1为", score);
      // scoreVal.innerHTML = score;
    }
    //AI蛇速度暂不受影响
    // if(type === 1){//黄色加速，假设每吃一个快200ms，速度最小为200
    //   if(speed > 200){
    //     speed -= 200;
    //   }
    // }
    if(type === 2){//绿色毒药，吃了之后断掉一半，即舍弃从数组1/2处至尾部的元素
      cxt.fillStyle = "black";
      let leftLength = Math.floor(snakeLength/2);
      //当除2后剩下的长度大于2等于时
      if(leftLength >= 2){
        for(let i = leftLength;i < snakeLength;i++){
          cxt.fillRect(snake[i].x*20, snake[i].y*20, 20, 20);
        }
        // score = Math.floor((score+2)/2) - 2;
        // console.log("分数减半为:", score);
        // scoreVal.innerHTML = score;
        snake.splice(leftLength, snakeLength - leftLength);
      }else{//此时蛇长度为2或3
        if(snakeLength > 2){//为3的话
          cxt.fillRect(snakeTail.x*20, snakeTail.y*20, 20, 20);
          snake.splice(2,1);
        }
        //默认蛇身长最少为2，所以长为2的蛇吃毒药不做处理
        // score = 0;
        // scoreVal.innerHTML = score;
        // console.log("分数减为0");
      }
    }

    //再生成随机个新食物, 食物数在1~3中随机
    // randomFood(cxt, foods);
    var foodNum = Math.random()*3 + 1;
    for(var j = 0;j < foodNum;j++){
      randomFood(cxt, foods);
    }
  }
}

function checkBorderAndFoods(cxt, snake, AISnake, foods){
  var snakeLength = snake.length;
  var AISnakeLength = AISnake.length;
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

  //再判断蛇头是否碰到AI蛇身体
  for(var i = 0;i < AISnakeLength;i++){
    if(AISnake[i].x === headX && AISnake[i].y === headY){
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
//AI蛇身体数组
var AISnake = [];

//食物数组
var foods = [];

//速度
var speed = 1000;//默认1000ms
//AI蛇速度
var AISpeed = 200;//默认200ms

//玩家蛇头当前方向
var newDirection;
//AI蛇头当前方向
var AIDirection;

var frame = 0;//帧数，测试用

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

gameInit(cxt, snake, AISnake, foods);

gameRun(cxt, snake, AISnake, foods);
