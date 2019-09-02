var timer;
$(function () {
    checkToken();
    $('#submitBtn').attr('disabled',true);
    $('.btn-replace').attr('disabled',true);
    $('.btn-replace').css('opacity',0.7);
    $('#handleClickBtn').attr('disabled',true);
    $('#handleClickBtn').css('opacity',0.7);

    // 时间段选择插件激活
    $('.J-datepicker-day').datePicker({
        format:'YYYY-MM-DD',
        max:getSystemTime(),
        hide:function () {
            $('#form').data('bootstrapValidator').updateStatus('birthTime','NOT_VALIDATED',null).validateField('birthTime');
        }
    });

    $('#handleClickBtn').click(function(){
        if(timeToSecond($('.durationTime').text())<1){
            layer.msg('请录制音频',{icon: 3,time:1200,shade: [0.8, '#393D49']});
            return false;
        }
    });

    var isActiveClick = true;
    $('#btn-active').click(function(){
        $('.playTime').css('display','none');
        $('.time').css('display','block');
        var currClass = $(this).attr('class')
        if(currClass == 'btn-start'){
            startRecording();
        }else {
            obtainRecord();
            window.clearInterval(timer);
            $('.time').text('00:00:00');

            sessionStorage.setItem('currTime',0);
            $('.waveformGif').css('display','none');

            $(this).removeClass('btn-stop').addClass('btn-start');
            $(this).children().attr('src','img/startRecord.png')

            $('#handleClickBtn').attr('disabled',false);
            $('#handleClickBtn').css('opacity',1);
            $('#btn-test').attr('disabled',false);
            $('#btn-test').css('opacity',1);

        }

        setTimeout(function(){
            isActiveClick = true;
            $('#btn-active').attr('disabled',false);
        }, 1000);
    });
    var hh = true;
    $('.btn-replace').click(function(){
        layer.confirm('确定要重新录制吗?', {icon: 3, title:'提示',offset:''}, function(index){
            if(hh){
                hh = false;
                $('.playTime').css('display','none');
                $('.time').css('display','block');
                $('#btn-active').children().attr('src','img/stopRecord.png');
                $('#btn-active').removeClass('btn-stop').addClass('btn-start');
                stopRecord();
                window.clearInterval(timer);
                $('.time').text('00:00:00');
                sessionStorage.setItem('currTime',0);
                startRecording();
            }
            setTimeout(function(){
                hh = true;
            },1000);
            layer.close(index);
        });


    });


    var Form = $('#form');
    formValidator(Form);

    $('#submitBtn').click(function(){
        if(timeToSecond($('.durationTime').text())<1){
            layer.msg('请录制音频',{icon: 3,time:1200,shade: [0.8, '#393D49']});
            return false;
        }
        var bv = Form.data('bootstrapValidator');
        bv.validate();
        if(bv.isValid()){
            var indexLoad=layer.load(1,{shade:[0.7,'#fff']});
            //var record = recorder.getBlob();
            var files = new FormData();
            var date = new Date($('#birthTime').val())
            //files.append('audioFile',record.blob);
            files.append('systemUserInfoId',1);
            files.append('audioName',sessionStorage.getItem('audioSoundUrl'));
            files.append('signalNoiseRatio',$('.noiseRatio').text());
            files.append('audioDecibel',$('.decibel').text());
            files.append('validDuration',$('.duration').text());
            files.append('averageEnergy',$('.energy').text());
            files.append('audioUserName',$('#audioUserName').val());
            files.append('audioUserSex',$('#audioUserSex').val());
            files.append('birthdayTimeStamp',date.getTime()/1000);
            files.append('audioUserBirthOrigin',$('#audioUserBirthOrigin').val());
            files.append('audioUserBirthPlace',$('#audioUserBirthPlace').val());
            files.append('audioUserHabitation',$('#audioUserHabitation').val());
            files.append('audioUserNation',$('#audioUserNation').val());
            files.append('audioUserDialect',$('#audioUserDialect').val());
            files.append('audioUserLanguages',$('#audioUserLanguages').val());
            files.append('audioUserSchooling',$('#audioUserSchooling').val());
            files.append('audioUserOccupation',$('#audioUserOccupation').val());
            files.append('audioUserPhoneNumber',$('#audioUserPhoneNumber').val());
            files.append('audioUserIdNumber',$('#audioUserIdNumber').val());
            files.append('audioUserAddress',$('#audioUserAddress').val());
            files.append('audioUserComment',$('#audioUserComment').val());
            files.append('subjectId',$('#subjectId').val());
            files.append('depositoryId',$('#depositoryId').val());

            $_ajaxFileUpload('/audioCtr/addAudioAndUser',files,function(data){
                console.log(data);
                layer.close(indexLoad);
                if(data.data.success){
                    layer.msg(data.data.information,{icon: 1,time:1200,shade: [0.8, '#393D49']});
                }else {
                    layer.msg(data.data.information,{icon: 2,time:1200,shade: [0.8, '#393D49']});
                }
                document.getElementById("form").reset();
                resetForm(Form);
                $('.duration').text(0);
                $('.noiseRatio').text(0);
                $('.decibel').text(0);
                $('.clipping').text(0);
                $('.energy').text(0);
                $('.userNumber').text(0);

                $('.currTime').text('00:00:00');
                $('.durationTime').text('00:00:00');
                $('.playTime').css('display','none');
                $('.time').css('display','block');
                $('#waveform').html('');
                $('.toneResult').text('未检测到音频文件');
            })

        }
    });




    //  检测按钮检测环境
    var startTest = true;
    $('#btn-test').click(function(){
        if(startTest){
            startTest = false;
            $(this).attr('disabled',true);
            //$(this).css('opacity',0.7);
            $('.playTime').css('display','none');
            $('.time').css('display','block');
            var currClass = $(this).attr('class');
            console.log(currClass);

            if(currClass == 'btn-testStart'){
                startRecording1();
            }else {
                obtainRecord1();
                window.clearInterval(timer1);
                $('.time').text('00:00:00');

                sessionStorage.setItem('currTime',0);
                $('.waveformGif').css('display','none');

                $(this).removeClass('btn-testStop').addClass('btn-testStart');
                $(this).text('开始检测');

                $('#handleClickBtn').attr('disabled',false);
                $('#handleClickBtn').css('opacity',1);
                $('#btn-active').attr('disabled',false);
                $('#btn-active').css('opacity',1);
                $('.btn-replace').attr('disabled',true);
                $('.btn-replace').css('opacity',0.7);
            }
        }

        setTimeout(function(){
            startTest = true;
            $('#btn-test').attr('disabled',false);
            //$('#btn-test').css('opacity',1);
        },1000)

    });



});

