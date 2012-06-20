@Travis.Artifact = Travis.Model.extend
  body: DS.attr('string')

@Travis.Artifact.FIXTURES = [
  { id: 1, body: 'log 1' }
  { id: 2, body: 'log 2' }
  { id: 3, body: 'log 3' }
  { id: 4, body: 'log 4' }
  { id: 5, body: 'log 4' }
]

