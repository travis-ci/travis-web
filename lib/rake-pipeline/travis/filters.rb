require 'rake-pipeline'
require 'execjs'
require 'uglifier'

module Travis
  class HandlebarsFilter < Rake::Pipeline::Filter
    class << self
      def source
        [
          File.read('lib/rake-pipeline/ember-headless.js'),
          File.read('assets/javascripts/vendor/handlebars.js'),
          File.read('assets/javascripts/vendor/ember.js')
        ].join("\n")
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
      path.sub(%r(^app/templates/), '').sub(/\.hbs$/, '')
    end
  end

  class SafeConcatFilter < Rake::Pipeline::Filter
    def generate_output(inputs, output)
      inputs.each do |input|
        source = File.read(input.fullpath) + ";"
        output.write source
      end
    end
  end

  class ProductionFilter < Rake::Pipeline::Filter
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
