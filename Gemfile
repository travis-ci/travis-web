ruby '1.9.3' rescue nil

source :rubygems

gem 'puma'
gem 'rack-ssl', '~> 1.3'
gem 'rack-cache'
gem 'sinatra'

group :assets do
  gem 'rake-pipeline',  github: 'livingsocial/rake-pipeline'
  gem 'rake-pipeline-web-filters', github: 'wycats/rake-pipeline-web-filters'
  gem 'rake-pipeline-i18n-filters'
  gem 'coffee-script'
  gem 'compass'
  gem 'tilt'
  gem 'uglifier'
end

group :development, :test do
  gem 'rake', '~> 0.9.2'
  gem 'localeapp'
  gem 'handlebars'
  gem 'localeapp-handlebars_i18n'
end


group :development do
  # gem 'debugger'
  gem 'foreman'
  gem 'rerun'
  gem 'guard'
  gem 'rb-fsevent', '~> 0.9.1'
end

group :test do
  gem 'rspec', '~> 2.11'
  gem 'sinatra-contrib'
end
