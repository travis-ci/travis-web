ruby '1.9.3' rescue nil

source :rubygems

gem 'unicorn'
gem 'rack-ssl', '~> 1.3'

group :development, :test do
  gem 'rake', '~> 0.9.2'
end

group :development do
  gem 'rake-pipeline',  github: 'livingsocial/rake-pipeline', ref: '3465e0e3e1'
  gem 'rake-pipeline-web-filters', github: 'wycats/rake-pipeline-web-filters'
  gem 'coffee-script'
  gem 'compass'
  gem 'tilt'
  gem 'uglifier'
  gem 'debugger'
  gem 'foreman'
  gem 'rerun'
end
