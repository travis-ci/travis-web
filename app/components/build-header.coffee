`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import GithubUrlPropertievs from 'travis/mixins/github-url-properties'`
`import { durationFrom, safe } from 'travis/utils/helpers'`

BuildHeaderComponent = Ember.Component.extend

  tagName: 'section'
  classNames: ['build-header']
  classNameBindings: ['item.state']

  urlCommitterGravatarImage: (->
    gravatarImage(@get('commit.committerEmail'), 40)
  ).property('commit.committerEmail')

  urlAuthorGravatarImage: (->
    gravatarImage(@get('commit.authorEmail'), 40)
  ).property('commit.authorEmail')

  isJob: (->
    if @get('item.build') then true else false
  ).property('item')

  elapsedTime: (->
    durationFrom(@get('item.startedAt'), @get('item.finishedAt'))
  ).property('item.startedAt', 'item.finishedAt', 'item.duration')

`export default BuildHeaderComponent`
