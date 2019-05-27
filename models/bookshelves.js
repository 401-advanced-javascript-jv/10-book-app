'use strict';

const Schema = require('./bookshelves-schema.js');

class Bookshelves {
  constructor() {
    this.Schema = Schema;
  }

  get(_id) {
    let queryObject = _id ? { _id } : {};
    return this.Schema.find(queryObject);
  }

  post(record) {
    let newRecord = new this.Schema(record);
    return newRecord.save();
  }

  put(_id, record) {
    return this.Schema.findByIdAndUpdate(_id, record, { new: true });
  }

  delete(_id) {
    return this.Schema.findByIdAndDelete(_id);
  }
}

module.exports = new Bookshelves();
