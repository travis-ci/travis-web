import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

// stub auth service
const authStub = Ember.Service.extend({
  currentUser: Ember.Object.create()
});

const job = Ember.Object.create();

moduleForComponent('repo-actions', 'RepoActionsComponent', {
  unit: true,
  needs: ['helper:perform', 'helper:inline-svg'],
  beforeEach() {
    this.register('service:auth', authStub);
  }
});

test('it shows cancel button if canCancel is true', function (assert) {
  const component = this.subject({
    canCancel: true,
    job: job
  });
  this.render();
  assert.ok(component.$('button[aria-label="Cancel job"]').length, 'cancel button should be visible');
});

test('the cancel button is for a build if a build is passed in', function (assert) {
  const component = this.subject({
    canCancel: true,
    build: Ember.Object.create()
  });
  this.render();
  assert.ok(component.$('button[aria-label="Cancel build"]').length, 'cancel build button should be visible');
});

test('it shows restart button if canRestart is true', function (assert) {
  const component = this.subject({
    canRestart: true,
    job: job
  });
  this.render();
  assert.ok(component.$('button[aria-label="Restart job"]').length, 'restart button should be visible');
});

test('user can cancel if she has pull permissions to a repo and job is cancelable', function (assert) {
  const job = Ember.Object.create({
    canCancel: false,
    userHasPullPermissionForRepo: true
  });
  const component = this.subject({
    job: job,
    userHasPullPermissionForRepo: false
  });
  assert.ok(!component.get('canCancel'));
  component.set('userHasPullPermissionForRepo', true);
  assert.ok(!component.get('canCancel'));
  job.set('canCancel', true);
  assert.ok(component.get('canCancel'));
});

test('user can restart if she has pull permissions to a repo and job is restartable', function (assert) {
  const job = Ember.Object.create({
    canRestart: false,
    userHasPullPermissionForRepo: true
  });
  const component = this.subject({
    job: job,
    userHasPullPermissionForRepo: false
  });
  assert.ok(!component.get('canRestart'));
  component.set('userHasPullPermissionForRepo', true);
  assert.ok(!component.get('canRestart'));
  job.set('canRestart', true);
  assert.ok(component.get('canRestart'));
});

test('it properly checks for user permissions for a repo', function (assert) {
  this.assert = assert;
  assert.expect(3);

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

  assert.notOk(component.get('userHasPermissionForRepo'), 'user should not have access to a repo');
});
