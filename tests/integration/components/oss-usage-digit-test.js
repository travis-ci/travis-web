import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('oss-usage-digit', 'Integration | Component | oss usage digit', {
  integration: true
});

test('it renders', function (assert) {
  this.set('digit', 1);
  this.render(hbs`{{oss-usage-digit digit=digit}}`);

  assert.equal(this.$().find('img').attr('src'), '../images/landing-page/oss-num-1.svg');
});
