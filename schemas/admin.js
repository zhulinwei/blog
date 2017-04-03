'use strict'

const crypto = require('crypto');
const utilFile = require('../util/util.js');


let AdminSchema = new mongoose.Schema({
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

// AdminSchema.statics = {
//     compare: function( password, cb ){

//         let pwd = utilFile.sha1( password );
//         console.log( '--------' )
//         console.log( pwd )
//         console.log( this.password )
//         console.log( '--------' )

//         if( pwd === this.password ){
//             cb( null, {'code': 1});
//         }else{
//             cb( null, {'code': 0, 'message': '密码不正确'});
//         }
//     }
// }

module.exports = AdminSchema;