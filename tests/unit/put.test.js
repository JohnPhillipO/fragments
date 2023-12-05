// tests/unit/put.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If request is unauthenticated
  test('unauthenticated request are denied', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated user successfully updates fragment data', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .put(`/v1/fragments/${post.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('I updated this fragment!');

    expect(res.status).toBe(200);

    // Get the fragment and check if it changed
    const get = await request(app)
      .get(`/v1/fragments/${post.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(get.statusCode).toBe(200);
    expect(Buffer.from(get.text)).toEqual(Buffer.from('I updated this fragment!'));
  });

  test('authenticated user fails to update a fragment with invalid content type', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .put(`/v1/fragments/${post.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('I updated this fragment!');

    expect(res.status).toBe(400);

    // Get the fragment and check if it changed
    const get = await request(app)
      .get(`/v1/fragments/${post.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(get.statusCode).toBe(200);
    expect(Buffer.from(get.text)).toEqual(Buffer.from('This is a fragment'));
  });

  test('authenticated user fails to update a fragment data with invalid ID', async () => {
    const res = await request(app)
      .put('/v1/fragments/invalidID')
      .auth('user1@email.com', 'password1')
      .send('I updated this fragment!')
      .set('Content-type', 'text/plain');

    expect(res.status).toBe(404);
  });
});
