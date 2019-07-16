function checkWxScroll(){
         var ua = navigator.userAgent.toLowerCase();
         var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
 
         if(ua.match(/MicroMessenger/i) == 'micromessenger'&&!!u){//在iphone 微信中
            var osVersion  =  navigator.userAgent.match(/iPhone\sOS\s([\d\_]+)/i);
            var  osArr = osVersion.length>=1? osVersion[1].split('_'):[];
            var newOS = osArr.length>=2 && (osArr[0]>11)
            if(newOS){ //如果iphone版本号>=12
                 temporaryRepair();
            }
         }
      }
function temporaryRepair(){
    var currentPosition,timer;
    var speed=1;//页面滚动距离
    timer=setInterval(function(){
    currentPosition=document.documentElement.scrollTop || document.body.scrollTop;
    currentPosition-=speed;
    window.scrollTo(0,0);//页面向上滚动
//            currentPosition+=speed; //speed变量
//            window.scrollTo(0,currentPosition);//页面向下滚动
    clearInterval(timer);
    },1);
}

export default checkWxScroll