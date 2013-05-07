minispade.require 'app'

@signInUser = ->
  # for now let's just use harcoded data to log in the user,
  # we may extend it in the future to pass specific user data
  Travis.auth.signIn
    user:
      id: 1
      email: 'tyrion@example.org'
      login: 'tyrion'
      token: 'abcdef'
    token: 'abcdef'

@app = (url, options = {}) ->
  # TODO: this should wait till app is initialized, not some
  #       arbitrary amount of time
  waits(50)
  runs ->
    Travis.reset()
    Travis.auth.signOut()

    if options.user
      signInUser()
    url = "/#{url}" unless url.match /^\//
    Travis.__container__.lookup('router:main').handleURL(url)


now = -> new Date('2012-07-02T00:03:00Z')
$.timeago.settings.nowFunction = -> now().getTime()
Travis.currentDate = now
Travis.testing = true
