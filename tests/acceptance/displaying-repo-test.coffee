`import Ember from 'ember'`
`import { module, test } from 'qunit'`
`import startApp from '../helpers/start-app'`

application = null
server = null

module 'Acceptance: DisplayingRepo',
  beforeEach: ->
    application = startApp()
    server = new Pretender()
    stubFind(server, 'repo', {slug: 'travis-ci/travis-web'})
    ###
    Don't return as Ember.Application.then is deprecated.
    Newer version of QUnit uses the return value's .then
    function to wait for promises if it exists.
    ###
    return

  afterEach: ->
    server.shutdown()
    Ember.run application, 'destroy'

test 'visiting /displaying-repo', (assert) ->
  visit '/travis-ci/travis-web'

  andThen ->
    stop()
    assert.equal currentPath(), 'displaying-repo'
