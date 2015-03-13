`import Ember from 'ember'`
`import startApp from '../helpers/start-app'`
`import Pretender from 'pretender'`

application = null
server = null

module 'Acceptance: Dashboard',
  setup: ->
    application = startApp()
    Ember.run ->
      application.auth.signInForTests(id: 1, login: 'drogus')
    server = new Pretender ->
      @get('/v3/repos', (request) ->
        data = {
          "@type": "repositories",
          "repositories": [{
            "@type": "repository",
            "active": true,
            "id": 1,
            "name": "travis-web",
            "slug": "travis-ci/travis-web",
            "description": "The Ember web client for Travis CI",
            "github_language": "CoffeeScript",
            "private": false,
            "owner": {
              "@type": "organization",
              "id": 1,
              "login": "travis-ci"
            },
            "last_build": {
              "@type": "build",
              "id": 1,
              "number": "1",
              "state": "passed",
              "duration": 20,
              "started_at": "2015-02-05T09:58:31Z",
              "finished_at": "2015-02-05T10:09:10Z"
            }
          }, {
            "@type": "repository",
            "active": true,
            "id": 2,
            "name": "travis-test",
            "slug": "travis-ci/travis-test",
            "private": false,
            "owner": {
              "@type": "organization",
              "id": 87,
              "login": "travis-ci"
            },
            "last_build": null
          }]
        }
        return [200, { "Content-Type": "application/json" }, JSON.stringify(data)]
      )

  teardown: ->
    Ember.run application, 'destroy'
    server.shutdown()

test 'visiting /dashboard', ->
  visit '/dashboard'

  andThen ->
    equal find('.dashboard-active .row').length, 1, 'there should be one repo displayed on dashboard'
    equal find('.dashboard-active .row h2').text(), 'travis-web', 'travis-web repository should be displayed'
