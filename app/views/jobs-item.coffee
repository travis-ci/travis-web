`import BasicView from 'travis/views/basic'`
`import { colorForState } from 'travis/utils/helpers'`
`import { languageConfigKeys } from 'travis/utils/keys-map';`

View = BasicView.extend
    tagName: 'div'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      colorForState(@get('job.state'))
    ).property('job.state')

    languages: (->
      output = []
      config = @get('job.config')
      for key, languageName of languageConfigKeys
        if version = config[key]
          output.push(languageName + ' ' + version)

      output.join(' ')
    ).property()

`export default View`
