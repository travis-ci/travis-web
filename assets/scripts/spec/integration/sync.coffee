module "Sync",
  setup: ->
    Ember.run -> Travis.advanceReadiness()
  teardown: ->
    Ember.run -> Travis.reset()

test "first sync page is show when user just signed up and is syncing", ->
  Ember.run ->
    signInUser(
      is_syncing: true
      synced_at: null
      login: 'new-user'
    )

  $.mockjax
    url: '/hooks'
    responseTime: 10
    responseText:
      hooks: []

  $.mockjax
    url: '/users'
    responseTime: 10
    responseText:
      user:
        is_syncing: true

  Travis.config.syncingPageRedirectionTime = 100

  wait().then ->
    ok $('#first_sync').text().match(/Just a few more seconds as we talk to GitHub to find out which repositories belong to you./)

    stop()
    Travis.__container__.lookup('controller:currentUser').get('content').set('isSyncing', false)
    setTimeout ->
      start()
      visit('/').then ->
        ok $('#getting-started').text().match(/Welcome to Travis CI!/)
    , 120
