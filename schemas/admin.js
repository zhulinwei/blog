'use strict'

const crypto = require('crypto');
const utilFile = require('../util/util.js');


let AdminSchema = new mongoose.Schema({
    // 管理员表中的openId主要是为了在评论管理中回复评论使用
    openId: {
        type: String,
        ref: 'user',
        default: null
    },
    adminName: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    // 权限
    jurisdiction: {
        type: Number,
        default: 0
    }
})

module.exports = AdminSchema;