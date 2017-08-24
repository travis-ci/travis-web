import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('trigger-custom-build', 'Integration | Component | trigger custom build', {
  integration: true
});

test('it renders', function (assert) {
  let repo = {
    id: 22,
    branches: [
      {
        name: 'master',
        default: true,
        exists_on_github: true
      }
    ]
  };
  this.set('repo', repo);
  this.render(hbs`{{trigger-custom-build repo=repo}}`);

  assert.equal(this.$().find('h2').text().trim(), 'Trigger a custom build\nBeta Feature');
  assert.equal(this.$().find('select').val(), 'master');
});
