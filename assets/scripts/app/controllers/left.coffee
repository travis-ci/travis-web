require 'travis/limited_array'

Travis.LeftController = Ember.ArrayController.extend
  recentBuilds: (->
    Travis.Build.find()
    Travis.LimitedArray.create
      content: Em.ArrayProxy.extend(Em.SortableMixin).create(
        sortProperties: ['sortOrder']
        content: Travis.Build.recent()
        isLoadedBinding: 'content.isLoaded'
      )
      limit: 30
  ).property()

  activate: ->
    @set('content', @get('recentBuilds'))
