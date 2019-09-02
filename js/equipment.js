/**
 * Created by Admin on 2019/8/7.
 */
$(function(){
    checkToken();
    //获取系统ip
    getUserIP(function(ip){
        sessionStorage.setItem('localIp',ip);
    });


    //查询设备入网列表
    var currPage = 1;
    var searchRecord = $('#searchRecord').val();
    var render = function(){
        $_ajax('/equipmentCtr/selectEquipmentInfo',{
            pageNum:currPage,
            pageSize: 10,
            equipmentIdentify:searchRecord
        },function(data){
            for(var i=0;i<data.data.list.length;i++){
                data.data.list[i].createTime = renderTime(data.data.list[i].createTime)
            }
            var html = template('tpl_tableContent', data.data);
            $('#tableContent').html(html);
            $('#tableContent').html(html)
            $('.totalPage').text('共'+data.data.total+'条')
            setPaginator(data.data.pageNum, Math.ceil(data.data.total / data.data.pageSize), render);

        })
    };
    render();
    var setPaginator = function (pageCurr,pageCount,pageCallback) {
        $('.pagination').pagination({
            pageCount: pageCount,
            current:pageCurr,
            jump: true,
            coping: true,
            homePage: '首页',
            endPage: '末页',
            prevContent: '上页',
            nextContent: '下页',
            callback: function (api) {
                currPage = api.getCurrent()
                pageCallback && pageCallback()
            }
        });
    };

    //  设备入网
    $('#btn-network').click(function(){
        var Identification = $('#Identification').val();
        var macAddress = $('#macAddress').val();
        var useIP = $('#useIP').val();
        sessionStorage.setItem('countNum2',0);
        if(Identification == ''){
            location.href="getUsbNumber://";
            getUsbTimeOutToNetwork()
        }else {
            $_ajax('/equipmentCtr/addEquipmentInfo',{
                terminalInfo:'',
                equipmentIdentify:Identification,
                macAddr:macAddress,
                ipAddr:useIP
            },function(data){
                console.log(data);
                if(data.data.success){
                    render();
                    layer.msg('入网成功',{icon: 1,time:1200,shade: [0.8, '#393D49']});
                }else {
                    layer.msg(data.data.information,{icon: 2,time:1200,shade: [0.8, '#393D49']});
                }
            });
        }

    });


//    搜索设备信息
    $('#btn-search').click(function(){
        searchRecord = $('#searchRecord').val();
        currPage = 1;
        render();
    });

    // 获取usb信息
    $('.autoGet').click(function(){
        $('#Identification').val('');
        $('#macAddress').val('');
        $('#useIP').val('');

        //点击手动获取前，调用的次数
        sessionStorage.setItem('countNum',0);
        $('#rotateImg').addClass('startRefreshImg');
        location.href="getUsbNumber://";
        getUsbTimeOut();
    });



    //设备入网前获取设备标识
    function getUsbTimeOutToNetwork(){
        var count = sessionStorage.getItem('countNum2');
        setTimeout(function(){
            $_ajaxAsync('/audioCtr/getUsbNumber',{
                ThisIp:sessionStorage.getItem('localIp')
            },function(data){
                console.log(data)
                if(!$.isEmptyObject(data.data)){
                    $('#Identification').val(data.data.usbNumber);
                    $('#macAddress').val(data.data.mac);
                    $('#useIP').val(sessionStorage.getItem('localIp'));
                    $_ajax('/equipmentCtr/addEquipmentInfo',{
                        terminalInfo:'',
                        equipmentIdentify:data.data.usbNumber,
                        macAddr:data.data.mac,
                        ipAddr:sessionStorage.getItem('localIp')
                    },function(data){
                        console.log(data);
                        if(data.data.success){
                            render();
                            layer.msg('入网成功',{icon: 1,time:1200,shade: [0.8, '#393D49']});
                        }else {
                            layer.msg('入网失败，请重新入网',{icon: 2,time:1200,shade: [0.8, '#393D49']});
                        }
                    });
                }else {
                    count++;
                    sessionStorage.setItem('countNum2',count);
                    if(count<4){
                        getUsbTimeOutToNetwork();
                    }else {
                        layer.msg('设备未连接',{icon: 2,time:1200,shade: [0.8, '#393D49']});
                    }
                }
            });
        },3000);
    }


});

//定时获取终端设备信息
function getUsbTimeOut(){
    var count = sessionStorage.getItem('countNum');
    setTimeout(function(){
        $_ajaxAsync('/audioCtr/getUsbNumber',{
            ThisIp:sessionStorage.getItem('localIp')
        },function(data){
            console.log(data);
            if(!$.isEmptyObject(data.data)){
                $('#Identification').val(data.data.usbNumber);
                $('#macAddress').val(data.data.mac);
                $('#useIP').val(sessionStorage.getItem('localIp'));
                $('#rotateImg').removeClass('startRefreshImg');
            }else {
                count++;
                sessionStorage.setItem('countNum',count);
                if(count < 4){
                    getUsbTimeOut()
                }else {
                    layer.msg('设备未连接',{icon: 2,time:1200,shade: [0.8, '#393D49']});
                    $('#rotateImg').removeClass('startRefreshImg');
                }

            }
        });
    },3000)
}


//时间格式转换
function renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

//获取本机ip
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //sten for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

