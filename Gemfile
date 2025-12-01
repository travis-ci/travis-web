# frozen_string_literal: true

ruby '~> 3.2.2'

source 'https://rubygems.org'

gem 'hashr'
gem 'puma', '~> 6.4', '>= 6.4.3'
gem 'rack', '>= 2.2.20'
gem 'rack-mobile-detect'
gem 'rack-protection', '>= 4.2.0'
gem 'rack-ssl', '~> 1.4'
gem 'rackup'
gem 'rexml', '>= 3.3.9'
gem 'sanitize'
gem 'sinatra', '>= 4.2.0'
gem 'travis-web', path: 'waiter'
gem 'nokogiri', '>= 1.18.9'

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
  gem 'rack-test'
  gem 'sinatra-contrib'
  gem 'test-unit'
end
