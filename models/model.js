'use strict';

/**
 * General
 * @module models/model.js
 */
class Model {

  constructor(schema) {
    this.schema = schema;
  }

  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }

  post(record) {

  }

  put(_id, record) {

  }

  delete(_id) {

  }

}
