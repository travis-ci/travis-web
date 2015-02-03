`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    _lastBuildDuration: { key: 'last_build_duration' }
  }

`export default Serializer`
