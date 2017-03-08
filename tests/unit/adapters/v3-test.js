import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('adapter:v3', 'Unit | Adapter | V3', {
  needs: ['model:build', 'service:auth'],
  beforeEach: function () {
    this.register('service:auth', Ember.Object.extend({
      token: function () {
        return 'foo';
      }
    }));
  }
});

test('it joins array that are passed as data', function (assert) {
  const adapter = this.subject(),
    type = 'GET',
    options = { data: { eventType: ['push', 'pull'] } };

  const hash = adapter.ajaxOptions('/builds', type, options);

  assert.equal(hash.data.eventType, 'push,pull');
});

test('it uses `includes` property', function (assert) {
  const adapter = this.subject(),
    type = 'GET',
    options = { data: { include: 'foo' } };

  adapter.set('includes', 'bar,baz');

  const hash = adapter.ajaxOptions('/repos', type, options);

  assert.equal(hash.data.include, 'foo,bar,baz');
});

test('sends page_size as limit', function (assert) {
  const adapter = this.subject(),
    type = 'GET',
    options = { data: { page_size: 100 } };

  const hash = adapter.ajaxOptions('/repos', type, options);

  assert.equal(hash.data.limit, 100);
  assert.notOk(hash.data.page_size);
});
