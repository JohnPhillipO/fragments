// tests/unit/getById.test.js
const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('Check if GET fragments metadata is valid', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(resPost.body).toEqual(res.body);
  });

  test('Check if GET fragments metadata is invalid', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}invalid/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
  });
});
