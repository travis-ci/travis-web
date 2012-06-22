require 'travis/model'

@Travis.Repository = Travis.Model.extend
  slug:                   DS.attr('string')
  description:            DS.attr('string')
  last_build_id:          DS.attr('number')
  last_build_number:      DS.attr('string')
  last_build_result:      DS.attr('number')
  last_build_started_at:  DS.attr('string')
  last_build_finished_at: DS.attr('string')

  primaryKey: 'slug'

  lastBuild: DS.belongsTo('Travis.Build')

  builds: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'push'
  ).property()

  pullRequests: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'pull_request'
  ).property()

  owner: (->
    (@get('slug') || '').split('/')[0]
  ).property('owner', 'name'),

  name: (->
    (@get('slug') || '').split('/')[1]
  ).property('owner', 'name'),

  last_build_duration: (->
    duration = @getPath('data.last_build_duration')
    duration = Travis.Helpers.durationFrom(@get('last_build_started_at'), @get('last_build_finished_at')) unless duration
    duration
  ).property('data.last_build_duration', 'last_build_started_at', 'last_build_finished_at')

  stats: (->
    @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
      @set('_stats', data)
      @notifyPropertyChange 'stats'
    ) && {}
  ).property('slug')

  select: ->
    Travis.Repository.select(self.get('id'))

  tick: ->
    @notifyPropertyChange 'last_build_duration'
    @notifyPropertyChange 'last_build_finished_at'

@Travis.Repository.reopenClass
  recent: ->
    @find()

  ownedBy: (owner) ->
    @find(owner: owner, orderBy: 'name')

  search: (query) ->
    @find(search: query, orderBy: 'name')

  bySlug: (slug) ->
    repo = $.detect(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repo then Ember.ArrayProxy.create(content: [repo]) else @find(slug: slug)

  select: (id) ->
    @find().forEach (repository) ->
      repository.set 'selected', repository.get('id') is id

@Travis.Repository.FIXTURES = [
  { id: 1, owner: 'travis-ci', name: 'travis-core',   slug: 'travis-ci/travis-core',   build_ids: [1, 2], last_build_id: 1, last_build_number: 1, last_build_result: 0 },
  { id: 2, owner: 'travis-ci', name: 'travis-assets', slug: 'travis-ci/travis-assets', build_ids: [3],    last_build_id: 3, last_build_number: 3},
  { id: 3, owner: 'travis-ci', name: 'travis-hub',    slug: 'travis-ci/travis-hub',    build_ids: [4],    last_build_id: 4, last_build_number: 4},
]


