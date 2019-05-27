'use strict';

const Model = require('./model.js');
const Schema = require('./book-schema.js');

class Book extends Model {}

module.exports = new Book(Schema);
