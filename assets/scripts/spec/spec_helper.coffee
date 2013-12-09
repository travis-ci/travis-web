document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

Travis.rootElement = '#ember-testing';
Travis.setupForTesting();
Travis.injectTestHelpers();

oldSetup = Travis.setup
Travis.ready = ->
  oldSetup.apply(this, arguments)
  Travis.auth.signOut()

window.exists = (selector) ->
  return !!find(selector).length

Ember.Container.prototype.stub = (fullName, instance) ->
  instance.destroy = instance.destroy || (->)
  this.cache.dict[fullName] = instance

window.signInUser = (data) ->
  data ||= {}
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
  $.mockjax
    url: '/users/permissions'
    responseTime: 10
    responseText:
      permissions: []
      admin: []
      push: []
      pull: []
  $.mockjax
    url: '/broadcasts'
    responseTime: 10
    responseText:
      broadcasts: []
  $.mockjax
    url: '/accounts'
    responseTime: 10
    responseText:
      accounts: []

  userData = Ember.merge(userData, data)
  # for now let's just use harcoded data to log in the user,
  # we may extend it in the future to pass specific user data
  Travis.auth.signIn
    user: userData
    token: 'abcdef'

  #@app = (url, options = {}) ->
  #  # TODO: this should wait till app is initialized, not some
  #  #       arbitrary amount of time
  #  waits(50)
  #  runs ->
  #    Travis.reset()
  #    Travis.auth.signOut()
  #
  #    if options.user
  #      signInUser()
  #    url = "/#{url}" unless url.match /^\//
  #    visit(url)

now = -> new Date('2012-07-02T00:03:00Z')
$.timeago.settings.nowFunction = -> now().getTime()
Travis.currentDate = now
