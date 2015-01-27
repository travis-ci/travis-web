get = Ember.get
set = Ember.set

Array.prototype.diff = (a) ->
  this.filter (i) -> !(a.indexOf(i) > -1)


@Travis.Model = DS.Model.extend()
