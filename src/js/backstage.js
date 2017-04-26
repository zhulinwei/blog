// 将bootstrap样式引入js模块中
require('../css/laypage.css');
require('../css/backstage.css');
require('script-loader!./util.js');
require("script-loader!./plugs/laypage.js");
require("script-loader!./plugs/ejs.min.js");
require("script-loader!./plugs/nprogress.js");
require("script-loader!./plugs/ueditor.config.js");
require("script-loader!./plugs/ueditor.all.min.js");
require("script-loader!./plugs/zh-cn.js");
require("script-loader!./plugs/dropify.js");
require("script-loader!./plugs/masonry.pkgd.js");

$(function(){
    NProgress.start();
    setTimeout(function(){
        NProgress.done();
    },200);

    // 屏幕最小化
    $('.glyphicon-chevron-left').click(function(){
        $('.right-page').animate({
            left: '0px',
            width: '100%'
        })
        $('.glyphicon-chevron-left').addClass('hide');
        $('.glyphicon-chevron-right').removeClass('hide');
    });

    // 屏幕最大化
    $('.glyphicon-chevron-right').click(function(){
        $('.right-page').animate({
            left: '16.5%',
            width: '83.5%'
        })
        $('.glyphicon-chevron-right').addClass('hide');
        $('.glyphicon-chevron-left').removeClass('hide');
    });

    // 一级菜单被点击时，切换背景并判断是否展开二级菜单
    $('.nav-side ul li').click(function( event ){
        
        if( !$( event.target ).hasClass('catalog') ){// 这个if，实在是迫于无奈之举啊
            $('.nav-side ul li.side-first-level-active').removeClass('side-first-level-active');
            // 先收缩所有的二级菜单
            $('.nav-side ul li .side-second-level').delay(0).slideUp(300);
            $(this).addClass('side-first-level-active');

            // 如果存在二级菜单，展开
            if($(this).children('ul').hasClass('side-second-level')){
                // 判断二级菜单当前状态
                if($(this).children('.side-second-level').css('display') === 'none'){
                    $(this).children(".side-second-level").delay(0).slideDown(300);
                }else{
                    $(this).children(".side-second-level").delay(0).slideUp(300);
                }
            }
        }
    });

    // 二级菜单被点击时，添加样式
    $('.side-first-level .side-second-level li a').click(function(event){
        if( !$(event.target).hasClass('catalog') ){
            event.stopPropagation();
        }
        $('.side-first-level .side-second-level li a').removeClass('side-second-level-active');
        $(this).addClass('side-second-level-active');
        
    })

    // blog中的公共函数
    let Command = {
        // 添加
        add: function( event,element,content ){
            let that = this;
            let type = 'add';

            // 操作提醒框
            if( $('.main ' + element + ' .edit').length === 0 ){// 尚未创建编辑栏目框
                
                that.showNewEdit( element,null,type,content );
            }else{// 已经存在创建好的编辑栏目框，注意替换其中的Id

                that.showExistEdit( element,null,type,content );
            }
        },
        // 编辑管理
        edit: function( event,element,content ){
            let that = this;
            let type = 'edit';
            let Id = $(event.target).attr('name');
            
            // 操作提醒框
            if( $('.main ' + element + ' .edit').length === 0 ){// 尚未创建编辑栏目框
                
                that.showNewEdit( element,Id,type,content );
            }else{// 已经存在创建好的编辑栏目框，注意替换其中的Id
                
                that.showExistEdit( element,Id,type,content );
            }

        },
        // 创建编辑框，为添加与编辑所共用
        buildEdit: function( Id,type,content ){
            let name = '';
            if( Id ){
                name += 'name="' + Id + '"';
            }
            
            let html = "<div class='edit' name='" + type + "'>"
            html += "<div class='edit-header'><i class='glyphicon glyphicon-info-sign'></i><span>" + content + "</span>";
            html += "<a href='javascript:;'><i class='glyphicon glyphicon-remove edit-remove'></i></a></div>";
            html += "<div class='edit-body'><input type='text' class='edit-input'></div>";
            html +="<div class='edit-footer pull-right'><input type='button' value='确定' class='btn btn-success'" + name + ">";
            html += "<input type='button' value='取消' class='btn btn-default edit-cancel'></div></div>";
            return html;
        },
        showNewEdit: function( element,Id,type,content ){
            
            let that = this;
            $('#shadow').show().animate({opacity: 1}, function(){
                    
                let html = that.buildEdit( Id,type,content );
                $('.main ' + element).append(html)
            });
        },
        // showExistEdit函数为添加与编辑两者所共用
        showExistEdit: function( element,Id,type,content ){
            // 如果存在Id，代表该次操作为编辑目录
            if( Id ){
                $('.main .edit .edit-footer input').attr('name',Id);
            }

            // 清空输入框
            $('.main .edit .edit-input').val('');   
            $('.main .edit').attr('name',type);
            $('.main .edit .edit-header span').html(content);      

            $('#shadow').show().animate({opacity: 1}, function(){
                $('.main .edit').removeClass('hidden');
            });
        },
        closeEdit: function(){

            $('.main .edit .edit-header').css('color','#000');// 先清除因警告用户而出现的红色字体
            $('.main .edit .edit-input').val('');// 清空输入框
            $('.main .edit').addClass('hidden');
            $('#shadow').hide().animate({opacity: 0});
        },
        // 表格中的全选与反选，但不包括状态为disabled的checkbox
        selectAll: function( event,element ){
            if( $(event.target).attr('checked') ){
                $(event.target).removeAttr('checked');
                $('.main ' + element + " input[type='checkbox']:not(:disabled)").prop("checked", false);
            }else{
                $(event.target).attr('checked','checked')            
                $('.main ' + element + " input[type='checkbox']:not(:disabled)").prop("checked", true);
            }
        },
        
        // 表格中的单一删除
        singleDel: function( event,element ){

            let that = this;
            let type = "singleDel";
            let Id = $(event.target).attr('name');
            let content_enabled = "确定删除?";
            let content_disabled = "不允许删除！"

            // 如果点击垃圾箱，则勾选对应的复选框，不包括状态为disabled的checkbox
            if( $('.main ' + element + ' input[name="' + Id + '"]').is(':disabled') ){
                that.showReminder( element,null,type,content_disabled );
            }else{
                
                $('.main ' + element + ' input[name="' + Id + '"]').prop("checked", true);
                that.showReminder( element,Id,type,content_enabled );
            }
            
        },
        // 表格中的批量删除
        batchDel: function( event,element ){
            let that = this;
            let type_warn = 'warn'
            let type_batch = 'batchDel';
            let content_warn = "至少勾选一个！！";
            let content_batch = "确定删除所选项?";

            // 至少勾选一个选项
            if( $('.main ' + element + ' table input[type="checkbox"]:checked').length === 0 ){
                that.showReminder( element,null,type_warn,content_warn );
                return false;
            }

            that.showReminder( element,null,type_batch,content_batch );
        },
        // 构建操作提醒框，为单一删除、批量删除以及批量删除提醒框三者所共用
        buildReminder: function( Id, type, content ){
            
            let name = '';
            if( Id ){// 存在Id表明为单一删除，不存在Id则指的是批量删除，只有在单一删除的情况下需要name
                name += 'name ="' + Id + '"';
            }

            let html = "<div class='reminder' name = '" + type + "'>"
            html += "<div class='reminder-header'><i class='glyphicon glyphicon-info-sign'></i><span>操作提醒</span>";
            html += "<a href='javascript:;'><i class='glyphicon glyphicon-remove reminder-remove'" + name + "></i></a></div>";
            html += "<div class='reminder-body'><p>" + content + "</p></div>";
            html +="<div class='reminder-footer pull-right'><input type='button' value='确定' class='btn btn-delete'" + name + ">";
            html += "<input type='button' value='取消' class='btn btn-default reminder-cancel'" + name + "></div></div>";
            return html;
        },
        // 展示提醒操作框
        showReminder: function( element,Id,type,content ){
            if( $('.main .reminder').length === 0 ){// 尚未创建操作提醒
                this.showNewReminder( element,Id,type,content );
                
            }else{// 已经存在创建好的操作提醒，注意替换其中的Id
                
                this.showExistReminder( Id,type,content )
            }
        },
        showNewReminder: function( element,Id,type,content ){


            let that = this;

            $('#shadow').show().animate({opacity: 1}, function(){
                let html = that.buildReminder( Id,type,content );
                $('.main ' + element).append(html)
            });
        },
        showExistReminder: function( Id,type,content ){

            $('.main .reminder .reminder-remove').attr('name',Id);
            $('.main .reminder .reminder-footer input').attr('name',Id);
            $('.main .reminder').attr('name',type);
            $('.main .reminder .reminder-body p').html(content)

            $('#shadow').show().animate({opacity: 1}, function(){
                $('.reminder').removeClass('hidden');
            });
        },
        // 关闭操作提醒框
        closeReminder: function( event,element ){
            let type = $('.main .reminder').attr('name');
            let Id = $(event.target).attr('name');

            // 关闭单一删除提醒框时，取消勾选该选项
            if( type === 'singleDel' || type === 'warn' ){
                $('.main ' + element + ' input[name="' + Id + '"]').prop("checked", false);
            }else if( type === 'batchDel' ){
                // 关闭全部删除提醒框时，取消勾选全部选项
                $('.main ' + element + ' input[type="checkbox"]').prop("checked", false);
            }

            
            $('.main .reminder').addClass('hidden');
            $('#shadow').hide().animate({opacity: 0});
        },
        clearEdit: function( element ){
            $('.main ' + element + ' input[name="title"]').val('');
            $('.main ' + element + ' .dropify-preview .dropify-filename-inner').html('');  
            $('.main ' + element + ' .dropify-preview .dropify-render img').removeAttr('src');  
            $('.main ' + element + ' #sticky').removeClass('switch-on').addClass('switch-off').css({
                'border-color' : '#dfdfdf',
                'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                'background-color' : 'rgb(255, 255, 255)'
            });
            $('.main ' + element + ' #lastest').removeClass('switch-off').addClass('switch-on').css({
                'border-color' : '#4C3B2F',
                'box-shadow' : '#4C3B2F' + ' 0px 0px 0px 16px inset',
                'background-color' : '#4C3B2F'
            });
            UE.getEditor('editor').setContent( '' );
        },
        getAjax: function( url ){
            let that = this;
            return $.ajax({
                type: 'get',
                url: url,
                beforeSend: function(){
                    NProgress.start();
                }
            })
        },
        // 由于不同的业务需求，postAjax后的done函数应有不宜写在公共函数中
        postAjax: function( url,data ){
            let that = this;
            return $.ajax({
                type: 'post',
                url: url,
                data: data,
                beforeSend: function(){
                    NProgress.start();
                }
            })
        },
        // 用于文件上传
        fileAjax: function( url,data ){
            let that = this;
            return $.ajax({
                type: 'post',
                url: url,
                data: data,                        
                processData: false,
                contentType: false,
                beforeSend: function(){
                    NProgress.start();
                }
            })
        },
        isEmpty: function( value ){
            if( value.trim().length ===0 ){
                return true;
            }
        }
    };
    
    // 开关按钮
    let Switch = {
        themeColor: '#4C3B2F',
        init: function(){
            let html = "<span class='slider'></span>";
            $('[class^=switch]').append(html);// 给含有switch开头的class添加该html
            // 初始化颜色与状态：存在自定义主题颜色
            if ($('[themeColor]').length > 0) {
                $('[themeColor]').each(function() {
                    let color = $(this).attr('themeColor');
                    if ($(this).hasClass("switch-on")) {
                        $(this).css({
                            'border-color' : color,
                            'box-shadow' : color + ' 0px 0px 0px 16px inset',
                            'background-color' : color
                        });
                    } else {
                        $(".switch-off").css({
                            'border-color' : '#dfdfdf',
                            'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                            'background-color' : 'rgb(255, 255, 255)'
                        });
                    }
                });
            }else{// 使用默认颜色
                $('.switch-on').each(function(){
                    let color = Switch.themeColor;
                    $(this).css({
                        'border-color' : color,
                        'box-shadow' : color + ' 0px 0px 0px 16px inset',
                        'background-color' : color
                    })
                })
            }
            // 点击或滑动下的颜色与状态
            $('[class^=switch]').click(function(){
                if( $(this).hasClass('switch-disabled') ){// 该按钮不能滑动
                    return;
                }

                if( $(this).hasClass('switch-on') ){
                    $(this).removeClass('switch-on').addClass('switch-off');
                    $(".switch-off").css({
                        'border-color' : '#dfdfdf',
                        'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                        'background-color' : 'rgb(255, 255, 255)'
                    });
                }else{
                    $(this).removeClass('switch-off').addClass('switch-on');
                    let color = $(this).attr('themeColor') || Switch.themeColor;
                    $(this).css({
                        'border-color' : color,
                        'box-shadow' : color + ' 0px 0px 0px 16px inset',
                        'background-color' : color
                    });
                }
            })
            
        }
    }

    // 首页
    $('.nav-side .nav-home').click(function(){
        Command.getAjax( '/backstage.html/nav_home' )
            .done( function( data ){
                NProgress.done();

                let html = ejs.render( $('#home').html(), {acticles: data[0], updateNumber: data[1], readingNumber: data[2] } );
                $('.main').html(html)
                
            })
    })
    
    // 目录管理
    $('.nav-side .nav-catalog').click(function(){
        Command.getAjax( '/backstage.html/nav_catalog' )
            .done( function( data ){
                NProgress.done();

                let catalogName = data[0];
                let catalogNumber = data[1];

                for( let i in catalogName ){
                    for( let j in catalogNumber ){
                        if( catalogName[i]._id == catalogNumber[j]._id ){
                            catalogName[i].sum = catalogNumber[j].num_tutorial
                        }
                    }
                }
                let html = ejs.render( $('#catalog').html(), { total: catalogName.length, catalogs: catalogName } );
                $('.main').html(html)
            })
    })

    // 文章管理
    $('.nav-side .side-first-level .side-second-level').on('click', 'li .catalog' , function(event){

        let catalogId = $( event.target ).attr('name');
        
        Command.getAjax( '/backstage.html/nav_article/?catalogId=' + catalogId )
            .done(function( data ){
                NProgress.done();
                // 判断是否为第一次加载
                let first = true;
                let html = ejs.render( $('#article').html(), { total: data[0],acticles: data[1]} );
                $('.main').html(html);

                let curr = Acticle.curr;
                let pages = Math.ceil(data[0]/Acticle.limit);
                // 初次加载，给分页绑定事件，当用户点击分页时，会触动jump函数去获取下一页的内容并插入tbody中
                Acticle.laypage( first,curr,pages,catalogId )
            })
    })

    // 发布文章
    $('.nav-side .nav-public').click(function(){
        Command.getAjax( '/backstage.html/nav_public' )
            .done( function( data ){
                NProgress.done();
                let html = ejs.render( $('#public').html(), { catalogs: data } );
            
                $('.main').html(html)
                // ueditor编辑器:因为ajax不能重复加载editor,所以在加载前先销毁editor
                UE.delEditor('editor');
                let ue = UE.getEditor('editor',{
                    initialFrameWidth: null// 随屏幕大小自适应 
                });
                // 初始化开关按钮
                Switch.init();
                // 初始化文件上传
                $('.dropify').dropify();
            })
    })

    // 相册管理：缩略图片管理
    $('.nav-side .nav-album').click(function( event ){
        $.ajax({
            type: 'get',
            url: '/js/ueditor/ue?action=listimage',
            beforeSend: function(){
                NProgress.start();
            }
        }).done(function(data){
            NProgress.done();

            let pages = Math.ceil(data.total/Album.limit)                    
            let start = (Album.curr-1) * Album.limit;
            let end = (Album.curr-1) * Album.limit + Album.limit;
            let albums = data.list.slice( start,end );
            let html = ejs.render( $('#album').html(), {albums: albums,total: data.total});
            $('.main').html( html );

            let first = true;
            Album.laypage( first,Album.curr,pages,data.list );
        })
    })

    // 帐号管理：帐号修改
    $('.nav-side .accounts-modify').click(function( event ){
        NProgress.start();
        let html = ejs.render( $('#accounts-modify').html() );
        setTimeout(function(){
            NProgress.done();
            $('.main').html(html);
        },200)
    });

    // 帐号管理： 管理员列表
    $('.nav-side .accounts-list').click(function(){
        Command.getAjax( '/backstage.html/nav_accounts/administrator_list' )
            .done(function(data){
                NProgress.done();
                let html = ejs.render( $('#accounts-list').html(),{ total: data[0], administrators: data[1] });
                $('.main').html( html );
            })
    })

    // 目录管理
    let Catalog = {
        element: '#catalog-page',
        addUrl: '/backstage.html/nav_catalog/catalog_add',
        editUrl: '/backstage.html/nav_catalog/catalog_edit',
        deleteUrl: '/backstage.html/nav_catalog/catalog_del',
        add: function( catalogId,catalogName ){
            
            let data = {
                catalogName: catalogName
            }
            Command.postAjax( this.addUrl,data )
                .done(function(data){
                        NProgress.done();
                        if( data.code !== 1 ){
                            $('.main .edit-header').css('color','red');
                            
                            return $('.main .edit-header span').html(data.message);
                        }
                        Command.closeEdit();
                        $('.nav-side .nav-catalog').click();
                        // 需要更新文章管理
                        let html = '<li><a name="' + data.catalogId + '" class="catalog" href="javascript:;">' + catalogName + '</a></li>'
                        $('.nav-side .nav-article').next().append(html);
                    });
        },
        edit: function( catalogId,catalogName ){
            let data = {
                catalogId: catalogId,
                catalogName: catalogName
            }
            Command.postAjax( this.editUrl,data )
                .done(function(data){
                    NProgress.done();
                    if( data.code !== 1 ){
                        $('.main .edit-header').css('color','red');
                        
                        return $('.main .edit-header span').html(data.message);
                    }
                    Command.closeEdit();
                    $('.main input[name="' + catalogId + '"]').parent().next().next().children('strong').html(catalogName);
                    // 需要更新文章管理
                    $('.nav-side .side-first-level .side-second-level li a[name="' + catalogId + '"] ').html(catalogName);
                    
                });
        },
        delete: function( event,element,catalogs ){
            let data = {
                catalogs: catalogs
            }

            let total = $('.main .main-header span:last-child strong').html();

            Command.postAjax( this.deleteUrl,data )
                .done(function(data){
                    NProgress.done();
                    if( data.code === 1 ){
                        catalogs.forEach(function( catalogId ){
                            $('.main table input[name="'+ catalogId + '"]').parents('tr').remove();
                            $('.main .main-header span:last-child strong').html( total-catalogs.length );
                            // 需要更新文章管理
                            $('.nav-side .side-first-level .side-second-level li a[name="' + catalogId + '"] ').parent().remove();
                        })
                    }
                    Command.closeReminder( event,element )
                });
        },
        confirmEdit: function( event,element ){
            let type = $('.main .edit').attr('name');
            let catalogId = $( event.target ).attr('name');
            let catalogName = $('.main .edit .edit-input').val();

            if( Command.isEmpty(catalogName) ){
                $('.main .edit-header').css('color','red');
                            
                return $('.main .edit-header span').html('目录名称不能为空');
            }
            this[type]( catalogId,catalogName );
        },
        // 三种情况下：1.单一删除提醒、2.全部删除提醒、3.至少勾选一个选项，点击操作提醒框确定键会导致三种情况下所产生的动作不同
        confirmDel: function( event,element ){
            let catalogs = [];
            let type = $('.main .reminder').attr('name');
            
            // 在至少勾选一个选项的情况下
            if( type === 'warn' ){
                return Command.closeReminder( event,element );
            }else if( type === 'singleDel' ){
                let catalogId = $(event.target).attr('name');
                catalogs.push( catalogId );
            }else if( type === 'batchDel' ){

                // 批量获取catalogId
                $('.main input[type="checkbox"]:checked').each(function(){
                    let catalogId = $(this).attr('name');
                    catalogs.push( catalogId );
                })
                //如果第一个的值为undefined，说明是全选，所以需要排除全选键
                if( catalogs[0] === undefined ){
                    catalogs.shift(1);
                }
            }
            this.delete( event,element,catalogs )
        }
    };

    // 文章管理
    let Acticle = {
        element: '#article-page',
        editElement: '#article-edit',
        curr: 1,// 默认当前页面
        limit: 2,// 默认显示数量
        editUrl: '/backstage.html/nav_article/article_edit',
        deleteUrl: '/backstage.html/nav_article/article_del',
        acticleUrl: '/backstage.html/nav_article/article_det',
        create: function( acticles ){
            let html = '';
            acticles.forEach(function( acticle ){
                let stickyPost = '';
                let lastest = '';
                // 是否置顶
                if( acticle.stickyPost ){
                    stickyPost += '<td><strong>是</strong></td>'
                }else{
                    stickyPost += '<td><strong>否</strong></td>'
                }
                // 是否公开
                if( acticle.lastest ){
                    lastest += '<td><strong>是</strong></td>'
                }else{
                    lastest += '<td><strong>否</strong></td>'
                }

                html += '<tr>';
                html += '    <th><input type="checkbox" name="' + acticle._id + '"></th>';
                html += '    <td>';
                html += '       <img src="/img/thumbnail/' + acticle.thumbnail + '" height="60px">';
                html += '    </td>';
                html += '    <td>' + acticle.title + '</td>';
                html +=      stickyPost;
                html +=      lastest;
                html += '    <td>';
                html += '       <a href="javascript:;" class="tooltip-test" data-toggle="tooltip" title="修改文章">';
                html += '           <i class="glyphicon glyphicon-pencil" name="' + acticle._id + '"></i>';
                html += '       </a>';
                html += '       <a href="javascript:;" class="tooltip-test" data-toggle="tooltip" title="删除文章">';
                html += '           <i class="glyphicon glyphicon-trash" name="' + acticle._id + '"></i>';
                html += '       </a>';
                html += '    </td>';
                html += '</tr>';
            })
            return html;
        },
        delete: function( event,element,catalogId,acticles,imageUrls,curr ){

            let data = {
                catalogId: catalogId,
                acticles: acticles,
                imageUrls: imageUrls,
                curr:curr
            }

            // 删除所选文章并更新该页内容，所该页已经不存在内容的情况下，获取上一页的内容
            Command.postAjax( this.deleteUrl,data )
                .done(function(data){
                    NProgress.done();

                    let html = Acticle.create(data[1]);
                    $('.main #article-page table tbody').html( html )
                    $('.main .catalog-page-header span:last-child strong').html( data[0] );

                    let curr = data[2]
                    let pages = Math.ceil(data[0]/Acticle.limit);
                    Acticle.laypage( false,curr,pages,catalogId )
                    Command.closeReminder( event,element )
                });
        },
        confirmDel: function( event,element ){
            let acticles = [];
            let imageUrls = [];
            let type = $('.main .reminder').attr('name');
            // 获取当前页数
            let curr = $('#article-page .paging .laypage_curr').html();
            let catalogId = $('.nav-side .catalog.side-second-level-active').attr('name');

            // 在至少勾选一个选项的情况下
            if( type === 'warn' ){
                return Command.closeReminder( event,element );
            }else if( type === 'singleDel' ){

                let acticleId = $(event.target).attr('name');
                let imageUrl = $('.main #article-page input[name="' + acticleId + '"]').parent().next().children('img').attr('src');
                

                acticles.push( acticleId );
                imageUrls.push( imageUrl.split('/img/thumbnail/')[1] );
            }else if( type === 'batchDel' ){
                // 批量获取acticleId
                $('.main input[type="checkbox"]:checked').each(function(){
                    let acticleId = $(this).attr('name');
                    let imageUrl = $('.main #article-page input[name="' + acticleId + '"]').parent().next().children('img').attr('src');
                    
                    if( acticleId ){
                        acticles.push( acticleId );
                    }
                    //如果第一个的值为undefined，说明是全选，所以需要排除全选键
                    if( imageUrl ){
                        imageUrls.push( imageUrl.split('/img/thumbnail/')[1] );
                    }
                })
            }

            this.delete( event,element,catalogId,acticles,imageUrls,curr )
        },
        edit: function( event,element ){
            let catalogId = $('.nav-side .catalog.side-second-level-active').attr('name');

            let acticleId = $( event.target ).attr('name');
            // 获取当前页数
            let curr = $('#article-page .paging .laypage_curr').html();

            let data = {
                acticleId: acticleId
            }
            Command.postAjax( this.acticleUrl,data )
                .done(function( data ){
                    NProgress.done();
                    let catalogs = data[0];
                    let acticle = data[1][0];

                    let html = ejs.render( $('#article-update').html(), { catalogs: catalogs,acticle: acticle } )
                    $('.main').html( html );
                    
                    $('.main #article-edit select option[name="' + catalogId + '"]').attr('selected','selected')

                    UE.delEditor('editor');
                    let ue = UE.getEditor('editor',{
                        initialFrameWidth: null// 随屏幕大小自适应 
                    });

                    ue.addListener("ready", function () {
                        // editor准备好之后才可以使用
                        ue.setContent( acticle.content );
                    });


                    // 如果文章置顶
                    if( acticle.stickyPost ){
                        
                        $('.main #article-edit #sticky').addClass('switch-on');
                    }else{
                        
                        $('.main #article-edit #sticky').addClass('switch-off');                                
                    }

                    // 如果文章公开
                    if( acticle.lastest ){
                        $('.main #article-edit #lastest').addClass('switch-on');
                    }else{
                        $('.main #article-edit #lastest').addClass('switch-off');                                
                    }

                    Switch.init();
                })

        },
        confrimEdit: function( event,element ){
            let that = this;
            let acticleId = $( '.main ' + element + ' input[name="acticleId"]' ).val();
            let catalogId = $( '.main ' + element + ' select option:selected' ).attr('name');
            let title = $( '.main ' + element + ' input[name="title"]').val();
            let outline = UE.getEditor('editor').getContentTxt().slice(0,100);
            let content = UE.getEditor('editor').getContent();
            let sticky = $( '.main ' + element + ' #sticky').hasClass('switch-on');
            let lastest = $( '.main ' + element + ' #lastest').hasClass('switch-on');

            // 文章不能为空
            if( !title || !UE.getEditor('editor').hasContents() ){
                return Command.showReminder( element,null,'warn','发布文章失败，请重新检查！');
            }

            let acticle = {
                acticleId: acticleId,
                superior: catalogId,
                title: title,
                outline: outline,
                content: content,
                stickyPost: sticky,
                lastest: lastest
            }

            Command.postAjax( this.editUrl,acticle )
                .done(function(data){
                    NProgress.done();
                    Command.clearEdit( element )
                    Command.showReminder( element,null,null,'文章修改成功');
                })
        },
        laypage: function( first,curr,pages,catalogId ){
            laypage({
                    cont: $('#article-page .paging'), 
                    curr: curr,
                    pages: pages, 
                    groups: 3, 
                    skin: '#4C3B2F', 
                    // 当用户点击分页时，会触动jump函数去获取下一页的内容并插入tbody中
                    jump: function( data ){
                        // 如果是首次加载并且当前页为第一页
                        if( first && (data.curr === 1) ){
                            first = false;
                            return;
                        }
                        let url = '/backstage.html/nav_article/?catalogId=' + catalogId + '&curr=' + data.curr;
                        Command.getAjax( url )
                            .done(function(data){
                                NProgress.done();
                                // 动态生成下一页的内容
                                let html = Acticle.create(data[1]);
                                $('.main #article-page table tbody').html( html )
                            })
                    }
            })
        }
    }

    // 图片管理
    let Album = {
        element: '#album-page',
        curr: 1,
        limit: 12,
        create: function( albums ){
            let html = '';
            albums.forEach(function( album ){
                html += '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">';
                html += '   <a href="javascript:;" class="thumbnail">';
                html += '       <img src="/img/ueditor/' + album + '">';
                html += '   </a>';
                html += '</div>';
            })
            return html;
        },
        laypage: function( first,curr,pages,list ){
            laypage({
                    cont: $('.main #album-page .paging'), 
                    curr: curr,
                    pages: pages, 
                    groups: 3, 
                    skin: '#4C3B2F', 
                    // 当用户点击分页时，会触动jump函数去获取下一页的内容并插入tbody中
                    jump: function( data ){
                        
                        // 如果是首次加载并且当前页为第一页
                        if( first && (data.curr === 1) ){
                            first = false;
                            return;
                        }

                        let start = (data.curr-1) * Album.limit;
                        let end = (data.curr-1) * Album.limit + Album.limit;

                        let albums = list.slice( start,end );
                        

                        let html = Album.create( albums );
                        $('.main #album-page .main-body').html( html );
                    }
            })
        }
    }

    // 发布文章
    let Public = {
        element: '#public-page',
        thumbnailUrl: '/backstage.html/nav_public/thumbnail_save',
        mainBodyUrl: '/backstage.html/nav_public/main_body_save',
        thumbnail: function( file ){
            let data = file;
            
            return Command.fileAjax( this.thumbnailUrl, file );
        },
        mainBody: function( acticle ){
            let data = acticle;
            return Command.postAjax( this.mainBodyUrl, data);
        },
        save: function( element ){
            let that = this;
            let catalogId = $( '.main ' + element + ' select option:selected' ).attr('name');
            let title = $( '.main ' + element + ' input[name="title"]').val();
            let thumbnail = $( '.main ' + element + ' input[type="file"]')[0].files[0];
            let outline = UE.getEditor('editor').getContentTxt().slice(0,100);
            let content = UE.getEditor('editor').getContent();
            let sticky = $( '.main ' + element + ' #sticky').hasClass('switch-on');
            let lastest = $( '.main ' + element + ' #lastest').hasClass('switch-on');

            // 低版本浏览器不一定支持FormData对象
            if( !window.FormData ){
                return Command.showReminder( element,null,'warn','请更换高级的浏览器');
            }
            // 文章不能为空
            if( !title || !thumbnail || !UE.getEditor('editor').hasContents() ){
                return Command.showReminder( element,null,'warn','发布文章失败，请重新检查！');
            }
            
            // 缩略图类型
            let type = thumbnail.type;
            let size = parseInt(thumbnail.type);
            let limit = 5 * 1024 * 1024;

            // 文章缩略图仅支持上传图片
            if( type.indexOf('image/') === -1 ){
                return Command.showReminder( element,null,'warn','文章缩略图仅支持上传图片');
            }

            // 文章缩略图限制在5M以下
            if ( parseInt(thumbnail.size) > limit ){
                return Command.showReminder( element,null,'warn','图片大于5M，请更换图片');
            }

            // 上传文章缩略图
            let formData = new FormData();
            formData.append('avatar',thumbnail);	

            let acticle = {
                superior: catalogId,
                title: title,
                outline: outline,
                content: content,
                stickyPost: sticky,
                lastest: lastest
            }

            that.thumbnail( formData )
                .done(function(data){
                    if( data.code === 1 ){
                        NProgress.set(0.4);
                        
                        acticle.thumbnail = data.path;
                        that.mainBody( acticle )
                            .done(function(data){
                                NProgress.done();
                                // 清空
                                Command.clearEdit( element )
                                Command.showReminder( element,null,null,'文章发布成功');
                            })
                    }
                })
        }
    }

    // 帐号管理
    let Account = {
        element: {
            modify: '#modify-password',
            list: '#administrator-list'
        },
        initialPwd: '123456',
        addUrl: '/backstage.html/nav_accounts/administrator_add',
        editUrl: '/backstage.html/nav_accounts/administrator_edit',
        deleteUrl: '/backstage.html/nav_accounts/administrator_del',
        modifyUrl: '/backstage.html/nav_accounts/modify_password',
        modify: function( element,passwords){
            let data = {
                oldPwd: passwords[0].value,
                newPwd: passwords[1].value,
            }
            Command.postAjax( this.modifyUrl,data )
                .done(function(data){
                    NProgress.done();
                    if( data.code === 1 ){
                        Command.showReminder( element,null,null,'修改密码成功！');
                        $('.main ' + element + ' form input[type="password"]').val('');
                    }else{
                        Command.showReminder( element,null,null,data.message);
                    }
                });

        },
        add: function( adminId,adminName ){
            let data = {
                adminName: adminName,
                password: this.initialPwd
            }
            Command.postAjax( this.addUrl,data )
                .done(function(data){
                        NProgress.done();
                        if( data.code !== 1 ){
                            $('.main .edit-header').css('color','red');
                            
                            return $('.main .edit-header span').html(data.message);
                        }
                        Command.closeEdit();
                        $('.nav-side .accounts-list').click();
                    });
        },
        edit: function( adminId,adminName ){
            let data = {
                adminId: adminId,
                adminName: adminName
            }
            Command.postAjax( this.editUrl,data )
                .done(function(data){
                    NProgress.done();
                    if( data.code !== 1 ){
                        $('.main .edit-header').css('color','red');
                        
                        return $('.main .edit-header span').html(data.message);
                    }
                    Command.closeEdit();
                    $('.main input[name="' + adminId + '"]').parent().next().next().children('strong').html(adminName)
                });
        },
        delete: function( event,element,adminIds ){
            let data = {
                adminIds: adminIds
            }

            let total = $('.main .main-header span:last-child strong').html();
            Command.postAjax( this.deleteUrl,data )
                .done(function(data){
                    NProgress.done();
                    if( data.code !== 1 ){
                        $('.main .reminder').attr('name','warn');
                        
                        return $('.main .reminder .reminder-body p').html(data.message);
                    }
                    Command.closeReminder(event,element);
                    adminIds.forEach(function( adminId ){
                            $('.main table input[name="'+ adminId + '"]').parents('tr').remove();
                            $('.main .main-header span:last-child strong').html( total-adminIds.length );                               
                        })
                });
        },
        
        removeRed: function( event ){
            if( $(event.target).next().css('color') === 'rgb(255, 0, 0)' ){
                setTimeout(function(){
                    $(event.target).next().removeAttr('style');
                },200)
            }
        },

        confirmEdit: function( event,element ){
            let type = $('.main .edit').attr('name');
            let adminId = $( event.target ).attr('name');
            let adminName = $('.main .edit .edit-input').val();

                if( Command.isEmpty(adminName) ){
                $('.main .edit-header').css('color','red');
                            
                return $('.main .edit-header span').html('管理员名称不能为空');
            }
            this[type]( adminId,adminName );
        },

        // 三种情况下：1.单一删除提醒、2.全部删除提醒、3.至少勾选一个选项，点击操作提醒框确定键会导致三种情况下所产生的动作不同
        confirmDel: function( event,element ){
            let adminIds = [];
            let type = $('.main .reminder').attr('name');
            
            // 在至少勾选一个选项的情况下
            if( type === 'warn' ){
                return Command.closeReminder( event,element )
            }else if( type === 'singleDel' ){
                let adminId = $(event.target).attr('name');
                
                // 正常情况下是存在adminId的，若不存在，则指的是不能删除的管理员
                if( !adminId ){
                    return Command.closeReminder( event,element )
                }

                adminIds.push( adminId );
            }else if( type === 'batchDel' ){

                // 批量获取adminId
                $('.main ' + element + ' input[type="checkbox"]:checked').each(function(){
                    let adminId = $(this).attr('name');
                    adminIds.push( adminId );
                })
                //如果第一个的值为undefined，说明是全选，所以需要排除全选键
                if( adminIds[0] === undefined ){
                    adminIds.shift(1);
                }
            }
            this.delete( event,element,adminIds )
        },
        confrimModify: function( event,element ){
            let passwords = $('.main ' + element + ' form').serializeArray();

            // 判断是否存在空值，在这里使用for循环比较合适，不宜使用forEach
            for( let i=0,password;password = passwords[i++];){
                if( Command.isEmpty( password.value ) ){
                    $('.main ' + element + ' form input[name=' + password.name + ']').next().css('color','rgb(255, 0, 0)');
                    return false;
                }
            }
            if( passwords[1].value !== passwords[2].value ){
                return Command.showReminder( element,null,null,'前后两次密码不正确');
            }

            this.modify( element,passwords)
        }
    };

    // 通过on给尚未出现的节点绑定事件
    // on方法 将click等事件绑定在document对象上，页面上任何元素发生的click事件都冒泡到document对象上得到处理。
    // 增加了绑定效率。当事件冒泡到document对象时，检测事件的target，如果与传入的选择符（这里是button）匹配，就触发事件，否则不触发。
    // 目录管理
    $('.main').on('click', Catalog.element , function(event){
        let className = event.target.className;
        switch( className ){
            // 添加目录
            case 'btn btn-add': 
                Command.add( event,Catalog.element,'请输入需要添加的目录名称' );
                break;
            // 编辑管理
            case 'glyphicon glyphicon-pencil': 
                Command.edit( event,Catalog.element,'请输入新的目录名称' );
                break;
            // 关闭编辑管理
            case 'glyphicon glyphicon-remove edit-remove': 
                Command.closeEdit();
                break;
            // 关闭编辑管理                        
            case 'btn btn-default edit-cancel': 
                Command.closeEdit();
                break;
            // 确定更新栏目或编辑栏目
            case 'btn btn-success': 
                Catalog.confirmEdit( event,Catalog.element );
                break;
            // 全选与反选
            case 'batch-selection': 
                Command.selectAll( event,Catalog.element );
                break;
            // 单一删除
            case 'glyphicon glyphicon-trash':
                Command.singleDel( event,Catalog.element );
                break;
            // 批量删除
            case 'btn btn-delete del-batch':
                Command.batchDel( event,Catalog.element );
                break;
            case 'glyphicon glyphicon-warning-sign':
                Command.batchDel( event,Catalog.element );
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove': 
                Command.closeReminder( event,Catalog.element );
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel': 
                Command.closeReminder( event,Catalog.element );
                break;
            // 确定删除
            case 'btn btn-delete': 
                Catalog.confirmDel( event,Catalog.element );
                break;
        }
    });

    // 文章管理
    $('.main').on('click',Acticle.element,function(event){
        let className = event.target.className;
        switch( className ){
            // 全选与反选
            case 'batch-selection': 
                Command.selectAll( event,Acticle.element );
                break;
            // 单一删除
            case 'glyphicon glyphicon-trash':
                Command.singleDel( event,Acticle.element );
                break;
            // 批量删除
            case 'btn btn-delete del-batch':
                Command.batchDel( event,Acticle.element );
                break;
            // 批量删除
            case 'glyphicon glyphicon-warning-sign':
                Command.batchDel( event,Acticle.element );
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove': 
                Command.closeReminder( event,Acticle.element );
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel': 
                Command.closeReminder( event,Acticle.element );
                break;
            // 确定删除
            case 'btn btn-delete': 
                Acticle.confirmDel( event,Acticle.element );
                break;
            // 编辑
            case 'glyphicon glyphicon-pencil': 
                Acticle.edit( event,Acticle.element );
                break;
        }
    })

    // 文章编辑
    $('.main').on('click',Acticle.editElement,function(event){
        let className = event.target.className;
        switch( className ){
            case 'btn btn-add':
                Acticle.confrimEdit( event,Acticle.editElement );
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove': 
                Command.closeReminder( event,Acticle.editElement );
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel': 
                Command.closeReminder( event,Acticle.editElement );
                break;
            // 关闭操作提醒框 
            case 'btn btn-delete': 
                Command.closeReminder( event,Acticle.editElement );
                break;
        }
        
    })

    // // 相册管理：缩略图片管理
    // $('.nav-side .nav-album').click(function( event ){
    //     $.ajax({
    //         type: 'get',
    //         url: '/js/ueditor/ue?action=listimage',
    //         beforeSend: function(){
    //             NProgress.start();
    //         }
    //     }).done(function(data){
    //         NProgress.done();
    //         let pages = Math.ceil(data.total/Album.limit)                    
    //         let start = (Album.curr-1) * Album.limit;
    //         let end = (Album.curr-1) * Album.limit + Album.limit;
    //         let albums = data.list.slice( start,end );
    //         let html = ejs.render( $('#album').html(), {albums: albums,total: data.total});
    //         $('.main').html( html );

    //         let first = true;
    //         Album.laypage( first,Album.curr,pages,data.list );
    //     })
    // })

    // 发布文章
    $('.main').on('click', Public.element, function( event ){
        let className = event.target.className;
        switch( className ){
            // 发布文章
            case 'btn btn-add':
                Public.save( Public.element );
                break;
            // 关闭操作提醒框
            case 'btn btn-delete':
                Command.closeReminder( event,Public.element );
                break;
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder( event,Public.element );
                break;
            case 'btn btn-default reminder-cancel':
                Command.closeReminder( event,Public.element );
                break;
                
        }
    })

    // 帐号管理：修改密码
    $('.main').on('click', Account.element.modify , function(event){
        let className = event.target.className;

        switch( className ){
            // 输入框
            case 'form-control': 
                Account.removeRed( event );
                break;
            // 确定修改密码
            case 'btn btn-add confrim-modify': 
                Account.confrimModify( event,Account.element.modify );
                break;
            // 移除操作提醒框
            case 'btn btn-delete':
                Command.closeReminder( event,Account.element.modify)
                break;
            case 'btn btn-default reminder-cancel':
                Command.closeReminder( event,Account.element.modify)
                break;
            case 'glyphicon glyphicon-remove reminder-remove':
                Command.closeReminder( event,Account.element.modify)
                break;
        }
    });

    // 帐号管理：管理员列表
    $('.main').on('click', Account.element.list , function(event){
        let className = event.target.className;
        switch( className ){
            // 添加管理员
            case 'btn btn-add': 
                Command.add( event,Account.element.list,'请输入需要添加的管理员名称' );
                break;
            // 添加管理员
            case 'glyphicon glyphicon-plus': 
                Command.add( event,Account.element.list,'请输入需要添加的管理员名称' );
                break;
            // 编辑管理员
            case 'glyphicon glyphicon-pencil': 
                Command.edit( event,Account.element.list,'请输入新的管理员名称' );
                break;
            case 'btn btn-success': 
                Account.confirmEdit( event,Account.element.list );
                break;
            // 关闭操作提醒框
            case 'btn btn-default edit-cancel':
                Command.closeEdit();
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove edit-remove':
                Command.closeEdit();
                break;
            // 全选与反选
            case 'batch-selection': 
                Command.selectAll( event,Account.element.list );
                break;
                // 单一删除
            case 'glyphicon glyphicon-trash':
                Command.singleDel( event,Account.element.list );
                break;
            // 批量删除
            case 'btn btn-delete del-batch':
                Command.batchDel( event,Account.element.list );
                break;
            // 批量删除
            case 'glyphicon glyphicon-warning-sign':
                Command.batchDel( event,Account.element.list );
                break;
            // 关闭操作提醒框
            case 'glyphicon glyphicon-remove reminder-remove': 
                Command.closeReminder( event,Account.element.list );
                break;
            // 关闭操作提醒框                        
            case 'btn btn-default reminder-cancel': 
                Command.closeReminder( event,Account.element.list );
                break;
            // 确定删除 
            case 'btn btn-delete': 
                Account.confirmDel( event,Account.element.list );
                break;
        } 
    });
})