//表单验证
function formValidator(form) {
    form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            audioUserIdNumber: {
                validators: {
                    notEmpty: {
                        message: '身份证号不能为空'
                    },
                    stringLength: {
                        max: 18
                    },
                    regexp: {
                        regexp: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                        message: '身份证号不正确'
                    }
                }
            },
            birthTime:{
                trigger:'change',
                validators: {
                    notEmpty: {
                        message: '出生日期不能为空'
                    }
                }
            }, audioUserName: {
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 30,
                        message: '请输入1到30个字符'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                        message: '姓名格式不正确'
                    }
                    ///^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
                }
            },audioUserBirthOrigin:{
                validators: {
                    notEmpty: {
                        message: '籍贯不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 30,
                        message: '请输入1到30个字符'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/,
                        message: '格式不正确'
                    }
                }
            }
        }
    });
}

//表单重置
function resetForm(form){
    form.data('bootstrapValidator').destroy();
    form.data('bootstrapValidator', null);
    $("select.selectpicker").each(function(){
        $(this).selectpicker('val',$(this).find('option:first').val());
        $(this).find("option:first").attr("selected", true);
    });
    formValidator(form);
}

var recorder;
var audio = document.getElementById('luyinAudio');

function startRecording() {
    HZRecorder.get(function (rec) {
        recorder = rec;
        recorder.start();
        sessionStorage.setItem('currTime',0);
        $('#handleClickBtn').attr('disabled',true);
        $('#handleClickBtn').css('opacity',0.7);
        $('.btn-replace').attr('disabled',false);
        $('.btn-replace').css('opacity',1);
        $('#btn-test').attr('disabled',true);
        $('#btn-test').css('opacity',0.7);

        $('.duration').text(0);
        $('.noiseRatio').text(0);
        $('.decibel').text(0);
        $('.clipping').text(0);
        $('.energy').text(0);
        $('.userNumber').text(0);

        $('#waveform').html('');
        $('.waveformGif').css('display','inline-block');

        //点击开始录音，弹框确定之后才开始修改
        timer = setInterval(function(){
            $('.time').text(dateFormat(sessionStorage.getItem('currTime')));
        },1000);
        $('#btn-active').removeClass('btn-start').addClass('btn-stop');
        $('#btn-active').children().attr('src','img/stopRecord.png');

    },{error:showError});
}

