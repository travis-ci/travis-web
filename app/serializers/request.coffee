`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    branchName: { key: 'branch' }
    tagName:    { key: 'tag' }
    repo:       { key: 'repository_id' }
  }

`export default Serializer`
