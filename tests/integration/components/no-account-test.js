import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('no-account', 'Integration | Component | no account', {
  integration: true
});

test('it renders', function (assert) {
  let org = Ember.Object.create({
    name: 'famous-org'
  });
  this.set('name', org);
  this.render(hbs`{{no-account name=name.name}}`);

  assert.equal(this.$('.page-title').text().trim(), 'We couldn\'t find the organization famous-org');
});
