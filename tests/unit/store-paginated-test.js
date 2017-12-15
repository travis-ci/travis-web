import { resolve } from 'rsvp';
import ArrayProxy from '@ember/array/proxy';
import { run } from '@ember/runloop';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('repo', 'Unit | store.paginated', {
  needs: ['model:repo', 'service:api', 'service:auth', 'service:store']
});

test('it adds records already in the store to paginated collection', function (assert) {
  assert.expect(3);

  let store = this.store(),
    repos = [];

  run(() => {
    let repo = store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { starred: true }
      }
    });

    repos.push(repo);
  });

  store.query = function () {
    assert.ok('store.query was called');

    let queryResult = ArrayProxy.create({ content: repos });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return resolve(queryResult);
  };

  let result = store.paginated('repo', { starred: true },
    { filter: (repo) => repo.get('starred'), sort: 'id:desc', dependencies: ['starred'] });

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.equal(collection.get('pagination.perPage'), 1);
    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);
  });
});

test('it uses filter function to filter records', function (assert) {
  assert.expect(3);

  let store = this.store(),
    repos = [];

  run(() => {
    let repo = store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { starred: false }
      }
    });

    repos.push(repo);
  });

  store.query = function () {
    assert.ok('store.query was called');

    let queryResult = ArrayProxy.create({ content: repos });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return resolve(queryResult);
  };

  let result = store.paginated('repo', { starred: true },
    { filter: (repo) => repo.get('starred'), sort: 'id:desc', dependencies: ['starred'] });

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.equal(collection.get('pagination.perPage'), 1);
    assert.equal(collection.toArray().length, 0);
  });
});

test('it sets limit based on the response, not the query params', function (assert) {
  let store = this.store();

  run(() => {
    store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { }
      }
    });

    store.push({
      data: {
        id: 2,
        type: 'repo',
        attributes: { }
      }
    });
  });

  store.query = function () {
    assert.ok('store.query was called');

    let queryResult = ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return resolve(queryResult);
  };

  let result = store.paginated('repo', { limit: 1000 },
    { filter: () => true, sort: 'id:desc' });

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.equal(collection.get('pagination.perPage'), 1);
    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['2']);
  });
});

test('it sorts results and live updates the first page', function (assert) {
  let store = this.store();

  run(() => {
    store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { }
      }
    });
  });

  store.query = function () {
    assert.ok('store.query was called');

    let queryResult = ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return resolve(queryResult);
  };

  let result = store.paginated('repo', {},
    { filter: () => true, sort: 'id:desc' });

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);

    run(() => {
      store.push({
        data: {
          id: 2,
          type: 'repo',
          attributes: { }
        }
      });
    });

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['2']);
  });
});

test('it updates pagination data when forceReload is set to true', function (assert) {
  assert.expect(4);
  let store = this.store();

  run(() => {
    store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { }
      }
    });
  });

  let total = 0;
  store.query = function () {
    assert.ok('store.query was called');

    total += 1;

    let queryResult = ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: total, limit: 1, offset: 0 });

    return resolve(queryResult);
  };

  let done = assert.async();

  store.paginated('repo', {}, { filter: () => true, forceReload: true }).then((paginatedCollection) => {
    assert.equal(paginatedCollection.get('pagination.total'), 1);

    let result = store.paginated('repo', {}, { filter: () => true, forceReload: true });

    result.then((paginatedCollection) => {
      paginatedCollection._lastPromise.then(() => {
        done();

        assert.equal(paginatedCollection.get('pagination.total'), 2);
      });
    });
  });
});

test('it returns live paginated collection even if offset is a string', function (assert) {
  assert.expect(1);

  let store = this.store();
  store.query = function () {
    let queryResult = ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });
    return resolve(queryResult);
  };

  let done = assert.async();
  let collection = store.paginated('repo', { offset: '0' }, {});

  collection.then((collection) => {
    assert.equal(collection.constructor.toString(), 'LivePaginatedCollection', 'paginated should return live paginated collection instance');

    done();
  });
});
