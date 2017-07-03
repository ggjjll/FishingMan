/**
 * Created by Administrator on 2016/12/23.
 */
//绘图环境配置
var mainCanvas;
var mainctx;
var mainCanvasWidth;
var mainCanvasHeight;

var imgSrc = {};    //所有图片资源
var fishArr = [];   //鱼群
var bulletArr = []; //子弹集合
var coinArr = [];   //硬币集合
var coinTextArr = [];  //金币数集合
var cannonType = 1;     //炮筒编号
var cannonRotate = 0;   //炮筒角度

var score = 0;  //游戏成绩
var energyNum = 0;//能量条
var mouseDownType;
var isAddEnergy = 1;

var bgm;
var bgm_coin;

//图片加载
function load(arr,breakFun){
    var iNow = 0;
    for(var i = 0; i < arr.length; i ++){
        var img = new Image();
        img.onload = function(){
            iNow ++;
            if(iNow >= arr.length){
                breakFun();
            }
        };
        img.src = arr[i].src;
        var name = arr[i].name;
        imgSrc[name] = img;
    }
}

window.onload = function(){

    bgm = document.getElementById("bgmGame");
    bgm_coin = document.getElementById("bgmCoin");
    bgm.volume = 0.5;
    //初始化成绩
    if(!localStorage.fishing_score){
        localStorage.fishing_score = 1000;
    }
    score = parseInt(localStorage.fishing_score);
    //初始化能量条
    if(!localStorage.fishing_energyNum){
        localStorage.fishing_energyNum = 0;
    }
    energyNum = parseInt(localStorage.fishing_energyNum);
    if(!localStorage.fishing_isAddEnergy){
        localStorage.fishing_isAddEnergy = 1;
    }
    isAddEnergy = parseInt(localStorage.fishing_isAddEnergy);

    load(imgSrcArr,function(){
        document.getElementById("loading").style.display="none";
        document.getElementById("start").style.display="block";
        var startButton = document.getElementById("startButton");
        startButton.addEventListener("click",function (){
            document.getElementById("mainCanvas").style.display="block";
            document.getElementById("startPage").style.display="none";
            start();
            addEvent();
        });
    });
};

//游戏开始
function start(){
    var iNow = 0;
    bgm.play();
    mainCanvas = document.getElementById("mainCanvas");
    mainctx = mainCanvas.getContext("2d");
    setInterval(function(){
        //更新画面属性
        mainCanvasWidth = mainCanvas.offsetWidth;
        mainCanvasHeight = mainCanvas.offsetHeight;
        mainCanvas.setAttribute("height",mainCanvasHeight);
        mainCanvas.setAttribute("width",mainCanvasWidth);

        mainctx.clearRect(0,0,mainCanvasWidth,mainCanvasHeight);    //清空画布
        mainctx.save();
        //描绘背景
        mainctx.drawImage(imgSrc["bg"],0,0,mainCanvasWidth,mainCanvasHeight);
        drawFish();
        drawBullet();
        drawCoinText();
        drawCoin();
        drawBar();
        mainctx.restore();
        if(iNow % frequency == 0){
            iNow = 0;
            addFish();
        }
        iNow ++;
    },30);
}


//添加鱼儿
function addFish(){
    var random = Math.random();
    var fishType = 1;
    for(var i = 1;i <= flashAtt_length; i ++){
        var name = "fish" + i;
        if(random <= flashAtt[name].pro){
            fishType = i;
            break;
        }
    }
    var start = Math.random();      //预设方向
    if(start > 0.5){
        fishArr.push({
            type:"fish"+fishType,
            x:-40,
            y:Math.random()*(mainCanvasHeight*0.5) + mainCanvasHeight*0.25,
            rotate:Math.random()*(1.2) - 0.6,
            frame:0,
            isLive:true
        });
    }else{
        fishArr.push({
            type:"fish"+fishType,
            x:mainCanvasWidth + 40,
            y:Math.random()*(mainCanvasHeight*0.5) + mainCanvasHeight*0.25,
            rotate:Math.random()*(1.2) - 0.6 + Math.PI,
            frame:0,
            isLive:true
        });
    }
}

