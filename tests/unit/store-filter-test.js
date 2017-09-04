import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('repo', 'Unit | store.filter', {
  needs: ['model:repo', 'service:ajax', 'service:auth', 'service:store']
});

test('it does not run query if query params are not passed', function (assert) {
  assert.expect(1);
  let store = this.store();

  store.query = function () {
    assert.ok(false, 'store.query was called, but it should not');

    return Ember.RSVP.resolve();
  };

  Ember.run(() => {
    store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { starred: true }
      }
    });
  });

  let result = store.filter('repo', null, () => true, ['starred']);

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);
  });
});

test('it adds records already in the store to filtered collection', function (assert) {
  assert.expect(3);
  let store = this.store();

  store.query = function () {
    assert.ok(true, 'store.query was called');

    return Ember.RSVP.resolve();
  };

  Ember.run(() => {
    store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { starred: true }
      }
    });

    store.push({
      data: {
        id: 2,
        type: 'repo',
        attributes: { starred: false }
      }
    });
  });

  let processedRecords = [];
  let result = store.filter('repo', {}, function (repo) {
    processedRecords.push(repo.get('id'));

    return repo.get('starred');
  }, ['starred']);

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.deepEqual(processedRecords, ['1', '2'], 'all repo records should be processed');
    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);
  });
});

test('it modifies filtered collection when dependencies change', function (assert) {
  assert.expect(5);
  let store = this.store();

  store.query = function () {
    assert.ok(true, 'store.query was called');

    return Ember.RSVP.resolve();
  };

  Ember.run(() => {
    store.push({
      data: {
        id: 1,
        type: 'repo',
        attributes: { starred: true }
      }
    });

    store.push({
      data: {
        id: 2,
        type: 'repo',
        attributes: { starred: false }
      }
    });
  });

  let processedRecords = [];
  let result = store.filter('repo', {}, function (repo) {
    processedRecords.push(repo.get('id'));

    return repo.get('starred');
  }, ['starred']);

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.deepEqual(processedRecords, ['1', '2'], 'all repo records should be processed');
    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);

    let repo1 = store.peekRecord('repo', 1);
    let repo2 = store.peekRecord('repo', 2);

    Ember.run(() => {
      repo1.set('starred', false);
    });

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), []);

    Ember.run(() => {
      repo2.set('starred', true);
    });

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['2']);
  });
});

test('it runs store.query in the background with forceReload', function (assert) {
  assert.expect(1);
  let store = this.store();

  let queryCount = 0;
  store.query = function () {
    queryCount += 1;

    return Ember.RSVP.resolve();
  };

  let promises = [];
  promises.push(store.filter('repo', {}, () => true, [], true));
  promises.push(store.filter('repo', {}, () => true, [], true));
  promises.push(store.filter('repo', {}, () => true, [], true));

  let done = assert.async();

  Ember.RSVP.all(promises).then((results) => {
    done();

    assert.equal(queryCount, 3);
  });
});

test('it adds new records in the store to the filtered collection', function (assert) {
  assert.expect(3);
  let store = this.store();

  store.query = function () {
    assert.ok(true, 'store.query was called');

    return Ember.RSVP.resolve();
  };

  let result = store.filter('repo', {}, (repo) => repo.get('starred'), ['starred']);

  let done = assert.async();

  result.then((collection) => {
    done();

    assert.equal(collection.toArray().length, 0);

    Ember.run(() => {
      store.push({
        data: {
          id: 1,
          type: 'repo',
          attributes: { starred: true }
        }
      });

      store.push({
        data: {
          id: 2,
          type: 'repo',
          attributes: { starred: false }
        }
      });
    });

    assert.deepEqual(collection.toArray().map((r) => r.get('id')), ['1']);
  });
});
