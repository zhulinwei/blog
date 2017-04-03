'use stict'

const moment = require('moment');

let ActicleSchema = new mongoose.Schema({
    superior: {//这里即为子表的外键，关联主表catalog
        type: mongoose.Schema.Types.ObjectId,
        ref: 'catalog'
    },
    title: {
        type: String,
        unqiue: true
    },
    thumbnail: String,
    outline: String,// 简要
    content: String,
    stickyPost: Boolean,// 是否置顶
    lastest: Boolean,// 是否更新至最新文章
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


ActicleSchema.pre('save', function(next) {// 注意，在这个地方不能使用箭头函数
    if( this.isNew ){
        this.meta.createAt = this.meta.updateAt = new Date().getTime();
    }else{
        this.meta.updateAt = new Date().getTime();
    }
    next();
})

module.exports = ActicleSchema;
