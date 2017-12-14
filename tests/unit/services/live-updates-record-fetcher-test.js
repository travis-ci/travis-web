import Service from '@ember/service';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

moduleFor('service:live-updates-record-fetcher', 'Unit | Service | live updates record fetcher', {
  needs: [],
  beforeEach() {
    this.register('service:store', Service.extend({
      queryRecord() {},
      findRecord() {},
    }));
  }
});

test('it fetches single job records when requests can not be grouped', function (assert) {
  let service = this.subject({ interval: 5 }),
    store = service.get('store'),
    done  = assert.async(),
    findRecordSpy = sinon.spy(store, 'findRecord'),
    queryRecordSpy = sinon.spy(store, 'queryRecord');

  service.fetch('job', 1, { build_id: 1 });
  service.fetch('job', 2, { build_id: 2 });

  setTimeout(() => {
    done();

    assert.equal(0, queryRecordSpy.getCalls().length, 'queryRecord should not have been called');
    assert.equal(2, findRecordSpy.getCalls().length, 'findRecord should have been called 2 times');
    assert.deepEqual(['job', 1, { reload: true }], findRecordSpy.getCall(0).args);
    assert.deepEqual(['job', 2, { reload: true }], findRecordSpy.getCall(1).args);
  }, 10);
});

test('it fetches build records and not job records when builds need to be fetched anyway', function (assert) {
  let service = this.subject({ interval: 5 }),
    store = service.get('store'),
    done  = assert.async(),
    findRecordSpy = sinon.spy(store, 'findRecord'),
    queryRecordSpy = sinon.spy(store, 'queryRecord');

  service.fetch('job', 1, { build_id: 1 });
  service.fetch('build', 1);
  service.fetch('job', 2, { build_id: 2 });

  setTimeout(() => {
    done();

    assert.equal(1, queryRecordSpy.getCalls().length, 'queryRecord should have been called 1 time');
    assert.equal(1, findRecordSpy.getCalls().length, 'findRecord should have been called 1 time');
    assert.deepEqual(['job', 2, { reload: true }], findRecordSpy.getCall(0).args);
    assert.deepEqual(['build', { id: 1, include: 'build.jobs' }], queryRecordSpy.getCall(0).args);
  }, 10);
});

test('it groups job records when there are at leat 2 for one build', function (assert) {
  let service = this.subject({ interval: 5 }),
    store = service.get('store'),
    done  = assert.async(),
    findRecordSpy = sinon.spy(store, 'findRecord'),
    queryRecordSpy = sinon.spy(store, 'queryRecord');

  service.fetch('job', 1, { build_id: 1 });
  service.fetch('job', 2, { build_id: 1 });

  setTimeout(() => {
    done();

    assert.equal(1, queryRecordSpy.getCalls().length, 'queryRecord should have been called 1 time');
    assert.equal(0, findRecordSpy.getCalls().length, 'findRecord should not have been called');
    assert.deepEqual(['build', { id: 1, include: 'build.jobs' }], queryRecordSpy.getCall(0).args);
  }, 10);
});

test('it ignores duplicated calls', function (assert) {
  let service = this.subject({ interval: 5 }),
    store = service.get('store'),
    done  = assert.async(),
    findRecordSpy = sinon.spy(store, 'findRecord'),
    queryRecordSpy = sinon.spy(store, 'queryRecord');

  service.fetch('build', 1);
  service.fetch('build', 1);
  service.fetch('build', 1);
  service.fetch('build', 1);

  setTimeout(() => {
    done();

    assert.equal(0, queryRecordSpy.getCalls().length, 'queryRecord should not have been called');
    assert.equal(1, findRecordSpy.getCalls().length, 'findRecord should have been called 1 time');
    assert.deepEqual(['build', 1, { reload: true }], findRecordSpy.getCall(0).args);
  }, 10);
});

test('it throttles with given interval', function (assert) {
  let service = this.subject({ interval: 20 }),
    store = service.get('store'),
    done  = assert.async(),
    findRecordSpy = sinon.spy(store, 'findRecord'),
    queryRecordSpy = sinon.spy(store, 'queryRecord');

  service.fetch('build', 1);

  setTimeout(() => {
    service.fetch('build', 1);

    setTimeout(() => {
      done();

      assert.equal(0, queryRecordSpy.getCalls().length, 'queryRecord should not have been called');
      assert.equal(2, findRecordSpy.getCalls().length, 'findRecord should have been called 2 times');
      assert.deepEqual(['build', 1, { reload: true }], findRecordSpy.getCall(0).args);
    }, 30);
  }, 30);
});
