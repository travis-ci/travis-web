require 'rake-pipeline'

require 'execjs'
require 'uglifier'
require 'pathname'

class Rake::Pipeline
  module Travis
    module Filters
      class Drop < Matcher
        def output_files
          input_files.reject { |f| f.path =~ @pattern }
        end
      end

      class Handlebars < Filter
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

          def compile(source)
            context.call('compileHandlebarsTemplate', source + "\n")
          end
        end

        def generate_output(inputs, output)
          inputs.each do |input|
            source = self.class.compile(input.read)
            source = wrap(name(input.path), source)
            output.write source
          end
        end

        def wrap(name, source)
          "\nEmber.TEMPLATES['#{name}'] = Ember.Handlebars.template(#{source});\n"
        end

        def name(path)
          path.gsub(%r(app/|templates/|.hbs), '')
        end
      end

      class SafeConcat < ConcatFilter
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

      class StripDebug < Filter
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
