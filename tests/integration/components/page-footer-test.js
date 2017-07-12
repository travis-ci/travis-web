import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { withFeature, withoutFeature } from 'travis/tests/helpers/with-feature';
import { stubTemplate } from 'travis/tests/helpers/stub-template';

moduleForComponent('page-footer', 'Integration | Component | page footer', {
  integration: true
});

test("it doesn't render Imprint, Blog or Twitter links for enterprise", function (assert) {
  withFeature(this, 'enterpriseVersion');
  this.render(hbs`{{page-footer}}`);

  assert.equal(this.$('a:contains(Imprint)').length, 0);
  assert.equal(this.$('a:contains(Blog)').length, 0);
  assert.equal(this.$('a:contains(Twitter)').length, 0);
});

test("it doesn't show travis-status for enteprise", function (assert) {
  stubTemplate(this, 'components/travis-status', hbs`TRAVIS STATUS`);

  // precondition
  withoutFeature(this, 'enterpriseVersion');
  this.render(hbs`{{page-footer}}`);

  assert.ok(this.$().text().match(/TRAVIS STATUS/));

  withFeature(this, 'enterpriseVersion');
  this.render(hbs`{{page-footer}}`);

  assert.notOk(this.$().text().match(/TRAVIS STATUS/));
});

test('it shows security statement for pro version', function (assert) {
  withoutFeature(this, 'proVersion');
  this.render(hbs`{{page-footer}}`);

  assert.equal(this.$('a:contains(Security)').length, 0);

  withFeature(this, 'proVersion');
  this.render(hbs`{{page-footer}}`);

  assert.equal(this.$('a:contains(Security)').length, 1);
});
