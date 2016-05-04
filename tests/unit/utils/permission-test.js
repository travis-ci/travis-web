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

test('it checks permissions if a repo object is given', function(assert) {
  let repo1 = Ember.Object.create({ id: 1 }),
      repo2 = Ember.Object.create({ id: 2 }),
      repo3 = Ember.Object.create({ id: '3' }),
      user  = Ember.Object.create({permissions: [1, 3]});

  assert.ok(hasPermission(user, repo1));
  assert.ok(!hasPermission(user, repo2));
  assert.ok(hasPermission(user, repo3));
});

test('it checks push permissions', function(assert) {
  let user = Ember.Object.create({pushPermissions: [1]});

  assert.ok(hasPushPermission(user, 1));
  assert.ok(hasPushPermission(user, '1'));
  assert.ok(!hasPushPermission(user, 2));
  assert.ok(!hasPushPermission(null, 1));
});

test('it checks push permissions if a repo object is given', function(assert) {
  let repo1 = Ember.Object.create({ id: 1 }),
      repo2 = Ember.Object.create({ id: 2 }),
      repo3 = Ember.Object.create({ id: '3' }),
      user  = Ember.Object.create({pushPermissions: [1, 3]});

  assert.ok(hasPushPermission(user, repo1));
  assert.ok(!hasPushPermission(user, repo2));
  assert.ok(hasPushPermission(user, repo3));
});

test('it checks admin permissions', function(assert) {
  let user = Ember.Object.create({adminPermissions: [1]});

  assert.ok(hasAdminPermission(user, 1));
  assert.ok(hasAdminPermission(user, '1'));
  assert.ok(!hasAdminPermission(user, 2));
  assert.ok(!hasAdminPermission(null, 1));
});

test('it checks admin permissions if a repo object is given', function(assert) {
  let repo1 = Ember.Object.create({ id: 1 }),
      repo2 = Ember.Object.create({ id: 2 }),
      repo3 = Ember.Object.create({ id: '3' }),
      user  = Ember.Object.create({adminPermissions: [1, 3]});

  assert.ok(hasAdminPermission(user, repo1));
  assert.ok(hasAdminPermission(user, repo3));
  assert.ok(!hasAdminPermission(user, repo2));
});
