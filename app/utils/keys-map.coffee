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
}

configKeys = {
  env:         'ENV'
  rvm:         'Ruby'
  gemfile:     'Gemfile'
  jdk:         'JDK'
  otp_release: 'OTP Release'
  xcode_sdk:   'Xcode SDK'
  xcode_scheme:'Xcode Scheme'
  compiler:    'Compiler'
  ghc:         'GHC'
  os:          'OS'
}

configKeysMap = Ember.merge configKeys, languageConfigKeys

`export default configKeysMap`
`export { languageConfigKeys, configKeys }`
