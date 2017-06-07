'use strict'

let ActicleSchema = require('../schemas/acticle.js');
let Acticle = mongoose.model('acticle', ActicleSchema);

module.exports = Acticle;