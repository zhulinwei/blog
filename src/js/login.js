require('../css/login.css');
require("script-loader!./common.js");
require("script-loader!./plugs/nprogress.js");

$(function(){
    // 表单检验规则
    let standard = {
        isNonEmpty: ( dom,value,errorMsg ) => {
            if( value.trim() === ''){
                return {
                    dom: dom,
                    errorMsg: errorMsg
                }
            }
        }
    };

    let nprogressStart = function(){
        if( isPc() ){
            NProgress.start();
        }
    };

    let nprogressDone = function(){
        if( isPc() ){
            NProgress.done();
        }
    };

    // 构造器，内部存在add()与start()函数，方便以后可轻易地拓展表单验证规则
    let Validator = function() {
        this.cache = [];
    };

    // 添加检验规则
    Validator.prototype.add = function( dom,rule,errorMsg )  {
        let array =[];
        this.cache.push(function(){
            array.push( dom )
            array.push( dom.val() );
            array.push( errorMsg );
            return standard[ rule ].apply( dom,array );
        })
    };

    Validator.prototype.start = function() {
        for( let i=0,fn; fn = this.cache[i++]; ){
            let msg = fn();// 调用函数fn()后，若用户输入内容不符合表单检验规则，会返回错误信息
            if( msg ){// 如果出现错误信息，说明检验没有通过
                return msg;
            }
        }
    };

    // 给表单添加检验规则
    let addRule = function() {
        let validator = new Validator();

        validator.add( $('#username'), 'isNonEmpty', '用户名不能为空');
        validator.add( $('#password'), 'isNonEmpty', '密码不能为空');

        let result = validator.start();
        return result;
    };


    // 初次离开username或password时是不会进行检测或错误提示的(经常这样实在是太烦了)，只有在提交表单出错后用户再次输入信息时，才会启用该函数
    $('#username, #password').keydown(function(){

        // 如果存在错误信息，当表单输入内容时隐藏错误提示
        if( !$(this).parent().next().hasClass('hidden') ){

            let errorTip = $(this).parent().next();
            // 错误提示渐变消失
            errorTip.fadeOut(500, function(){
                errorTip.addClass('hidden');
                errorTip.removeAttr('style');
            })
            
        }
    });

    // 提交表单前，检查
    $('.login-box-body .btn-confirm').click(function(event){
        let error = addRule();

        // 返回有错误信息
        if( error ){
            $(error.dom).parent().next().removeClass('hidden').children('span').html(error.errorMsg);
            return false;
        }

        $.ajax({
            type: 'post',
            url: '/login.html/checkpwd',
            data: {
                'username': $('#username').val(),
                'password': $('#password').val()
            },
            beforeSend: function(){
                nprogressStart();
            }
        }).done( function(data){
            nprogressDone();

            if( data.code === 1 ){
                window.location.href = '/backstage.html'
            }else if( data.code === 1001 ){
                $('.admin-error').removeClass('hidden').children('span').html(data.message);
            }else if( data.code === 1002 ){
                $('.password-error').removeClass('hidden').children('span').html(data.message);
            }
        })
    });
})     
