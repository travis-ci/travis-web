import Service from '@ember/service';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:live-updates-record-fetcher', 'Unit | Service | live updates record fetcher', {
  needs: [],
  beforeEach() {
    this.calls = {
      queryRecord: [],
      findRecord: []
    };
    let calls = this.calls;

    this.register('service:store', Service.extend({
      queryRecord() {
        calls.queryRecord.push([...arguments]);
      },
      findRecord() {
        calls.findRecord.push([...arguments]);
      },
    }));
  }
});

test('it fetches single job records when requests can not be grouped', function (assert) {
  let service = this.subject({ interval: 5 }),
    done = assert.async();

  service.fetch('job', 1, { build_id: 1 });
  service.fetch('job', 2, { build_id: 2 });

  setTimeout(() => {
    done();

    assert.equal(0, this.calls.queryRecord.length, 'queryRecord should not have been called');
    assert.equal(2, this.calls.findRecord.length, 'findRecord should have been called 2 times');
    assert.deepEqual(['job', 1, { reload: true }], this.calls.findRecord[0]);
    assert.deepEqual(['job', 2, { reload: true }], this.calls.findRecord[1]);
  }, 10);
});

test('it fetches build records and not job records when builds need to be fetched anyway', function (assert) {
  let service = this.subject({ interval: 5 }),
    done = assert.async();

  service.fetch('job', 1, { build_id: 1 });
  service.fetch('build', 1);
  service.fetch('job', 2, { build_id: 2 });

  setTimeout(() => {
    done();

    assert.equal(1, this.calls.queryRecord.length, 'queryRecord should have been called 1 time');
    assert.equal(1, this.calls.findRecord.length, 'findRecord should have been called 1 time');
    assert.deepEqual(['job', 2, { reload: true }], this.calls.findRecord[0]);
    assert.deepEqual(['build', { id: 1, include: 'build.jobs' }], this.calls.queryRecord[0]);
  }, 10);
});

test('it groups job records when there are at leat 2 for one build', function (assert) {
  let service = this.subject({ interval: 5 }),
    done = assert.async();

  service.fetch('job', 1, { build_id: 1 });
  service.fetch('job', 2, { build_id: 1 });

  setTimeout(() => {
    done();

    assert.equal(1, this.calls.queryRecord.length, 'queryRecord should have been called 1 time');
    assert.equal(0, this.calls.findRecord.length, 'findRecord should not have been called');
    assert.deepEqual(['build', { id: 1, include: 'build.jobs' }], this.calls.queryRecord[0]);
  }, 10);
});

test('it ignores duplicated calls', function (assert) {
  let service = this.subject({ interval: 5 }),
    done = assert.async();

  service.fetch('build', 1);
  service.fetch('build', 1);
  service.fetch('build', 1);
  service.fetch('build', 1);

  setTimeout(() => {
    done();

    assert.equal(0, this.calls.queryRecord.length, 'queryRecord should not have been called');
    assert.equal(1, this.calls.findRecord.length, 'findRecord should have been called 1 time');
    assert.deepEqual(['build', 1, { reload: true }], this.calls.findRecord[0]);
  }, 10);
});

test('it throttles with given interval', function (assert) {
  let service = this.subject({ interval: 5 }),
    done = assert.async();

  service.fetch('build', 1);

  setTimeout(() => {
    service.fetch('build', 1);

    setTimeout(() => {
      done();

      assert.equal(0, this.calls.queryRecord.length, 'queryRecord should not have been called');
      assert.equal(2, this.calls.findRecord.length, 'findRecord should have been called 2 times');
      assert.deepEqual(['build', 1, { reload: true }], this.calls.findRecord[0]);
    }, 30);
  }, 30);
});
