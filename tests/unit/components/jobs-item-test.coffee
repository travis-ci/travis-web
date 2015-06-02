`import { test, moduleForComponent } from 'ember-qunit'`

moduleForComponent 'jobs-item', 'JobsItemComponent', {
  # specify the other units that are required for this test
  needs: ['helper:format-duration']
}

test 'it renders', ->
  attributes = {
    id: 10
    state: 'passed'
    number: '2'
    config: {
      rvm: '2.1.2'
      jdk: 'openjdk6'
      os: 'linux',
      env: 'TESTS=unit'
    },
    duration: 100
  }
  job = Ember.Object.create(attributes)
  component = @subject(job: job)
  @append()

  ok component.$().hasClass('passed'), 'component should have a state class (passed)'
  equal component.$('.job-id').text().trim(), '2', 'job number should be displayed'
  equal component.$('.job-lang').text().trim(), 'JDK: openjdk6 Ruby: 2.1.2', 'langauges list should be displayed'
  equal component.$('.job-env').text().trim(), 'TESTS=unit', 'env should be displayed'
  ok component.$('.job-os').hasClass('linux'), 'OS class should be added for OS icon'
  equal component.$('.job-duration').text().trim(), '1 min 40 sec', 'duration should be displayed'

test 'outputs info on not set properties', ->
  job = Ember.Object.create()

  component = @subject(job: job)
  @append()

  ok component.$('.job-env').text().match(/no environment variables set/), 'a message for no env vars should be displayed'
  ok component.$('.job-lang').text().match(/no language set/), 'a message about no language being set should be displayed'

test 'when env is not set, gemfile is displayed in the env section', ->
  attributes = {
    id: 10
    state: 'passed'
    number: '2'
    config: {
      rvm: '2.1.2'
      gemfile: 'foo/Gemfile'
    },
    duration: 100
  }
  job = Ember.Object.create(attributes)
  component = @subject(job: job)
  @append()

  equal component.$('.job-lang').text().trim(), 'Ruby: 2.1.2', 'langauges list should be displayed'
  equal component.$('.job-env').text().trim(), 'Gemfile: foo/Gemfile', 'env should be displayed'

test 'when env is set, gemfile is displayed in the language section', ->
  attributes = {
    id: 10
    state: 'passed'
    number: '2'
    config: {
      rvm: '2.1.2'
      gemfile: 'foo/Gemfile'
      env: 'FOO=bar'
    },
    duration: 100
  }
  job = Ember.Object.create(attributes)
  component = @subject(job: job)
  @append()

  equal component.$('.job-lang').text().trim(), 'Ruby: 2.1.2 Gemfile: foo/Gemfile', 'Gemfile should be displayed in languages section'
  equal component.$('.job-env').text().trim(), 'FOO=bar', 'env should be displayed'
