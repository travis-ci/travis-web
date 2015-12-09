`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  setupController: (controller)->
    @container.lookup('controller:repos').activate('owned')

`export default Route`
