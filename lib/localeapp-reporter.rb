require 'handlebars'
require 'localeapp'
require 'localeapp/i18n_shim'
require 'localeapp/exception_handler'

module Localeapp
  class Reporter
    class << self

      def hbs_load_path
        @@load_path ||= []
      end
      def hbs_load_path=(dir)
        @@load_path = dir
      end
    end
    
    def initialize(locale_file, *hbs_templates)
      configure_localeapp locale_file
      backend.load_translations locale_file
      hbs_templates = Localeapp::Reporter.hbs_load_path if hbs_templates.empty?
      hbs_templates.flatten.each { |file| extract_keys(file) }
    end

   
    def send_missing_translations
      register_missing_translations
      Localeapp::Sender.new.post_missing_translations
    end
    
    private
    
    def configure_localeapp(locale_file)
      Localeapp.configure do |config|
        config.translation_data_directory = Dir.new(File.expand_path('../',locale_file))
      end
    end

    def matcher
      @matcher ||= Regexp.new("{{t (.*?)}}")
    end

    def backend
      @backend ||= I18n::Backend::Simple.new
    end

    def hbs_locale_keys
      @hbs_locale_keys ||= []
    end 

    def extract_keys(template_file)
      template = IO.read(template_file)
      if matches = template.scan(matcher)
        @hbs_locale_keys = hbs_locale_keys | matches.flatten
      end
    end
 
    def register_missing_translations 
      hbs_locale_keys.map do |locale_key|
        begin
          backend.translate(:en, locale_key)
          nil
        rescue Exception => e
          Localeapp.missing_translations.add(:en, locale_key, nil, options || {})
        end
      end
    end


  end
end


