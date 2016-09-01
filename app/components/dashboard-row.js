import Ember from 'ember';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  permissions: service(),
  tagName: 'li',
  classNameBindings: ['repo.active:is-active'],
  classNames: ['rows', 'rows--dashboard'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,
  dropupIsOpen: false,

  currentBuild: alias('repo.currentBuild'),

  urlGithubCommit: Ember.computed('repo.slug', 'currentBuild.commit.sha', function () {
    return githubCommitUrl(this.get('repo.slug'), this.get('currentBuild.commit.sha'));
  }),

  displayMenuTofu: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasPushPermission(this.get('repo'));
  }),

  displayActivateLink: Ember.computed('permissions.all', 'repo', function () {
    return this.get('permissions').hasAdminPermission(this.get('repo'));
  }),

  openDropup() {
    this.toggleProperty('dropupIsOpen');
    Ember.run.later((() => { self.toggleProperty('dropupIsOpen'); }), 2000);
  },

  tiggerNewBuild() {

    // send post request to trigger endpoint
    // set isTriggering
    // set hasTiggered

    // maybe use ember concurrency?
  },

  actions: {
    openDropup() {
      this.openDropup();
    }
  }
});

