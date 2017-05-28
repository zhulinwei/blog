'use strict'

const del = require('del');
const path = require('path');
const crypto = require('crypto');
const moment = require('moment');
const Promise = require('bluebird');
const utilFile = require('../util/util.js');
const fs = Promise.promisifyAll(require("fs"));
let Admin = require('../models/admin.js');
let Acticle = require('../models/acticle.js');
let Catalog = require('../models/catalog.js');

// 在线编辑时图片上传地址
let newImagePath = path.join( dirname, '/public/img/ueditor/');
let oldImagePath = path.join( dirname, '/public/img/ueditor_temp/');
let thumbnailPath = path.join( dirname, '/public/img/thumbnail/');

// 打开后台登录页面
let login = (req, res, next) => {
    res.render('backstage/login.html');
};

// 检测登录帐号密码
let checkpwd = (req, res, next) => {
    return Admin.findOne({
            adminName: req.body.username
        }).then((data) => {
            // 用户不存在
            if (!data) {
                return res.json({ code: 1001, message: '用户不存在' })
            }

            let pwd = utilFile.sha1(req.body.password);
            if (pwd !== data.password) {
                return res.json({ code: 1002, message: '密码不正确' })
            }
            req.session.adminName = data.adminName;
            req.session.jurisdiction = data.jurisdiction;
            // 通过验证
            res.json({ code: 1 });
        })
};

// 获取系统消息
let getNews = () => {
    return redis.get('blog_news')
        .then( ( data ) => {
            // 有待后期完善
            if( !data ){
                redis.set('blog_news', 0);
            }
            return Promise.resolve( data );
        })
        .catch((error) => {
            return Promise.reject(error);
        })
};

