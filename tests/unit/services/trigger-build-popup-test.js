import { moduleFor, test } from 'ember-qunit';

moduleFor('service:trigger-build-popup', 'Unit | Service | trigger build popup', {
  needs: ['service:auth']
});

test('it toggles the isShowingFlag', function (assert) {
  let service = this.subject();
  assert.equal(service.get('isShowingTriggerBuildModal'), false, 'initally the modal is hidden');
  service.toggleTriggerBuildModal();
  assert.equal(service.get('isShowingTriggerBuildModal'), true, 'after toggling the modal is visible');
});
