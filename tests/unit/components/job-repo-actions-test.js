import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

let userStub = Ember.Object.extend({
  hasAccessToRepo: function (repo) {
    ok(repo.get('id', 44));
    ok(true, 'hasAccessToRepo was called');
    return false;
  }
}).create();

// stub auth service
const authStub = Ember.Service.extend({
  currentUser: userStub
});

moduleForComponent('job-repo-actions', 'JobRepoActionsComponent', {
  unit: true,
  needs: ['helper:perform'],
  beforeEach() {
    this.register('service:auth', authStub);
  }
});

test('it shows cancel button if canCancel is true', function () {
  var component;
  component = this.subject({
    canCancel: true
  });
  this.render();
  return ok(component.$('a[title="Cancel job"]').length, 'cancel link should be visible');
});

test('it shows restart button if canRestart is true', function () {
  var component;
  component = this.subject({
    canRestart: true
  });
  this.render();
  return ok(component.$('a[title="Restart job"]').length, 'restart link should be visible');
});

test('user can cancel if she has pull permissions to a repo and job is cancelable', function () {
  var component, job;
  job = Ember.Object.create({
    canCancel: false,
    userHasPullPermissionForRepo: true
  });
  component = this.subject({
    job: job,
    userHasPullPermissionForRepo: false
  });
  ok(!component.get('canCancel'));
  component.set('userHasPullPermissionForRepo', true);
  ok(!component.get('canCancel'));
  job.set('canCancel', true);
  return ok(component.get('canCancel'));
});

test('user can restart if she has pull permissions to a repo and job is restartable', function () {
  var component, job;
  job = Ember.Object.create({
    canRestart: false,
    userHasPullPermissionForRepo: true
  });
  component = this.subject({
    job: job,
    userHasPullPermissionForRepo: false
  });
  ok(!component.get('canRestart'));
  component.set('userHasPullPermissionForRepo', true);
  ok(!component.get('canRestart'));
  job.set('canRestart', true);
  return ok(component.get('canRestart'));
});

test('it properly checks for user permissions for a repo', function () {
  var component, repo;
  expect(3);
  repo = Ember.Object.create({
    id: 44
  });
  component = this.subject({
    repo: repo
  });
  return ok(!component.get('userHasPermissionForRepo'), 'user should not have access to a repo');
});
