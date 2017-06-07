'use strict'

const moment = require('moment');

// 定义目录schema
let UserSchema = new mongoose.Schema({
    // 将mongoose原有的_id给覆盖住（原本_id的类型是ObjectId），换成用户的openId存进_id中
    _id: String,
    nickName: String,
    thumbnail: String,
    meta: {
        createAt: {
            type: Number,
            default: new Date().getTime()
        },
        updateAt: {
            type: Number,
            default: new Date().getTime()
        }
    }
});

UserSchema.pre('save', function(next){// 这里不能使用()=>
    if( this.isNew ){
        this.meta.createAt = this.meta.updateAt = new Date().getTime();
    }else{
        this.meta.updateAt = new Date().getTime();
    }
    next();
})

module.exports = UserSchema;