module "Router",
  teardown: ->
    Ember.run -> Travis.reset()

test 'renders notFound template when URL can\t be found', ->
  visit('/somehing/something/something/.../dark/side/..../something/something/something/.../complete').then ->
    equal($('#main').text().trim(), 'The requested page was not found.')

test 'renders repo not found information when repo can\'t be found', ->
  visit('/what-is-this/i-dont-even').then ->
    equal($('#main').text().trim(), 'The repository at what-is-this/i-dont-even was not found.')
