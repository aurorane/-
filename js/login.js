$(function(){
    var form = $('#form');
    formValidator(form);
    $('.login').click(function () {
        var bv = form.data('bootstrapValidator');
        bv.validate();
        if(bv.isValid()){
            var username = $('#username').val();
            var password = $.md5($('#password').val());

            $_ajaxLogin('/signCtr/signIn',{
                userNumber:username,
                userPassword:password
            },function(data){
                console.log(data)
                if(data.data.success){
                    sessionStorage.setItem('token',data.data.token);
                    window.location.href = 'index.html'
                }else {
                    alert('用户名或密码不正确');
                    $("#form").data('bootstrapValidator').destroy();
                    $('#form').data('bootstrapValidator', null);
                    formValidator();
                }
            });

            //if(username == 'admin' && password == 'qweasd'){
            //    sessionStorage.setItem('username','admin');
            //    sessionStorage.setItem('password','qweasd');
            //    window.location.href = 'index.html'
            //}else {
            //    alert('用户名或密码不正确')
            //    $("#form").data('bootstrapValidator').destroy();
            //    $('#form').data('bootstrapValidator', null);
            //    formValidator();
            //}
            $('#username').val('');
            $('#password').val('');
        }
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            $('.login').triggerHandler('click');
        }
    });


});
function formValidator(form) {
    form.bootstrapValidator({
        message: '输入值不合法',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_（）()\. \u4e00-\u9fa5 ]+$/,
                        message: '用户名只能由字母、数字、点、下划线、括号和汉字组成'
                    }
                }
            }
            , password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }, stringLength: {
                        min: 6,
                        max: 20,
                        message: '请输入6到20个字符'
                    },regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能由字母、数字、点、下划线组成'
                    }
                }
            }
        }
    });
}
