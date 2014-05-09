require 'travis/model'

@Travis.Commit = Travis.Model.extend
  buildId:           Ember.attr('number')
  sha:               Ember.attr('string')
  branch:            Ember.attr('string')
  message:           Ember.attr('string')
  compareUrl:        Ember.attr('string')
  authorName:        Ember.attr('string')
  authorEmail:       Ember.attr('string')
  committerName:     Ember.attr('string')
  committerEmail:    Ember.attr('string')
  subject:           Ember.attr('string')
  body:              Ember.attr('string')

  build: Ember.belongsTo('Travis.Build')

  subject: ( ->
    @get('message').split("\n", 1)[0]
  ).property('message')

  body: ( ->
    message = @get('message')
    if message.indexOf("\n") > 0
      message.substr(message.indexOf("\n") + 1).trim()
    else
      ""
  ).property('message')

  authorIsCommitter: ( ->
    @get('authorName') == @get('committerName') and
      @get('authorEmail') == @get('committerEmail')
  ).property('authorName', 'authorEmail', 'committerName', 'committerEmail')
