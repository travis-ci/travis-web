object = Ember.Object.extend(Travis.LineNumberParser)
subject = object.create()

module "Travis.LineNumberParser",
  test "without line numbers", ->
    deepEqual subject.fetchLineNumbers(''), []

  test "with a start date only", ->
    deepEqual subject.fetchLineNumbers('#L5'), ['5']

  test "with a start and end dates", ->
    deepEqual subject.fetchLineNumbers('#L5-L6'), ['5', '6']