// 获取总文章数
let getActicles = () => {
    return redis.get('blog_acticles')
        .then((data) => {
            if( !data ){
                data = 0;                
                return getCount( Acticle )
            }
            return Promise.resolve(data);
        })
        .then( (data) => {
            // 在redis中保存
            redis.set('blog_acticles', data);
            return Promise.resolve(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        })
};

// 获取最近更新文章数量
let getUpdateNumber = () => {
    return redis.get('blog_update')
        .then((data) => {
            // 有待后期完善
            if( !data ){
                data = 0;
                redis.set('blog_update', 0);
            }
            return Promise.resolve(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        })
};

// 获取总阅读人次
let getReadNUmber = () => {
    return redis.get('blog_read')
        .then((data) => {
            // 有待后期完善
            if( !data ){
                data = 0;
                redis.set('blog_read', 0);
            }
            return Promise.resolve(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};


// 获取数量
let getCount = ( model,options ) => {
    return model.count(options)
        .catch((error) => {
            return Promise.reject(error)
        });
}

// 打印数据字段
let getField = ( model,options,fields,skip,limit,reorder ) => {
    let option = options || null;
    let hop = parseInt(skip) || 0;
    let length = parseInt(limit) || null;
    let sort = reorder || null;
    
    return model.find(option)
        .select(fields)
        .sort(sort)                
    	.skip(hop)
    	.limit(length)
        .lean()
        .catch((error) => {
            return Promise.reject(error)
        });
}

// 展示后台首页
let showIndex = (req, res, next) => {
    // return Promise.all([getNews(), getActicles(), getUpdateNumber(), getReadNUmber(), getField( Catalog,null,'catalogName' )])
    return Promise.all([getNews(), getField( Catalog,null,'catalogName' )])
        .then((data) => {
            res.render('backstage/backstage.html', { news: data[0], catalogs: data[1] });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

// 统计各类文章数量
let acticleTypes = () => {
    return Acticle.aggregate([
            { $group: { _id: "$superior", num_tutorial: { $sum: 1 } } }
        ])
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};


// 首页
let navHome = (req, res, next) => {
    return Promise.all([getActicles(), getUpdateNumber(), getReadNUmber()])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

// 目录管理
let navCatalog = (req, res, next) => {
    return Promise.all([ getField( Catalog,null,'catalogName' ), acticleTypes()])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

// 添加目录
let catalogAdd = (req, res, next) => {
    return Catalog.findOne({
            catalogName: req.body.catalogName
        })
        .then((data) => {
            if (data) {
                return res.json({ 'code': 2001, 'message': '栏目已经存在，请重新输入！' })
            }

            return Catalog.create({catalogName: req.body.catalogName});
        })
        .then((data) => {
            res.json({ "code": 1, catalogId: data._id });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

// 删除目录
let catalogsDel = (req, res, next) => {
    // remove + $in: 可以做到批量删除，catalogs是数组形式
    return Catalog.remove({ "_id": { $in: req.body.catalogs } })
        .then((data) => {
            res.json({ "code": 1 });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

// 更改目录
let catalogEdit = (req, res, next) => {
    return Catalog.findOne({
            catalogName: req.body.catalogName
        })
        .then((data) => {
            if (data) {
                return res.json({ 'code': 2001, 'message': '栏目已经存在，请重新输入！' })
            }
            return Catalog.update({
                    _id: req.body.catalogId
                }, {
                    catalogName: req.body.catalogName
                })
        })
        .then((data) => {
            res.json({ "code": 1 });
        })
        .catch((error) => {
            return Promise.reject(error);
        })
};

// 文章管理
let navArticle = ( req,res,next ) => {
    let options = {
        superior: req.query.catalogId
    }
    let record = {'meta.createAt': -1};
    let fields = 'title thumbnail stickyPost lastest meta'; 
    let paging = utilFile.paging( req.query.curr );

    return Promise.all([ getCount( Acticle,options ),getField( Acticle,options,fields,paging.skip,paging.limit,record ) ])
        .then( (data) => {
            data[1].forEach( (acticle ) => {
                acticle.meta.createAt = moment(acticle.meta.createAt).format('YYYY-MM-DD');
                acticle.meta.updateAt = moment(acticle.meta.updateAt).format('YYYY-MM-DD');
            })
            res.json( data ); 
        })
        .catch((error) => {
            return Promise.reject(error)
        })
}

// 文章详情
let ArticleDet = ( req,res,next ) => {
    let options = {
        _id: req.body.acticleId
    }
    return Promise.all([ getField( Catalog,null,'catalogName' ),getField( Acticle,options ) ])
        .then( (data) => {
            res.json( data ); 
        })
        .catch((error) => {
            return Promise.reject(error)
        })
}

// 更新文章
let ArticleEdit = ( req,res,next ) => {
    let dir_url = '/img/ueditor_temp/';
    let images = utilFile.getImgUrl( req.body.content,dir_url );
    moveAndDeleteImage( images )
        .then( () => {
            if( JSON.parse( req.body.stickyPost ) ){
                return Acticle.findOneAndUpdate({
                        stickyPost: true
                    },{
                        stickyPost: false
                    })
            }
        })
        .then( (data) => {
            return Acticle.findOne({_id: req.body.acticleId})
        })
        .then( (data) => {
            // 将图片路径由临时文件夹改为为文件夹中的路径
            let content = req.body.content.replace(/\img\/ueditor_temp/g,'img/ueditor');
            data.superior = req.body.superior;
            data.title = req.body.title;
            data.outline = req.body.outline;
            data.content = content;
            data.stickyPost = req.body.stickyPost;
            data.lastest = req.body.lastest;
            data.meta.updateAt = new Date().getTime();
            return data.save();
        })
        .then((data) => {
            res.json({"code":1})            
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
}

// 删除文章
let ArticleDel = ( req,res,next ) => {
    let curr = req.body.curr;
    let acticles = req.body.acticles;
    let imageUrls = req.body.imageUrls;
    let options = {
        superior: req.body.catalogId
    }
    let fields = 'title thumbnail stickyPost lastest meta'; 
    let paging = utilFile.paging( req.body.curr );

    // 删除所选文章并更新该页内容，所该页已经不存在内容的情况下，获取上一页的内容
    return Acticle.remove({ "_id": {$in: req.body.acticles} })
        .then( (data) => {
            return Promise.all([ getCount( Acticle,options ),getField( Acticle,options,fields,paging.skip,paging.limit ) ]);
        })
        .then( (data) => {
            // 该分页已经不存在内容但上页依然有
            if( data[0] !== 0 && data[1].length === 0 ){
                curr = curr - 1;
                let prePaging = utilFile.paging( curr );
                return Promise.all([ getCount( Acticle,options ),getField( Acticle,options,fields,prePaging.skip,prePaging.limit ) ])
            }else{
                // 返回当前页                
                return data;
            }
        })
        .then( (data) => {
            data.push( curr );
            res.json(data);
        })
        // 删除缩略图
        .then( () => {
            return imageUrls.map( (imageUrl) => {
                if(imageUrl !== ''){
                    return del([ thumbnailPath + imageUrl ])
                }
            })
        })
        .then( () => {
            return redis.get('blog_acticles');
        })
        .then( (data) => {
            return redis.set('blog_acticles',parseInt(data) - imageUrls.length);
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
}

// 发布文章
let navPublic = ( req,res,next ) => {
    return getField( Catalog,null,'catalogName' )
        .then( ( data ) => {
            res.json( data );
        })
        .catch((error) => {
            return Promise.reject(error);
        })
}

let thumbnailSave = ( req,res,next ) => {
    let exist = fs.existsSync(thumbnailPath);

    if(!exist){
        fs.mkdir(thumbnailPath);
    }
    
    utilFile.upload(req, res, function (error) {
        if (error) {
            return Promise.reject(error);
        }
        // 本地环境:windows
        res.json({"code": 1, "path": req.file.path.split('thumbnail\\')[1]});
        // 生产环境:linux
        // res.json({"code": 1, "path": req.file.path.split('thumbnail/')[1]});
    })
}

// 移动图片至图片文件夹中并删除临时图片文件夹中的不需要用上的部分
let moveAndDeleteImage = ( imgPaths ) => {
    // 如果不存在imgPaths，直接返回
    if( !imgPaths ){
        return Promise.resolve();
    }
    // 不能使用fs.existsAsync，因为不能返回Promise
    let exist = fs.existsSync(newImagePath);

    if( !exist ){
        fs.mkdir(newImagePath);
    }

    return Promise.all(imgPaths.map( (imgPath) => {
            if( imgPath ){
                // 将图片由临时文件夹转移至图片文件夹中
                return fs.renameAsync( oldImagePath + imgPath , newImagePath + imgPath )
                    .catch( ( error ) => {
                        return Promise.reject( error )
                    })
            }
        }))
        .then( () => {// 删除临时文件夹中的文件
            return del([ oldImagePath + '*' ])
        })
}

// 保存文章
let mainBodySave = ( req,res,next ) => {

    let images = utilFile.getImgUrl( req.body.content );

    moveAndDeleteImage( images )
        .then( () => {
            if( JSON.parse( req.body.stickyPost ) ){
                return Acticle.findOneAndUpdate({
                        stickyPost: true
                    },{
                        stickyPost: false
                    })
            }
        })
        .then( (data) => {

            // 将图片路径由临时文件夹改为为文件夹中的路径
            let content = req.body.content.replace(/\img\/ueditor_temp/g,'img/ueditor');
            return Acticle.create({
                    superior: req.body.superior,
                    title: req.body.title,
                    thumbnail: req.body.thumbnail,
                    outline: req.body.outline,
                    content: content,
                    stickyPost: req.body.stickyPost,
                    lastest: req.body.lastest
                })
        })
        .then( (data) => {
            res.json({"code":1});
        })
        .then( () => {
            return redis.get('blog_acticles');
        })
        .then( (data) => {
            return redis.set('blog_acticles',parseInt(data) + 1);
        })
        .catch( (error) => {
            return Promise.reject( error );
        })
}


// 帐号管理
let administratorList = (req, res, next) => {

    let fields = 'adminName jurisdiction';
    Promise.all([ getCount( Admin ), getField( Admin,null,fields )])
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            return Promise.reject(error);
        })
}

// 添加管理员
let administratorAdd = (req, res, next) => {

    if( req.session.jurisdiction !== 1 ){
        return res.json({"code": 7003, "message": "没有权限添加新的管理员"});
    }

    return Admin.findOne({ adminName: req.body.adminName })
        .then( ( data ) => {
            if (data) {
                return res.json({ "code": 7001, "message": "该管理员已经存在" });
            }

            let password = utilFile.sha1( req.body.password );

            return Admin.create({
                    adminName: req.body.adminName,
                    password: password
                })
                .then( ( data ) => {
                    res.json({"code": 1})
                })
                .catch( ( error ) => {
                    return Promise.reject(error);
                })
        })
        .catch( ( error ) => {
            return Promise.reject(error);
        })
}

// 编辑管理员
let administratorEdit = ( req,res,next ) => {

    if( req.body.adminId !== req.session.adminId ){
        return res.json({"code": 7002, "message": "无法更改其他管理员名称"});
    }

    return Admin.findOne({
        adminName: req.body.adminName
    })
    .then((data) => {
        if (data) {
            return res.json({ 'code': 2001, 'message': '该管理员已经存在！' })
        }

        return Admin.update({
            _id: req.body.adminId
        }, {
                adminName: req.body.adminName
            })
            .then((data) => {
                res.json({ "code": 1 });
            })
            .catch((error) => {
                return Promise.reject(error);
            })
    })
    .catch((error) => {
        return Promise.reject(error);
    })
};

// 删除管理员
let administratorDel = ( req,res,next ) => {

    if( req.session.jurisdiction !== 1 ){
        return res.json({"code": 7004, "message": "没有权限删除其他管理员"});
    }
    return Admin.remove({ "_id": { $in: req.body.adminIds } })
        .then((data) => {
            res.json({ "code": 1 });
        })
        .catch((error) => {
            return Promise.reject(error);
        })
};

// 修改密码
let modifyPassword = ( req,res,next ) => {

    let oldPwd = utilFile.sha1(req.body.oldPwd);
    return Admin.findOne({
            _id: req.session.adminId
        })
        .then( (data) => {
            if( data.password !== oldPwd ){
                return res.json({"code": 7005, "message": "旧密码不正确，请重新输入！"});
            }

            let newPwd = utilFile.sha1(req.body.newPwd);

            return Admin.update({
                    _id: req.body.adminId
                }, {
                    password: req.body.newPwd
                })
                .then((data) => {
                    res.json({ "code": 1 });
                })
                .catch((error) => {
                    return Promise.reject(error);
                })

        })
}

let ueditor = ( req,res,next ) => {
    //客户端上传文件设置
    var ActionType = req.query.action;
     
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = '/img/ueditor_temp/';//默认图片上传地址：这是临时上传的文件夹
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {

            file_url = '/video/ueditor/'; //视频
        }

        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/img/ueditor/';
        
        fs.readdirAsync( path.join( dirname,'/public',dir_url) )
            .then( (data) => {
                let images = {
                    total: data.length,
                    list: data
                }
                res.json(images);
                // 客户端会列出 dir_url 目录下的所有图片,但是在文件夹中无图片的情况下，会出现bug，故弃用
                // res.ue_list(dir_url); 
            })
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/js/ueditor/nodejs/config.json');
    }
}

exports.login = login;
exports.checkpwd = checkpwd;
exports.showIndex = showIndex;
exports.navHome = navHome;
exports.navCatalog = navCatalog;
exports.catalogsDel = catalogsDel;
exports.catalogAdd = catalogAdd;
exports.catalogEdit = catalogEdit;
exports.navArticle = navArticle;
exports.ArticleDet = ArticleDet;
exports.ArticleDel = ArticleDel;
exports.ArticleEdit = ArticleEdit;
exports.navPublic = navPublic;
exports.thumbnailSave = thumbnailSave;
exports.mainBodySave = mainBodySave;
exports.administratorList = administratorList;
exports.administratorAdd = administratorAdd;
exports.administratorEdit = administratorEdit;
exports.administratorDel = administratorDel;
exports.modifyPassword = modifyPassword;
exports.ueditor = ueditor;