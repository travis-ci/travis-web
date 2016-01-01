`import Ember from 'ember'`
`import { githubCommit as githubCommitUrl } from 'travis/utils/urls'`

BuildsItemComponent = Ember.Component.extend
  tagName: 'li'
  classNameBindings: ['build.state']
  classNames: ['row-li', 'pr-row']

  urlGithubCommit: (->
    githubCommitUrl(@get('build.repo.slug'), @get('build.commit.sha'))
  ).property('build.commit.sha')

`export default BuildsItemComponent`
