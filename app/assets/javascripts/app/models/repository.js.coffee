@Travis.Repository = Travis.Model.extend # Travis.Helpers,
  slug:                   DS.attr('string')
  name:                   DS.attr('string')
  owner:                  DS.attr('string')
  description:            DS.attr('string')
  last_build_id:          DS.attr('number')
  last_build_number:      DS.attr('string')
  last_build_result:      DS.attr('number')
  last_build_started_at:  DS.attr('string')
  last_build_finished_at: DS.attr('string')

  builds: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'push'
  ).property()

  pullRequests: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'pull_request'
  ).property()

  lastBuild: (->
    Travis.Build.find @get('last_build_id')
  ).property('last_build_id')

  last_build_duration: (->
    duration = @getPath('data.last_build_duration')
    duration = @durationFrom(@get('last_build_started_at'), @get('last_build_finished_at')) unless duration
    duration
  ).property('data.last_build_duration', 'last_build_started_at', 'last_build_finished_at')

  stats: (->
    return unless Travis.env is 'production'
    url = 'https://api.github.com/json/repos/show/' + @get('slug')
    @get('_stats') || $.get(url, (data) => @set('_stats', data)) && undefined
  ).property('_stats')

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
  { id: 1, owner: 'travis-ci', name: 'travis-core',   build_ids: [1, 2] },
  { id: 2, owner: 'travis-ci', name: 'travis-assets', build_ids: [3] },
  { id: 3, owner: 'travis-ci', name: 'travis-hub',    build_ids: [4] },
]


