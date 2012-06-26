require 'store/rest_adapter'

Travis.Store = DS.Store.extend
  revision: 4
  adapter: Travis.RestAdapter.create()
