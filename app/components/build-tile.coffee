`import Ember from 'ember'`

BuildTileComponent = Ember.Component.extend

  tagName: 'li'
  classNameBindings: ['build.state']
  attributeBindings: ['title'],

  title: (->
    num = @get('build.number')
    "##{num}"
  ).property('build')

`export default BuildTileComponent`
