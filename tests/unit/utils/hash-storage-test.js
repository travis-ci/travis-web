import HashStorage from 'travis/utils/hash-storage';

const { module, test } = QUnit;

module('hash-storage');

test('hash storage behaves like local storage', (assert) => {
  const storage = HashStorage.create();

  assert.equal(storage.getItem('hello'), undefined, 'expected storage to initially be empty');
  assert.equal(storage.setItem('hello', 1919), 1919, 'expected setItem to return the value');
  assert.equal(storage.getItem('hello'), 1919, 'expected getItem to retrieve the value');

  assert.equal(storage.removeItem('hello'), null, 'expected removeItem to return null');
  assert.equal(storage.getItem('hello'), null, 'expected the value to be null after removeItem');

  storage.setItem('again', 2010);
  storage.clear();

  assert.equal(storage.getItem('again'), undefined, 'expected the value to be null after clear');
});
