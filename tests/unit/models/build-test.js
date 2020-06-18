import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | build', function (hooks) {
  setupTest(hooks);
  test('the calling of the increasePriority function', function (assert) {
    const buildModel = run(() => this.owner.lookup('service:store').createRecord('build'));

    assert.ok(buildModel);
    run(function () {
      return buildModel.setProperties({
        id: '1',
        api: {
          post: function (url) {
            return { url, method: 'post' };
          }
        }
      });
    });

    let apiReturn = buildModel.increasePriority(true);
    assert.equal(JSON.stringify(apiReturn), JSON.stringify({url: '/build/1/priority?cancel_all=true', method: 'post'}));

    apiReturn = buildModel.increasePriority(false);
    assert.equal(JSON.stringify(apiReturn), JSON.stringify({url: '/build/1/priority?cancel_all=false', method: 'post'}));

    apiReturn = buildModel.increasePriority(null);
    assert.equal(JSON.stringify(apiReturn), JSON.stringify({url: '/build/1/priority?cancel_all=false', method: 'post'}));

    apiReturn = buildModel.increasePriority();
    assert.equal(JSON.stringify(apiReturn), JSON.stringify({url: '/build/1/priority?cancel_all=false', method: 'post'}));
  });
});
