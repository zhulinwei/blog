require('../css/blog.css');
require("script-loader!./common.js");
require("script-loader!./plugs/nprogress.js");

$(function(){
    $('body').show();
    if(isPc()){
        $('.navbar .collapse .head-center li a').click(function(){
            NProgress.start();                
            NProgress.set(0.4);
            setTimeout(function(){
                NProgress.set(0.7);
            },1000)
            setTimeout(function(){
                NProgress.set(0.8);
            },1500)
            setTimeout(function(){
                NProgress.set(0.9);
            },2000)
        })
    }
})