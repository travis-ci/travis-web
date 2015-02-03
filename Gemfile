source 'http://rubygems.org'
ruby '2.1.2'

gem 'travis-web', path: 'server'
gem 'puma'
gem 'rack-ssl', '~> 1.3'
gem 'rack-protection', '~> 1.3'
gem 'rack-mobile-detect'
gem 'sinatra'
gem 'hashr'

gem 'rake-pipeline',  github: 'livingsocial/rake-pipeline'
gem 'rake-pipeline-web-filters', github: 'wycats/rake-pipeline-web-filters'
gem 'coffee-script'
gem 'compass'
gem 'tilt'
gem 'uglifier'
gem 'yui-compressor'
gem 'libv8', '~> 3.16.0'

group :development, :test do
  gem 'rake'
end


group :development do
  # gem 'debugger'
  gem 'foreman'
  gem 'rerun', '~> 0.10.0'
  gem 'guard'
  gem 'rb-fsevent', '~> 0.9.1'
end

group :test do
  gem 'rspec', '~> 2.11'
  gem 'sinatra-contrib'
end

