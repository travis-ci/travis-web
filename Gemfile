ruby "~> 2.4.1"

source 'https://rubygems.org'

gem 'travis-web', path: 'waiter'
gem 'puma'
gem 'rack-ssl', '~> 1.3'
gem 'rack-protection', '~> 1.3'
gem 'sinatra'
gem 'hashr'
gem 'jemalloc', git: 'https://github.com/joshk/jemalloc-rb', ref: '9ffefeb'

group :development, :test do
  gem 'rake'
end

group :development do
  # gem 'debugger'
  gem 'foreman'
end

group :test do
  gem 'rspec', '~> 2.11'
  gem 'sinatra-contrib'
end
