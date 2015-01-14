require 'routes/route'

SshKey = Travis.SshKey
Ajax = Travis.ajax
TravisRoute = Travis.Route

Route = TravisRoute.extend
  model: (params) ->
    repo = @modelFor('repo')
    self = this
    SshKey.fetch(repo.get('id')).then ( (result) -> result unless result.get('isNew') ), (xhr) ->
      if xhr.status == 404
        # if there is no model, just return null. I'm not sure if this is the
        # best answer, maybe we should just redirect to different route, like
        # ssh_key.new or ssh_key.no_key
        return null

  afterModel: (model, transition) ->
    repo = @modelFor('repo')
    Ajax.get "/repositories/#{repo.get('id')}/key", (data) =>
      @defaultKey = Ember.Object.create(fingerprint: data.fingerprint)

  setupController: (controller, model) ->
    controller.reset()
    @_super.apply this, arguments

    if @defaultKey
      controller.set('defaultKey', @defaultKey)
      @defaultKey = null

  deactivate: ->
    @_super.apply(this, arguments)

    @controllerFor('ssh_key').send('cancel')

Travis.SshKeyRoute = Route
