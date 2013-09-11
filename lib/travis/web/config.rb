require 'hashr'
require 'yaml'

# Encapsulates the configuration necessary for travis-listener.
#
# Configuration values will be read from
#
#  * either ENV['travis_config'] (this variable is set on Heroku by `travis config [env]`,
#    see travis-cli) or
#  * a local file config/travis.yml which contains the current env key (e.g. development,
#    production, test)
#
# The env key can be set through various ENV variables, see Travis::Config.env.
#
module Travis
  module Web
    class Config < Hashr
      class << self
        def env
         ENV['ENV'] || ENV['RAILS_ENV'] || ENV['RACK_ENV'] || 'development'
        end

        def load_env
          @load_env ||= YAML.load(ENV['travis_config']) if ENV['travis_config']
        end

        def load_file
          @load_file ||= YAML.load_file(filename)[env] if File.exists?(filename) rescue {}
        end

        def filename
          @filename ||= File.expand_path('config/travis.yml')
        end
      end

      define  ssl: { hsts: true }

      default _access: [:key]

      def initialize(data = nil, *args)
        data ||= self.class.load_env || self.class.load_file || {}
        super
      end

      def env
        self.class.env
      end
    end
  end
end
