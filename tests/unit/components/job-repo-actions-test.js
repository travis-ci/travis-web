import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('job-repo-actions', 'JobRepoActionsComponent', {
  unit: true
});

test('it shows cancel button if canCancel is true', function() {
  var component;
  component = this.subject({
    canCancel: true
  });
  this.render();
  return ok(component.$('a[title="Cancel job"]').length, 'cancel link should be visible');
});

test('it shows restart button if canRestart is true', function() {
  var component;
  component = this.subject({
    canRestart: true
  });
  this.render();
  return ok(component.$('a[title="Restart job"]').length, 'restart link should be visible');
});

test('user can cancel if she has permissions to a repo and job is cancelable', function() {
  var component, job;
  job = Ember.Object.create({
    canCancel: false,
    userHasPermissionForRepo: true
  });
  component = this.subject({
    job: job,
    userHasPermissionForRepo: false
  });
  ok(!component.get('canCancel'));
  component.set('userHasPermissionForRepo', true);
  ok(!component.get('canCancel'));
  job.set('canCancel', true);
  return ok(component.get('canCancel'));
});

test('user can restart if she has permissions to a repo and job is restartable', function() {
  var component, job;
  job = Ember.Object.create({
    canRestart: false,
    userHasPermissionForRepo: true
  });
  component = this.subject({
    job: job,
    userHasPermissionForRepo: false
  });
  ok(!component.get('canRestart'));
  component.set('userHasPermissionForRepo', true);
  ok(!component.get('canRestart'));
  job.set('canRestart', true);
  return ok(component.get('canRestart'));
});

test('it properly checks for user permissions for a repo', function() {
  var component, repo, user;
  expect(3);
  repo = Ember.Object.create({
    id: 44
  });
  user = Ember.Object.extend({
    hasAccessToRepo: function(repo) {
      ok(repo.get('id', 44));
      ok(true, 'hasAccessToRepo was called');
      return false;
    }
  }).create();
  component = this.subject({
    user: user,
    repo: repo
  });
  return ok(!component.get('userHasPermissionForRepo'), 'user should not have access to a repo');
});
