`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    branch_name: { key: 'branch' }
    tag_name:    { key: 'tag' }
    repo:       { key: 'repository_id' }
  }

`export default Serializer`
