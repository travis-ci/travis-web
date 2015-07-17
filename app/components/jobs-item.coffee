`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import { languageConfigKeys } from 'travis/utils/keys-map';`

JobsItemComponent = Ember.Component.extend
  tagName: 'li'
  classNameBindings: ['job.state']
  classNames: ['tile', 'tile--jobs', 'row']

  isBooting: (->
    if @get('job.state') == 'received'
      return true
  ).property('job.state')

  languages: (->
    output = []

    if config = @get('job.config')
      for key, languageName of languageConfigKeys
        if version = config[key]
          output.push(languageName + ': ' + version)

      gemfile = @get('job.config.gemfile')
      if gemfile && @get('job.config.env')
        output.push "Gemfile: #{gemfile}"

    output.join(' ')
  ).property('job.config')

  environment: (->
    if env = @get('job.config.env')
      env
    else if gemfile = @get('job.config.gemfile')
      "Gemfile: #{gemfile}"
  ).property('job.config.env', 'job.config.gemfile')

`export default JobsItemComponent`
