import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { withFeature } from 'travis/tests/helpers/with-feature';
import { stubService } from 'travis/tests/helpers/stub-service';

moduleForComponent('top-bar', 'Integration | Component | top bar', {
  integration: true
});

test("it shows 'There are no broadcasts message' if there're no broadcasts", function (assert) {
  withFeature(this, 'broadcasts');
  // in the future I would like to make a test helper that works properly for
  // integration and acceptance tests, but I'd have to do some changes in auth
  // which I don't want to do at this point
  stubService(this, 'auth', Service.extend({
    signedIn: 'true',
    currentUser: Object.freeze({
      name: 'Test User'
    })
  }));
  stubService(this, 'broadcasts', Service.extend({ broadcasts: Object.freeze([]) }));
  this.render(hbs`{{top-bar}}`);

  assert.ok(this.$().text().match(/There are no broadcasts/));

  // renders user name
  assert.ok(this.$('a.navigation-anchor').text().match(/Test User/));
});
