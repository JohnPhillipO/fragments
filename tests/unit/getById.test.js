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
      .send('<h1>This is a fragment.</h1>');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(Buffer.from(res.text)).toEqual(Buffer.from('<h1>This is a fragment.</h1>'));
  });

  test('Check if it gets a valid fragment of application/json with valid ext', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.json`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(200);
    expect(Buffer.from(res.body)).toEqual(Buffer.from('This is a fragment'));
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

  test('Check text/plain invalid types', async () => {
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

  test('Check text/markdown invalid types', async () => {
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

  test('Check text/html invalid types', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.png`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(415);
  });

  test('Check application/json invalid types', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('This is a fragment');

    const res = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}.png`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');

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
