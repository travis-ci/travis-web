record = null

module "Travis.User",
  setup: ->
  teardown: ->
    Travis.User.resetData()

test '', ->
  # TODO: we should not need to mock entire user response
  #       just for user creation. It happens, because whenever
  #       a user is created we try to get fresh data
  userData = {
    id: 1
    email: 'tyrion@example.org'
    login: 'tyrion'
    token: 'abcdef'
    created_at: "2011-05-10T15:43:59Z"
    gravatar_id: "582034b63279abeaa8e76acf12f5ee30"
    is_syncing: false
    locale: "en"
    name: "Tyrion"
    synced_at: "2013-12-09T09:41:47Z"
  }
  $.mockjax
    url: '/users/1'
    responseTime: 10
    responseText:
      user: userData


  Travis.User.load [{ id: '1', login: 'test@travis-ci.org' }]
  user = null
  pushPermissions = null
  adminPermissions = null

  Ember.run ->
    user = Travis.User.find(1)
    user.set '_rawPermissions',
      then: (func) ->
        func(permissions: [1], admin: [1], pull: [2], push: [3])

    pushPermissions  = user.get('pushPermissions')
    adminPermissions = user.get('adminPermissions')

  wait().then ->
    deepEqual(adminPermissions.toArray(), [1])
    deepEqual(pushPermissions.toArray(),  [3])
