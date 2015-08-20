`import BasicView from 'travis/views/basic'`
`import Polling from 'travis/mixins/polling'`

View = BasicView.extend Polling,
  pollHook: (store) ->
    contentType = @get('controller.contentType')
    repositoryId = @get('controller.repo.id')
    store = @get('controller.store')

    if contentType == 'builds'
      store.query('build', { event_type: 'push', repository_id: repositoryId })
    else if contentType == 'pull_requests'
      store.filter('build', { event_type: 'pull_request', repository_id: repositoryId })
    else
      store.query 'build', repository_id: repositoryId, branches: true


`export default View`
