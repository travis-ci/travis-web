`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    repo: { key: 'repository_id' }
  }

  serialize: (snapshot, options) ->
    return { env_var: this._super(snapshot, options) }

`export default Serializer`