function obtainRecord(){
    if(!recorder){
        showError("请先录音");
        return;
    }
    var record = recorder.getBlob();
    if(record.duration!==0){
        console.log(record.blob);

        $('.playTime').css('display','block');
        $('.time').css('display','none');
        $('.currTime').html('00:00:00');
        $('#btn-active').attr('src','img/startRecord.png');

        var durationTime;
        var playCurrTime=0;

        $('#handleClickBtn').remove();
        var playBtn = document.createElement('button');
        var playImg = document.createElement('img');

        playBtn.id='handleClickBtn';
        playBtn.className='startPlay';
        playImg.src = 'img/startPlay.png';
        playBtn.append(playImg);
        $(".btnCont").prepend(playBtn);
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            height:200,
            barWidth: 1,
            barHeight: 1.2,
            audioRate:1,
            cursorWidth:10,
            cursorColor:'#ffffff',
            mediaControls: true,
            scrollParent: true,
            progressColor:'#359EAD',//播放之后的颜色
            waveColor:'#808080',//播放之前的颜色
        });

        wavesurfer.loadBlob(record.blob);

        //点击页面频谱图位置
        wavesurfer.on('seek',function(){
            playCurrTime = parseInt(wavesurfer.getCurrentTime());
            sessionStorage.setItem('playCurrTime',playCurrTime)
            $('.currTime').html(dateFormat(playCurrTime))
        })
        //  加载完成
        var loadIndex = layer.load(2,{shade: [0.5, '#ffffff']});
        wavesurfer.on('ready', function () {
            durationTime = parseInt(wavesurfer.getDuration());
            $('.durationTime').text(dateFormat(durationTime));
            $('#handleClickBtn').click(function(){
                var currPlayStatus = $(this).attr('class');
                if (currPlayStatus == 'startPlay'){
                    $(this).children().attr('src','img/pausePlay.png');
                    wavesurfer.play();
                    $(this).removeClass('startPlay').addClass('stopPlay')
                    $('.btn-replace').attr('disabled',true);
                    $('.btn-replace').css('opacity',0.7);
                    $('#btn-active').attr('disabled',true);
                    $('#btn-active').css('opacity',0.7);
                    $('#btn-test').attr('disabled',true);
                    $('#btn-test').css('opacity',0.7);

                }else if(currPlayStatus == 'stopPlay'){
                    $(this).children().attr('src','img/startPlay.png');
                    wavesurfer.pause();
                    $(this).removeClass('stopPlay').addClass('startPlay');

                    $('.btn-replace').attr('disabled',false);
                    $('.btn-replace').css('opacity',1);
                    $('#btn-active').attr('disabled',false);
                    $('#btn-active').css('opacity',1);
                    $('#btn-test').attr('disabled',false);
                    $('#btn-test').css('opacity',1);

                }

            });
            var getFiles = new window.File([record.blob], timestamp()+'.wav', {type: 'audio/wav'});
            console.log(getFiles)
            var files = new FormData();
            files.append('audioFile',getFiles);

            $_ajaxFileUpload('/audioCtr/getAudioInfo',files,function(data){
                layer.close(loadIndex);
                console.log(data);
                $('.duration').text(data.data.duration);
                $('.noiseRatio').text(data.data.noiseRatio);
                $('.decibel').text(data.data.decibel);
                $('.energy').text(data.data.energy);
                $('.clipping').text(data.data.overstep);
                $('.userNumber').text(data.data.userNum);
                if(data.data.duration < 10){
                    $('#submitBtn').attr('disabled',true);
                        $('.toneResult').text('录音不符合采集质量要求');
                        layer.msg('有效时长不足10s',{icon: 3,time:1200,shade: [0.8, '#393D49']});
                        return false;
                }else {
                    $('.toneResult').text('录音符合采集质量要求');
                    $('#submitBtn').attr('disabled',false);
                    sessionStorage.setItem('audioSoundUrl',data.data.audioPath);
                }


            });

        });
        //当前时间
        wavesurfer.on('audioprocess',function(){
            playCurrTime = parseInt(wavesurfer.getCurrentTime());
            sessionStorage.setItem('playCurrTime',playCurrTime)
            $('.currTime').html(dateFormat(playCurrTime))
        });
        //播放完
        wavesurfer.on('finish',function(){
            $('#handleClickBtn').removeClass('stopPlay').addClass('startPlay');
            $('#handleClickBtn').children().attr('src','img/startPlay.png');

            $('.btn-replace').attr('disabled',false);
            $('.btn-replace').css('opacity',1);
            $('#btn-active').attr('disabled',false);
            $('#btn-active').css('opacity',1);
        });


    }else{
        showError("请先录音")
    }
    //recorder.clear();

};

//function downloadRecord(record){
//    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
//    save_link.href = URL.createObjectURL(record);
//    var now=new Date;
//    save_link.download = now.Format("yyyyMMddhhmmss");
//    fake_click(save_link);
//}



function stopRecord(){
    //recorder&&recorder.stop();
    recorder.clear();
};
var msg={};

//$(document).on("click",".voiceItem",function(){
//    var id=$(this)[0].id;
//    var data=msg[id];
//    playRecord(data.blob);
//})

var ct;
function showError(msg){
    console.log(msg);
    clearTimeout(ct);
    ct=setTimeout(function() {
        $(".error").html("")
    }, 3000);
}


var recorder1;
var timer1;

