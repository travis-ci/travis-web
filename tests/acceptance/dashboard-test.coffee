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
          "repositories": [
            "@type": "repository",
            "@href": "/v3/repo/4289199",
            "@representation": "standard",
            "@permissions": {
              "read": true,
              "enable": true,
              "disable": true,
              "create_request": true
            },
            "id": 4289199,
            "name": "jupiter-brain",
            "slug": "travis-ci/jupiter-brain",
            "description": "Jupiter Brain manages servers",
            "github_language": "Go",
            "active": true,
            "private": false,
            "owner": {
              "@type": "organization",
              "id": 87,
              "login": "travis-ci",
              "@href": "/v3/org/87"
            },
            "default_branch": {
              "@type": "branch",
              "@href": "/v3/repo/4289199/branch/master",
              "@representation": "standard",
              "name": "master",
              "repository": {
                "@href": "/v3/repo/4289199"
              },
              "default_branch": true,
              "exists_on_github": true,
              "last_build": {
                "@type": "build",
                "@href": "/v3/build/81667484",
                "@representation": "minimal",
                "id": 81667484,
                "number": "77",
                "state": "passed",
                "duration": 107,
                "event_type": "push",
                "previous_state": "passed",
                "started_at": "2015-09-22T20:56:03Z",
                "finished_at": "2015-09-22T20:57:50Z",
                "commit": {
                  "@type": "commit",
                  "@representation": "standard",
                  "id": 23259185,
                  "sha": "39f658654f2d458af074b600d11e47547988ee56",
                  "ref": "refs/heads/master",
                  "message": "Merge pull request #6 from travis-ci/hh-circuit-breaker\n\nvsphere: add circuit breaker between Jupiter Brain and vSphere",
                  "compare_url": "https://github.com/travis-ci/jupiter-brain/compare/923f220a494f...39f658654f2d",
                  "committed_at": "2015-09-22T20:55:43Z",
                  "committer": {
                    "name": "emma trimble",
                    "avatar_url": "https://0.gravatar.com/avatar/e3058e8bba1f2b87defccd5695070782"
                  },
                  "author": {
                    "name": "emma trimble",
                    "avatar_url": "https://0.gravatar.com/avatar/e3058e8bba1f2b87defccd5695070782"
                  }
                }
              }
            }
          ]
        }
        return [200, { "Content-Type": "application/json" }, JSON.stringify(data)]
      )

  teardown: ->
    Ember.run application, 'destroy'
    server.shutdown()

test 'visiting /dashboard', ->
  visit '/dashboard'

  andThen ->
    equal find('.dashboard-active .dashboard-row').length, 1, 'there should be one repo displayed on dashboard'
    equal find('.dashboard-active .dashboard-row h2').text(), 'jupiter-brain', 'jupiter-brain repository should be displayed'
