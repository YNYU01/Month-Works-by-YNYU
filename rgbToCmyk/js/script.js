const root = document.documentElement;
var HSL = {h:0,s:"50%",l:"50%"};
var RGB = {r:100,g:50,b:50};
var HSV = {h:0,s:"66%",v:"75%"};
function reColor(e,key,end){  
    var num = e.value;
    if(e.type == 'range'){
        e.nextElementSibling.value = num + end;
    }
    if(e.type == 'text'){
        num = e.value == 0 ? 0 : e.value.replace(/^0+/,'').match(/\d+/g).join().replace(',','');
        //console.log(num)
        if(num){
            if(key == 'h'){
                num > 360 ? num = 360 : num = num;
            } else {
                num > 100 ? num = 100 : num = num;
            };
        } else {
            num = num == 0 ? 0 : key == "h" ?  0 : 50;
        }
        e.value = num + end
        e.previousElementSibling.value = num;
    }
    HSL[key] = num + end;
    root.style.setProperty('--' + key,num + end);
    var rgb = hslToRgb(HSL["h"],HSL["s"],HSL["l"])
        RGB["r"] = rgb.r
        RGB["g"] = rgb.g
        RGB["b"] = rgb.b
    var hsv = hslToHsv(HSL["h"],HSL["s"],HSL["l"])
        HSV["h"] = hsv.h
        HSV["s"] = hsv.s + "%"
        HSV["v"] = hsv.v + "%"
    root.style.setProperty("--ss",HSV["s"])
    root.style.setProperty("--ll",HSV["v"])
    console.log(HSL.s,HSL.l,HSV.s,HSV.v)
    reColorValue(false);
}

function reColorValue(isPick){
    var hslValueBox = document.querySelectorAll('[data-color-value="hsl"]')[0];
    var rgbValueBox = document.querySelectorAll('[data-color-value="rgb"]')[0];
    hslValueBox.value = 'hsl(' + HSL["h"] + ',' + HSL["s"] + ',' + HSL["l"] + ')';
    rgbValueBox.value = 'rgb(' + Math.floor(RGB["r"]/100 * 255) + ',' + Math.floor(RGB["g"]/100 * 255) + ',' + Math.floor(RGB["b"]/100 * 255) + ')';
    if(isPick){
        Object.keys(HSL).forEach(item => {
        //console.log(item,HSL[item])
            document.getElementById(item + "-range").value = HSL[item].toString().replace("%","");
            document.getElementById(item + "-text").value = HSL[item];
        })
    }
}

function pickColor(e,event,type){
    var x = event.clientX
    var y = event.clientY
    var w = e.offsetWidth
    var h = e.offsetHeight
    var startX = e.offsetLeft
    var startY = e.offsetTop
    if(type == "hsl"){
        var s = Math.floor((x - startX)/w * 100);
        var l = 100 - Math.floor((y - startY)/h * 100);
        s < 0 ? s = 0 : s = s
        l < 0 ? l = 0 : l = l
        s > 100 ? s = 100 : s = s
        l > 100 ? l = 100 : l = l
        s = s + "%"
        l = l + "%"
    //console.log(x,y,w,h,startX,startY,s)
        root.style.setProperty('--s',s);
        root.style.setProperty('--l',l);
        HSL.s = s;
        HSL.l = l;
        var hsv = hslToHsv(HSL.h,HSL.s,HSL.l)
        HSV.h = hsv.h
        HSV.s = hsv.s + "%"
        HSV.v = hsv.v + "%"
        var rgb = hslToRgb(HSL.h,s,l)
        RGB["r"] = rgb.r
        RGB["g"] = rgb.g
        RGB["b"] = rgb.b
        
    root.style.setProperty("--ss",HSV["s"])
    root.style.setProperty("--ll",HSV["v"])
    }
    if(type == "hsv"){
        var ss = Math.floor((x - startX)/w * 100);
        var ll = 100 - Math.floor((y - startY)/h * 100);
        ss < 0 ? ss = 0 : ss = ss
        ll < 0 ? ll = 0 : ll = ll
        ss > 100 ? ss = 100 : ss = ss
        ll > 100 ? ll = 100 : ll = ll 
        ss = ss + "%"
        ll = ll + "%"
    //console.log(x,y,w,h,startX,startY,s)
        root.style.setProperty('--ss',ss);
        root.style.setProperty('--ll',ll);
        HSV.s = ss;
        HSV.v = ll;
        var hsl = hsvToHsl(HSV.h,HSV.s,HSV.v)
        HSL.h = hsl.h
        HSL.s = hsl.s + "%"
        HSL.l = hsl.l + "%"
        var rgb = hslToRgb(HSL.h,HSL.s,HSL.l)
        RGB["r"] = rgb.r
        RGB["g"] = rgb.g
        RGB["b"] = rgb.b
        
    root.style.setProperty("--s",HSL["s"])
    root.style.setProperty("--l",HSL["l"])
    }
   console.log(HSL.s,HSL.l,HSV.s,HSV.v)
    reColorValue(true)
    
}


function hslToRgb(h, s, l) {//rgb百分比
    s = s.replace("%","")
    l = l.replace("%","")
    // 将色相h从角度转换为弧度
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        // 饱和度为0时是灰色，使用亮度作为RGB所有值
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

   
    return {
        r: Math.round(r * 100),
        g: Math.round(g * 100),
        b: Math.round(b * 100)
    };
}

function hslToHsv(h,s,l) {
    s = s.replace("%","")
    l = l.replace("%","")
    s /= 100; // HSL中的饱和度（范围0到1）
    l /= 100; // HSL中的亮度（范围0到1）

    let v;
    if (s === 0) {
        // 如果饱和度为0，则HSV的饱和度也为0，明度等于HSL的亮度
        v = l;
        return {h:h,s:0,v:Math.floor(v * 100) }
    } else {
        if (l <= 0.5) {
            v = l * (1 + s);
        } else {
            v = l + s - l * s;
        }
        let sv = (2 * (v - l)) / v;
        if (l == 0){
            sv = s
        }
        if (l == 1){
            sv = 0
        }
        return {h:h,s:Math.floor(sv * 100),v:Math.floor(v * 100)}; // 返回HSV值，乘以100以匹配常见的百分比表示法
    }
}

function hsvToHsl(h, s, v) {
    s = s.replace("%","")
    v = v.replace("%","")
    s /= 100; // HSL中的饱和度（范围0到1）
    v /= 100; // HSL中的亮度（范围0到1）
    let l = (2 - s) * v / 2;

    if (l !== 0) {
        if (l === 1) {
            s = 0;
        } else {
            s = s * v / (l < 0.5 ? 2 * l : 2 - 2 * l);
        }
    } else {
        s = 0;
    }
    //console.log(h,s * 100,l * 100)
        return {h:h,s:Math.floor(s * 100),l:Math.floor(l * 100)}; // 返回HSL值，乘以100以匹配常见的百分比表示法

}

