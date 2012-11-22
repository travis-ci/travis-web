Localeapp.configure do |config|
  config.api_key                    = ENV['LOCALEAPP']
  config.translation_data_directory = 'locales'
  config.synchronization_data_file  = '.localeapp/log.yml'
  config.daemon_pid_file            = '.localeapp/localeapp.pid'
end
