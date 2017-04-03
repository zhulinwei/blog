'use strict'

let ActicleSchema = require('../schemas/acticle.js');
let Acticle = mongoose.model('Acticle', ActicleSchema);

module.exports = Acticle;