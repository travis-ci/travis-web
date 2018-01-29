import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('conditional-title', 'helper:conditional-title', {
  integration: true
});

test('it renders', function (assert) {
  this.set('conditionalTime', 0);
  this.set('str', 'Started');
  this.set('time', '2018-01-29T09:36:31Z');

  this.render(hbs`<div title={{conditional-title conditionalTime str time}}></div>`);
  assert.equal(this.$('div').attr('title'), '');

  this.set('conditionalTime', 1);
  assert.equal(this.$('div').attr('title'), 'Started January 29, 2018 12:36:31');
});
