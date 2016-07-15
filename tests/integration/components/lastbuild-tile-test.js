import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lastbuild-tile', 'Integration | Component | lastbuild tile', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  let build = {
    state: 'passed',
    id: 1234,
    number: '222'
  };
  this.set('build', build);

  this.render(hbs`{{lastbuild-tile build=build}}`);

  assert.equal(this.$('.label-align').text().trim(), '#222', 'shows the right build number');
  assert.equal(this.$('li').hasClass('passed'), true, 'has class according to build state');
});
