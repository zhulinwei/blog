require('../css/blog.css');
require('script-loader!./util.js');
require("script-loader!./plugs/nprogress.js");

$(function(){
    $('body').show();
    NProgress.start();
    setTimeout(function(){
        NProgress.done();
    },500)
})