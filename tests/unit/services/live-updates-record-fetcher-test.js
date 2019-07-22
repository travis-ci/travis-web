import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | live updates record fetcher', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.calls = {
      queryRecord: [],
      findRecord: []
    };
    let calls = this.calls;

    this.service = this.owner.lookup('service:live-updates-record-fetcher');
    this.service.set('interval', 5);

    this.service.store.queryRecord = function () {
      calls.queryRecord.push([...arguments]);
    };
    this.service.store.findRecord = function () {
      calls.findRecord.push([...arguments]);
    };
  });

  test('it fetches single job records when requests can not be grouped', function (assert) {
    const done = assert.async();

    this.service.fetch('job', 1, { build_id: 1 });
    this.service.fetch('job', 2, { build_id: 2 });

    setTimeout(() => {
      done();

      assert.equal(0, this.calls.queryRecord.length, 'queryRecord should not have been called');
      assert.equal(2, this.calls.findRecord.length, 'findRecord should have been called 2 times');
      assert.deepEqual(['job', 1, { reload: true }], this.calls.findRecord[0]);
      assert.deepEqual(['job', 2, { reload: true }], this.calls.findRecord[1]);
    }, 10);
  });

  test('it fetches build records and not job records when builds need to be fetched anyway', function (assert) {
    const done = assert.async();

    this.service.fetch('job', 1, { build_id: 1 });
    this.service.fetch('build', 1);
    this.service.fetch('job', 2, { build_id: 2 });

    setTimeout(() => {
      done();

      assert.equal(1, this.calls.queryRecord.length, 'queryRecord should have been called 1 time');
      assert.equal(1, this.calls.findRecord.length, 'findRecord should have been called 1 time');
      assert.deepEqual(['job', 2, { reload: true }], this.calls.findRecord[0]);
      assert.deepEqual(['build', { id: 1, include: 'build.jobs' }], this.calls.queryRecord[0]);
    }, 10);
  });

  test('it groups job records when there are at leat 2 for one build', function (assert) {
    const done = assert.async();

    this.service.fetch('job', 1, { build_id: 1 });
    this.service.fetch('job', 2, { build_id: 1 });

    setTimeout(() => {
      done();

      assert.equal(1, this.calls.queryRecord.length, 'queryRecord should have been called 1 time');
      assert.equal(0, this.calls.findRecord.length, 'findRecord should not have been called');
      assert.deepEqual(['build', { id: 1, include: 'build.jobs' }], this.calls.queryRecord[0]);
    }, 10);
  });

  test('it ignores duplicated calls', function (assert) {
    const done = assert.async();

    this.service.fetch('build', 1);
    this.service.fetch('build', 1);
    this.service.fetch('build', 1);
    this.service.fetch('build', 1);

    setTimeout(() => {
      done();

      assert.equal(0, this.calls.queryRecord.length, 'queryRecord should not have been called');
      assert.equal(1, this.calls.findRecord.length, 'findRecord should have been called 1 time');
      assert.deepEqual(['build', 1, { reload: true }], this.calls.findRecord[0]);
    }, 10);
  });

  test('it throttles with given interval', function (assert) {
    const done = assert.async();

    this.service.fetch('build', 1);

    setTimeout(() => {
      this.service.fetch('build', 1);

      setTimeout(() => {
        done();

        assert.equal(0, this.calls.queryRecord.length, 'queryRecord should not have been called');
        assert.equal(2, this.calls.findRecord.length, 'findRecord should have been called 2 times');
        assert.deepEqual(['build', 1, { reload: true }], this.calls.findRecord[0]);
      }, 30);
    }, 30);
  });

});

