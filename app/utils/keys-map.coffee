languageConfigKeys = {
  go:          'Go'
  php:         'PHP'
  node_js:     'Node.js'
  perl:        'Perl'
  python:      'Python'
  scala:       'Scala'
  ruby:        'Ruby'
  d:           'D'
  julia:       'Julia'
  csharp:      'C#'
  mono:        'Mono'
  dart:        'Dart'
  elixir:      'Elixir'
  ghc:         'GHC'
  jdk:         'JDK'
  rvm:         'Ruby'
  otp_release: 'OTP Release'
}

configKeys = {
  env:         'ENV'
  gemfile:     'Gemfile'
  xcode_sdk:   'Xcode SDK'
  xcode_scheme:'Xcode Scheme'
  compiler:    'Compiler'
  os:          'OS'
}

configKeysMap = Ember.merge configKeys, languageConfigKeys

`export default configKeysMap`
`export { languageConfigKeys, configKeys }`
