require 'travis/model'

@Travis.Artifact = Travis.Model.extend
  body: DS.attr('string')

  append: (body) ->
    @set('body', @get('body') + body)
