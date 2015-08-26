`import Ember from 'ember'`
`import V2FallbackSerializer from 'travis/serializers/v2_fallback'`

Serializer = V2FallbackSerializer.extend
  isNewSerializerAPI: true
  attrs: {
    _lastBuildDuration: { key: 'last_build_duration' }
  }

`export default Serializer`
