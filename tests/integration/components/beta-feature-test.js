import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | beta feature', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let feature = {
      name: 'dashboard',
      displayName: 'Dashboard',
      feedbackUrl: 'https://github.com/travis-ci/give-feedback',
      description: 'super awesome new Dashboard',
      enabled: true
    };
    this.set('feature', feature);
    await render(hbs`{{beta-feature feature=feature}}`);

    assert.equal(this.$().find('.feature-name span').text().trim(), 'Dashboard');
    assert.equal(this.$().find('.feature-name a').attr('href'), 'https://github.com/travis-ci/give-feedback');
    assert.equal(this.$().find('p').text().trim(), 'super awesome new Dashboard');
    assert.equal(this.$().find('.switch').hasClass('active'), true);
  });
});