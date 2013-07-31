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
  pullRequestNumber: Ember.attr('number')

  build: Ember.belongsTo('Travis.Build')
