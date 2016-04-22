import Ember from 'ember';
import { hasPermission, hasPushPermission, hasAdminPermission } from 'travis/utils/permission';
import { module, test } from 'qunit';

module('Unit | Utility | permission');

test('it checks permissions', function(assert) {
  let user = Ember.Object.create({permissions: [1]});
  assert.ok(hasPermission(user, 1));
  assert.ok(!hasPermission(user, 2));
  assert.ok(!hasPermission(null, 1));
});

test('it checks push permissions', function(assert) {
  let user = Ember.Object.create({pushPermissions: [1]});
  assert.ok(hasPushPermission(user, 1));
  assert.ok(!hasPushPermission(user, 2));
  assert.ok(!hasPushPermission(null, 1));
});

test('it checks admin permissions', function(assert) {
  let user = Ember.Object.create({adminPermissions: [1]});
  assert.ok(hasAdminPermission(user, 1));
  assert.ok(!hasAdminPermission(user, 2));
  assert.ok(!hasAdminPermission(null, 1));
});
