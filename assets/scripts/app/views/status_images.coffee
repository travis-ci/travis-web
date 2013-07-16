Travis.StatusImagesView = Em.View.extend
  templateName: 'status_images'
  elementId: 'status-images'
  classNames: ['popup']
  classNameBindings: ['display']

  repoBinding:  'toolsView.repo'
  buildBinding: 'toolsView.build'
  jobBinding:   'toolsView.job'
  branchesBinding: 'repo.branches'

  didInsertElement: ->
    @_super.apply(this, arguments)

    @setStatusImageBranch()
    @show()

  show: ->
    @set('display', true)

  close: ->
    @destroy()

  urlRepo: (->
    "https://#{location.host}/#{@get('repo.slug')}"
  ).property('repo.slug')

  setStatusImageBranch: (->
    if @get('repo.branches.isLoaded')
      @set('statusImageBranch', @get('repo.branches').findProperty('commit.branch', @get('build.commit.branch')))
    else
      @set('statusImageBranch', null)
  ).observes('repo.branches', 'repo.branches.isLoaded', 'build.commit.branch')

  statusImageUrl: (->
    Travis.Urls.statusImage(@get('repo.slug'), @get('statusImageBranch.commit.branch'))
  ).property('repo.slug', 'statusImageBranch')

  markdownStatusImage: (->
    "[![Build Status](#{@get('statusImageUrl')})](#{@get('urlRepo')})"
  ).property('statusImageUrl')

  textileStatusImage: (->
    "!#{@get('statusImageUrl')}!:#{@get('urlRepo')}"
  ).property('statusImageUrl')

  rdocStatusImage: (->
    "{<img src=\"#{@get('statusImageUrl')}\" alt=\"Build Status\" />}[#{@get('urlRepo')}]"
  ).property('statusImageUrl')

  asciidocStatusImage: (->
    "image:#{@get('statusImageUrl')}[\"Build Status\", link=\"#{@get('urlRepo')}\"]"
  ).property('statusImageUrl')

  rstStatusImage: (->
    ".. image:: #{@get('statusImageUrl')}   :target: #{@get('urlRepo')}"
  ).property('statusImageUrl')
