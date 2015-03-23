`import Ember from 'ember'`
`import { colorForState } from 'travis/utils/helpers'`
`import { languageConfigKeys } from 'travis/utils/keys-map';`

JobsItemComponent = Ember.Component.extend
  tagName: 'li'
  classNameBindings: ['job.state']
  classNames: ['tile', 'tile--jobs', 'row']

  languages: (->
    output = []

    if config = @get('job.config')
      for key, languageName of languageConfigKeys
        if version = config[key]
          output.push(languageName + ': ' + version)

    output.join(' ')
  ).property('job.config')

`export default JobsItemComponent`
