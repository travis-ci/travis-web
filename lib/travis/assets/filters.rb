require 'rake-pipeline'
require 'execjs'
require 'uglifier'
require 'pathname'
require 'json'

module Travis
  class Assets
    module Filters
      class Drop < Rake::Pipeline::Matcher
        def output_files
          input_files.reject { |f| f.path =~ @pattern }
        end
      end

      class Handlebars < Rake::Pipeline::Filter
        class << self
          def source
            [
              File.read(root.join('lib/rake-pipeline/ember-headless.js')),
              File.read(root.join('assets/scripts/vendor/handlebars.js')),
              File.read(root.join('assets/scripts/vendor/ember.js'))
            ].join("\n")
          end

          def root
            @root ||= Pathname.new(File.expand_path('../../../../', __FILE__))
          end

          def context
            @@context ||= ExecJS.compile(source)
          end
        end

        attr_reader :options

        def initialize(*args, &block)
          @options = args.last.is_a?(Hash) ? args.pop : {}
          super
        end

        def generate_output(inputs, output)
          inputs.each do |input|
            source = input.read
            source = options[:precompile] ? compile(source) : escape(source)
            source = wrap(name(input.path), source)
            output.write source
          end
        end

        def compile(source)
          self.class.context.call('compileHandlebarsTemplate', source + "\n")
        end

        def escape(source)
          source.to_json
        end

        def wrap(name, source)
          method = options[:precompile] ? 'template' : 'compile'
          "\nEmber.TEMPLATES['#{name}'] = Ember.Handlebars.#{method}(#{source});\n"
        end

        def name(path)
          path.gsub(%r(app/|templates/|.hbs), '')
        end
      end

      class SafeConcat < Rake::Pipeline::ConcatFilter
        def generate_output(inputs, output)
          inputs.each do |input|
            output.write File.read(input.fullpath) + ";"
          end
        end
      end

      class OrderingSafeConcat < SafeConcat
        def initialize(ordering, string = nil, &block)
          @ordering = ordering
          super(string, &block)
        end

        def generate_output(inputs, output)
          @ordering.reverse.each do |name|
            file = inputs.find { |i| i.path == name }
            inputs.unshift(inputs.delete(file)) if file
          end
          super
        end
      end

      class StripDebug < Rake::Pipeline::Filter
        def generate_output(inputs, output)
          inputs.each do |input|
            source = File.read(input.fullpath)
            source = strip_debug(source)
            source = Uglifier.compile(source)
            output.write source
          end
        end

        def strip_debug(source)
          source.gsub(%r{^(\s)*Ember\.(assert|deprecate|warn)\((.*)\).*$}, "")
        end
      end
    end
  end
end