//绘制鱼群
function drawFish(){
    for(var i = 0; i < fishArr.length; i ++){
        //越界判断
        if(fishArr[i].x < -150 || fishArr[i].x > mainCanvasWidth+150 || fishArr[i].y < -150 || fishArr[i].y > mainCanvasHeight + 150){
            fishArr.splice(i,1);
            i --;
            continue;
        }
        var name = fishArr[i].type;
        mainctx.save();
            mainctx.translate(fishArr[i].x,fishArr[i].y);
            mainctx.rotate(fishArr[i].rotate);
            mainctx.translate(-flashAtt[fishArr[i].type].width/2,-flashAtt[fishArr[i].type].height/2);
            if(fishArr[i].rotate > 0.5 * Math.PI)
                mainctx.scale(1,-1);
            mainctx.drawImage(imgSrc[name],0,flashAtt[name].height*Math.floor(fishArr[i].frame),flashAtt[name].width,flashAtt[name].height,0,0,flashAtt[name].width,flashAtt[name].height);
        mainctx.restore();
        //修改参数
        fishArr[i].frame += 0.25;
        if(fishArr[i].isLive){
            if(fishArr[i].frame >= flashAtt[name].sumFrame - 4)
                fishArr[i].frame = 0;
            fishArr[i].x += flashAtt[name].speed*Math.cos(fishArr[i].rotate);
            fishArr[i].y += flashAtt[name].speed*Math.sin(fishArr[i].rotate);
            fishArr[i].rotate += (Math.random()*0.02-0.01);
        }
        else{
            //死亡
            if(fishArr[i].frame >= flashAtt[name].sumFrame){
                addCoinText(fishArr[i].x,fishArr[i].y,flashAtt[name].cost);     //添加金币数字
                addCoin(fishArr[i].x,fishArr[i].y,flashAtt[name].cost);        //添加硬币
                fishArr.splice(i,1);
                i --;
            }
        }
    }
}

//添加子弹
function addBullet(){
    bulletArr.push({
        type:"bullet" + cannonType,
        x:mainCanvasWidth/2 + 45,
        y:mainCanvasHeight - barHeight/2,
        rotate:-0.5*Math.PI + cannonRotate
    });
}

//绘制子弹
function drawBullet(){
    for(var i = 0; i < bulletArr.length; i ++){
        var isDraw = true;
        //越界判断
        if(bulletArr[i].x < -15 || bulletArr[i].x > mainCanvasWidth+15 || bulletArr[i].y < -15 || bulletArr[i].y > mainCanvasHeight + 15)
            isDraw = false;
        //碰撞检测
        if(isDraw && bulletArr[i].x > 20 && bulletArr[i].x < mainCanvasWidth-20 && bulletArr[i].y > 20 && bulletArr[i].y < mainCanvasHeight-barHeight - 30){
            var bulletX = bulletArr[i].x;
            var bulletY = bulletArr[i].y;
            for(var j = 0; j < fishArr.length; j ++){
                if(fishArr[j].x < 0 || fishArr[j].x > mainCanvasWidth || fishArr[j].y < 0 || fishArr[j].y > mainCanvasHeight-barHeight - 10 || fishArr[j].isLive == false)
                    continue;
                var relationship = getRelationship(bulletX,bulletY,fishArr[j].x,fishArr[j].y);
                if(relationship.d <= bulletAtt[bulletArr[i].type].range){
                    fishArr[j].frame = flashAtt[fishArr[j].type].sumFrame - 4;
                    fishArr[j].isLive = false;
                    isDraw = false;
                    //金币音效
                    bgm_coin.currentTime = 0.0;
                    bgm_coin.play();
                }
            }
        }
        if(!isDraw){
            bulletArr.splice(i,1);
            i--;
            continue;
        }
        var name = bulletArr[i].type;
        mainctx.save();
            mainctx.translate(bulletArr[i].x,bulletArr[i].y);
            mainctx.rotate(bulletArr[i].rotate+0.5*Math.PI);
            mainctx.translate(-bulletAtt[name].width/2,-bulletAtt[name].height/2);
            if(bulletArr[i].rotate > 0.5 * Math.PI)
                mainctx.scale(1,-1);
            mainctx.drawImage(imgSrc[name],0,0,bulletAtt[name].width,bulletAtt[name].height,0,0,bulletAtt[name].width,bulletAtt[name].height);
        mainctx.restore();
        //修改参数
        bulletArr[i].x += bulletAtt[name].speed*Math.cos(bulletArr[i].rotate);
        bulletArr[i].y += bulletAtt[name].speed*Math.sin(bulletArr[i].rotate);
    }
}

