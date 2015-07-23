`import Ember from 'ember'`

SshKeyComponent = Ember.Component.extend

  classNames: ['settings-sshkey']

  isDeleting: false

  actions:
    delete: ->
      return if @get('isDeleting')
      @set('isDeleting', true)

      deletingDone = => @set('isDeleting', false)

      @get('key').deleteRecord()
      @get('key').save().then(deletingDone, deletingDone).then =>
        @sendAction('sshKeyDeleted')


`export default SshKeyComponent`
