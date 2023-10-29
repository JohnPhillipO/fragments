// tests/unit/getById.test.js
const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id or GET /v1/fragments/:id.ext', () => {
  test('Check if it gets a valid fragment of text/plain with valid ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(Buffer.from(res.text)).toEqual(Buffer.from('This is a fragment'));
  });

  test('Check if it gets a valid fragment of text/markdown with valid ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(Buffer.from(res.text)).toEqual(Buffer.from('This is a fragment'));
  });

  test('Check if it gets a valid fragment of text/html with valid ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(Buffer.from(res.text)).toEqual(Buffer.from('This is a fragment'));
  });

  test('Check if it gets a valid fragment with valid types and without ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(Buffer.from(res.text)).toEqual(Buffer.from('This is a fragment'));
  });

  test('Check invalid types', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.png`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(415);
  });

  test('Invalid ID: Id does not represent a known fragment', async () => {
    const res = await request(app)
      .get(`/v1/fragments/1234`)
      .auth('user1@email.com', 'password1')
      .send('This is a fragment');

    expect(res.status).toBe(404);
  });
});