//添加金币数字
function addCoinText(x,y,num){
    coinTextArr.push({
        x:x,
        y:y,
        num:num,
        frame:0
    })
}

//绘制金币数字
function drawCoinText(){
    for(var i = 0; i < coinTextArr.length; i ++){
        var num = coinTextArr[i].num;
        mainctx.save();
            mainctx.translate(coinTextArr[i].x-coinTextWidth/2,coinTextArr[i].y-coinTextHeight/2);
            mainctx.drawImage(imgSrc["coinText"],10*coinTextWidth,0,coinTextWidth,coinTextHeight,0,0,coinTextWidth,coinTextHeight);
            var iNow = 1;
            var canDraw = false;
            for(var j = flashCost_maxLength-1; j >= 0; j --){
                var numbit = Math.floor(num/(Math.pow(10,j)));
                if(numbit)
                    canDraw = true;
                if(canDraw){
                    mainctx.drawImage(imgSrc["coinText"],numbit*coinTextWidth,0,coinTextWidth,coinTextHeight,coinTextWidth*iNow,0,coinTextWidth,coinTextHeight);
                    iNow ++;
                }
                num %= (Math.pow(10,j))
            }
        mainctx.restore();
        coinTextArr[i].frame ++;
        coinTextArr[i].y -= coinTextSpeed;
        if(coinTextArr[i].frame > coinTime * coinSpeed){
            coinTextArr.splice(i,1);
            i --;
        }
    }
}

//添加硬币
function addCoin(x,y,num){
    var relationship = getRelationship((mainCanvasWidth - barWidth) / 2 + 80,mainCanvasHeight - barHeight + 20,x,y);
    coinArr.push({
        x:x,
        y:y,
        dx:relationship.dx / (coinTime*coinSpeed),
        dy:relationship.dy / (coinTime*coinSpeed),
        num:num,
        frame:0
    })
}

//绘制硬币
function drawCoin(){
    for(var i = 0; i < coinArr.length; i ++){
        mainctx.save();
            mainctx.translate(coinArr[i].x - coinWidth,coinArr[i].y - coinHeight);
            if(coinArr[i].num <= coinLim)
                mainctx.drawImage(imgSrc["coinAni1"],0,coinHeight*Math.floor(coinArr[i].frame),coinWidth,coinHeight,0,0,coinWidth,coinHeight);      //小硬币
            else
                mainctx.drawImage(imgSrc["coinAni2"],0,coinHeight*Math.floor(coinArr[i].frame),coinWidth,coinHeight,0,0,coinWidth,coinHeight);      //大硬币
        mainctx.restore();
        coinArr[i].frame += 1/coinSpeed;
        coinArr[i].x += coinArr[i].dx;
        coinArr[i].y += coinArr[i].dy;
        if(coinArr[i].frame > coinTime){
            changeScore(coinArr[i].num);
            changeEnergy(coinArr[i].num);
            coinArr.splice(i,1);
            i--;
        }
    }
}
//绘制面板
function drawBar(){
    mainctx.save();
        //面板底部
        mainctx.translate((mainCanvasWidth-barWidth)/2,mainCanvasHeight-barHeight+3);
        mainctx.drawImage(imgSrc["bottom-bar"],0,0,barWidth,barHeight);
        //游戏成绩
        var num = score>=0 ? score : 0;
        for(var i = 5;i >= 0; i --){
            //数字分位处理
            var numBit = Math.floor(num % 10);
            num = Math.floor(num/10);
            mainctx.drawImage(imgSrc["bottom-num"],0,scoreHeight * (9-numBit), scoreWidth,scoreHeight, 20 + i*(scoreWidth+3),44, scoreWidth,scoreHeight);
        }
        //炮筒调整按钮
        if(mouseDownType == '+'){
            mainctx.drawImage(imgSrc["cannon_plus_down"],0,0,cannonWidth,cannonHeight,162,45,cannonWidth-15,cannonHeight-8);     //加号
        }else{
            mainctx.drawImage(imgSrc["cannon_plus"],0,0,cannonWidth,cannonHeight,162,45,cannonWidth-15,cannonHeight-8);          //加号
        }
        if(mouseDownType == '-'){
            mainctx.drawImage(imgSrc["cannon_minus_down"],0,0,cannonWidth,cannonHeight,188,45,cannonWidth-15,cannonHeight-8);    //减号
        }else{
            mainctx.drawImage(imgSrc["cannon_minus"],0,0,cannonWidth,cannonHeight,188,45,cannonWidth-15,cannonHeight-8);        //减号
        }
        //绘制大炮
        mainctx.save();
            mainctx.translate(barWidth/2+45, barHeight/2);
            mainctx.rotate(cannonRotate);
            mainctx.fillStyle = "#789456";
            mainctx.fillRect(0,0,10,10);
            var cannonName = "cannon" + cannonType;
            mainctx.translate(-cannonAtt[cannonName].width/2,-cannonAtt[cannonName].height/2);
            mainctx.drawImage(imgSrc[cannonName],0,0,cannonAtt[cannonName].width,cannonAtt[cannonName].height,0,0,cannonAtt[cannonName].width,cannonAtt[cannonName].height);
        mainctx.restore();
        //绘制能量条
        if(!isAddEnergy)
            changeEnergy(0-energySpeed);
        else
            changeEnergy(0.05);
        var proportion = energyNum / energyMax;
        mainctx.save();
            mainctx.translate(542, 44);
            mainctx.drawImage(imgSrc["energy-bar"],0,0,energyWidth*proportion,energyHeight,0,0,energyWidth*proportion,energyHeight);
        mainctx.restore();
    mainctx.restore();
}

