$: << 'lib'
namespace :localeapp do
  desc "update all locale files from localeapp"
  task :update do
    require 'localeapp'
    system 'localeapp pull'
  end

  desc "push changes to en.yml up to localeapp"
  task :report do
    require 'localeapp'
    system 'localeapp push locales/en.yml'
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
