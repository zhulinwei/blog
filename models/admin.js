'use strict'

let AdminSchema = require('../schemas/admin.js');
let Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;