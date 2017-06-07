require('../css/blog.css');
require("script-loader!./common.js");
require("script-loader!./plugs/ejs.min.js");
require("script-loader!./plugs/nprogress.js");
require("script-loader!./plugs/headroom.min.js");
require("script-loader!./plugs/jQuery.headroom.min.js");

$(function(){
    let Blog = {
        // 防止滑动到底部多次触发AJAX
        send: false,
        limit: 10,
        isDetail: (value) => {
            var reg = /detail/g
            return value.match(reg);
        },
        something: (value) => {
            var reg = /\S+/;
            return reg.test(value);
        },
        init: () => {
            Blog.send = true;
            if( hash === ''  ){// 保证是博客首页
                return Blog.getIndex();
            }else{
                hash = hash.split('#')[1];
                $('.container .category .category-item a').each(function(index,data){
                    if( hash && ($(data).html() === hash) ){
                        let catalogId = $(this).attr('catalogId');
                        Blog.getCatalogActicle( catalogId );
                        return false;
                    }
                })
            }
        },
        getIndex: () => {
            $.ajax({
                type: 'get',
                url: '/blog.html/showActicles'
            }).done(function(data){
                let html = data.length === 0 ? '暂无最新文章' : ejs.render( $('#lastest').html(),{ lastests: data } );                    
                $('.lastest-item').html( html );
                if( data.length < 10 ){
                    // 显示暂无更多文章
                    $('.container .loadmore').removeClass('hidden');
                    // 既然无更过文章了，就没有必要进行下一页的请求了
                    $('.container .loader').attr('curr','null');
                    $('.loader').addClass('hidden');                            
                }else if( data.length === 10 ){
                    $('.loader').removeClass('hidden');
                }
                // 防止在刷新时出现getCatalogActicle与getNextActicle均触发的现象
                Blog.send = false;
            })
        },
        getCatalogActicle: (catalogId) => {
            $.ajax({
                type: 'get',
                url: '/blog.html/showActicles?catalogId=' + catalogId
            }).done( (data) => {
                let html = data.length === 0 ? '暂无最新文章' : ejs.render( $('#lastest').html(),{ lastests: data } );                    
                $('.lastest-item').html( html );
                if( data.length < 10 && data.length != 0  ){
                    // 显示暂无更多文章
                    $('.container .loadmore').removeClass('hidden');
                    // 既然无更过文章了，就没有必要进行下一页的请求了
                    $('.container .loader').attr('curr','null');
                }
                // 防止在刷新时出现getCatalogActicle与getNextActicle均触发的现象
                Blog.send = false;
            })
        },
        getComments: () => {
            let connectQq = $('.connectQq').attr('href') + search;
            // QQ登录及回调地址
            $('.connectQq').attr('href',connectQq)
            // 去获取用户信息和评论详情
            $.ajax({
                type: 'get',
                url: '/blog.html/showComment' + search
            }).done(function(data){
                let length = data.comments.length;
                var html = ejs.render( $('#comments').html(),{ comments: data.comments, length: length, currentUser: data.currentUser });
                $('.comment').html( html );
                // 如果url中含有#comment，则直接滑倒评论处
                if( hash === '#comments' ){
                    let targetTop = $(".comment").offset().top;
                    $("html,body").animate({scrollTop: targetTop}, 1000);
                }
            })
        },
        getNextActicle: (curr,catalogId) => {
            // 在该请求没有结束之前不允许重复发送请求            
            Blog.send = true;
            $.ajax({
                type: 'get',
                url: '/blog.html/nextActicles?curr=' + curr + '&catalogId=' + catalogId
            }).done(function(data){
                if( data.length < 10 ){
                    $('.loader').attr('curr','null');
                    $('.loader ').addClass('hidden');
                    $('.loadmore').removeClass('hidden');
                }else{
                    $('.loader').attr('curr',parseInt(curr)+1);                    
                }
                let html = data.length === 0 ? '暂无最新文章' : ejs.render( $('#lastest').html(),{ lastests: data } );                                    
                $('.lastest').append( html );
                Blog.send = false;
            })
        },
        saveComment: (data) => {
            $.ajax({
                type: 'post',
                url: '/blog.html/saveComment',
                data: data
            }).done(function(data){
                let comment = data[0];
                let total = $('.comment .block-title .total').html();
                $('.comment .block-title .total').html( parseInt(total)+1 );
                $('.comment .comment-input').val('');
                $('.comment .comment-item .comment-button').css('color','#808080');
                $('.comment .comment-item .comment-button').css('border-color','#808080');
                let html = Blog.createComment( comment );
                $('.comment').append( html );
            })
        },
        createComment: (comment) => {
                let reply;
                if( !comment.to ){
                    reply = comment.from.nickName;
                }else{
                    reply = comment.from.nickName + '<span class="speak-to">回复</span>' + comment.to.nickName;
                }
                let html = '';
                html += '<div class="comment-item comment-show">';
                html += '   <div class="img-wrapper">';
                html += '       <img class="from-user" src="' + comment.from.thumbnail + '" alt="">';
                html += '   </div>';
                html += '   <div class="comment-wrapper">';
                html += '       <div class="comment-header">';
                html += '           <p>' + reply + '</p>';
                html += '       </div>';
                html += '       <div class="comment-content">';
                html += '           <p>' + comment.content + '</p>';                    
                html += '       </div>';
                html += '       <div class="comment-footer">';
                html += '           <p><span class="comment-time">1秒前</span><button class="comment-default comment-answer" openId=' + comment.from._id + '>回复</button></p>';
                html += '       </div>';
                html += '       <div class="comment-item comment-frame"></div>';
                html += '   </div>';
                html += '</div>';
        },
        createFrame: (that,toId,thumbnail) => {
            let html = '';
            html += '<div class="img-wrapper">';
            html += '   <img src="' + thumbnail + '" alt="">';
            html += '</div>';
            html += '<div class="comment-wrapper">';
            html += '   <div class="comment-editor">';
            html += '       <input type="text">';
            html += '   </div>';
            html += '   <div class="comment-footer pull-right">';
            html += '       <button class="comment-default comment-cancel">取消</button>';
            html += '       <button class="comment-default comment-reversion" toId=' + toId + '>回复</button>';
            html += '   </div>';
            html += '</div>';
            $(that).parents('.comment-wrapper').children('.comment-frame').html(html)
        },
        nprogressStart: function(){
            if( isPc() ){
                NProgress.start();
            }
        },
        nprogressDone: function(){
            if( isPc() ){
                NProgress.done();
            }
        },
        // 当body不允许被选择后，这个函数是多余的，不过没关系，我懒得删除了
        interceptKeys: function(event) {
            event = event || window.event; // IE support
            var keyCode = event.keyCode;
            var ctrlDown = event.ctrlKey || event.metaKey; // Mac support
            // 不允许复制文章内容
            if (ctrlDown && keyCode==67) {
                event.preventDefault();
                return false;
            }
        }
    };

    let href = window.location.href;
    let hash = window.location.hash;
    let search = window.location.search;
    
    // 判断是博客首页或文章详情页
    if( !Blog.isDetail(href) ){
        Blog.init();
    }else{
        Blog.getComments();
    }

    
    // 在不需要页头时将其隐藏
    $("#header").headroom();

    // 判断是否为PC端，移动端不需要进度条
    $('.navbar .collapse .head-center li a').click(function(){
        Blog.nprogressStart();
    })

    $('.container article').click(function(){
        Blog.nprogressDone();
    })

    // 不允许复制文章内容    
    $('body').keydown(function(event){
        Blog.interceptKeys(event);
    });

    // 侧边栏                            
    $('.category .category-item a').click(function(){
        // 此处的添加active主要是为了滑动到底部自动加载可加载对应目录的文章                
        $(this).attr('class','active');                      
        $('.container .loadmore').addClass('hidden');
        let catalogId  = $(this).attr('catalogid');
        Blog.getCatalogActicle( catalogId )
    });

    // 滑动到底部自动加载
    $(window).scroll(function(){
        // 到达页面底部
        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
            // 只有博客页才需要向下翻
            if( Blog.isDetail(href) ){
                return false;                
            }

            let curr = $('.loader').attr('curr');
            // catalogId为null代表不针对某个目录进行请求，而是去获取全部类型的文章
            let catalogId = $('.category .category-item a.active').attr('catalogId') || null;
            // 当curr为null或已经发送过请求时，return false
            if( curr === 'null' || Blog.send === true ){
                return false;
            }
            Blog.getNextActicle(curr,catalogId);
        }
    });

    // 输入框获取焦点时，判断是否已经登录
    $('.comment').on('focus', '.comment-reply .comment-editor input', function(event){
        let openId = $('.comment .comment-reply .current-user').attr('openId');
        // 不存在openId说明尚未登录，无权发表评论
        if( !openId ){
            $('#shadow').show().animate({opacity: 1}, function(){
                $('.reminder').show();
            });
        }else{
            $('.comment .comment-reply .comment-footer').slideDown();
            $('.comment .comment-reply .comment-editor').css('border-color','#80C0FF');
        }
    });

    // 键盘事件
    $('.comment').on('keyup', '.comment-reply .comment-editor input', function(event){
        let content = $('.comment .comment-input').val();
        if( Blog.something(content) ){
            $('.comment .comment-item .comment-button').css('color','#0080ff');
            $('.comment .comment-item .comment-button').css('border-color','#0080ff');
        }else{
            $('.comment .comment-item .comment-button').css('color','#808080');
            $('.comment .comment-item .comment-button').css('border-color','#808080');
        }
    });

    // 关闭登录提醒框
    $('.reminder-close').click(function(){
        $('.reminder').hide();
        $('#shadow').hide().animate({opacity: 0});
    });

    // 评论
    $('.comment').on('click', '.comment-reply .comment-button', function(event){
        let content = $('.comment .comment-input').val();
        if( !Blog.something(content) ){
            return false;
        }

        let acticleId = search.split('=')[1];
        let openId = $('.comment .comment-reply .current-user').attr('openId');
        let nickName = $('.comment .comment-reply .current-user').attr('nickName');
        let thumbnail = $('.comment .comment-reply .current-user').attr('src');
        let data = {
            acticleId: acticleId,
            fromId: openId,
            content: content.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        Blog.saveComment(data);
    })

    // 回复：判断是否登录
    $('.comment').on('click', '.comment-answer', function(event){
        let that = this;
        // 判断是否已经登录
        let openId = $('.current-user').attr('openId');
        if( !openId ){
            $('#shadow').show().animate({opacity: 1}, function(){
                $('.reminder').show();
            });
        }else{
            let toId = $(this).attr('openId');
            let thumbnail = $('.comment .comment-reply .img-wrapper img').attr('src');
            Blog.createFrame(that,toId,thumbnail);
        }
    })

    // 取消回复
    $('.comment').on('click', '.comment-frame .comment-cancel', function(event){
        let that = this;
        $(that).parents('.comment-frame').remove();
    })

    // 回复
    $('.comment').on('click', '.comment-frame .comment-reversion', function(event){
        let that = this;
        $(that).parents('.comment-frame').remove();
        
        let fromId = $('.comment .comment-reply .img-wrapper img').attr('openId');
        let toId = $(this).attr('toId');
        let acticleId = window.location.search.split('=')[1];
        let content = $(this).parents('.comment-frame').children('.comment-wrapper').children('.comment-editor').children('input').val(); 
        if( !Blog.something(content) ){
            return false;
        }
        let data = {
            acticleId: acticleId,
            fromId: fromId,
            toId: toId,
            content: content.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        $(that).parents('.comment-frame').remove();
        Blog.saveComment(data);
    })
})
