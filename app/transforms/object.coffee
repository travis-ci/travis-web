Transform = DS.Transform.extend
  deserialize: (serialized) ->
    serialized

  serialize: (deserialized) ->
    deserialized

Travis.ObjectTransform = Transform
