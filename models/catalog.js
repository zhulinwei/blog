'use strict'

let CatalogSchema = require('../schemas/catalog.js');
let Catalog = mongoose.model('Catalog', CatalogSchema);

module.exports = Catalog;