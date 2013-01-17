Travis.Instrumentation = {
  subscribe: (event) ->
    Em.subscribe event,
      before:(name, timestamp, payload) ->
        timestamp
      after: (name, timestamp, payload, start_timestamp) ->
        console.log(name, payload, timestamp - start_timestamp)
}
