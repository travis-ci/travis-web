`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`

BuildsItemComponent = Ember.Component.extend
  tagName: 'li'
  classNameBindings: ['build.state']
  classNames: ['row-li', 'pr-row']

  authorAvatarUrl: (->
    if url = @get('build.commit.authorAvatarUrl')
      url
    else
      email = @get('build.commit.authorEmail')
      gravatarImage(email, 40)
  ).property('build.commit.authorEmail', 'build.commit.authorAvatarUrl')

  urlGithubCommit: (->
    githubCommitUrl(@get('build.repo.slug'), @get('build.commit.sha'))
  ).property('build.commit.sha')

`export default BuildsItemComponent`
