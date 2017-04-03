'use strict'

let AdminSchema = require('../schemas/admin.js');
let Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;