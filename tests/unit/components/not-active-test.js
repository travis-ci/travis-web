import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const authServiceStub = Ember.Service.extend({
  currentUser: Ember.Object.create({ pushPermissions: [1] })
});

moduleForComponent('not-active', 'Unit | Component | not active', {
  unit: true,
  beforeEach() {
    this.register('service:auth', authServiceStub);
    this.inject.service('auth', { as: 'auth' });
  }
});

test('canActivate returns true if a user has access to a repo', function(assert) {
  let component = this.subject();
  let repo = Ember.Object.create({ id: 1 });

  component.set('repo', repo);

  assert.ok(component.get('canActivate'));
});

test("canActivate returns false if user doesn't exist", function(assert) {
  let component = this.subject();

  assert.ok(!component.get('canActivate'));
});

test("canActivate returns false if user doesn't push access to the repo", function(assert) {
  let component = this.subject();

  let repo = Ember.Object.create({ id: 2 });

  component.set('repo', repo);

  assert.ok(!component.get('canActivate'));
});
