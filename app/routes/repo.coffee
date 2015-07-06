`import TravisRoute from 'travis/routes/basic'`
`import Repo from 'travis/models/repo'`

Route = TravisRoute.extend
  titleToken: (model) ->
    model.get('slug')

  renderTemplate: ->
    @render 'repo', into: 'main'

  setupController: (controller, model) ->
    # TODO: if repo is just a data hash with id and slug load it
    #       as incomplete record
    model = @store.find('repo', model.id) if model && !model.get
    controller.set('repo', model)

  serialize: (repo) ->
    slug = if repo.get then repo.get('slug') else repo.slug
    if slug
      [owner, name] = slug.split('/')
      { owner: owner, name: name }

  model: (params) ->
    slug = "#{params.owner}/#{params.name}"
    Repo.fetchBySlug(@store, slug)

  resetController: ->
    @controllerFor('repo').deactivate()

  actions:
    error: (error) ->
      # if error throwed has a slug (ie. it was probably repo not found)
      # set the slug on main.error controller to allow to properly
      # display the repo information
      if error.slug
        this.controllerFor('main.error').set('slug', error.slug)

      # bubble to the top
      return true

`export default Route`
