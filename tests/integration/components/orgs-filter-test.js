import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
// import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | orgs filter', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders data correctly', async function (assert) {
    const orgs = [
      EmberObject.create({
        id: 'lislis',
        name: 'Lisa P',
        type: 'user',
        avatarUrl: 'https://placekitten.com/200/200',
        reposCount: 4,
        subscribed: false,
        education: false
      }),
      EmberObject.create({
        id: 'travis-ci',
        name: 'Travis CI',
        type: 'organization',
        avatarUrl: 'https://placekitten.com/200/200',
        reposCount: 23,
        subscribed: true,
        education: false
      })
    ];

    const selectedOrg = null;

    this.set('orgs', orgs);
    this.set('selectedOrg', selectedOrg);
    await render(hbs`{{orgs-filter orgs=orgs selected=selectedOrg }}`);

    assert.dom('[data-test-org-filter-item]').exists({ count: 2}, 'Lists right amount of accounts');
    assert.dom('.option-display .label-align').hasText('All accounts', 'Displays right message if no account is selected');
    assert.dom('*').doesNotHaveClass('is-open', 'Account list is not open per default');
    await click('.option-button .option-display');

    /*
    wait().then(() => {
      ok(this.$().hasClass('is-open'), 'Account list is open after click');
    });
    */

    // this.$('.option-list a:first-of-type').click();

    /*
    wait().then(() => {
      equal(this.$('.option-list').children().length, 3, 'Lists account and clear filter option if an account is selected');
    });*/
  });
});
