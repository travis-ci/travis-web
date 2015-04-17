`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'caches-item', 'CachesItemComponent', {
  needs: ['helper:format-time', 'helper:mb']
}

test 'it renders', ->

  attributes = {
    repository_id: 10,
    size: 1024 * 1024,
    branch: "master",
    last_modified: "2015-04-16T11:25:00Z",
    type: "push"
  }

  component = @subject(cache: attributes)
  @append()

  ok component.$().hasClass('push'), 'component should have a type class (push)'
  equal component.$('.caches-branch').text().trim(), 'master', 'branch name should be displayed'
  # equal component.$('.caches-date').text().trim(), '', ''
  equal component.$('.caches-size').text().trim(), '1.00MB', 'size should be displayed'
