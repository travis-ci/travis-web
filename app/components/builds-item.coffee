`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`

BuildsItemComponent = Ember.Component.extend
  
  tagName: 'li'
  classNameBindings: ['build.state']
  classNames: ['row-li', 'pr-row']

  urlAuthorGravatarImage: (->
    gravatarImage(@get('build.commit.authorEmail'), 40)
  ).property('build.commit.authorEmail')

  urlGithubCommit: (->
    githubCommitUrl(@get('build.repo.slug'), @get('build.commit.sha'))
  ).property('build.commit.sha')

`export default BuildsItemComponent`
