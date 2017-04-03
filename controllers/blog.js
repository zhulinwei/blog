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
        }else if( string.indexOf('year','years') !== -1 ){
            status = '年前'
        }
        return ( time + status ).replace(/^(an|a)/,'1');
    }
}

// 获取置顶文章
let getStickyPost = () => {
    return Acticle.findOne({
            stickyPost: true
        })
        .lean()
        .then( (data) => {
            // 在存在置顶文章的情况下
            if ( data ){
                data.meta.updateAt = Blog.translate( moment(data.meta.updateAt).toNow(true) );
                data.meta.createAt = Blog.translate( moment(data.meta.createAt).toNow(true) );
            }
            return Promise.resolve( data )
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
}

// 获取最新文章
let getLastest = ( skip,limit ) => {
    let hop = parseInt(skip) || Blog.skip;
    let length = parseInt(limit) || Blog.limit;

    return Acticle.find({
            stickyPost: false,
            lastest: true
        })
        .skip(hop)
        .limit(length)
        .sort({ meta: -1 })
        .lean()// 必须加上lean否则无法进行时间戳的转化
        .then( (data) => {
            // 在存在最新文章的情况下
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

// 获取侧边栏
let getCatalog = () => {
    return Catalog.find()
    	.select('catalogName')
        .then( (data) => {
            return Promise.resolve( data );
        }).catch( (error) => {
            return Promise.reject( error );
        })
}

let getActile = {
    catalog: ( req,res,next,Id) => {// 获取侧边栏所属文章
        return Acticle.find({
            superior: Id
        }).then(function(data){
            res.json( data );
        })
    },
    acticle: ( req,res,next,Id) => {// 获取文章详细内容
        return Acticle.findOne({
                _id: Id
            })
            .lean()
            .then(function(data){
                data.meta.updateAt = Blog.translate( moment(data.meta.updateAt).toNow(true) );
                data.meta.createAt = Blog.translate( moment(data.meta.createAt).toNow(true) );
                res.render('blog/acticle.html', { acticle: data });
            })
    }
}

let showBlog = ( req,res,next ) => {

    console.log( req.body )
    console.log( req.query )

    let query = url.parse( req.url ).query;
    let type = querystring.parse(query).type;
    let Id = querystring.parse(query).Id

    if( !type ){
        return Promise.all([getStickyPost(), getLastest(), getCatalog()])
            .then(function( data ){
                console.log( data )
                res.render('blog/blog.html', {stickyPosts: data[0], lastests: data[1], catalog: data[2]})
            })
            .catch( (error) => {
                return Promise.reject( error );
            })
    }
    // 使用策略模式获取相对应的文章
    getActile[type](req,res,next,Id);
}

let nextActicles = ( req,res,next ) => {
    let curr = req.query.curr;
    let skip = curr * Blog.limit;
    getLastest( skip,Blog.limit )
        .then( (data) => {
            res.json(data)
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
}


exports.showBlog = showBlog;
exports.nextActicles = nextActicles;