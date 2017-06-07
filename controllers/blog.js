'use strict'

const url = require('url');
const moment = require('moment');
const Promise = require('bluebird');
const querystring = require('querystring');
let User = require('../models/user.js');
let Catalog = require('../models/catalog.js');
let Acticle = require('../models/acticle.js');
let Comment = require('../models/comment.js');


let Blog = {
    skip: 0,// 默认跳过数量
    limit: 10,// 默认每次搜索数量
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
        }else if( string.indexOf('month','months') !== -1 ){
            status = '月前'
        }else if( string.indexOf('year','years') !== -1 ){
            status = '年前'
        }
        return ( time + status ).replace(/^(an|a)/,'1');
    },
    // 获取侧边栏
    catalogList: () => {
        return Catalog.find()
            .select('catalogName')
            .catch( (error) => {
                return Promise.reject( error );
            })
    },
    // option：查询依据、skip：忽略条数、limit：展示条数
    acticle: (option,skip,limit) => {
        let hop = parseInt(skip) || Blog.skip;
        let length = parseInt(limit) || Blog.limit;
        return Acticle.find(option)
            .sort({ 'meta.createAt': -1 })
            .skip(hop)
            .limit(length)
            .lean()            
            .then(function(data){
                // 在存在文章的情况下
                if( data ){
                    data.forEach( (lastest) => {
                        lastest.meta.updateAt = Blog.translate( moment(lastest.meta.updateAt).toNow(true) );
                        lastest.meta.createAt = Blog.translate( moment(lastest.meta.createAt).toNow(true) );
                    })
                }
                return Promise.resolve( data );
            })
            .catch( (error) => {
                return Promise.reject( error );
            })
    },
    // 评论获取
    getComment: (option) => {
        return Comment.find(option)
            .populate('from')
            .populate('to')
            .lean()
            .then(function(data){
                data.forEach( (comment) => {
                    comment.meta.createAt = Blog.translate( moment(comment.meta.createAt).toNow(true) );
                })
                return Promise.resolve( data );
            })
            .catch( (error) => {
                return Promise.reject( error );
            })
    }
};

// 取出置顶文章和目录列表
let showIndex = ( req,res,next ) => {
    let sticky = {// 置顶文章查询条件
        stickyPost: true
    };
    Promise.all([Blog.acticle(sticky), Blog.catalogList()])
        .then(function( data ){
            res.render('blog/blog.html', {stickyPosts: data[0][0], catalog: data[1]})
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
};

// 取出对应的目录文章
let showActicles = ( req,res,next ) => {
    let catalogId = req.query.catalogId;
    // 不存在catalogId，表明是加载首页；反之加载对应目录的文章
    let option = !catalogId ? { lastest: true } : { superior: catalogId}
    Blog.acticle(option)
        .then((data) => {
            res.json(data);
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
};


let detail = ( req,res,next ) => {
    let query = url.parse( req.url ).query;
    let acticleId = querystring.parse(query).acticleId;
    let option = {
        _id: acticleId
    };
    Blog.acticle(option)
        .then((data) => {
            res.render('blog/acticle.html', { acticle: data[0] });
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
};

// 检查登录状态
let checkStatus = ( req,res,next ) => {
    let openId = req.session.openId;
    if( !openId ){
        res.json({'code':1003});
    }else{
        res.json({'code':1});        
    }
}

// 更多文章
let nextActicles = ( req,res,next ) => {
    var skip,option;
    // 获取下一页文章且无catalogId，代表当前在首页底部
    if(req.query.catalogId === 'null'){
        skip = req.query.curr * Blog.limit + 1;
        option = {};
    }else{
        skip = req.query.curr * Blog.limit;
        option = {superior: req.query.catalogId};
    }

    Blog.acticle( option,skip )
        .then( (data) => {
            res.json(data);
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
};

// 评论
let saveComment = ( req,res,next ) => {
    let option;
    let acticleId = req.body.acticleId;
    let fromId = req.body.fromId;
    let toId = req.body.toId || null;
    let content = req.body.content;
    
    
    let comment = new Comment({
        superior: acticleId,
        from: fromId,
        to: toId,
        content: content
    })

    comment.save()
        .then((data) => {
            let option = {
                _id: data._id
            }
            return Acticle.update({
                _id: data.superior
            },{
                $inc:{
                    pigeView: 1
                }
            })
        })
        .then((data) => {
            return Blog.getComment(option);
        })
        .then((data) => {
            res.json( data );
        })
}


// 获取评论
let showComment = ( req,res,next ) => {
    let currentUser;
    // 判断是否已经登录
    if( req.session.openId ){
        currentUser = new Object();
        currentUser.openId = req.session.openId;
        currentUser.nickName = req.session.nickName;
        currentUser.thumbnail = req.session.thumbnail;
    }else{
        currentUser = null;
    }

    let option = { 
        superior: req.query.acticleId
    };
    Blog.getComment(option)
        .then( (data) => {
            res.json({ comments: data, currentUser: currentUser });
        })
};

exports.detail = detail;
exports.showIndex = showIndex;
exports.showActicles = showActicles;
exports.nextActicles = nextActicles;
exports.checkStatus = checkStatus;
exports.saveComment = saveComment;
exports.showComment = showComment;