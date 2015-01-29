initialize = (container) ->
  if Travis.config.ga_code
    window._gaq = []
    _gaq.push(['_setAccount', Travis.config.ga_code])

    ga = document.createElement('script')
    ga.type = 'text/javascript'
    ga.async = true
    ga.src = 'https://ssl.google-analytics.com/ga.js'
    s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(ga, s)

GAInitializer =
  name: 'google-analytics'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.initializer GAInitializer
