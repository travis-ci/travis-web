import Ember from 'ember';
import PermissionsMixin from 'travis/mixins/permissions';
import { module, test } from 'qunit';

module('Unit | Mixin | permissions');

// Replace this with your real tests.
test('it works', function(assert) {
  let PermissionsObject = Ember.Object.extend(PermissionsMixin);
  let subject = PermissionsObject.create();
  assert.ok(subject);
});
