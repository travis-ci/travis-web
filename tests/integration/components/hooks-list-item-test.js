import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hooks-list-item', 'HooksListItemComponent', {
  integration: true,
});

test('it renders', function (assert) {
  this.set('hook', {
    id: 10000,
    name: 'foo-bar',
    owner_name: 'foo',
    description: 'A foo repo',
    active: true,
    urlGithub: 'https://github.com/foo/foobar',
    slug: 'foo/foo-bar'
  });

  this.render(hbs`{{hooks-list-item hook=hook}}`);

  assert.ok(this.$('.switch').hasClass('active'), 'switch should have active class');
  assert.equal(this.$('.profile-repo span').text().trim(), 'A foo repo', 'repo description should be displayed');
});
