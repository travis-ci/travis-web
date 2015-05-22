`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    lastBuild: { key: 'last_build_id' }
  }

  normalizePayload: (payload) ->
    payload = @_super.apply(this, arguments)

    payload.repos = payload.repositories
    delete payload.repositories

    payload.builds = []

    for repo in payload.repos
      if repo.last_build
        payload.builds.pushObject repo.last_build
        repo.last_build_id = repo.last_build.id
        delete repo.last_build

    payload


`export default Serializer`
