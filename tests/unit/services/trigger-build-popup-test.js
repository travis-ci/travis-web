import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | trigger build popup', function (hooks) {
  setupTest(hooks);

  test('it toggles the isShowingFlag', function (assert) {
    let service = this.owner.lookup('service:trigger-build-popup');
    assert.equal(service.get('isShowingTriggerBuildModal'), false, 'initally the modal is hidden');
    service.toggleTriggerBuildModal();
    assert.equal(service.get('isShowingTriggerBuildModal'), true, 'after toggling the modal is visible');
  });
});
