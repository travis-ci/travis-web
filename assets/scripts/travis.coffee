require 'ext/jquery'
require 'ext/ember/namespace'

@Travis = Em.Namespace.create
  config:
    api_endpoint: $('meta[rel="travis.api_endpoint"]').attr('href')

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
    { name: 'node_js', display: 'Node.js' }
    { name: 'jvmotp',  display: 'JVM and Erlang' }
    { name: 'rails',   display: 'Rails' }
    { name: 'spree',   display: 'Spree' }
  ]

  INTERVALS: { sponsors: -1, times: -1, updateTimes: 1000 }

  run: (attrs) ->
    location.href = location.href.replace('#!/', '') if location.hash.slice(0, 2) == '#!'

    @loadConfig (config) =>
      app = Travis.App.create(attrs || {})
      # TODO: router expects the classes for controllers on main namespace, so
      #       if we want to keep app at Travis.app, we need to copy that, it would
      #       be ideal to send a patch to ember and get rid of this
      $.each Travis, (key, value) ->
        app[key] = value if value && value.isClass && key != 'constructor'

      @app   = app
      @store = app.store

      $ =>
        app.initialize()
        app.router.flashController.pushObject({ error: 'error!' })

  loadConfig: (callback) ->
    @ajax.get '/config', (data) =>
      $.extend @config, data.config
      callback(data.config)

require 'travis/ajax'
require 'app'

