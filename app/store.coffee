`import DS from 'ember-data'`

Store = DS.Store.extend
  defaultAdapter: 'application'
  adapter: 'application'

`export default Store`
