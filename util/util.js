'use strict'

const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

// 密码加密
let sha1 = function(str){
    let sha1sum = crypto.createHash('sha1');
    sha1sum.update(str);
    return sha1sum.digest('hex');
};

// 判断是否已经登录
let checkStatus = ( req,res,next ) => {
	if( !req.session.adminName ){
		
		return res.render( 'backstage/login.html' );
	}
	next();
}

// 文件上传
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	    cb(null, path.join( dirname, './public/img/thumbnail/'))
	},
	filename: function (req, file, cb) {
	    cb(null, Date.now() + '.' + file.originalname.split('.')[1])
	}
});

let upload = multer({ 
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }// 文件最大为5M
}).single('avatar');

// 获取文章的图片的文件名
let getImgUrl = function( content ){
	let reg = new RegExp(/<[img|IMG].*?src=[\'|\"](.*?(?:[\.gif|\.jpg|\.jpeg|\.png]))[\'|\"].*?[\/]?>/g);
	let images = content.match( reg );
	if( images ){
		let array = [];
		for( let i=0, image; image=images[i++]; ){
			let imageUrl = image.split('"')[1];
			let imageName = imageUrl.split('/img/ueditor_temp/')[1];
			imageName !== undefined ? imageName : null; 
			array.push( imageName );
		}
		return array;
	}
	return null;
}

// 分页
let paging = ( curr ) => {
	let limit = 2;
	let skip = (curr-1) * limit;
	return {
		curr: curr || 0,
		skip: skip || 0,
		limit: limit
	}
}

exports.sha1 = function(str){
    str = sha1(str);
    return sha1("!@#$%" + str + "HEX").toUpperCase();
}

exports.upload = upload;
exports.paging = paging;
exports.checkStatus = checkStatus;
exports.getImgUrl = getImgUrl;
