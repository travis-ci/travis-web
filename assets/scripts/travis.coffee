require 'ext/jquery'
require 'ext/ember/namespace'

if window.history.state == undefined
  window.history.state = {}
  oldPushState = window.history.pushState
  window.history.pushState = (state, title, href) ->
    window.history.state = state
    oldPushState.apply this, arguments

  oldReplaceState = window.history.replaceState
  window.history.replaceState = (state, title, href) ->
    window.history.state = state
    oldReplaceState.apply this, arguments

@Travis = Em.Namespace.create Ember.Evented,
  config:
    api_endpoint: $('meta[rel="travis.api_endpoint"]').attr('href')
    pusher_key:   $('meta[name="travis.pusher_key"]').attr('value')

  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala']

  ROUTES:
    'profile/:login/me':           ['profile', 'user']
    'profile/:login':              ['profile', 'hooks']
    'profile':                     ['profile', 'hooks']
    'stats':                       ['stats', 'show']
    ':owner/:name/jobs/:id/:line': ['home', 'job']
    ':owner/:name/jobs/:id':       ['home', 'job']
    ':owner/:name/builds/:id':     ['home', 'build']
    ':owner/:name/builds':         ['home', 'builds']
    ':owner/:name/pull_requests':  ['home', 'pullRequests']
    ':owner/:name/branches':       ['home', 'branches']
    ':owner/:name':                ['home', 'current']
    '':                            ['home', 'index']
    '#':                           ['home', 'index']

  QUEUES: [
    { name: 'common',  display: 'Common' }
    { name: 'php',     display: 'PHP, Perl and Python' }
    { name: 'jvmotp',  display: 'JVM, Erlang and Node.js' }
    { name: 'rails',   display: 'Rails' }
    { name: 'spree',   display: 'Spree' }
  ]

  INTERVALS: { sponsors: -1, times: -1, updateTimes: 1000 }

  setLocale: (locale) ->
    return unless locale

    I18n.locale = locale
    localStorage.setItem('travis.locale', locale)

  needsLocaleChange: (locale) ->
    I18n.locale != locale

  run: (attrs) ->
    location.href = location.href.replace('#!/', '') if location.hash.slice(0, 2) == '#!'

    @setLocale localStorage.getItem('travis.locale') || 'en'

    Ember.run.next this, ->
      app = Travis.App.create(attrs || {})
      # TODO: router expects the classes for controllers on main namespace, so
      #       if we want to keep app at Travis.app, we need to copy that, it would
      #       be ideal to send a patch to ember and get rid of this
      $.each Travis, (key, value) ->
        app[key] = value if value && value.isClass && key != 'constructor'

      @app   = app
      @store = app.store
      $ => app.initialize()

require 'ext/i18n'
require 'travis/ajax'
require 'app'

