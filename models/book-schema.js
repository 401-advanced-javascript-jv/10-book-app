'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const Schema = mongoose.Schema;

const book = new Schema(
  {
    author: { type: String, required: true },
    title: { type: String, required: true },
    isbn: { type: String, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true },
    bookshelf_id: {type:String, required: true}
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
book.virtual('name', {
  ref: 'Bookshelf',
  localField: 'bookshelf_id',
  foreignField: '_id',
});

book.pre('find', function() {
  this.populate('name');
});

module.exports = mongoose.model('Book', book);
