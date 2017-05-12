'use strict'

const url = require('url');
const moment = require('moment');
const Promise = require('bluebird');
const querystring = require('querystring');
let Acticle = require('../models/acticle.js');
let Catalog = require('../models/catalog.js');


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
                return Promise.resolve( data )
            })
            .catch( (error) => {
                return Promise.reject( error );
            })

    }
}


let showBlog = ( req,res,next ) => {
    let query = url.parse( req.url ).query;
    let type = querystring.parse(query).type;
    let Id = querystring.parse(query).Id;
    let sticky = {// 置顶文章查询条件
        stickyPost: true
    };
    let lastest = {// 最新文章查询条件  
        stickyPost: false,
        lastest: true
    }
    // 不存在type代表初次加载首页
    if( !type ){
        return Promise.all([Blog.acticle(sticky), Blog.acticle(lastest), Blog.catalogList()])
            .then(function( data ){
                res.render('blog/blog.html', {stickyPosts: data[0][0], lastests: data[1], catalog: data[2]})
            })
            .catch( (error) => {
                return Promise.reject( error );
            })
    }
    // 根据type判断是获取对于目录的文章列表还是文章详情
    let option =  type === 'catalog' ? {superior: Id} : {_id: Id};
    return Blog.acticle(option)
        .then( (data) => {
            if(type === 'catalog'){// 获取对于目录的文章列表
                res.json( data );
            }else{// 获取文章详情
                res.render('blog/acticle.html', { acticle: data[0] });
            }
        })
}
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

    return Blog.acticle( option,skip )
        .then( (data) => {
            res.json(data);
        })
        .catch( (error) => {
            return Promise.reject( error );
        })

    // return getLastest( skip,Blog.limit )
    //     .then( (data) => {
    //         res.json(data);
    //     })
    //     .catch( (error) => {
    //         return Promise.reject( error );
    //     })
}


exports.showBlog = showBlog;
exports.nextActicles = nextActicles;