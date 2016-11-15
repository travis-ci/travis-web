import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('hooks-list-item', 'HooksListItemComponent', {
  needs: ['component:hook-switch']
});

test('it renders', function (assert) {
  const attributes = {
    id: 10000,
    name: 'foo-bar',
    owner_name: 'foo',
    description: 'A foo repo',
    active: true,
    urlGithub: 'https://github.com/foo/foobar',
    slug: 'foo/foo-bar'
  };
  const component = this.subject({
    hook: attributes
  });
  this.render();
  assert.ok(component.$().hasClass('active'), 'component should have active class');
  assert.ok(component.$('.switch').hasClass('active'), 'switch should have active class');
  assert.equal(component.$('.profile-repo span').text().trim(), 'A foo repo', 'repo description should be displayed');
});
