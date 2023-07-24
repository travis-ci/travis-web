# frozen_string_literal: true

ruby '~> 3.2.2'

source 'https://rubygems.org'

gem 'hashr'
gem 'puma', '~> 6'
gem 'rack-mobile-detect'
gem 'rack-protection', '~> 3.0'
gem 'rack-ssl', '~> 1.4'
gem 'sanitize'
gem 'sinatra'
gem 'travis-web', path: 'waiter'

group :development, :test do
  gem 'rake'
end

group :development do
  # gem 'debugger'
  gem 'foreman'
  gem 'rubocop'
  gem 'rubocop-performance'
  gem 'rubocop-rspec'
  gem 'simplecov'
  gem 'simplecov-console'
end

group :test do
  gem 'rspec', '~> 3.12'
  gem 'sinatra-contrib'
  gem 'test-unit'
end
