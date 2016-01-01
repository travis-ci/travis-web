`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'builds-item', {
  needs: ['helper:format-sha', 'helper:format-duration', 'helper:format-time',
          'helper:format-message', 'helper:pretty-date', 'component:status-icon', 'component:request-icon']
}

test 'it renders', (assert) ->

  attributes = {
    id: 10000,
    state: 'passed'
    number: 11,
    branch: 'foobarbranch',
    message: undefined,
    pullRequest: false,
    eventType: 'push',
    commit: {
      sha: "a5e8093098f9c0fb46856b753fb8943c7fbf26f3",
      branch: 'foobarbranch',
      authorName: 'Test Author',
      authorEmail: 'author@example.com'
    }
    repo: {
      slug: 'foo/bar'
    }
  }

  component = @subject()
  component.set('build', attributes)
  @append()

  ok component.$().hasClass('passed'), 'component has right status class'
  equal component.$('.row-branch a').text().trim(), 'foobarbranch', 'component renders branch if event is push'
  equal component.$('a[title="See the commit on GitHub"]').attr('href'), 'https://github.com/foo/bar/commit/a5e8093098f9c0fb46856b753fb8943c7fbf26f3', 'component generates right commit link'
