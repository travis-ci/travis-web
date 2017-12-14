import EmberObject from '@ember/object';
import Service from '@ember/service';
import { moduleFor, test } from 'ember-qunit';

const authStub = Service.extend({
  currentUser: EmberObject.create()
});

moduleFor('service:permissions', 'Unit | Service | permissions', {
  beforeEach() {
    this.register('service:auth', authStub);
    this.inject.service('auth');
  }
});

test('it checks permissions', function (assert) {
  let service = this.subject();
  service.set('currentUser.permissions', [1]);

  assert.ok(service.hasPermission(1));
  assert.notOk(service.hasPermission(2));

  service.set('currentUser', null);
  assert.notOk(service.hasPermission(1));
});

test('it checks permissions if a repo object is given', function (assert) {
  let service = this.subject();
  service.set('currentUser.permissions', [1, 3]);

  let repo1 = EmberObject.create({ id: 1 }),
    repo2 = EmberObject.create({ id: 2 }),
    repo3 = EmberObject.create({ id: '3' });

  assert.ok(service.hasPermission(repo1));
  assert.notOk(service.hasPermission(repo2));
  assert.ok(service.hasPermission(repo3));
});

test('it checks push permissions', function (assert) {
  let service = this.subject();
  service.set('currentUser.pushPermissions', [1]);

  assert.ok(service.hasPushPermission(1));
  assert.ok(service.hasPushPermission('1'));
  assert.notOk(service.hasPushPermission(2));

  service.set('currentUser', null);
  assert.notOk(service.hasPushPermission(1));
});

test('it checks push permissions if a repo object is given', function (assert) {
  let service = this.subject();
  service.set('currentUser.pushPermissions', [1, 3]);

  let repo1 = EmberObject.create({ id: 1 }),
    repo2 = EmberObject.create({ id: 2 }),
    repo3 = EmberObject.create({ id: '3' });

  assert.ok(service.hasPushPermission(repo1));
  assert.notOk(service.hasPushPermission(repo2));
  assert.ok(service.hasPushPermission(repo3));
});

test('it checks admin permissions', function (assert) {
  let service = this.subject();
  service.set('currentUser.adminPermissions', [1]);

  assert.ok(service.hasAdminPermission(1));
  assert.ok(service.hasAdminPermission('1'));
  assert.notOk(service.hasAdminPermission(2));

  service.set('currentUser', null);
  assert.notOk(service.hasAdminPermission(1));
});

test('it checks admin permissions if a repo object is given', function (assert) {
  let service = this.subject();
  service.set('currentUser.adminPermissions', [1, 3]);

  let repo1 = EmberObject.create({ id: 1 }),
    repo2 = EmberObject.create({ id: 2 }),
    repo3 = EmberObject.create({ id: '3' });

  assert.ok(service.hasAdminPermission(repo1));
  assert.ok(service.hasAdminPermission(repo3));
  assert.notOk(service.hasAdminPermission(repo2));
});
