import Ember from 'ember';

var configKeys, configKeysMap, languageConfigKeys;

languageConfigKeys = {
  go: 'Go',
  php: 'PHP',
  node_js: 'Node.js',
  perl: 'Perl',
  perl6: 'Perl6',
  python: 'Python',
  scala: 'Scala',
  smalltalk: 'Smalltalk',
  smalltalk_config: 'Config',
  ruby: 'Ruby',
  d: 'D',
  julia: 'Julia',
  csharp: 'C#',
  mono: 'Mono',
  dart: 'Dart',
  elixir: 'Elixir',
  ghc: 'GHC',
  haxe: 'Haxe',
  jdk: 'JDK',
  rvm: 'Ruby',
  otp_release: 'OTP Release',
  rust: 'Rust',
  c: 'C',
  cpp: 'C++',
  clojure: 'Clojure',
  lein: 'Lein',
  compiler: 'Compiler',
  crystal: 'Crystal',
  osx_image: 'Xcode',
  r: 'R'
};

configKeys = {
  env: 'ENV',
  gemfile: 'Gemfile',
  xcode_sdk: 'Xcode SDK',
  xcode_scheme: 'Xcode Scheme',
  compiler: 'Compiler',
  os: 'OS'
};

configKeysMap = Ember.merge(configKeys, languageConfigKeys);

export default configKeysMap;

export { languageConfigKeys, configKeys };
