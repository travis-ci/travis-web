Controller = Ember.ArrayController.extend
  init: ->
    @_super.apply this, arguments
    @tickables = []

  tips: [
    "Did you know that you can parallelize tests on Travis CI? <a href=\"http://docs.travis-ci.com/user/speeding-up-the-build/#Paralellizing-your-build-on-one-VM?utm_source=tips\">Learn more</a>"
    "Did you know that you can split a build into several smaller pieces? <a href=\"http://docs.travis-ci.com/user/speeding-up-the-build/#Parallelizing-your-builds-across-virtual-machines?utm_source=tips\">Learn more</a>"
    "Did you know that you can skip a build? <a href=\"http://docs.travis-ci.com/user/how-to-skip-a-build/?utm_source=tips\">Learn more</a>"
  ]

  tip: (->
    if tips = @get('tips')
      tips[Math.floor(Math.random()*tips.length)]
  ).property().volatile()

Travis.SidebarController = Controller
