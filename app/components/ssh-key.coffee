`import Ember from 'ember'`

SshKeyComponent = Ember.Component.extend

  classNames: ['settings-sshkey']

  isDeleting: false

  actions:
    delete: ->
      console.log('isDeleting')

      # return if @get('isDeleting')
      # @set('isDeleting', true)

      # deletingDone = => @set('isDeleting', false)

      # @get('model').deleteRecord()
      # @get('model').save().then(deletingDone, deletingDone).then =>
      #   @set('model', null)


`export default SshKeyComponent`
