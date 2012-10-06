source :rubygems

gem 'unicorn'
gem 'sinatra'
gem 'sinatra-contrib'
gem 'rack-contrib',   github: 'rack/rack-contrib'
gem 'yard-sinatra',   github: 'rkh/yard-sinatra'

group :development, :test do
  gem 'rake', '~> 0.9.2'
end

group :development do
  gem 'travis-api',     github: 'travis-ci/travis-api'
  gem 'travis-core',    github: 'travis-ci/travis-core', branch: 'sf-travis-api'
  gem 'travis-support', github: 'travis-ci/travis-support'
  gem 'gh',             github: 'rkh/gh'

  gem 'bunny'
  gem 'pg',             '~> 0.13.2'
  gem 'newrelic_rpm',   '~> 3.3.0'
  gem 'hubble',         github: 'roidrage/hubble'

  gem 'rake-pipeline',  github: 'livingsocial/rake-pipeline', ref: '3465e0e3e1'
  gem 'rake-pipeline-web-filters', github: 'wycats/rake-pipeline-web-filters'

  gem 'coffee-script'
  gem 'compass'
  gem 'tilt'
  gem 'uglifier'

  gem 'debugger'
  gem 'foreman'
  gem 'rerun'
  gem 'rb-fsevent', '~> 0.9.1'

  gem 'guard'
end

group :test do
  gem 'rspec',        '~> 2.11'
  gem 'factory_girl', '~> 2.4.0'
  gem 'mocha',        '~> 0.12'
end

