require 'rake-pipeline'

module Rake::Pipeline::Travis
  autoload :Filters, 'rake-pipeline/travis/filters'
  autoload :Helpers, 'rake-pipeline/travis/helpers'
  autoload :Version, 'rake-pipeline/travis/version'
end

Rake::Pipeline::DSL::PipelineDSL.send(:include, Rake::Pipeline::Travis::Helpers)
