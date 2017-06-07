'use strict'

let UserSchema = require('../schemas/user.js');
let User = mongoose.model('user', UserSchema);

module.exports = User;