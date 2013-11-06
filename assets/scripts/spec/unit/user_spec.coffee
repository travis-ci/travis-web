record = null

module "Travis.User",
  setup: ->
  teardown: ->
    Travis.User.resetData()

test '', ->
  $.mockjax({
    url: '/users/permissions',
    responseTime: 10,
    responseText: {
      permissions: [1],
      admin: [1],
      pull: [2],
      push: [3]
    }
  });

  Travis.User.load [{ id: '1', login: 'test@travis-ci.org' }]
  user = null
  pushPermissions = null
  adminPermissions = null

  Ember.run ->
    user = Travis.User.find(1)
    pushPermissions  = user.get('pushPermissions')
    adminPermissions = user.get('adminPermissions')

  wait().then ->
    deepEqual(adminPermissions.toArray(), [1])
    deepEqual(pushPermissions.toArray(),  [3])