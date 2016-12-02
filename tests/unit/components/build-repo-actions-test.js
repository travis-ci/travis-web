import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

// stub auth service
const authStub = Ember.Service.extend({
  currentUser: Ember.Object.create()
});

moduleForComponent('build-repo-actions', 'BuildRepoActionsComponent', {
  unit: true,
  needs: ['helper:perform', 'helper:inline-svg'],
  beforeEach() {
    this.register('service:auth', authStub);
    this.inject.service('auth');
  }
});

test('it shows cancel button if canCancel is true', function (assert) {
  const component = this.subject({
    canCancel: true
  });
  this.render();
  return assert.ok(component.$('button[title="Cancel build"]').length, 'cancel button should be visible');
});

test('it shows restart button if canRestart is true', function (assert) {
  const component = this.subject({
    canRestart: true
  });
  this.render();
  assert.ok(component.$('button[title="Restart build"]').length, 'restart button should be visible');
});

test('user can cancel if she has pull permissions to a repo and build is cancelable', function (assert) {
  const build = Ember.Object.create({
    canCancel: false,
    userHasPullPermissionForRepo: true
  });
  const component = this.subject({
    build: build,
    userHasPullPermissionForRepo: false
  });
  assert.ok(!component.get('canCancel'));
  component.set('userHasPullPermissionForRepo', true);
  assert.ok(!component.get('canCancel'));
  build.set('canCancel', true);
  return assert.ok(component.get('canCancel'));
});

test('user can restart if she has pull permissions to a repo and job is restartable', function (assert) {
  const build = Ember.Object.create({
    canRestart: false,
    userHasPullPermissionForRepo: true
  });
  const component = this.subject({
    build: build,
    userHasPullPermissionForRepo: false
  });
  assert.ok(!component.get('canRestart'));
  component.set('userHasPullPermissionForRepo', true);
  assert.ok(!component.get('canRestart'));
  build.set('canRestart', true);
  assert.ok(component.get('canRestart'));
});

test('it properly checks for user permissions for a repo', function (assert) {
  assert.expect(3);
  this.assert = assert;

  const repo = Ember.Object.create({
    id: 44
  });

  const component = this.subject({
    repo: repo
  });

  component.set('auth.currentUser.hasAccessToRepo', (repo) => {
    this.assert.ok(repo.get('id', 44));
    this.assert.ok(true, 'hasAccessToRepo was called');
    return false;
  });

  assert.ok(!component.get('userHasPermissionForRepo'), 'user should not have access to a repo');
});
