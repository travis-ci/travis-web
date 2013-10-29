require 'rake-pipeline'

module Travis
  class Assets
    autoload :Filters, 'travis/assets/filters'
    autoload :Helpers, 'travis/assets/helpers'
    autoload :Version, 'travis/assets/version'

    TYPES = [:styles, :scripts, :images, :static, :vendor]
    VENDOR_ORDER = %w(jquery.min minispade handlebars ember)
    PRODUCTION_VENDOR_ORDER = %w(jquery.min minispade handlebars ember.prod)
    SPEC_VENDOR_ORDER = %w(jasmine jasmine-html jasmine-runner sinon)

    attr_reader :roots, :env

    def initialize(roots = '.')
      @roots = Array(roots).map { |root| Pathname.new(File.expand_path(root)) }
      @env = ENV['ENV']
    end

    def staging?
      ENV['API_ENDPOINT'] =~ /staging/ unless development?
    end

    def production?
      !staging? and !development?
    end

    def development?
      env != 'production'
    end

    def vendor_order
      order = production? ? PRODUCTION_VENDOR_ORDER : VENDOR_ORDER
      order.map { |name| "vendor/#{name}.js" }
    end

    def spec_vendor_order
      SPEC_VENDOR_ORDER.map { |name| "spec/vendor/#{name}.js" }
    end

    def setup_compass
      Compass.configuration.images_path = images.first
      styles.each do |path|
        Compass.configuration.add_import_path(path)
      end
    end

    def update_version
      Travis::Assets::Version.new(roots).update
    end

    TYPES.each { |type| define_method(type) { paths[type] } }

    def paths
      @paths ||= TYPES.inject({}) do |paths, type|
        paths.merge(type.to_sym => roots.map { |root| root.join("assets/#{type}").to_s })
      end
    end
  end
end

Rake::Pipeline::DSL::PipelineDSL.send(:include, Travis::Assets::Helpers)
