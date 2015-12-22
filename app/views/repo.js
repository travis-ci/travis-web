import { statusImage } from 'travis/utils/urls';
import StatusImagesView from 'travis/views/status-images';
import BasicView from 'travis/views/basic';
import config from 'travis/config/environment';
import Polling from 'travis/mixins/polling';

export default BasicView.extend(Polling, {
  popup: Ember.inject.service(),
  reposBinding: 'reposController',
  repoBinding: 'controller.repo',
  buildBinding: 'controller.build',
  jobBinding: 'controller.job',
  tabBinding: 'controller.tab',
  pollModels: 'controller.repo',
  classNameBindings: ['controller.isLoading:loading'],

  isEmpty: function() {
    return this.get('repos.isLoaded') && this.get('repos.length') === 0;
  }.property('repos.isLoaded', 'repos.length'),

  statusImageUrl: function() {
    return statusImage(this.get('controller.repo.slug'));
  }.property('controller.repo.slug'),

  actions: {
    statusImages() {
      var view;
      this.get('popup').close();
      view = StatusImagesView.create({
        toolsView: this,
        container: this.container
      });
      BasicView.currentPopupView = view;
      view.appendTo($('body'));
      return false;
    }
  }
});
