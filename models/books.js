'use strict';

const Schema = require('./books-schema.js');

module.exports = class Books {
  constructor() {}

  get(_id) {
    let queryObject = _id ? { _id } : {};
    return Schema.find(queryObject);
  }

  post(record) {
    let newRecord = new Schema(record);
    return newRecord.save();
  }

  put(_id, record) {
    return Schema.findByIdAndUpdate(_id, record, { new: true });
  }

  delete(_id) {
    return Schema.findByIdAndDelete(_id);
  }
};
