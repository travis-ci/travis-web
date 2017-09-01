import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('repo', 'Unit | store.paginated', {
  needs: ['model:repo', 'service:ajax', 'service:auth', 'service:store']
});

test('it adds records already in the store to paginated collection', function (assert) {
  assert.expect(3);

  let store = this.store(),
    repos = [];

  Ember.run(() => {
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

    let queryResult = Ember.ArrayProxy.create({ content: repos });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return Ember.RSVP.resolve(queryResult);
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

  Ember.run(() => {
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

    let queryResult = Ember.ArrayProxy.create({ content: repos });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return Ember.RSVP.resolve(queryResult);
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

  Ember.run(() => {
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

    let queryResult = Ember.ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return Ember.RSVP.resolve(queryResult);
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

  Ember.run(() => {
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

    let queryResult = Ember.ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: 1, limit: 1, offset: 0 });

    return Ember.RSVP.resolve(queryResult);
  };

  let result = store.paginated('repo', {},
                               { filter: () => true, sort: 'id:desc' });

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);

    Ember.run(() => {
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

  Ember.run(() => {
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

    let queryResult = Ember.ArrayProxy.create({ content: [] });
    queryResult.set('meta', {});
    queryResult.set('meta.pagination', { count: total, limit: 1, offset: 0 });

    return Ember.RSVP.resolve(queryResult);
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

