import Ember from 'ember';

export default Ember.Component.extend({
  displayCodeClimate: function() {
    return this.get('repo.githubLanguage') === 'Ruby';
  }.property('repo.githubLanguage'),

  actions: {
    codeClimatePopup() {
      $('.popup').removeClass('display');
      $('#code-climate').addClass('display');
      return false;
    }
  }
});
