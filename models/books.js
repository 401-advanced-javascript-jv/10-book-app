'use strict';

const schema = require('./books-schema.js');

module.exports = class Books {
  constructor(schema) {}

  get(_id) {
    let queryObject = _id ? { _id } : {};
    return schema.find(queryObject);
  }

  post(record) {}

  put(_id, record) {}

  delete(_id) {}
};
