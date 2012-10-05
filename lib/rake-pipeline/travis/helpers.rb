require 'rake-pipeline/dsl'

class Rake::Pipeline
  module Travis
    module Helpers
      def travis_handlebars(*args, &block)
        filter(Filters::Handlebars, *args, &block)
      end

      def strip_debug(*args, &block)
        filter(Filters::StripDebug, *args, &block)
      end

      def safe_concat(*args, &block)
        if args.first.kind_of?(Array)
          filter(Filters::OrderingSafeConcat, *args, &block)
        else
          filter(Filters::SafeConcat, *args, &block)
        end
        # filter(Filters::SafeConcat, *args, &block)
      end

      def drop(pattern)
        matcher = pipeline.copy(Filters::Drop)
        matcher.glob = pattern
        pipeline.add_filter matcher
        matcher
      end
      alias :skip :drop
    end
  end
end
