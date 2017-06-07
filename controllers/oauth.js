'use strict'

const User = require('../models/user.js');
const request = Promise.promisify( require('request') );

let appId = '101405670';

// 获取openId
let getOpenId = function (token) {
		let url = 'https://graph.qq.com/oauth2.0/me?access_token=' + token;
		return request( url )
			.then(function(data){
				let body = data.body;
				let length = body.length;
				let openId = JSON.parse( body.substring(10,length-4) ).openid;
				return openId;
			})
			.catch((error) => {
				return new Promise.reject( error );
			})
};

// 根据openId从数据库中取出对应的用户信息
let getUserFromDb = (openId) => {
	return User.findOne({"_id": openId}) 
		.catch((error) => {
			return new Promise.reject( error );
		})
}

// 根据openId从QQ中获取用户信息
let getUserFromQq = function (token,openId){
	let url = 'https://graph.qq.com/user/get_user_info?access_token=' + token + '&oauth_consumer_key=' + appId +'&openid=' + openId;
	return request( url )
		.then(function(data){
			let info = JSON.parse( data.body )
			return info;
		})
		.catch((error) => {
			return new Promise.reject( error );
		})
};

// 将从QQ中获取到的用户信息保存进数据库中
let saveUserFromQq = (openId,info) => {
	let user = new User({
		_id: openId,
		nickName: info.nickname,
		thumbnail: info.figureurl_qq_1.replace('\\','')
	})
	return user.save();
};

// 整合getUserFromQq与saveUserFromQq两个操作
let saveUser = (token,openId) => {
	return getUserFromQq(token,openId)
		.then((data) => {
			return saveUserFromQq(openId,data);
		})
		.catch((error) => {
			return new Promise.reject( error );
		})
};

let saveSession = () => {
	req.session.openId = data._id;
	req.session.nickName = data.nickName;
	req.session.thumbnail = data.thumbnail;
};


let getIdentity = ( req,res,next ) => {
	let openId;
	let token = req.query.access_token;
	getOpenId(token)
		.then((data) => {
			openId = data;
			return getUserFromDb(data);
		})
		.then((data) => {
			// 如果在数据库中没有该用户，则去QQ中获取并保存
			if(!data){
				return saveUser(token,openId);
			}
			return data;
		})
		.then((data) => {
			req.session.openId = data._id;
			req.session.nickName = data.nickName;
			req.session.thumbnail = data.thumbnail;
			res.json({"code": 1});
		})
}

exports.getIdentity = getIdentity;
