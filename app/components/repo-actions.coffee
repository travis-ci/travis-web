`import Ember from 'ember'`

RepoActionsComponent = Ember.Component.extend(
  displayCodeClimate: (->
    @get('repo.githubLanguage') == 'Ruby'
  ).property('repo.githubLanguage')

  displayCodecov: (->
    @get('repo.githubLanguage') in ['Ruby', 'Python', 'Go', 'Java', 'PHP', 'Node.js', 'Scala', 'D', 'C']
  ).property('repo.githubLanguage')

  actions:
    codeClimatePopup: ->
      $('.popup').removeClass('display')
      $('#code-climate').addClass('display')
      return false

    codecovPopup: ->
      $('.popup').removeClass('display')
      language = @get('repo.githubLanguage')
      $('#codecov').addClass('display')
      return false
)

`export default RepoActionsComponent`
