$: << 'lib'

namespace :ember do
  desc 'update ember'
  task :update do
    if File.exists?('tmp/ember.js')
      system 'cd tmp/ember.js; git fetch origin; git reset --hard origin/master'
    else
      system 'git clone https://github.com/emberjs/ember.js.git tmp/ember.js'
    end

    system 'cd tmp/ember.js; rake dist'
    system 'cp tmp/ember.js/dist/ember.js assets/javascripts/vendor/ember.js'
  end
end

# TODO create a rake task that pulls the localization yml down from
# localeapp
desc "update all locale files from localeapp"
task :update_locales do
  require 'localeapp'

  # hmmmmm
end

