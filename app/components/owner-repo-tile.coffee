`import Ember from 'ember'`

OwnerRepoTileComponent = Ember.Component.extend

  tagName: 'li'
  classNames: ['owner-tile', 'row-li']
  classNameBindings: ['repo.default_branch.last_build.state']

  ownerName: (->
    @get('repo.slug').split(/\//)[0]
  ).property('repo.slug')

  repoName: (->
    @get('repo.slug').split(/\//)[1]
  ).property('repo.slug')

  isAnimating: (->
    state = @get('repo.default_branch.last_build.state')
    animationStates = ['received', 'queued', 'started', 'booting']

    unless animationStates.indexOf(state) == -1
      true

  ).property('repo.default_branch.last_build.state')




`export default OwnerRepoTileComponent`
