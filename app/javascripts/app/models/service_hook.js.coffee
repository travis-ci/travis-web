@Travis.ServiceHook = Travis.Model.extend
  primaryKey: 'slug'
  name:       DS.attr('string')
  owner_name: DS.attr('string')
  active:     DS.attr('boolean')

  slug: (->
    [@get('owner_name'), @get('name')].join('/')
  ).property()

  toggle: ->
    @set 'active', !@get('active')
    Travis.app.store.commit()

@Travis.ServiceHook.reopenClass
  url: 'profile/service_hooks'


