source 'http://rubygems.org'
ruby '1.9.3'

gem 'puma'
gem 'rack-ssl', '~> 1.3'
gem 'rack-protection', '~> 1.3'
gem 'rack-cache'
gem 'rack-mobile-detect'
gem 'sinatra'

group :assets do
  gem 'rake-pipeline',  github: 'livingsocial/rake-pipeline'
  gem 'rake-pipeline-web-filters', github: 'wycats/rake-pipeline-web-filters'
  gem 'rake-pipeline-i18n-filters'
  gem 'coffee-script'
  gem 'compass'
  gem 'tilt'
  gem 'uglifier'
  gem 'yui-compressor'
  gem 'libv8', '~> 3.16.0'
end

group :development, :test do
  gem 'rake'
  gem 'localeapp'
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

require 'bundler/installer'

module ::Bundler
  class Installer < Environment
    MAX_RETRIES = 3

    def install_gem_from_spec(spec, standalone = false)
      retries = 1
      # Download the gem to get the spec, because some specs that are returned
      # by rubygems.org are broken and wrong.
      Bundler::Fetcher.fetch(spec) if spec.source.is_a?(Bundler::Source::Rubygems)

      # Fetch the build settings, if there are any
      settings = Bundler.settings["build.#{spec.name}"]
      Bundler.rubygems.with_build_args [settings] do
        spec.source.install(spec)
        Bundler.ui.debug "from #{spec.loaded_from} "
      end

      # newline comes after installing, some gems say "with native extensions"
      Bundler.ui.info ""
      if Bundler.settings[:bin] && standalone
        generate_standalone_bundler_executable_stubs(spec)
      elsif Bundler.settings[:bin]
        generate_bundler_executable_stubs(spec, :force => true)
      end

      FileUtils.rm_rf(Bundler.tmp)
    rescue Gem::RemoteFetcher::FetchError => e
      if retries <= MAX_RETRIES
        Bundler.ui.warn "#{e.class}: #{e.message}"
        Bundler.ui.warn "Installing #{spec.name} (#{spec.version}) failed."
        Bundler.ui.warn "Retrying (#{retries}/#{MAX_RETRIES})"
        retries += 1
        sleep retries
        retry
      else
        Bundler.ui.warn "Installing #{spec.name} (#{spec.version}) failed after #{retries} retries: #{e.message}."
        Bundler.ui.warn "Giving up"
        msg = "An error, most likely because of network issues, has occurred trying to install #{spec.name} (#{spec.version}), "
        msg << "and Bundler cannot continue."
        raise Bundler::InstallError, msg
      end
    rescue Exception => e
      # install hook failed
      raise e if e.is_a?(Bundler::InstallHookError) || e.is_a?(Bundler::SecurityError)

      # other failure, likely a native extension build failure
      Bundler.ui.info ""
      Bundler.ui.warn "#{e.class}: #{e.message}"
      msg = "An error occurred while installing #{spec.name} (#{spec.version}),"
      msg << " and Bundler cannot continue.\nMake sure that `gem install"
      msg << " #{spec.name} -v '#{spec.version}'` succeeds before bundling."
      Bundler.ui.debug e.backtrace.join("\n")
      raise Bundler::InstallError, msg
    end
  end
end
