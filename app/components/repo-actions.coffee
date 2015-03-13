`import Ember from 'ember'`

RepoActionsComponent = Ember.Component.extend(
  displayCodeClimate: (->
    @get('repo.githubLanguage') == 'Ruby'
  ).property('repo.githubLanguage')

  actions:
    codeClimatePopup: ->
      $('.popup').removeClass('display')
      $('#code-climate').addClass('display')
      return false
)

`export default RepoActionsComponent`
