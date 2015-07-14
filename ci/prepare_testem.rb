require 'json'

pull_request = ENV['TRAVIS_PULL_REQUEST'] != 'false'

testem = JSON.parse(File.read('testem.json'))

testem['launch_in_ci'] =  ['PhantomJS']
testem['launch_in_ci'] += ['SL_chrome', 'SL_firefox'] unless pull_request

File.open('testem.json', 'w') { |f| f.write testem.to_json }
