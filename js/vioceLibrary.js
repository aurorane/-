$(function(){
    checkToken();

    $('.J-datepicker').datePicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        max:getSystemTime()
    });

    var currPage = 1;
    var tableUserName = $('#tableUserName').val();
    var tableIDNumber = $('#tableIDNumber').val();
    var tableGender = $('#tableGender').val();
    var audioUserStatus = $('.activeStatue').attr('data-status');
    var tableStartTime = $('#tableStartTime').val();
    var tableEndTime = $('#tableEndTime').val();
    var render = function () {
        $_ajax('/audioCtr/selectUserInfo',{
            pageNum:currPage,
            pageSize: 10,
            audioUserName:tableUserName,
            audioUserSex:tableGender,
            audioUserIdNumber:tableIDNumber,
            audioUserStatus:audioUserStatus,
            actionTime:tableStartTime,
            endTime:tableEndTime
        },function (data) {
            console.log(data.data);
            for(var i=0;i<data.data.list.length;i++){
                data.data.list[i].creationTimeStamp = timestampToTime(data.data.list[i].creationTimeStamp)
            }
            var html = template('tpl_tableContent', data.data);
            $('#tableContent').html(html)
            $('.totalPage').text('共'+data.data.total+'条')
            setPaginator(data.data.pageNum, Math.ceil(data.data.total / data.data.pageSize), render);

            //没选中复选框不选，存在选中的复选框选择
            selectOrNo();
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

    //tab切换
    $('#audioUserStatus a').click(function(){
        $(this).addClass('activeStatue').siblings().removeClass('activeStatue');
        audioUserStatus = $('.activeStatue').attr('data-status');

        if(audioUserStatus == 2){
            $('.tableContent thead tr th:first').hide();
            $('#batchAudio').hide();
        }else {
            $('.tableContent thead tr th:first').show();
            $('#batchAudio').show()
        }
        render();
    });


    // 搜索功能
    $('#searchBtn').click(function(){
        tableUserName = $('#tableUserName').val();
        tableIDNumber = $('#tableIDNumber').val();
        tableGender = $('#tableGender').val();
        audioUserStatus = $('.activeStatue').attr('data-status');
        if($('#tableStartTime').val() != ''){
            tableStartTime = new Date($('#tableStartTime').val()).getTime()/1000;
        }else {
            tableStartTime = ''
        }
        if($('#tableEndTime').val()!= ''){
            tableEndTime = new Date($('#tableEndTime').val()).getTime()/1000;
        }else {
            tableEndTime = ''
        }

        //if(audioUserStatus == 2){
        //    $('.tableContent thead tr th:first').hide();
        //    $('#batchAudio').hide();
        //}else {
        //    $('.tableContent thead tr th:first').show();
        //    $('#batchAudio').show()
        //}
        if(tableEndTime-tableStartTime < 0){
            layer.msg('采集时间段不正确',{icon: 2,time:1200,shade: [0.8, '#393D49']});
            return false;
        }
        console.log(tableStartTime-tableEndTime);
        render();
    });

    //  删除功能
    $('#tableContent').on('click','.delBtn',function(){
        var currId = $(this).parents().parents().attr('id');
        layer.confirm('确定要删除该条信息吗?', {icon: 3, title:'提示',offset:''}, function(index){
            $_ajax('/audioCtr/deleteAudioInfo',{
                audioUserId:currId
            },function(data){
                if(data.data.success){
                    render();
                    layer.msg('删除成功',{icon: 1,time:1200,shade: [0.8, '#393D49']});
                }else {
                    layer.msg('删除失败',{icon: 2,time:1200,shade: [0.8, '#393D49']});
                }
            });
            layer.close(index);
        });
    });

    //查看详情
    $('#tableContent').on('click','.seeBtn',function(){
        var currId = $(this).parents().parents().attr('id');
        $_ajax('/audioCtr/queryAudioUser',{
            audioUserId:currId
        },function(data){
            console.log(data);
            //data.data.audioNameSplit = data.data.audioName.split('.')[0];
            //data.data.audioNameSplit = data.data.audioUrl.split('com/')[1];

            data.data.birthdayTimeStamp = timestampToTime(data.data.birthdayTimeStamp).split(' ')[0];
            var html = template('tpl_tableModal', data.data);
            $('#tableModal').html(html);
            // 播放按钮
            $('.btn-play').click(function(){
                var currAudioUrl = $(this).attr('data-audioUrl');
                $('#myAudio').attr('src',currAudioUrl);
                if($(this).hasClass('pause')){
                    $(this).removeClass('pause').addClass('play');
                    $(this).parents().parents().siblings().find('.btn-play').removeClass('play').addClass('pause')
                    $(this).parents().parents().siblings().find('.btn-play').text('播放');
                    $(this).text('停止');
                    $('#myAudio').get(0).play();
                }else if($(this).hasClass('play')){
                    $(this).removeClass('play').addClass('pause');
                    $(this).text('播放');
                    $('#myAudio').attr('src','');
                    $('#myAudio').get(0).pause();
                }

                $('#myAudio').on('ended',function () {
                    $('.btn-play').removeClass('play').addClass('pause');
                    $('.btn-play').text('播放');
                })

            })

        });
    });

    $('.close').click(function(){
        $('#myAudio').attr('src','');
        $('#myAudio').get(0).pause();
    });




    //批量上传功能
    $('#batchAudio').click(function(){
        var checkList = [];
        $('#tableContent tr input').each(function(i,item){
            if(item.checked){
                var currId = $(this).parents().parents().attr('id');
                checkList.push(currId)
            }
        });
        if(checkList.length == 0){
            layer.msg('请选择上传内容',{icon: 2,time:1200,shade: [0.8, '#393D49']});
            return false;
        }
        //console.log(JSON.stringify(checkList));
        $_ajaxArray('/audioCtr/batchAudio',{
            audioInfoIdArray:checkList
        },function(data){
            console.log(data)
            if(data.data.success){
                render();
                $('.parentCheck').prop('checked', false);
                layer.msg(data.data.information,{icon: 1,time:1200,shade: [0.8, '#393D49']});
            }else {
                layer.msg(data.data.information,{icon: 2,time:1200,shade: [0.8, '#393D49']});
            }
        })

    });

    //全选全不选
    $('.parentCheck').bind('click',function(){
        if(this.checked){
            $(this).parents().parents().parents().siblings().children('tr').find('input').each(function(){
                $(this).prop('checked', true);
            })
        }else {
            $(this).parents().parents().parents().siblings().children('tr').find('input').each(function(){
                $(this).prop('checked', false);
            })
        }
    });

});

//列表多选和不选时复选框的变化
function selectOrNo(){
    var list=[];
    $('#tableContent tr input').on('click',function(){
        var currId = $(this).parents().parents().attr('id');
        if($(this).get(0).checked){
            if(list.length == 0){
                list.push(currId)
            }else {
                var kk = list.some(function(v){
                    return v == currId
                });
                if(!kk){
                    list.push(currId);
                }
            }
        }else {
            var currIndexOf = list.indexOf(currId);
            if(currIndexOf>-1){
                list.splice(currIndexOf,1)
            }
        }
        if(list.length>0){
            $('.parentCheck').prop("checked", true);
        }else {
            $('.parentCheck').prop("checked", false);
        }
    })
}

