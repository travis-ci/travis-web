`import Ember from 'ember'`
`import Model from 'travis/models/model'`
`import Build from 'travis/models/build'`
`import { gravatarImage } from 'travis/utils/urls'`

Commit = Model.extend
  sha:               DS.attr()
  branch:            DS.attr()
  message:           DS.attr()
  compareUrl:        DS.attr()
  authorName:        DS.attr()
  authorEmail:       DS.attr()
  committerName:     DS.attr()
  committerEmail:    DS.attr()
  committedAt:        DS.attr()
  committerAvatarUrl: DS.attr()
  authorAvatarUrl: DS.attr()

  build: DS.belongsTo('build')

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

  authorAvatarUrlOrGravatar: (->
    if url = @get('authorAvatarUrl')
      url
    else
      email = @get('authorEmail')
      gravatarImage(email, 40)
  ).property('authorEmail', 'authorAvatarUrl')

  committerAvatarUrlOrGravatar: (->
    if url = @get('committerAvatarUrl')
      url
    else
      email = @get('committerEmail')
      gravatarImage(email, 40)
  ).property('committerEmail', 'committerAvatarUrl')

`export default Commit`
