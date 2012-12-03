$: << 'lib'
namespace :localeapp do
  desc "syncs localeapp, yaml and handlebars"
  task :update do
    require 'localeapp-handlebars_i18n'
    Localeapp::HandlebarsI18n.configure($stdout) do |config|
      config.hbs_load_path = Dir[File.expand_path '../assets/scripts/app/templates/**/*.hbs', __FILE__]
      config.yml_load_path = File.expand_path '../locales/', __FILE__
      config.localeapp_api_key = ENV['LOCALEAPP_API_KEY']
    end
    system "localeapp push locales/#{Localeapp::HandlebarsI18n.default_locale}.yml"
    Localeapp::HandlebarsI18n.send_missing_translations
    system "localeapp pull"
  end
end

namespace :ember do
  desc 'update ember'
  task :update do
    if File.exists?('tmp/ember.js')
      system 'cd tmp/ember.js; git fetch origin; git reset --hard origin/master'
    else
      system 'git clone https://github.com/emberjs/ember.js.git tmp/ember.js'
    end

    system 'cd tmp/ember.js; bundle update'
    system 'cd tmp/ember.js; rake dist'
    system 'cp tmp/ember.js/dist/ember.js assets/javascripts/vendor/ember.js'
  end
end
