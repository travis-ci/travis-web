import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('not-active', 'Unit | Component | not active', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('canActivate returns true if a user has access to a repo', function(assert) {
  let component = this.subject();

  let user = Ember.Object.create({ pushPermissions: [1] });
  let repo = Ember.Object.create({ id: 1 });

  component.set('user', user);
  component.set('repo', repo);

  //this.render();
  //assert.equal(this.$().text().trim(), '');
  assert.ok(component.get('canActivate'));
});

test("canActivate returns false if user doesn't exist", function(assert) {
  let component = this.subject();

  assert.ok(!component.get('canActivate'));
});

test("canActivate returns false if user doesn't push access to the repo", function(assert) {
  let component = this.subject();

  let user = Ember.Object.create({ pushPermissions: [2] });
  let repo = Ember.Object.create({ id: 1 });

  component.set('user', user);
  component.set('repo', repo);

  assert.ok(!component.get('canActivate'));
});
