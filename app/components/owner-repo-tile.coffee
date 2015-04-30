`import Ember from 'ember'`

OwnerRepoTileComponent = Ember.Component.extend

  tagName: 'li'
  classNames: ['tile', 'tile--small', 'row']
  classNameBindings: ['repo.default_branch.last_build.state']

  ownerName: (->
    @get('repo.slug').split(/\//)[0]
  ).property('repo.slug')

  repoName: (->
    @get('repo.slug').split(/\//)[1]
  ).property('repo.slug')




`export default OwnerRepoTileComponent`
