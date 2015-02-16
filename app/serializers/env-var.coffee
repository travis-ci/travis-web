`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    repo: { key: 'repository_id' }
  }

`export default Serializer`
