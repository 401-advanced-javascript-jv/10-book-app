'use strict';

const Model = require('./model.js');
const Schema = require('./bookshelf-schema.js');

class Bookshelf extends Model {}

module.exports = new Bookshelf(Schema);
