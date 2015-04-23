`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'hooks-list-item', 'HooksListItemComponent', {
  # specify the other units that are required for this test
  needs: ['component:hook-switch']
}

test 'it renders', ->

  attributes = {
    id: 10000,
    name: "foo-bar",
    owner_name: "foo",
    description: "A foo repo",
    active: true,
    urlGithub: "https://github.com/foo/foobar",
    slug: "foo/foo-bar"
  }
  component = @subject(hook: attributes)
  @append()

  ok component.$().hasClass('active'), 'component should have active class'
  ok component.$('.travis-switch').hasClass('active'), 'switch should have active class'
  equal component.$('.profile-repo span').text().trim(), 'A foo repo', 'repo description should be displayed'
