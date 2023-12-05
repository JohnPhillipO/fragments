// tests/unit/delete.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  // If request is unauthenticated
  test('unauthenticated request are denied', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can delete a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    // Delete the fragment
    const id = res.body.fragment.id;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.status).toBe('ok');
  });

  test('No fragment found with that id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    // Delete the fragment with invalid id
    const deleteRes = await request(app)
      .delete(`/v1/fragments/invalidID`)
      .auth('user1@email.com', 'password1');

    // Post was successful.
    expect(res.statusCode).toBe(201);

    // Delete should return 404 (Id is not found)
    expect(deleteRes.statusCode).toBe(404);
  });
});
