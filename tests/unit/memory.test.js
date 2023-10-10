const memory = require('../../src/model/data/memory/index');

describe('Database calls using In-Memory Database Backend', () => {
  test('readFragment() returns meta data from memory db', async () => {
    const fragment = { ownerId: 'a', id: 'b', data: 123 };
    await memory.writeFragment(fragment);
    const result = await memory.readFragment('a', 'b');
    expect(result).toEqual(fragment);
  });

  test('readFragment() with incorrect key returns nothing', async () => {
    await memory.writeFragment({ ownerId: 'a', id: 'b', data: 123 });
    const result = await memory.readFragment('a', 'c');
    expect(result).toBe(undefined);
  });

  test('writeFragment() returns meta data from a written memory db', async () => {
    const fragment = { ownerId: 'a', id: 'b', data: 123 };
    await memory.writeFragment(fragment);
    const result = await memory.readFragment('a', 'b');
    expect(result).toEqual(fragment);
  });

  test('writeFragment() returns nothing', async () => {
    const result = await memory.writeFragment({ ownerId: 'a', id: 'b', data: {} });
    expect(result).toBe(undefined);
  });

  test('readFragmentData() read data from memory db', async () => {
    const data = Buffer.from([1, 2, 3]);
    await memory.writeFragmentData('a', 'b', data);
    const result = await memory.readFragmentData('a', 'b');
    expect(result).toEqual(data);
  });

  test('writeFragmentData() write data buffer to memory db', async () => {
    const data = Buffer.from([1, 2, 3]);
    await memory.writeFragmentData('a', 'b', data);
    const result = await memory.readFragmentData('a', 'b');
    expect(result).toEqual(data);
  });
});
