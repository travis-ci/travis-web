import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('hooks-list-item', 'HooksListItemComponent', {
  needs: ['component:hook-switch']
});

test('it renders', function() {
  var attributes, component;
  attributes = {
    id: 10000,
    name: "foo-bar",
    owner_name: "foo",
    description: "A foo repo",
    active: true,
    urlGithub: "https://github.com/foo/foobar",
    slug: "foo/foo-bar"
  };
  component = this.subject({
    hook: attributes
  });
  this.render();
  ok(component.$().hasClass('active'), 'component should have active class');
  ok(component.$('.switch--icon').hasClass('active'), 'switch should have active class');
  return equal(component.$('.profile-repo span').text().trim(), 'A foo repo', 'repo description should be displayed');
});
