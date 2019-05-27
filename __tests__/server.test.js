'use strict';

const supergoose = require('cf-supergoose');

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Server', () => {
  it('Passes', () => {

  });
});
