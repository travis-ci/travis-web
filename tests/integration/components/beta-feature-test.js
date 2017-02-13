import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('beta-feature', 'Integration | Component | beta feature', {
  integration: true
});

test('it renders', function (assert) {
  let feature = {
    name: 'dasboard',
    feedbackUrl: 'https://github.com/travis-ci/give-feedback',
    description: 'super awesome new Dashboard',
    enabled: true
  };
  this.set('feature', feature);
  this.render(hbs`{{beta-feature feature=feature}}`);

  assert.equal(this.$().find('.feature-name span').text().trim(), 'Dasboard');
  assert.equal(this.$().find('.feature-name a').attr('href'), 'https://github.com/travis-ci/give-feedback');
  assert.equal(this.$().find('p').text().trim(), 'super awesome new Dashboard');
  assert.equal(this.$().find('.switch').hasClass('active'), true);
});
