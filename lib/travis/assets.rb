require 'rake-pipeline'

module Travis
  class Assets
    autoload :Filters, 'travis/assets/filters'
    autoload :Helpers, 'travis/assets/helpers'
    autoload :Version, 'travis/assets/version'

    TYPES = [:styles, :scripts, :images, :static, :vendor]
    VENDOR_ORDER = %w(jquery.min minispade handlebars ember)
    SPEC_VENDOR_ORDER = %w(jasmine jasmine-html jasmine-runner sinon)

    attr_reader :roots, :env

    def initialize(roots = '.')
      @roots = Array(roots).map { |root| Pathname.new(File.expand_path(root)) }
      @env = ENV['ENV']
    end

    def production?
      env == 'production'
    end

    def development?
      !production?
    end

    def vendor_order
      VENDOR_ORDER.map { |name| "vendor/#{name}.js" }
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
      Travis::Assets::Version.new.update
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
