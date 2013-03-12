minispade.require 'app'

@app = (url) ->
  # TODO: this should wait till app is initialized, not some
  #       arbitrary amount of time
  waits(50)
  runs ->
    Travis.reset()
    url = "/#{url}" unless url.match /^\//
    Travis.__container__.lookup('router:main').handleURL(url)


now = -> new Date('2012-07-02T00:03:00Z')
$.timeago.settings.nowFunction = -> now().getTime()
Travis.currentDate = now
