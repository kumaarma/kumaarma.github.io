setTimeout(init,100);
function init(){
    var obox = document.getElementById('box'),
        aDiv = obox.getElementsByTagName('div');

        for (var i = 0; i < aDiv.length; i++) {
            aDiv[i].style.background = "url(img/"+(i+1)+".jpg) center/cover";
            aDiv[i].style.transform = "rotateY("+(i*36)+"deg) translate3d(0,0,350px)";
            aDiv[i].style.transition = "transform 1s "+(aDiv.length-i)*0.2+"s";
        }
    var sX,
        sY,
        nX,
        nY,
        desX = 0,
        desY = 0,
        tX = 0,
        tY = 10,
        index = 0;//滚轮初始值
    document.onmousedown = function(e){
        clearInterval(obox.timer);
        e = e || window.event;
        var sX = e.clientX,
            sY = e.clientY;
            this.onmousemove = function(e){
                e = e || window.event;
                var nX = e.clientX,
                    nY = e.clientY;
                     // 当前点的坐标和前一点的坐标差值
                    desX = nX - sX;
                    desY = nY - sY;
                    tX += desX*0.1; 
                    tY += desY*0.1;

                    obox.style.transform = "rotateX("+(-tY)+"deg) rotateY("+tX+"deg)";
                    sX = nX;
                    sY = nY;
            }
            this.onmouseup = function(){
                this.onmousemove = this.onmouseup = null;
                obox.timer = setInterval(function(){
                    desX *= 0.95;
                    desY *= 0.95;
                    tX += desX*0.1;
                    tY += desY*0.1;
                    obox.style.transform = "rotateX("+(-tY)+"deg) rotateY("+tX+"deg)";
                    if (Math.abs(desX)<0.5 && Math.abs(desY)<0.5) {
                        clearInterval(obox.timer);
                    }
                },13);
            }
        return false;
    }
    //滚轮放大缩小
    mousewheel(document,function(e){
        e = e || window.event;
        var d = e.wheelDelta/120 || -e.detail/3;
            if (d>0) {
                index-=20;
            }else{
                index+=30;
            }
            (index<(-1050)&&(index=(-1050)));
        document.body.style.perspective = 1000 + index + "px";
    })
    function mousewheel(obj,fn){
        document.onmousewheel===null?obj.onmousewheel=fn:addEvent(obj,"DOMMouseScroll",fn)
    }
    function addEvent(obj,eName,fn){
        obj.attachEvent?obj.attachEvent("on"+eName,fn):obj.addEventListener(eName,fn);
    }
}