function startRecording1() {
    HZRecorder1.get(function (rec) {
        recorder1 = rec;
        recorder1.start();
        sessionStorage.setItem('currTime',0);
        $('#handleClickBtn').attr('disabled',true);
        $('#handleClickBtn').css('opacity',0.7);
        $('.btn-replace').attr('disabled',true);
        $('.btn-replace').css('opacity',0.7);
        $('#btn-active').attr('disabled',true);
        $('#btn-active').css('opacity',0.7);

        $('.duration').text(0);
        $('.noiseRatio').text(0);
        $('.decibel').text(0);
        $('.clipping').text(0);
        $('.energy').text(0);
        $('.userNumber').text(0);

        $('#waveform').html('');
        $('.waveformGif').css('display','inline-block');

        //点击开始录音，弹框确定之后才开始修改
        timer1 = setInterval(function(){
            $('.time').text(dateFormat(sessionStorage.getItem('currTime')));
        },1000);
        $('#btn-test').removeClass('btn-testStart').addClass('btn-testStop');
        $('#btn-test').text('停止检测');

    },{error:showError});
}

function obtainRecord1(){
    if(!recorder1){
        showError("请先录音");
        return;
    }
    var record = recorder1.getBlob();
    if(record.duration!==0){
        console.log(record.blob);

        $('.playTime').css('display','block');
        $('.time').css('display','none');
        $('.currTime').html('00:00:00');

        var durationTime;
        var playCurrTime=0;

        $('#handleClickBtn').remove();
        var playBtn = document.createElement('button');
        var playImg = document.createElement('img');

        playBtn.id='handleClickBtn';
        playBtn.className='startPlay';
        playImg.src = 'img/startPlay.png';
        playBtn.append(playImg);
        $(".btnCont").prepend(playBtn);
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            height:200,
            barWidth: 1,
            barHeight: 1.2,
            audioRate:1,
            cursorWidth:10,
            cursorColor:'#ffffff',
            mediaControls: true,
            scrollParent: true,
            progressColor:'#359EAD',//播放之后的颜色
            waveColor:'#808080',//播放之前的颜色
        });

        wavesurfer.loadBlob(record.blob);

        //点击页面频谱图位置
        wavesurfer.on('seek',function(){
            playCurrTime = parseInt(wavesurfer.getCurrentTime());
            sessionStorage.setItem('playCurrTime',playCurrTime)
            $('.currTime').html(dateFormat(playCurrTime))
        })
        //  加载完成
        wavesurfer.on('ready', function () {
            durationTime = parseInt(wavesurfer.getDuration());
            $('.durationTime').text(dateFormat(durationTime));
            $('#handleClickBtn').click(function(){
                var currPlayStatus = $(this).attr('class');
                if (currPlayStatus == 'startPlay'){
                    $(this).children().attr('src','img/pausePlay.png');
                    wavesurfer.play();
                    $(this).removeClass('startPlay').addClass('stopPlay');
                    $('.btn-replace').attr('disabled',true);
                    $('.btn-replace').css('opacity',0.7);
                    $('#btn-active').attr('disabled',true);
                    $('#btn-active').css('opacity',0.7);
                    $('#btn-test').attr('disabled',true);
                    $('#btn-test').css('opacity',0.7);

                }else if(currPlayStatus == 'stopPlay'){
                    $(this).children().attr('src','img/startPlay.png');
                    wavesurfer.pause();
                    $(this).removeClass('stopPlay').addClass('startPlay');

                    $('.btn-replace').attr('disabled',false);
                    $('.btn-replace').css('opacity',1);
                    $('#btn-active').attr('disabled',false);
                    $('#btn-active').css('opacity',1);
                    $('#btn-test').attr('disabled',false);
                    $('#btn-test').css('opacity',1);

                }

            });
            var getFiles = new window.File([record.blob], timestamp()+'.wav', {type: 'audio/wav'});
            console.log(getFiles)
            var files = new FormData();
            files.append('audioFile',getFiles);

        });
        //当前时间
        wavesurfer.on('audioprocess',function(){
            playCurrTime = parseInt(wavesurfer.getCurrentTime());
            sessionStorage.setItem('playCurrTime',playCurrTime)
            $('.currTime').html(dateFormat(playCurrTime))
        });
        //播放完
        wavesurfer.on('finish',function(){
            $('#handleClickBtn').removeClass('stopPlay').addClass('startPlay');
            $('#handleClickBtn').children().attr('src','img/startPlay.png');

            $('.btn-replace').attr('disabled',false);
            $('.btn-replace').css('opacity',1);
            $('#btn-active').attr('disabled',false);
            $('#btn-active').css('opacity',1);
            $('#btn-test').attr('disabled',false);
            $('#btn-test').css('opacity',1);
        });

    }else{
        showError("请先录音")
    }
    //recorder.clear();
};
