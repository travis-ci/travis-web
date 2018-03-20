import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { stubService } from 'travis/tests/helpers/stub-service';

module('Integration | Component | top bar', function (hooks) {
  setupRenderingTest(hooks);

  test("it shows 'There are no broadcasts message' if there're no broadcasts", async function (assert) {
    const features = this.owner.lookup('service:features');
    features.enable('broadcasts');
    // in the future I would like to make a test helper that works properly for
    // integration and acceptance tests, but I'd have to do some changes in auth
    // which I don't want to do at this point
    stubService('auth', Service.extend({
      signedIn: 'true',
      currentUser: Object.freeze({
        name: 'Test User'
      })
    }));
    stubService(this, 'broadcasts', Service.extend({ broadcasts: Object.freeze([]) }));
    await render(hbs`{{top-bar}}`);

    assert.ok(this.$('header').text().match(/There are no broadcasts/));

    // renders user name
    assert.ok(this.$('a.navigation-anchor').text().match(/Test User/));
  });
});
