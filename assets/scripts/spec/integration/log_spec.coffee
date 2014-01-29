module "Logs",
  setup: ->
    Ember.run -> Travis.advanceReadiness()
    @sandbox = sinon.sandbox.create();
    $.mockjax
      url: '/jobs/1/log?cors_hax=true'
      responseTime: 0
      responseText: "First line\ncontent:travis_fold:start:install\r$ Install something\nInstalling something\ncontent:travis_fold:end:install\r$ End"

  teardown: ->
    Ember.run -> Travis.reset()
    @sandbox.restore();

test 'displaying the logs initializes the line selector', ->
  selector_stub =
    willDestroy: @sandbox.spy()
  lineSelector = @sandbox.stub(Travis, "LinesSelector").returns(selector_stub)
  visit('/travis-ci/travis-core/jobs/1').then ->
    ok lineSelector.calledWithNew(), 'the lines selector has been initialized'

test 'displaying the log initializes the logger', ->
  log = @sandbox.stub(Log, "create").returns
    set: @sandbox.spy()
  scroll_stub =
    tryScroll: @sandbox.spy()
  scroll = @sandbox.stub(Log, "Scroll").returns(scroll_stub)

  visit('/travis-ci/travis-core/jobs/1').then ->
    ok log.calledWith({limit: Log.LIMIT, listeners: [scroll_stub]}), 'the logger has been initialized'

test 'displaying the logs initializes the log folder', ->
  folder_stub = {}
  logFolder = @sandbox.stub(Travis, "LogFolder").returns(folder_stub)
  visit('/travis-ci/travis-core/jobs/1').then ->
    ok logFolder.calledWithNew(), 'the logs folder has been initialized'
