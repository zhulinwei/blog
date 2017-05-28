require('../css/blog.css');
require("script-loader!./common.js");
require("script-loader!./plugs/ejs.min.js");
require("script-loader!./plugs/ejs.min.js");
require("script-loader!./plugs/nprogress.js");
require("script-loader!./plugs/headroom.min.js");
require("script-loader!./plugs/jQuery.headroom.min.js");

$(function(){
    
    // 在不需要页头时将其隐藏
    $("#header").headroom();
    
    if(isPc()){
        $('.navbar .collapse .head-center li a').click(function(){
            NProgress.start();                
            NProgress.set(0.4);
            setTimeout(function(){
                console.log('1')
                NProgress.set(0.7);
            },1000)
            setTimeout(function(){
                console.log('2')                        
                NProgress.set(0.8);
            },1200)
            setTimeout(function(){
                console.log('3')                        
                NProgress.set(0.9);
            },1400)
        })

        $('.container article').click(function(){
            NProgress.start();                
            NProgress.set(0.9);
        })
    }
    

    let Blog = {
        // 防止滑动到底部多次触发AJAX
        sendAjax: false,
        limit: 10,
        create: function( acticles ){
            let that = this;
            let html = '';
            acticles.forEach(function( acticle ){
                html += '<li class="item">';
                html += '   <article>';
                html += '       <a href="blog.html?type=acticle&Id=' + acticle._id + '">';
                html += '           <div class="latest-article-img-container latest-article-img-container-xs">';
                html += '               <div class="latest-article-img-preview" style="background-image: url(/img/thumbnail/' + acticle.thumbnail + ')"></div>';
                html += '           </div>';
                html += '           <section class="article-summary latest-article">';
                html += '               <span class="article-title article-title-xs">' + acticle.title + '</span>';
                html += '               <p>' + acticle.outline + '...<span class="article-read-all">阅读全文 ></span></p>';
                html += '               <div class="pull-right">';
                html += '                   <a href="/index.html">';
                html += '                       <strong>Level.Z</strong>';
                html += '                   </a>';
                html += '                   <span class="article-dot">.</span>';
                html += '                   <a href="javascript:;">';
                html += '                       <strong>0</strong>条评论';
                html += '                   </a>';
                html += '                   <span class="article-dot">.</span>';
                html += '                   <time>';
                html += '                       <strong>' + acticle.meta.createAt + '</strong>';
                html += '                   </time>';
                html += '               </div>';
                html += '           </section>';
                html += '       </a>';
                html += '   </article>';
                html += '</li>';
            })
            return html;
        },
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

    // 不允许复制文章内容    
    $('body').keydown(function(event){
        Blog.interceptKeys(event);
    })

    // 侧边栏                            
    $('.category .category-item a').click(function(event){
        event.preventDefault();
        // 此处的添加active主要是为了滑动到底部自动加载可加载对应目录的文章
        $(this).attr('class','active');
        $.ajax({
            type: 'get',
            url:  $(this).attr('href'),
            beforeSend: function(){
                NProgress.start();
            }
        }).done(function( data ){
            NProgress.done();
            // 文章数量为0
            if( data.length === 0 ){
                return $('.lastest').html('<h3>暂无更新</h3>')
            }
            let html = Blog.create( data );
            $('.lastest').html( html )
        })
    });

    // 滑动到底部自动加载
    $(window).scroll(function(){
        // 到达页面底部
        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
            let curr = $('.loader').attr('curr');
            let catalogId = $('.category .category-item a.active').attr('catalogId') || null;
            // 当curr为0或已经发送过请求时，return false
            if( curr === '0' || Blog.sendAjax === true ){
                return false;
            }
            // 在该请求没有结束之前不允许重复发送请求
            Blog.sendAjax = true;
            $.ajax({
                type: 'get',
                url: '/blog.html/nextActicles?curr=' + curr + '&catalogId=' + catalogId
            }).done(function(data){
                if( data.length === 0 ){
                    $('.loader').attr('curr','0');
                    $('.loader ').addClass('hidden');
                    $('.loadmore').removeClass('hidden');
                    return;
                }
                $('.loader').attr('curr',parseInt(curr)+1);
                let html = Blog.create( data );
                $('.lastest').append( html );
                Blog.sendAjax = false;
            })
        }
    });

    setTimeout(function(){
        NProgress.done();
    },200)
})