//得到两点间的关系
//以p1为基准
function getRelationship(p1X,p1Y,p2X,p2Y){
    var dx = p1X - p2X;
    var dy = p1Y - p2Y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var rotate = Math.acos(dx/d);
    return {
        dx:dx,
        dy:dy,
        d:d,
        rotate:rotate
    }
}

//修改成绩
function changeScore(num){
    score += num;
    localStorage.fishing_score = score;
}

//修改能量条
function changeEnergy(num){
    if((isAddEnergy && num > 0) || (!isAddEnergy && num < 0))
        energyNum += num;
    if(energyNum > energyMax){
        energyNum = energyMax;
        reward();
        isAddEnergy = 0;
    }
    if(energyNum < 0){
        energyNum = 0;
        isAddEnergy = 1;
    }
    localStorage.fishing_energyNum = parseInt(energyNum);
    localStorage.fishing_isAddEnergy = isAddEnergy;
}

//奖励
function reward(){
    for(var i = 0; i < rewardFish; i ++)
        addFish();
}

//绑定事件
function addEvent(){
    mainCanvas.addEventListener("mousedown",function(ev){
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        //按键判断
        var startX = (mainCanvasWidth-barWidth)/2;
        var startY = mainCanvasHeight-barHeight+3;
        var testCannonX = mouseX - startX  - 162;
        var testCannonY = mouseY - startY - 45;
        if(testCannonX >= 0 && testCannonX <= cannonWidth-15 && testCannonY >= 0 && testCannonY <= cannonHeight-8){
            mouseDownType = "+";
            cannonType ++;
        }else if(testCannonX >= 26 && testCannonX <= cannonWidth+11 && testCannonY >= 0 && testCannonY <= cannonHeight-8){
            mouseDownType = "-";
            cannonType --;
        }else{
            //发子弹
            if(bulletAtt["bullet" + cannonType].cost <= score){
                addBullet();
                changeScore(-bulletAtt["bullet" + cannonType].cost);
            }
        }
        if(cannonType > cannonAtt_length)
            cannonType = 1;
        else if(cannonType < 1)
            cannonType = cannonAtt_length;
    });
    mainCanvas.addEventListener("mouseup",function(){
        mouseDownType = "";
    });
    mainCanvas.addEventListener("mousemove",function(ev){
        var mouseX = ev.clientX;
        var mouseY = ev.clientY;
        var relationship = getRelationship(mainCanvasWidth/2 + 45,mainCanvasHeight - barHeight/2,mouseX,mouseY);
        cannonRotate =-0.5 * Math.PI + relationship.rotate;
    });
}