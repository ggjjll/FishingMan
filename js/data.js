/**
 * Created by Administrator on 2016/12/23.
 */
//图片资源
var imgSrcArr = [
    {name:"bg",src:"img/bg.jpg"},

    {name:"fish1",src:"img/fish1.png"},
    {name:"fish2",src:"img/fish2.png"},
    {name:"fish3",src:"img/fish3.png"},
    {name:"fish4",src:"img/fish4.png"},
    {name:"fish5",src:"img/fish5.png"},
    {name:"fish6",src:"img/fish6.png"},
    {name:"fish7",src:"img/fish7.png"},
    {name:"fish8",src:"img/fish8.png"},
    {name:"fish9",src:"img/fish9.png"},
    {name:"fish10",src:"img/fish10.png"},

    {name:"bottom-bar",src:"img/bottom-bar.png"},
    {name:"bottom-num",src:"img/bottom-num.png"},
    {name:"energy-bar",src:"img/energy-bar.png"},

    {name:"cannon_minus",src:"img/cannon_minus.png"},
    {name:"cannon_minus_down",src:"img/cannon_minus_down.png"},
    {name:"cannon_plus",src:"img/cannon_plus.png"},
    {name:"cannon_plus_down",src:"img/cannon_plus_down.png"},
    {name:"cannon1",src:"img/cannon1.png"},
    {name:"cannon2",src:"img/cannon2.png"},
    {name:"cannon3",src:"img/cannon3.png"},
    {name:"cannon4",src:"img/cannon4.png"},
    {name:"cannon5",src:"img/cannon5.png"},
    {name:"cannon6",src:"img/cannon6.png"},
    {name:"cannon7",src:"img/cannon7.png"},

    {name:"bullet1",src:"img/bullet1.png"},
    {name:"bullet2",src:"img/bullet2.png"},
    {name:"bullet3",src:"img/bullet3.png"},
    {name:"bullet4",src:"img/bullet4.png"},
    {name:"bullet5",src:"img/bullet5.png"},
    {name:"bullet6",src:"img/bullet6.png"},
    {name:"bullet7",src:"img/bullet7.png"},

    {name:"coinAni1",src:"img/coinAni1.png"},
    {name:"coinAni2",src:"img/coinAni2.png"},
    {name:"coinText",src:"img/coinText.png"}

];

//鱼的属性设置
var flashAtt = {
    fish1:{width:55,height:37,speed:3.2,cost:5,sumFrame:8,pro:0.7},
    fish2:{width:78,height:64,speed:2.9,cost:15,sumFrame:8,pro:0.75},
    fish3:{width:72,height:56,speed:2.5,cost:25,sumFrame:8,pro:0.80},
    fish4:{width:77,height:59,speed:1.2,cost:35,sumFrame:8,pro:0.85},
    fish5:{width:107,height:122,speed:1.1,cost:45,sumFrame:8,pro:0.9},
    fish6:{width:105,height:79,speed:1.4,cost:40,sumFrame:12,pro:0.92},
    fish7:{width:92,height:151,speed:1.6,cost:30,sumFrame:10,pro:0.94},
    fish8:{width:174,height:126,speed:1.6,cost:50,sumFrame:12,pro:0.96},
    fish9:{width:166,height:183,speed:2.2,cost:70,sumFrame:12,pro:0.98},
    fish10:{width:178,height:187,speed:0.8,cost:60,sumFrame:10,pro:0.99}
};
var flashAtt_length = 10;
var flashCost_maxLength = 2;

//炮筒的属性
var cannonAtt = {
    cannon1:{width:74,height:74,bullet:"bullet1"},
    cannon2:{width:74,height:76,bullet:"bullet2"},
    cannon3:{width:74,height:76,bullet:"bullet3"},
    cannon4:{width:74,height:83,bullet:"bullet4"},
    cannon5:{width:74,height:85,bullet:"bullet5"},
    cannon6:{width:74,height:90,bullet:"bullet6"},
    cannon7:{width:74,height:94,bullet:"bullet7"}
};
var cannonAtt_length = 7;

//子弹的属性
var bulletAtt = {
    bullet1:{width:24,height:26,speed:10,range:15,cost:10},
    bullet2:{width:25,height:29,speed:9.75,range:25,cost:15},
    bullet3:{width:27,height:31,speed:9.5,range:35,cost:20},
    bullet4:{width:29,height:33,speed:9.25,range:45,cost:25},
    bullet5:{width:30,height:34,speed:9,range:55,cost:30},
    bullet6:{width:31,height:35,speed:8.75,range:65,cost:35},
    bullet7:{width:32,height:38,speed:8.5,range:75,cost:40}
};

//图形参数
var barWidth = 765;
var barHeight = 72;
var scoreWidth = 20;
var scoreHeight = 24;
var cannonWidth = 44;
var cannonHeight = 31;
var coinTextWidth = 36;
var coinTextHeight = 49;
var coinWidth = 60;
var coinHeight = 60;
var energyWidth = 213;
var energyHeight = 19;

//游戏参数参数
var frequency = 20;      //添加鱼的频率
var coinTime = 10;       //硬币总帧数
var coinTextSpeed = 2;
var coinSpeed = 2;    //硬笔旋转速度
var coinLim = 25;       //分值分界
var energyMax = 2000;
var energySpeed = 5;
var rewardFish = 25;
