import Ember from 'ember';
import { hasPermission } from 'travis/utils/permission';
import { module, test } from 'qunit';

module('Unit | Utility | permission');


test('it checks permissions', function(assert) {

  let user = Ember.Object.create({permissions: [1]});

  assert.ok(hasPermission(user, 1));
  assert.ok(!hasPermission(user, 2));

});
