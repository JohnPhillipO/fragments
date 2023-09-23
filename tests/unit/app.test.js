// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 Middleware', () => {
  // If resource can't be found occurs
  test('should return a 404 status code and JSON error message', () =>
    request(app).get('/a-nonexisting-resource').expect(404));
});
