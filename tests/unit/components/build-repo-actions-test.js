import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

let userStub = Ember.Object.extend({
  hasAccessToRepo(repo) {
    ok(repo.get('id', 44));
    ok(true, 'hasAccessToRepo was called');
    return false;
  }
}).create();

// stub auth service
const authStub = Ember.Service.extend({
  currentUser: userStub
});

moduleForComponent('build-repo-actions', 'BuildRepoActionsComponent', {
  unit: true,
  beforeEach() {
    this.register('service:auth', authStub);
    this.inject.service('auth');
  }
});

test('it shows cancel button if canCancel is true', function () {
  let component;
  component = this.subject({
    canCancel: true
  });
  this.render();
  return ok(component.$('a[title="Cancel Build"]').length, 'cancel link should be visible');
});

test('it shows restart button if canRestart is true', function () {
  let component;
  component = this.subject({
    canRestart: true
  });
  this.render();
  return ok(component.$('a[title="Restart Build"]').length, 'restart link should be visible');
});

test('user can cancel if she has permissions to a repo and build is cancelable', function () {
  let build, component;
  build = Ember.Object.create({
    canCancel: false,
    userHasPermissionForRepo: true
  });
  component = this.subject({
    build,
    userHasPermissionForRepo: false
  });
  ok(!component.get('canCancel'));
  component.set('userHasPermissionForRepo', true);
  ok(!component.get('canCancel'));
  build.set('canCancel', true);
  return ok(component.get('canCancel'));
});

test('user can restart if she has permissions to a repo and job is restartable', function () {
  let build, component;
  build = Ember.Object.create({
    canRestart: false,
    userHasPermissionForRepo: true
  });
  component = this.subject({
    build,
    userHasPermissionForRepo: false
  });
  ok(!component.get('canRestart'));
  component.set('userHasPermissionForRepo', true);
  ok(!component.get('canRestart'));
  build.set('canRestart', true);
  return ok(component.get('canRestart'));
});

test('it properly checks for user permissions for a repo', function () {
  let component, repo;
  expect(3);
  repo = Ember.Object.create({
    id: 44
  });
  component = this.subject({
    repo
  });
  return ok(!component.get('userHasPermissionForRepo'), 'user should not have access to a repo');
});
