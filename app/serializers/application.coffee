`import DS from 'ember-data'`

Serializer = DS.ActiveModelSerializer.extend
  defaultSerializer: 'application'
  serializer: 'application'

`export default Serializer`
