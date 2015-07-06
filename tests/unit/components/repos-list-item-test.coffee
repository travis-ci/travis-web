`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'repos-list-item', {
  unit: true,
  needs: ['helper:format-duration', 'helper:format-time', 'service:polling']
}

test 'it renders repository data', (assert) ->
  assert.expect 9

  repo = Ember.Object.create({
    slug: 'travis-ci/travis-ci',
    lastBuild: Ember.Object.create({
      id: 1,
      state: 'passed',
      number: '10',
      startedAt: '2015-04-03T15:20:00Z',
      finishedAt: '2015-04-03T15:20:20Z',
      duration: 20
    })
  })
  component = @subject(repo: repo, selectedRepo: repo)
  @render()

  assert.ok(component.$('> .tile').hasClass('passed'), 'repo tile should have state class')
  assert.equal(component.$('a.slug').text().trim(), 'travis-ci/travis-ci', 'slug should be displayed')
  assert.equal(component.$('a.last_build').text().trim(), '10', 'build number should be displayed')
  assert.equal(component.$('.duration').attr('title'), '2015-04-03T15:20:00Z', 'started at should be displayed at duration\'s title')
  assert.equal(component.$('.duration').text().trim(), '20 sec', 'duration should be formatted')
  assert.equal(component.$('.finished_at').text().trim(), $.timeago('2015-04-03T15:20:20Z'), 'finished-at should be formatted')
  assert.equal(component.$('.finished_at').attr('title').trim(), '2015-04-03T15:20:20Z', 'finished-at should be displayed as a title')

  assert.ok(component.$().hasClass('selected'), 'component should have selected class when repo and selected repo are the same objects')

  Ember.run ->
    component.set('selectedRepo', {})

  assert.ok(!component.$().hasClass('selected'), 'component should not have selected class when repo and selected repo are not the same objects')
