module Travis
  autoload :HandlebarsFilter, 'rake-pipeline/travis/filters'
  autoload :SafeConcatFilter, 'rake-pipeline/travis/filters'
  autoload :ProductionFilter, 'rake-pipeline/travis/filters'
  autoload :Version,          'rake-pipeline/travis/version'
end
