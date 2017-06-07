'use stict'
const moment = require('moment');
let CommentSchema = new mongoose.Schema({
    superior: {//这里即为子表的外键，关联主表acticle
        type: mongoose.Schema.Types.ObjectId,
        ref: 'acticle'
    },
    from: {
        type: String,
        ref: 'user'
    },
    to: {
        type: String,
        ref: 'user',
        default: null
    },
    content: String,
    meta: {
        createAt: {
            type: Number,
            default: new Date().getTime()
        }
    }
});

CommentSchema.pre('save', function(next) {// 注意，在这个地方不能使用箭头函数
    if( this.isNew ){
        this.meta.createAt = new Date().getTime();
    }
    next();
});

module.exports = CommentSchema;
