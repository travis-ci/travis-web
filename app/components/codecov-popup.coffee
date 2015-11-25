`import Ember from 'ember'`

Component = Ember.Component.extend(
  bashSupportedLanguage: (->
    return @get('language') in ['Python', 'Go', 'Java', 'PHP', 'Node.js', 'Scala', 'D', 'C']
  ).property('language')

  url: (->
    return 'https://github.com/codecov/example-' + @get('language').toLowerCase()
  ).property('language')

  actions:
    close: ->
      $('.popup').removeClass('display')
      return false
)

`export default Component`
