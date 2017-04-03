'use strict'

// js中的公共函数
let Command = {
	// 添加
	add: function( event,element,content ){
        let that = this;
        let type = 'add';
        // let content = '请输入需要添加的目录名称';

        // 操作提醒框
        if( $('.main ' + element + ' .catalog-edit').length === 0 ){// 尚未创建编辑栏目框
            
            that.showNewEdit( null,type,content );
        }else{// 已经存在创建好的编辑栏目框，注意替换其中的catalogId

            that.showExistEdit( null,type,content );
        }
    },
    // 编辑管理
    edit: function( event,element,content ){
        let that = this;
        let type = 'edit';
        let catalogId = $(event.target).attr('name');
        // let content = '请输入新的目录名称';

        // 操作提醒框----其实可以继续改进
        if( $('.main ' + element + ' .catalog-edit').length === 0 ){// 尚未创建编辑栏目框
            
            that.showNewEdit( catalogId,type,content );
        }else{// 已经存在创建好的编辑栏目框，注意替换其中的catalogId
            
            that.showExistEdit( catalogId,type,content );
        }

    },
    // 创建编辑框，为添加与编辑所共用
    buildEdit: function( catalogId,type,content ){
        let name = '';
        if( catalogId ){
            name += 'name="' + catalogId + '"';
        }
        
        let html = "<div class='edit' name='" + type + "'>"
        html += "<div class='edit-header'><i class='glyphicon glyphicon-info-sign'></i><span>" + content + "</span>";
        html += "<a href='javascript:;'><i class='glyphicon glyphicon-remove edit-remove'></i></a></div>";
        html += "<div class='edit-body'><input type='text' class='edit-input'></div>";
        html +="<div class='edit-footer pull-right'><input type='button' value='确定' class='btn btn-success'" + name + ">";
        html += "<input type='button' value='取消' class='btn btn-default edit-cancel'></div></div>";
        return html;
    },
    showNewEdit: function( catalogId,type,content ){
        let that = this;
        $('.mian #shadow').show().animate({opacity: 1}, function(){
                
            let html = that.buildEdit( catalogId,type,content );
            $('.main').append(html)
        });
    },
    // showExistEdit函数为添加与编辑两者所共用
    showExistEdit: function( catalogId,type,content ){
        // 如果存在catalogId，代表该次操作为编辑目录
        if( catalogId ){
            $('.main .edit .edit-footer input').attr('name',catalogId);
        }

        // 清空输入框
        $('.main .edit .edit-input').val('');   
        $('.main .edit').attr('name',type);
        $('.main .edit .edit-header span').html(content);      

        $('#shadow').show().animate({opacity: 1}, function(){
            $('.main .edit').removeClass('hidden');
        });
    },
    hideEdit: function(){
        // 清空输入框
        $('.main .edit .edit-input').val('');
        $('.main .edit').addClass('hidden');
        $('#shadow').hide().animate({opacity: 0});
    },
	// 表格中的全选与反选
    selectAll: function( event,element ){
        if( $(event.target).attr('checked') ){
            $(event.target).removeAttr('checked');
            $('.main ' + element + " input[type='checkbox']").prop("checked", false);
        }else{
            $(event.target).attr('checked','checked')            
            $('.main ' + element + " input[type='checkbox']").prop("checked", true);
        }
    },
    // 表格中的单一删除
    singleDel: function( event,element ){
        let that = this;
        let type = "singleDel";
        let catalogId = $(event.target).attr('name');
        let content = "确定删除?";
        // 如果点击垃圾箱，则勾选对应的复选框
        $('.main ' + element' input[name="' + catalogId + '"]').prop("checked", true);
        that.showReminder( catalogId,type,content );
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
            that.showReminder( null,type_warn,content_warn );
            return false;
        }

        that.showReminder( null,type_batch,content_batch );
    },
    // 构建操作提醒框，为单一删除、批量删除以及批量删除提醒框三者所共用
    buildReminder: function( catalogId, type, content ){
        let name = '';
        if( catalogId ){// 存在catalogId表明为单一删除，不存在catalogId则指的是批量删除，只有在单一删除的情况下需要name
            name += 'name ="' + catalogId + '"';
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
    showReminder: function( catalogId,type,content ){

        if( $('.main .reminder').length === 0 ){// 尚未创建操作提醒
            this.showNewReminder( catalogId,type,content );
            
        }else{// 已经存在创建好的操作提醒，注意替换其中的catalogId
            this.showExistReminder( catalogId,type,content )
        }
    },
    showNewReminder: function( catalogId,type,content ){
        let that = this;

        $('.main #shadow').show().animate({opacity: 1}, function(){
            let html = that.buildReminder( catalogId,type,content );
            $('.main').append(html)
        });
    },
    showExistReminder: function( catalogId,type,content ){

        // 如果存在catalogId，代表该次操作为单一删除
        if( catalogId ){
            $('.main .reminder .reminder-footer input').attr('name',catalogId);
        }
        $('.main .reminder').attr('name',type);
        $('.main .reminder .reminder-body p').html(content)

        $('#shadow').show().animate({opacity: 1}, function(){
            $('.reminder').removeClass('hidden');
        });
    },
    // 关闭操作提醒框
    closeReminder: function( event,element ){
        let catalogId = $(event.target).attr('name');

        // 勾选对应的复选框
        $('.main ' + element + ' input[name="' + catalogId + '"]').prop("checked", false);

        $('.main .reminder').addClass('hidden');
        $('.main #shadow').hide().animate({opacity: 0});
    },
    // 提醒框确定键
    confirmDel: function( event,element ){
        // 三种情况下：1.单一删除提醒、2.全部删除提醒、3.至少勾选一个选项，点击操作提醒框确定键会导致三种情况下所产生的动作不同
        $('.main .reminder').addClass('hidden');
        $('#shadow').hide().animate({opacity: 0});

        let catalogs = [];
        let type = $('.main .reminder').attr('name');

        // 在至少勾选一个选项的情况下
        if( type === 'warn' ){
            return false;
        }else if( type === 'singleDel' ){
            let catalogId = $(event.target).attr('name');
            catalogs.push( catalogId );
        }else if( type === 'batchDel' ){
            // 批量获取catalogId
            $('main ' + element + ' input[type="checkbox"]:checked').each(function(){
                let catalogId = $(this).attr('name');
                catalogs.push( catalogId );
            })
            //如果第一个的值为undefined，说明是全选，所以需要排除全选键
            if( catalogs[0] === undefined ){
                catalogs.shift(1);
            }
        }

        this.deleteAjax( catalogs )
            .done(function( data ){
                NProgress.done();  
                if( data.code === 1 ){

                    catalogs.forEach(function( catalogId ){
                        $('.main table input[name="'+ catalogId + '"]').parents('tr').remove();                               
                    })
                }
            })
    },
    // ajax请求：添加
    addAjax: function( url,data ) {
        let that = this;
        
        return $.ajax({
            type: 'post',
            url: url,
            data: {
                catalogName: catalogName
            },
            beforeSend: function(){
                NProgress.start();
            }
        }).done(function(data){
            NProgress.done();
            
            if( data.code !== 1 ){
                $('.main .edit-header').css('color','red');
                
                return $('.main .edit-header span').html(data.message);
            }

            that.hideEdit();
            $('.nav-side .nav-catalog').click();

        })
    },
    // ajax请求：删除catalogsDel
    deleteAjax: function( url,data ){
        return $.ajax({
            type: 'post',
            url: url,
            data: data,
            beforeSend: function(){
                NProgress.start();
            }
        })
    },
    // ajax请求：更新栏目
    updateAjax: function( catalogId,catalogName ) {
        let that = this;
        return $.ajax({
            type: 'post',
            url: '/backstage.html/nav_catalog/catalog_update',
            data: {
                catalogId: catalogId,
                catalogName: catalogName
            },
            beforeSend: function(){
                NProgress.start();
            }
        }).done(function(data){

            NProgress.done();
            if( data.code !== 1 ){
                $('.main #catalog-page .catalog-edit-header').css('color','red');
                
                return $('.main #catalog-page .catalog-edit-header span').html(data.message);
            }

            that.hideEdit();
            $('.main #catalog-page .catalog-page-body input[name="' + catalogId + '"]').parent().next().next().children('strong').html(catalogName)
        })
    },
}