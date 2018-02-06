import { moduleFor, test } from 'ember-qunit';

moduleFor('route:signin', 'Unit | Route | signin', {
  needs: ['service:auth']
});

test('it does not require auth', function (assert) {
  let route = this.subject();
  assert.equal(route.get('needsAuth'), false);
});
