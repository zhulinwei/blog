'use strict'

let CatalogSchema = require('../schemas/catalog.js');
let Catalog = mongoose.model('catalog', CatalogSchema);

module.exports = Catalog;