require 'ext/jquery'
require 'ext/ember/namespace'

@Travis = Em.Namespace.create
  CONFIG_KEYS: ['rvm', 'gemfile', 'env', 'jdk', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala']

  ROUTES:
    'profile':                     ['profile', 'show']
    'stats':                       ['stats', 'show']
    ':owner/:name/jobs/:id/:line': ['home', 'job']
    ':owner/:name/jobs/:id':       ['home', 'job']
    ':owner/:name/builds/:id':     ['home', 'build']
    ':owner/:name/builds':         ['home', 'builds']
    ':owner/:name/pull_requests':  ['home', 'pullRequests']
    ':owner/:name/branches':       ['home', 'branches']
    ':owner/:name':                ['home', 'current']
    '':                            ['home', 'index']

  QUEUES: [
    { name: 'common',  display: 'Common' }
    { name: 'php',     display: 'PHP, Perl and Python' }
    { name: 'node_js', display: 'Node.js' }
    { name: 'jvmotp',  display: 'JVM and Erlang' }
    { name: 'rails',   display: 'Rails' }
    { name: 'spree',   display: 'Spree' }
  ]

  INTERVALS: { sponsors: -1, times: -1 }

  run: (attrs) ->
    @app = Travis.App.create(attrs || {})



