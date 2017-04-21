'use strict'
require('../css/blog.css');
require("script-loader!./plugs/moment.js");
require("script-loader!./plugs/ejs.min.js");
require("script-loader!./plugs/nprogress.js");
require("script-loader!./plugs/headroom.min.js");
require("script-loader!./plugs/jQuery.headroom.min.js");

$(function(){
    // 在不需要页头时将其隐藏
    $("#header").headroom();

    NProgress.start();
    setTimeout(function(){
        NProgress.done();
    },200);

    let Blog = {
        limit: 10,
        create: function( acticles ){
            let that = this;
            let html = '';
            // let updateAt = '';
            acticles.forEach(function( acticle ){
                // this.translate( moment(data.meta.updateAt).toNow(true))
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
                html += '                       <strong>' + that.translate( moment(acticle.meta.updateAt).toNow(true)) + '</strong>';
                html += '                   </time>';
                html += '               </div>';
                html += '           </section>';
                html += '       </a>';
                html += '   </article>';
                html += '</li>';
            })
            return html;
        },
        translate: ( string ) => {
            let time = string.split(' ')[0]

            let status = ''
            if( string.indexOf('second','seconds') !== -1 ){
                status = '秒前'
            }else if( string.indexOf('minute','minutes') !== -1 ){
                status = '分钟前'
            }else if( string.indexOf('hour','hours') !== -1 ){
                status = '小时前'
            }else if( string.indexOf('day','days') !== -1 ){
                status = '天前'
            }else if( string.indexOf('year','years') !== -1 ){
                status = '年前'
            }
            return ( time + status ).replace(/^(an|a)/,'1');
        }
    };

    // 侧边栏                            
    $('.category .category-item a').click(function(event){
        event.preventDefault();
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

            if( curr === '0' ){
                return false;
            }
            $('.loader').removeClass('hidden');
            
            $.ajax({
                type: 'get',
                url: '/blog.html/nextActicles?curr=' + curr
            }).done(function(data){
                $('.loader').addClass('hidden');

                if( data.length === 0 ){
                    $('.loader').attr('curr','0');
                    $('.loader ').addClass('hidden');
                    $('.loadmore').removeClass('hidden');
                    return;
                }
                $('.loader').attr('curr',parseInt(curr)+1);
                let html = Blog.create( data );
                $('.lastest').append( html )
            })
        }
    });
})
