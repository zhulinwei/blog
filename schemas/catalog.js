'use strict'

const moment = require('moment');

// 定义目录schema
let CatalogSchema = new mongoose.Schema({
    catalogName: String,
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

CatalogSchema.pre('save', function(next){// 这里不能使用()=>
    if( this.isNew ){
        this.meta.createAt = this.meta.updateAt = new Date().getTime();
    }else{
        this.meta.updateAt = new Date().getTime();
    }

    next();
})


module.exports = CatalogSchema;