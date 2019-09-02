/**
 * Created by Admin on 2019/5/8.
 */

//const pubUrl = 'http://47.95.146.100:9902';
//const loginUrl = 'http://47.95.146.100:9902';
//const getUsbUrl = 'http://47.95.146.100:9902';

const pubUrl = 'https://vrs-public.tlifetech.com';
const loginUrl = 'https://vrs-public.tlifetech.com';
const getUsbUrl = 'https://vrs-public.tlifetech.com';


function $_ajaxLogin(url,params,callback){
    $.ajax({
        url:loginUrl+url,
        data:params,
        type:'post',
        dataType:'json',
        success:function(data){
            callback && callback(data)
        },
        error:function(error){
            console.log(error)
        }
    })
}

//验证是否登录
function checkToken(){
    //var username = sessionStorage.getItem('username');
    //var password = sessionStorage.getItem('password');
    //if(username == '' || password == '' || username == null || password == null){
    //    window.location.href = 'login.html';
    //}
    var token = sessionStorage.getItem('token');
    $_ajaxLogin('/signCtr/checkToken',{
        userToken:token
    },function(data){
        //console.log(data)
        if(!data.data.success){
            window.location.href = 'login.html';
        }
    });
}

//退出登录
$('.logout').click(function(){
    var token = sessionStorage.getItem('token');
    $_ajaxLogin('/signCtr/signOut',{
        userToken:token
    },function(data){
        //console.log(data);
        sessionStorage.setItem('token','');
        window.location.href = 'login.html';
    });

});

function $_ajax(url,params,callback){
    $.ajax({
        url:pubUrl+url,
        data:params,
        type:'post',
        dataType:'json',
        success:function(data){
            callback && callback(data)
        },
        error:function(error){
            console.log(error)
        }
    })
}

function $_ajaxAsync(url,params,callback){
    $.ajax({
        url:getUsbUrl+url,
        data:params,
        type:'post',
        dataType:'json',
        async:false,
        success:function(data){
            callback && callback(data)
        },
        error:function(error){
            console.log(error)
        }
    })
}

function $_ajaxArray(url,params,callback){
    $.ajax({
        url:pubUrl+url,
        data:params,
        type:'post',
        dataType:'json',
        traditional:true,
        success:function(data){
            callback && callback(data)
        },
        error:function(error){
            console.log(error)
        }
    })
}


function $_ajaxFileUpload(url,params,callback){
    $.ajax({
        url:pubUrl+url,
        data:params,
        type:'post',
        dataType:'json',
        async:true,
        processData : false,
        contentType : false,
        timeout:300000,
        success:function(data){
            callback && callback(data)
        },
        error:function(error){
            console.log(error)
        }
    })
}

var dateFormat = function(second){
    var dd,hh,mm,ss;
    second = typeof second === 'string' ? parseInt(second) : second;
    if(second < 0){
        return;
    }
    dd = second / (24 * 3600) | 0;
    second = Math.round(second) - dd * 24 * 3600;
    hh = second / 3600 | 0;
    second = Math.round(second) - hh * 3600;
    mm = second / 60 | 0;
    ss = Math.round(second) - mm * 60;
    if(Math.round(dd) < 10){
        dd = dd > 0 ? '0' + dd : '';
    }
    if(Math.round(hh) < 10){
        hh = '0' + hh;
    }
    if(Math.round(mm) < 10){
        mm = '0' + mm;
    }
    if(Math.round(ss) < 10){
        ss = '0' + ss;
    }
    return dd + ' ' + hh + ':' + mm + ':' + ss;
};

//（00:00:00）转秒
var timeToSecond = function(time){
    var splitTime = time.split(':')
    return parseInt(splitTime[0])*3600 + parseInt(splitTime[1])*60 + parseInt(splitTime[2])
}

//时间戳转换成时间
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate();
    D = D < 10 ? '0'+ D + ' ' : D + ' ';
    h = date.getHours();
    h = h < 10 ? '0'+ h +':' : h + ':';
    m = date.getMinutes();
    m = m < 10 ? '0'+ m +':' : m + ':';
    s = date.getSeconds();
    s = s < 10 ? '0'+ s : s;
    return Y+M+D+h+m+s;//时分秒可以根据自己的需求加上
}

//获取系统当前时间
function getSystemTime() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var day = myDate.getDate();
    var hours = myDate.getHours();
    var min = myDate.getMinutes();
    var second = myDate.getSeconds();
    month = month < 10 ? ('0'+month) : month;
    day = day < 10 ? ('0'+day) : day;
    hours = hours < 10 ? ('0'+hours) : hours;
    min = min < 10 ? ('0'+min) : min;
    second = second < 10 ? ('0'+second) : second;
    return year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + second
}

//获取系统当前时间
function timestamp() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return "" + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
}
function add0(m) {
    return m < 10 ? '0' + m : m;
}

