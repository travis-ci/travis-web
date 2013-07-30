#module "Router",
#  setup: ->
#    Ember.run -> Travis.advanceReadiness()
#  teardown: ->
#    Ember.run -> Travis.reset()
#
#test 'renders notFound template when URL can\t be found', ->
#  visit('/somehing/something/something/.../dark/side/..../something/something/something/.../complete').then ->
#    equal('The requested page was not found.', $('#main').text().trim())
